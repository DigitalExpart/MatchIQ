import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, CheckCircle, Pause } from 'lucide-react';
import { amoraSessionService, AmoraSession } from '../../services/amoraSessionService';

interface SessionListProps {
  onSelectSession: (session: AmoraSession) => void;
  onCreateSession: () => void;
  currentSessionId?: string;
}

export function SessionList({ onSelectSession, onCreateSession, currentSessionId }: SessionListProps) {
  const [sessions, setSessions] = useState<AmoraSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await amoraSessionService.listSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'PAUSED':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCreateSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Session</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No sessions yet</p>
            <p className="text-xs mt-2">Create your first coaching session to get started</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  currentSessionId === session.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate flex-1">
                    {session.title}
                  </h3>
                  {getStatusIcon(session.status)}
                </div>
                {session.primary_topic && (
                  <p className="text-xs text-gray-500 mb-2 capitalize">
                    {session.primary_topic.replace('_', ' ')}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(session.last_message_at || session.updated_at)}</span>
                </div>
                {session.summary_text && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {session.summary_text}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
