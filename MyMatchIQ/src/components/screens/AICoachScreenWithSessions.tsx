import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Heart, Menu, X, FileText } from 'lucide-react';
import { amoraSessionService, AmoraSession } from '../../services/amoraSessionService';
import { SessionList } from '../ai/SessionList';
import { CreateSessionModal } from '../ai/CreateSessionModal';
import { MessageFeedback } from '../ai/MessageFeedback';
import { FollowUpNotification } from '../ai/FollowUpNotification';

export interface AICoachScreenProps {
  onBack: () => void;
  onNavigateHome?: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  messageId?: string; // For feedback
}

export function AICoachScreenWithSessions({ onBack }: AICoachScreenProps) {
  // Session management
  const [currentSession, setCurrentSession] = useState<AmoraSession | null>(null);
  const [showSessionList, setShowSessionList] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessions, setSessions] = useState<AmoraSession[]>([]);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  // User context
  const [userContext, setUserContext] = useState({
    topics: [] as string[],
    mentionedIssues: [] as string[],
    relationshipStatus: undefined as string | undefined,
    partnerName: undefined as string | undefined,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
    checkForFollowUps();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSessions = async () => {
    try {
      const data = await amoraSessionService.listSessions();
      setSessions(data);
      
      // Auto-select first active session or create one if none exist
      if (data.length > 0 && !currentSession) {
        const activeSession = data.find(s => s.status === 'ACTIVE') || data[0];
        selectSession(activeSession);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const checkForFollowUps = async () => {
    // FollowUpNotification component handles this
  };

  const selectSession = async (session: AmoraSession) => {
    setCurrentSession(session);
    setShowSessionList(false);
    setMessages([]);
    setShowSummary(false);
    
    // Load session summary if available
    if (session.summary_text) {
      setShowSummary(true);
    }
  };

  const handleCreateSession = async (session: AmoraSession) => {
    setSessions(prev => [session, ...prev]);
    selectSession(session);
  };

  const handleFollowUpSelect = (sessionId: string, prompt: string) => {
    // Find and select the session
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      selectSession(session);
      // Pre-fill the prompt
      setInputValue(prompt);
      inputRef.current?.focus();
    }
  };

  const updateContext = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract partner name
    const partnerPatterns = [
      /(?:with|dating|seeing) (\w+)/i,
      /(?:his|her|their|my partner's) name is (\w+)/i,
      /(\w+) and (?:i|me)/i,
    ];
    for (const pattern of partnerPatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        setUserContext(prev => ({ ...prev, partnerName: match[1] }));
      }
    }
    
    // Detect relationship status
    if (lowerMessage.includes('single') || lowerMessage.includes('not dating')) {
      setUserContext(prev => ({ ...prev, relationshipStatus: 'single' }));
    } else if (lowerMessage.includes('dating') || lowerMessage.includes('seeing someone')) {
      setUserContext(prev => ({ ...prev, relationshipStatus: 'dating' }));
    } else if (lowerMessage.includes('relationship') || lowerMessage.includes('partner') || lowerMessage.includes('married')) {
      setUserContext(prev => ({ ...prev, relationshipStatus: 'committed' }));
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Require a session
    if (!currentSession) {
      setShowCreateModal(true);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    updateContext(content);

    // Add loading message
    const loadingMessage: Message = {
      id: 'loading',
      type: 'ai',
      content: '...',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://macthiq-ai-backend.onrender.com/api/v1';
      const requestPayload = {
        mode: 'LEARN',
        specific_question: content,
        coach_session_id: currentSession.id, // NEW: Pass session ID
        context: {
          topics: userContext.topics,
          mentioned_issues: userContext.mentionedIssues,
          relationship_status: userContext.relationshipStatus,
          partner_name: userContext.partnerName,
        }
      };

      const response = await fetch(`${apiUrl}/coach/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Remove loading message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'loading');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.message || 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date(),
          messageId: data.message_id, // For feedback
        }];
      });

      // Update context with topics from response
      if (data.referenced_data?.topics) {
        setUserContext(prev => ({
          ...prev,
          topics: Array.from(new Set([...prev.topics, ...data.referenced_data.topics])),
        }));
      }

      // Refresh session to get updated summary
      if (data.coach_session_id) {
        try {
          const updatedSession = await amoraSessionService.getSession(data.coach_session_id);
          setCurrentSession(updatedSession);
          if (updatedSession.summary_text) {
            setShowSummary(true);
          }
        } catch (error) {
          console.error('Failed to refresh session:', error);
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'loading');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: error.message?.includes('timeout')
            ? 'The request took too long. Please try again.'
            : 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    // Get last user message and regenerate
    const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <button
            onClick={() => setShowSessionList(!showSessionList)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-2">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl text-white font-bold">
              {currentSession ? currentSession.title : 'Amora - AI Coach'}
            </h1>
            <p className="text-white/90 text-sm">
              {currentSession?.primary_topic 
                ? currentSession.primary_topic.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'Your AI Relationship Coach'}
            </p>
          </div>
        </div>
      </div>

      {/* Session List Sidebar */}
      {showSessionList && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSessionList(false)}>
          <div 
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Sessions</h2>
              <button
                onClick={() => setShowSessionList(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SessionList
              onSelectSession={selectSession}
              onCreateSession={() => {
                setShowSessionList(false);
                setShowCreateModal(true);
              }}
              currentSessionId={currentSession?.id}
            />
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSessionCreated={handleCreateSession}
      />

      {/* Follow-up Notifications */}
      <FollowUpNotification onSelectFollowUp={handleFollowUpSelect} />

      {/* Session Summary */}
      {showSummary && currentSession && (currentSession.summary_text || currentSession.next_plan_text) && (
        <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-900">Session Summary</h3>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="text-purple-600 hover:text-purple-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {currentSession.summary_text && (
            <p className="text-sm text-gray-700 mb-2">{currentSession.summary_text}</p>
          )}
          {currentSession.next_plan_text && (
            <div className="mt-2 pt-2 border-t border-purple-200">
              <p className="text-xs font-medium text-purple-700 mb-1">Next Steps:</p>
              <p className="text-sm text-gray-700">{currentSession.next_plan_text}</p>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && currentSession && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-purple-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentSession.title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Start a conversation with Amora about your relationship questions
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-lg'
                  : 'bg-white shadow-md text-gray-900 rounded-bl-lg'
              }`}
            >
              {message.type === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">Amora</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
              
              {/* Feedback buttons for AI messages */}
              {message.type === 'ai' && message.messageId && (
                <MessageFeedback
                  messageId={message.messageId}
                  messageContent={message.content}
                  onRegenerate={handleRegenerate}
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        {!currentSession && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 mb-2">
              Please create or select a session to start chatting
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-sm font-medium text-yellow-900 hover:underline"
            >
              Create a new session →
            </button>
          </div>
        )}
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            id="amora-chat-input"
            name="amora-message"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder={currentSession ? "Ask me anything about dating..." : "Create a session first..."}
            autoComplete="off"
            aria-label="Chat with Amora"
            disabled={!currentSession || isLoading}
            className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading || !currentSession}
            className={`px-6 py-3 rounded-2xl transition-all ${
              inputValue.trim() && currentSession && !isLoading
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
