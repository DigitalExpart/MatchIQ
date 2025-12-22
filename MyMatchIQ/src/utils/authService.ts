/**
 * Authentication Service
 * Handles user authentication and account management
 */

export interface UserAccount {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  name: string;
  createdAt: string;
  lastLogin?: string;
}

// Simple in-memory storage (in production, use a backend API)
class AuthService {
  private accounts: Map<string, UserAccount> = new Map();
  private currentUserId: string | null = null;

  constructor() {
    // Load accounts from localStorage
    this.loadAccounts();
  }

  private loadAccounts() {
    try {
      const saved = localStorage.getItem('myMatchIQ_accounts');
      if (saved) {
        const accounts = JSON.parse(saved);
        accounts.forEach((acc: UserAccount) => {
          this.accounts.set(acc.email.toLowerCase(), acc);
        });
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }

    // Load current session
    const currentUserId = localStorage.getItem('myMatchIQ_currentUserId');
    if (currentUserId) {
      this.currentUserId = currentUserId;
    }
  }

  private saveAccounts() {
    try {
      const accountsArray = Array.from(this.accounts.values());
      localStorage.setItem('myMatchIQ_accounts', JSON.stringify(accountsArray));
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    const emailLower = email.toLowerCase();
    
    if (this.accounts.has(emailLower)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const userId = Date.now().toString();
    const account: UserAccount = {
      id: userId,
      email: emailLower,
      password, // In production, hash this
      name,
      createdAt: new Date().toISOString(),
    };

    this.accounts.set(emailLower, account);
    this.saveAccounts();

    // Auto sign in after sign up
    this.currentUserId = userId;
    localStorage.setItem('myMatchIQ_currentUserId', userId);

    return { success: true, userId };
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    const emailLower = email.toLowerCase();
    const account = this.accounts.get(emailLower);

    if (!account) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (account.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    account.lastLogin = new Date().toISOString();
    this.accounts.set(emailLower, account);
    this.saveAccounts();

    this.currentUserId = account.id;
    localStorage.setItem('myMatchIQ_currentUserId', account.id);

    return { success: true, userId: account.id };
  }

  signOut(): void {
    this.currentUserId = null;
    localStorage.removeItem('myMatchIQ_currentUserId');
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  getAccount(userId: string): UserAccount | null {
    for (const account of this.accounts.values()) {
      if (account.id === userId) {
        return account;
      }
    }
    return null;
  }

  getAccountByEmail(email: string): UserAccount | null {
    return this.accounts.get(email.toLowerCase()) || null;
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }
}

export const authService = new AuthService();

