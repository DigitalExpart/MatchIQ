/**
 * API Configuration with Environment Support
 * 
 * Supports:
 * - local: http://localhost:8000/api/v1
 * - staging: https://api-staging.mymatchiq.com/api/v1
 * - production: https://api.mymatchiq.com/api/v1
 */
export type Environment = 'local' | 'staging' | 'production';

// Get environment from VITE_ENV or default to local
const getEnvironment = (): Environment => {
  const env = import.meta.env.VITE_ENV || import.meta.env.MODE || 'local';
  if (env === 'production' || env === 'prod') return 'production';
  if (env === 'staging' || env === 'stage') return 'staging';
  return 'local';
};

const environment = getEnvironment();

// API base URLs by environment
const API_BASE_URLS: Record<Environment, string> = {
  local: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  staging: import.meta.env.VITE_API_BASE_URL || 'https://api-staging.mymatchiq.com/api/v1',
  production: import.meta.env.VITE_API_BASE_URL || 'https://api.mymatchiq.com/api/v1',
};

// Feature flags (read-only)
export const FEATURE_FLAGS = {
  // AI features
  AI_COACH_ENABLED: import.meta.env.VITE_FEATURE_AI_COACH !== 'false',
  AI_INSIGHTS_ENABLED: import.meta.env.VITE_FEATURE_AI_INSIGHTS !== 'false',
  
  // Rate limiting
  RATE_LIMITING_ENABLED: import.meta.env.VITE_FEATURE_RATE_LIMITING !== 'false',
  
  // Analytics
  ANALYTICS_ENABLED: import.meta.env.VITE_FEATURE_ANALYTICS !== 'false',
} as const;

export const API_CONFIG = {
  BASE_URL: API_BASE_URLS[environment],
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  ENVIRONMENT: environment,
  FEATURE_FLAGS,
} as const;

// Log configuration in development
if (environment === 'local') {
  console.log('API Configuration:', {
    environment,
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    featureFlags: API_CONFIG.FEATURE_FLAGS,
  });
}
