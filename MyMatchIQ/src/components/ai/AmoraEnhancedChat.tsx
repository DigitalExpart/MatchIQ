/**
 * Amora Enhanced Chat Component
 * TASK 8: Frontend Experience Polish
 * 
 * Features:
 * - First-turn warm welcome
 * - Privacy badge
 * - Calm typing indicator
 * - Comfortable spacing
 * - Fade-in animations
 * - Readable message rhythm
 */

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Lock, Heart } from 'lucide-react';
import { API_BASE_URL } from '../../utils/apiConfig';

interface Message {
  id: string;
  type: 'user' | 'amora';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AmoraEnhancedChatProps {
  onBack: () => void;
  userId: string;
}

export const AmoraEnhancedChat: React.FC<AmoraEnhancedChatProps> = ({
  onBack,
  userId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add typing indicator
    const typingId = Date.now().toString() + '-typing';
    setMessages(prev => [...prev, {
      id: typingId,
      type: 'amora',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }]);

    try {
      const response = await fetch(`${API_BASE_URL}/coach/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mode: 'LEARN',
          specific_question: userMessage.content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));

      // Add Amora's response
      const amoraMessage: Message = {
        id: Date.now().toString(),
        type: 'amora',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, amoraMessage]);
      setIsFirstMessage(false);

    } catch (error) {
      console.error('Error getting response:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));

      // Show error fallback
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'amora',
        content: "I'm here to help. Can you share a bit more about what you're thinking?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-purple-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-purple-50 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Amora</h1>
            <p className="text-xs text-gray-500">Your AI Relationship Coach</p>
          </div>
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-full">
          <Lock className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-xs font-medium text-purple-700">Private</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* First-turn welcome message */}
        {messages.length === 0 && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-purple-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Amora</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed">
                I'm Amora. I help people think through love and relationships without judgment or pressure.
              </p>
              <p className="text-gray-800 leading-relaxed mt-3">
                What's been on your mind lately?
              </p>
              <div className="mt-4 pt-4 border-t border-purple-100">
                <p className="text-xs text-purple-600 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  This is a safe, judgment-free space. Take your time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            {message.type === 'amora' && message.isTyping ? (
              /* Calm Typing Indicator */
              <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-purple-100'
                }`}
              >
                {message.type === 'amora' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-purple-700">Amora</span>
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-purple-100 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isFirstMessage ? "Share what's on your mind..." : "Type your message..."}
              className="flex-1 resize-none rounded-2xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[52px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AmoraEnhancedChat;
