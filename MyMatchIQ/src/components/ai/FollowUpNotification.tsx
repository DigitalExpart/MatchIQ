import { useState, useEffect } from 'react';
import { Bell, X, MessageSquare } from 'lucide-react';
import { amoraSessionService, FollowUp } from '../../services/amoraSessionService';

interface FollowUpNotificationProps {
  onSelectFollowUp: (sessionId: string, prompt: string) => void;
}

export function FollowUpNotification({ onSelectFollowUp }: FollowUpNotificationProps) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFollowUps();
    // Check every 5 minutes
    const interval = setInterval(checkFollowUps, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkFollowUps = async () => {
    try {
      setLoading(true);
      const data = await amoraSessionService.getDueFollowups();
      setFollowUps(data);
    } catch (error) {
      console.error('Failed to check follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (sessionId: string) => {
    setDismissed(new Set([...dismissed, sessionId]));
  };

  const handleSelect = (followUp: FollowUp) => {
    onSelectFollowUp(followUp.coach_session_id, followUp.prompt);
    handleDismiss(followUp.coach_session_id);
  };

  const visibleFollowUps = followUps.filter(f => !dismissed.has(f.coach_session_id));

  if (loading || visibleFollowUps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 p-4">
      {visibleFollowUps.map((followUp) => (
        <div
          key={followUp.coach_session_id}
          className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Check-in: {followUp.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3">{followUp.prompt}</p>
                <button
                  onClick={() => handleSelect(followUp)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  Continue Session
                </button>
              </div>
            </div>
            <button
              onClick={() => handleDismiss(followUp.coach_session_id)}
              className="p-1 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
