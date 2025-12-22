/**
 * Production-Ready API Client for MyMatchIQ Backend
 * 
 * Features:
 * - Centralized fetch wrapper
 * - Auth token injection (JWT or session)
 * - Standard headers (X-Client-Version, Accept-Language)
 * - Graceful error handling (401/403/500)
 * - Timeout + retry (read-only requests only)
 * - Abort controller support
 * - Request debouncing
 * - Rate limiting
 */
import { API_CONFIG } from '../utils/apiConfig';

const CLIENT_VERSION = '1.0.0';

export interface ApiError {
  detail: string;
  status?: number;
  code?: string;
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retry?: {
    attempts: number;
    delay: number;
    onlyReadOnly?: boolean;
  };
  skipAuth?: boolean;
  skipRateLimit?: boolean;
}

// Rate limiting state
const rateLimitState = {
  requests: new Map<string, number[]>(),
  maxRequests: 100, // per window
  windowMs: 60000, // 1 minute
};

// Request debouncing
const pendingRequests = new Map<string, AbortController>();

// Get auth token from storage or context
function getAuthToken(): string | null {
  try {
    // In production, this would get from auth context or secure storage
    const token = localStorage.getItem('myMatchIQ_authToken');
    return token;
  } catch {
    return null;
  }
}

// Get user locale
function getUserLocale(): string {
  try {
    const saved = localStorage.getItem('myMatchIQ_language') || 'en';
    return saved;
  } catch {
    return 'en';
  }
}

// Check rate limit
function checkRateLimit(endpoint: string): boolean {
  const now = Date.now();
  const key = endpoint.split('?')[0]; // Remove query params for rate limiting
  
  if (!rateLimitState.requests.has(key)) {
    rateLimitState.requests.set(key, []);
  }
  
  const requests = rateLimitState.requests.get(key)!;
  
  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => now - timestamp < rateLimitState.windowMs);
  rateLimitState.requests.set(key, recentRequests);
  
  if (recentRequests.length >= rateLimitState.maxRequests) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  return true;
}

// Debounce request
function getDebouncedRequest(key: string): AbortController | null {
  // Cancel previous request with same key
  const existing = pendingRequests.get(key);
  if (existing) {
    existing.abort();
  }
  
  const controller = new AbortController();
  pendingRequests.set(key, controller);
  
  // Clean up after request completes
  setTimeout(() => {
    pendingRequests.delete(key);
  }, 1000);
  
  return controller;
}

// Create timeout promise
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

// Retry logic
async function retryRequest<T>(
  fn: () => Promise<T>,
  attempts: number,
  delay: number
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx) except 408, 429
      if (error instanceof Error && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
          throw error;
        }
      }
      
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError!;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = API_CONFIG.BASE_URL, defaultTimeout: number = API_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retry,
      skipAuth = false,
      skipRateLimit = false,
      signal: externalSignal,
      ...fetchOptions
    } = options;

    // Check rate limit
    if (!skipRateLimit && !checkRateLimit(endpoint)) {
      const error: ApiError = {
        detail: 'Rate limit exceeded. Please try again later.',
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED',
      };
      throw error;
    }

    // Get debounced controller for non-GET requests
    const isReadOnly = (fetchOptions.method || 'GET').toUpperCase() === 'GET';
    const debounceKey = isReadOnly ? null : `${fetchOptions.method || 'POST'}:${endpoint}`;
    const debouncedController = debounceKey ? getDebouncedRequest(debounceKey) : null;
    
    // Combine abort signals
    const abortController = new AbortController();
    const signals: AbortSignal[] = [abortController.signal];
    if (externalSignal) signals.push(externalSignal);
    if (debouncedController) signals.push(debouncedController.signal);

    // Create combined signal
    const combinedSignal = AbortSignal.any(signals);

    const url = `${this.baseUrl}${endpoint}`;
    
    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Client-Version': CLIENT_VERSION,
      'Accept-Language': getUserLocale(),
      ...fetchOptions.headers,
    };

    // Add auth token
    if (!skipAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Development mode: Try to get user ID from localStorage for testing
        // In production, this would come from proper auth
        try {
          const currentUserId = localStorage.getItem('myMatchIQ_currentUserId');
          if (currentUserId && API_CONFIG.ENVIRONMENT === 'local') {
            // For local development, use X-User-Id header
            headers['X-User-Id'] = currentUserId;
          }
        } catch {
          // Ignore if localStorage not available
        }
      }
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
      signal: combinedSignal,
    };

    // Execute request with timeout and optional retry
    const executeRequest = async (): Promise<T> => {
      try {
        const response = await Promise.race([
          fetch(url, config),
          createTimeoutPromise(timeout),
        ]) as Response;

        // Handle errors
        if (!response.ok) {
          const error: ApiError = await response.json().catch(() => ({
            detail: `HTTP ${response.status}: ${response.statusText}`,
          }));
          error.status = response.status;

          // Handle specific status codes
          if (response.status === 401) {
            // Unauthorized - clear auth and redirect
            localStorage.removeItem('myMatchIQ_authToken');
            error.detail = 'Authentication required. Please sign in again.';
            error.code = 'UNAUTHORIZED';
          } else if (response.status === 403) {
            error.detail = 'Access forbidden. You may not have permission for this action.';
            error.code = 'FORBIDDEN';
          } else if (response.status === 500) {
            error.detail = 'Server error. Please try again later.';
            error.code = 'SERVER_ERROR';
          } else if (response.status === 429) {
            error.detail = 'Too many requests. Please try again later.';
            error.code = 'RATE_LIMIT_EXCEEDED';
          }

          throw error;
        }

        return await response.json();
      } catch (error) {
        // Handle abort
        if (error instanceof Error && error.name === 'AbortError') {
          const apiError: ApiError = {
            detail: 'Request was cancelled',
            code: 'ABORTED',
          };
          throw apiError;
        }

        // Handle timeout
        if (error instanceof Error && error.message.includes('timeout')) {
          const apiError: ApiError = {
            detail: 'Request timed out. Please check your connection and try again.',
            code: 'TIMEOUT',
          };
          throw apiError;
        }

        // Re-throw API errors
        if ('status' in (error as any)) {
          throw error;
        }

        // Network or other errors
        const apiError: ApiError = {
          detail: error instanceof Error ? error.message : 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
        };
        throw apiError;
      }
    };

    // Apply retry logic if specified (only for read-only requests)
    if (retry && isReadOnly && retry.onlyReadOnly !== false) {
      return retryRequest(executeRequest, retry.attempts, retry.delay);
    }

    return executeRequest();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
      retry: options?.retry || {
        attempts: 3,
        delay: 1000,
        onlyReadOnly: true,
      },
    });
  }

  async post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // Create abort controller for request cancellation
  createAbortController(): AbortController {
    return new AbortController();
  }
}

export const apiClient = new ApiClient();

