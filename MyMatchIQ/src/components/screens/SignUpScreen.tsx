import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface SignUpScreenProps {
  onComplete: (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
    age?: string;
    gender?: string;
    location?: string;
    datingGoal?: string;
  }) => void;
  onBack: () => void;
  onSignIn?: () => void;
  datingGoal?: string;
}

export function SignUpScreen({ onComplete, onBack, onSignIn, datingGoal }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    age: '',
    gender: '',
    location: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://macthiq-ai-backend.onrender.com/api/v1';
        
        console.log('Signing up with API URL:', apiUrl);
        console.log('Request data:', {
          name: formData.name,
          email: formData.email,
          location: formData.location || null,
          dating_goal: datingGoal || 'serious'
        });
        
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            location: formData.location || null,
            dating_goal: datingGoal || 'serious'
          }),
        });

        console.log('Response status:', response.status);
        
        // Read response as text first, then parse JSON
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          setErrors({ email: `Server error (${response.status}): ${responseText || 'Invalid response'}` });
          return;
        }

        console.log('Response data:', data);

        if (!response.ok) {
          const errorMessage = data.detail || data.message || 'Registration failed';
          console.error('Signup failed:', errorMessage);
          setErrors({ email: errorMessage });
          return;
        }

        // Success - call onComplete with user data
        console.log('Signup successful!');
        onComplete({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          age: formData.age || undefined,
          gender: formData.gender || undefined,
          location: formData.location || undefined,
          datingGoal: datingGoal
        });
      } catch (error: unknown) {
        console.error('Sign up error:', error);
        
        // Safely extract error message
        let errorMessage = 'Failed to connect to server. Please try again.';
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to reach the server. Please check your connection and try again.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          
          // Handle different error types
          if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            errorMessage = 'Network error: Cannot reach server. The backend may be sleeping. Please wait a moment and try again.';
          } else if (error.message?.includes('CORS')) {
            errorMessage = 'CORS error: Server configuration issue. Please contact support.';
          } else if (error.message) {
            errorMessage = error.message;
          }
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        setErrors({ email: errorMessage });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="mb-6 text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="mb-4 flex justify-center">
            <img src="/my-match-iq-logo.png" alt="My Match IQ" className="h-12 sm:h-16 md:h-20 w-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Start your journey to meaningful connections</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-rose-400'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.username
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-rose-400'
                }`}
                placeholder="Choose a username"
              />
            </div>
            {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-rose-400'
                }`}
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age (Optional)
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors"
              placeholder="25"
              min="18"
              max="100"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender (Optional)
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Location (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-rose-400'
                }`}
                placeholder="Create a password (min. 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-rose-400'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium text-lg hover:scale-[1.02] mt-8"
          >
            Create Account
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>

        {/* Already have account */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={onSignIn}
            type="button"
            className="text-rose-500 hover:text-rose-600 font-medium"
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
}
