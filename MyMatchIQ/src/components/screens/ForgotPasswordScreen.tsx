import { useState } from 'react';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Logo } from '../Logo';
import { authService } from '../../utils/authService';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onResetPassword: (token: string) => void;
}

export function ForgotPasswordScreen({ onBack, onResetPassword }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://macthiq-ai-backend.onrender.com/api/v1';
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Failed to send reset link');
        return;
      }

      // Success - show message
      setSuccess(true);
      
      // In development, token is returned in response (remove in production)
      if (data.token) {
        setResetToken(data.token);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseToken = () => {
    if (resetToken) {
      onResetPassword(resetToken);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 pt-6 pb-4">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center mb-4">
            <Logo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900">Reset Password</h1>
          <p className="text-sm text-center text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="w-full max-w-md mx-auto">
          {success ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex flex-col items-center gap-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-900 mb-2">
                    Reset link sent!
                  </p>
                  <p className="text-sm text-green-700">
                    If an account with that email exists, a password reset link has been sent.
                    Please check your email.
                  </p>
                </div>
              </div>

              {/* Development: Show token and allow direct reset */}
              {resetToken && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                  <p className="text-xs text-blue-800 mb-2 font-semibold">
                    Development Mode: Reset Token
                  </p>
                  <p className="text-xs text-blue-700 mb-3 break-all">{resetToken}</p>
                  <button
                    onClick={handleUseToken}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
                  >
                    Use This Token to Reset Password
                  </button>
                </div>
              )}

              <button
                onClick={onBack}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 flex-1">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-400 focus:outline-none text-gray-900"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              {/* Back to Sign In */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
