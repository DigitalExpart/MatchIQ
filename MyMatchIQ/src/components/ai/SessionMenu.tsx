import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Share2, Pin, Edit, Trash2, PinOff } from 'lucide-react';
import { AmoraSession } from '../../services/amoraSessionService';

interface SessionMenuProps {
  session: AmoraSession;
  onShare: (session: AmoraSession) => void;
  onPin: (session: AmoraSession) => void;
  onEdit: (session: AmoraSession) => void;
  onDelete: (session: AmoraSession) => void;
}

export function SessionMenu({ session, onShare, onPin, onEdit, onDelete }: SessionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent session card click
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Session options"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          <button
            onClick={() => handleAction(() => onShare(session))}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={() => handleAction(() => onPin(session))}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {session.pinned ? (
              <>
                <PinOff className="w-4 h-4" />
                <span>Unpin</span>
              </>
            ) : (
              <>
                <Pin className="w-4 h-4" />
                <span>Pin session</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => handleAction(() => onEdit(session))}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          
          <div className="border-t border-gray-200 my-1" />
          
          <button
            onClick={() => handleAction(() => onDelete(session))}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
