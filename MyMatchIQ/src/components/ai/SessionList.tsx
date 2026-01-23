import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, CheckCircle, Pause, Pin } from 'lucide-react';
import { amoraSessionService, AmoraSession } from '../../services/amoraSessionService';
import { SessionMenu } from './SessionMenu';

interface SessionListProps {
  onSelectSession: (session: AmoraSession) => void;
  onCreateSession: () => void;
  currentSessionId?: string;
  onSessionUpdated?: () => void; // Callback when session is updated/deleted
}

export function SessionList({ onSelectSession, onCreateSession, currentSessionId, onSessionUpdated }: SessionListProps) {
  const [sessions, setSessions] = useState<AmoraSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<AmoraSession | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await amoraSessionService.listSessions();
      // Sort: pinned sessions first, then by updated_at
      const sorted = [...data].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return dateB - dateA; // Most recent first
      });
      setSessions(sorted);
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

  const handleShare = async (session: AmoraSession) => {
    try {
      // Create shareable link
      const shareUrl = `${window.location.origin}?session=${session.id}`;
      
      // Try Web Share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: `Amora Session: ${session.title}`,
          text: `Check out my Amora coaching session: ${session.title}`,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Session link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing session:', error);
      // Fallback: copy to clipboard
      try {
        const shareUrl = `${window.location.origin}?session=${session.id}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Session link copied to clipboard!');
      } catch (clipboardError) {
        alert('Failed to share session. Please try again.');
      }
    }
  };

  const handlePin = async (session: AmoraSession) => {
    try {
      await amoraSessionService.updateSession(session.id, {
        pinned: !session.pinned,
      });
      await loadSessions();
      onSessionUpdated?.();
    } catch (error) {
      console.error('Error pinning session:', error);
      alert('Failed to pin/unpin session. Please try again.');
    }
  };

  const handleEdit = (session: AmoraSession) => {
    setEditingSession(session);
    setEditTitle(session.title);
  };

  const handleSaveEdit = async () => {
    if (!editingSession || !editTitle.trim()) return;

    try {
      await amoraSessionService.updateSession(editingSession.id, {
        title: editTitle.trim(),
      });
      await loadSessions();
      setEditingSession(null);
      setEditTitle('');
      onSessionUpdated?.();
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session. Please try again.');
    }
  };

  const handleDelete = async (session: AmoraSession) => {
    if (!confirm(`Are you sure you want to delete "${session.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await amoraSessionService.deleteSession(session.id);
      await loadSessions();
      onSessionUpdated?.();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session. Please try again.');
    }
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
              <div
                key={session.id}
                className={`w-full text-left p-3 rounded-xl transition-all relative ${
                  currentSessionId === session.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {editingSession?.id === session.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') {
                          setEditingSession(null);
                          setEditTitle('');
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingSession(null);
                          setEditTitle('');
                        }}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectSession(session)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {session.pinned && (
                            <Pin className="w-3 h-3 text-purple-500 flex-shrink-0" />
                          )}
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {session.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusIcon(session.status)}
                        </div>
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
                    <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                      <SessionMenu
                        session={session}
                        onShare={handleShare}
                        onPin={handlePin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
