import { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { getCoachResponse, CoachResponse, getChatSession, ChatSession } from '../../services/aiService';
import { MatchScan, UserProfile } from '../../App';

interface AICoachPanelProps {
  scan: MatchScan;
  userProfile: UserProfile | null;
  category?: 'safety' | 'communication' | 'emotional' | 'values' | 'general';
}

export function AICoachPanel({ scan, userProfile, category = 'general' }: AICoachPanelProps) {
  const [coachResponse, setCoachResponse] = useState<CoachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    loadInitialCoachResponse();
  }, [scan, category]);

  const loadInitialCoachResponse = async () => {
    if (!userProfile) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Try to load existing session first
      let existingSession: ChatSession | null = null;
      try {
        // Check if we have a session ID in localStorage for this scan
        const storedSessionId = localStorage.getItem(`chat_session_${scan.id}`);
        if (storedSessionId) {
          existingSession = await getChatSession(storedSessionId);
          if (existingSession && existingSession.messages.length > 0) {
            // Load existing conversation
            setSessionId(existingSession.id);
            setUserName(existingSession.user_name || null);
            setConversation(
              existingSession.messages.map(msg => ({
                role: msg.role as 'user' | 'ai',
                message: msg.message,
              }))
            );
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // Session not found or error loading, continue with new session
        console.log('No existing session found, starting new session');
      }
      
      // Start new conversation
      const response = await getCoachResponse(
        'EXPLAIN',
        scan.id,
        undefined, // scanResultId - will be looked up from scan_id
        category
      );
      
      setCoachResponse(response);
      setSessionId(response.session_id || null);
      setUserName(response.user_name || null);
      
      // Save session ID to localStorage
      if (response.session_id) {
        localStorage.setItem(`chat_session_${scan.id}`, response.session_id);
      }
      
      setConversation([{
        role: 'ai',
        message: response.message,
      }]);
    } catch (error: any) {
      console.error('Error loading AI coach:', error);
      setError(error.detail || 'Failed to load AI coach. Please try again.');
      setConversation([{
        role: 'ai',
        message: 'I apologize, but I encountered an error connecting to the AI service. Please check your connection and try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim() || !userProfile) return;

    const userMsg = userQuestion;
    setUserQuestion('');
    setConversation(prev => [...prev, { role: 'user', message: userMsg }]);

    setIsLoading(true);
    setError(null);
    try {
      const response = await getCoachResponse(
        'LEARN',
        scan.id,
        undefined,
        category,
        userMsg,
        sessionId || undefined
      );
      
      setCoachResponse(response);
      
      // Update session ID if returned
      if (response.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id);
        localStorage.setItem(`chat_session_${scan.id}`, response.session_id);
      }
      
      // Update user name if returned
      if (response.user_name && response.user_name !== userName) {
        setUserName(response.user_name);
      }
      
      setConversation(prev => [...prev, { role: 'ai', message: response.message }]);
    } catch (error: any) {
      console.error('Error getting AI coach response:', error);
      setError(error.detail || 'Failed to get response. Please try again.');
      setConversation(prev => [...prev, {
        role: 'ai',
        message: 'I apologize, but I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm">
          <img src="/ai-coach-logo.svg" alt="AI Coach" className="w-full h-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Amora - Your AI Coach
            {userName && <span className="text-sm font-normal text-gray-600 ml-2">👋 Hi {userName}!</span>}
          </h3>
          <p className="text-xs text-gray-500">Get personalized guidance</p>
        </div>
      </div>

      {/* Conversation */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm p-1">
                <img src="/ai-coach-logo.svg" alt="Amora" className="w-full h-full" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.message}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-rose-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm p-1">
              <img src="/ai-coach-logo.svg" alt="Amora" className="w-full h-full opacity-50" />
            </div>
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Safety Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
        <p className="text-xs text-amber-800">
          <strong>AI explains, not advises:</strong> The AI Coach provides insights and explanations based on your assessment data. It does not provide directive advice or make decisions for you. Always trust your instincts and seek professional guidance when needed.
        </p>
      </div>

      {/* Question Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          placeholder="Ask a question about this assessment..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleAskQuestion}
          disabled={isLoading || !userQuestion.trim()}
          className={`px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
