/**
 * Authentication Service
 * Handles user authentication and account management using backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://macthiq-ai-backend.onrender.com/api/v1';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  age?: number;
  location?: string;
  dating_goal?: string;
  createdAt: string;
  lastLogin?: string;
}

// Authentication Service with Backend API
class AuthService {
  private currentUserId: string | null = null;
  private currentUserAccount: UserAccount | null = null;

  constructor() {
    // Load current session from localStorage
    this.loadSession();
  }

  private loadSession() {
    try {
      const currentUserId = localStorage.getItem('myMatchIQ_currentUserId');
      const currentUser = localStorage.getItem('myMatchIQ_currentUser');
      
      if (currentUserId && currentUser) {
        this.currentUserId = currentUserId;
        this.currentUserAccount = JSON.parse(currentUser);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }

  private saveSession(userId: string, account: UserAccount) {
    try {
      localStorage.setItem('myMatchIQ_currentUserId', userId);
      localStorage.setItem('myMatchIQ_currentUser', JSON.stringify(account));
      this.currentUserId = userId;
      this.currentUserAccount = account;
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.detail || 'Sign up failed' };
      }

      // Save user session
      const account: UserAccount = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        age: data.user.age,
        location: data.user.location,
        dating_goal: data.user.dating_goal,
        createdAt: data.user.created_at,
      };

      this.saveSession(account.id, account);

      return { success: true, userId: account.id };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to connect to server' };
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.detail || 'Sign in failed' };
      }

      // Save user session
      const account: UserAccount = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        age: data.user.age,
        location: data.user.location,
        dating_goal: data.user.dating_goal,
        createdAt: data.user.created_at,
        lastLogin: new Date().toISOString(),
      };

      this.saveSession(account.id, account);

      return { success: true, userId: account.id };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to connect to server' };
    }
  }

  signOut(): void {
    this.currentUserId = null;
    this.currentUserAccount = null;
    localStorage.removeItem('myMatchIQ_currentUserId');
    localStorage.removeItem('myMatchIQ_currentUser');
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  getAccount(userId: string): UserAccount | null {
    if (this.currentUserAccount && this.currentUserAccount.id === userId) {
      return this.currentUserAccount;
    }
    return null;
  }

  getAccountByEmail(email: string): UserAccount | null {
    if (this.currentUserAccount && this.currentUserAccount.email.toLowerCase() === email.toLowerCase()) {
      return this.currentUserAccount;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }

  async getUserById(userId: string): Promise<UserAccount | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      const account: UserAccount = {
        id: data.id,
        email: data.email,
        name: data.name,
        age: data.age,
        location: data.location,
        dating_goal: data.dating_goal,
        createdAt: data.created_at,
      };

      return account;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; token?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.detail || 'Failed to send reset link' };
      }

      return {
        success: true,
        message: data.message,
        token: data.token, // Only in development
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Failed to connect to server' };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.detail || 'Failed to reset password' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Failed to connect to server' };
    }
  }
}

export const authService = new AuthService();
