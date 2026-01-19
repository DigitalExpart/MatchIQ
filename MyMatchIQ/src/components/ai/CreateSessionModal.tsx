import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { amoraSessionService, AmoraSession } from '../../services/amoraSessionService';
import { authService } from '../../utils/authService';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: (session: AmoraSession) => void;
}

const TOPIC_OPTIONS = [
  { value: 'heartbreak', label: 'Heartbreak & Breakups' },
  { value: 'marriage_strain', label: 'Marriage Stress' },
  { value: 'self_worth', label: 'Self-Worth in Dating' },
  { value: 'communication', label: 'Communication Issues' },
  { value: 'trust', label: 'Trust Issues' },
  { value: 'anxiety', label: 'Relationship Anxiety' },
  { value: 'boundaries', label: 'Setting Boundaries' },
  { value: 'compatibility', label: 'Compatibility Questions' },
  { value: 'dating', label: 'Dating Advice' },
  { value: 'other', label: 'Other' },
];

const TIME_OPTIONS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export function CreateSessionModal({ isOpen, onClose, onSessionCreated }: CreateSessionModalProps) {
  const [title, setTitle] = useState('');
  const [primaryTopic, setPrimaryTopic] = useState<string>('');
  const [followUpEnabled, setFollowUpEnabled] = useState(false);
  const [followUpTime, setFollowUpTime] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    if (isOpen) {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        setError('Please sign in to create a coaching session');
      } else {
        setError(null);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a session title');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const session = await amoraSessionService.createSession({
        title: title.trim(),
        primary_topic: primaryTopic || undefined,
        follow_up_enabled: followUpEnabled,
        follow_up_time: followUpEnabled ? followUpTime : undefined,
      });

      // Reset form
      setTitle('');
      setPrimaryTopic('');
      setFollowUpEnabled(false);
      setFollowUpTime('09:00');
      
      onSessionCreated(session);
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create session';
      
      // Check if it's an authentication error
      if (errorMessage.includes('Authentication required') || errorMessage.includes('401')) {
        setError('Please sign in to create a coaching session. If you are signed in, please try refreshing the page.');
      } else {
        setError(errorMessage);
      }
      
      console.error('Error creating session:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Coaching Session</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Breakup with Alex, Marriage stress..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Topic (Optional)
              </label>
              <select
                value={primaryTopic}
                onChange={(e) => setPrimaryTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a topic...</option>
                {TOPIC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={followUpEnabled}
                  onChange={(e) => setFollowUpEnabled(e.target.checked)}
                  className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Daily Follow-ups</span>
                  <p className="text-xs text-gray-500">Get daily check-in reminders for this session</p>
                </div>
              </label>

              {followUpEnabled && (
                <div className="mt-4 ml-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Check-in Time
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <select
                      value={followUpTime}
                      onChange={(e) => setFollowUpTime(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !isAuthenticated}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
