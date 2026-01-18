import { useState } from 'react';
import { ThumbsUp, ThumbsDown, RotateCcw, Copy, Check } from 'lucide-react';
import { amoraSessionService } from '../../services/amoraSessionService';

interface MessageFeedbackProps {
  messageId: string;
  messageContent: string;
  onRegenerate?: () => void;
}

export function MessageFeedback({ messageId, messageContent, onRegenerate }: MessageFeedbackProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    
    try {
      setLoading(true);
      await amoraSessionService.submitFeedback(messageId, 'like');
      setLiked(true);
      setDisliked(false);
    } catch (error) {
      console.error('Failed to submit like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (disliked) return;
    
    try {
      setLoading(true);
      await amoraSessionService.submitFeedback(messageId, 'dislike');
      setDisliked(true);
      setLiked(false);
    } catch (error) {
      console.error('Failed to submit dislike:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      await amoraSessionService.submitFeedback(messageId, 'regenerate');
      if (onRegenerate) {
        onRegenerate();
      }
    } catch (error) {
      console.error('Failed to submit regenerate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleLike}
        disabled={loading || liked}
        className={`p-1.5 rounded-lg transition-colors ${
          liked
            ? 'bg-green-100 text-green-600'
            : 'hover:bg-gray-100 text-gray-500 hover:text-green-600'
        }`}
        title="Like this response"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>

      <button
        onClick={handleDislike}
        disabled={loading || disliked}
        className={`p-1.5 rounded-lg transition-colors ${
          disliked
            ? 'bg-red-100 text-red-600'
            : 'hover:bg-gray-100 text-gray-500 hover:text-red-600'
        }`}
        title="Dislike this response"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>

      <button
        onClick={handleRegenerate}
        disabled={loading}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors"
        title="Regenerate response"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
