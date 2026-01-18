/**
 * Amora Session Management Service
 * Handles all API calls for coaching sessions
 */

export interface AmoraSession {
  id: string;
  title: string;
  primary_topic?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  follow_up_enabled: boolean;
  follow_up_time?: string;
  summary_text?: string;
  next_plan_text?: string;
}

export interface FollowUp {
  coach_session_id: string;
  title: string;
  primary_topic?: string;
  prompt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://macthiq-ai-backend.onrender.com/api/v1';

class AmoraSessionService {
  /**
   * Get auth token from localStorage or auth service
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Try to get token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('myMatchIQ_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * List all sessions for the current user
   */
  async listSessions(): Promise<AmoraSession[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/coach/sessions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing sessions:', error);
      throw error;
    }
  }

  /**
   * Create a new coaching session
   */
  async createSession(data: {
    title: string;
    primary_topic?: string;
    follow_up_enabled?: boolean;
    follow_up_time?: string;
  }): Promise<AmoraSession> {
    try {
      const response = await fetch(`${API_BASE_URL}/coach/sessions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create session: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Get a specific session by ID
   */
  async getSession(sessionId: string): Promise<AmoraSession> {
    try {
      const response = await fetch(`${API_BASE_URL}/coach/sessions/${sessionId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  }

  /**
   * Update a session
   */
  async updateSession(
    sessionId: string,
    data: {
      title?: string;
      status?: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
      follow_up_enabled?: boolean;
      follow_up_time?: string;
    }
  ): Promise<AmoraSession> {
    try {
      const response = await fetch(`${API_BASE_URL}/coach/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update session: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  /**
   * Get due follow-ups
   */
  async getDueFollowups(): Promise<FollowUp[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/coach/sessions/followups/due`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch follow-ups: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting follow-ups:', error);
      return [];
    }
  }

  /**
   * Submit feedback for a message
   */
  async submitFeedback(messageId: string, feedbackType: 'like' | 'dislike' | 'regenerate'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/coach/sessions/feedback`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          message_id: messageId,
          feedback_type: feedbackType,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit feedback: ${errorText}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
}

export const amoraSessionService = new AmoraSessionService();
