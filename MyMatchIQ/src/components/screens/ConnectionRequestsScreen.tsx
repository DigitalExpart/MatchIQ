import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MoreVertical, X, Play, Pause, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export type ConnectionRequestStatus = 'pending' | 'extended' | 'accepted' | 'declined' | 'expired' | 'revoked';
export type ConnectionStatus = 'active' | 'paused' | 'revoked';

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  sentAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp
  status: ConnectionRequestStatus;
  hasExtended?: boolean; // Whether recipient has used their one-time extension
  acceptedAt?: string; // ISO timestamp
  revokedAt?: string; // ISO timestamp
  revokedBy?: 'sender' | 'recipient';
}

export interface ActiveConnection {
  id: string;
  user1Id: string;
  user1Name: string;
  user2Id: string;
  user2Name: string;
  connectedAt: string; // ISO timestamp
  status: ConnectionStatus;
  pausedAt?: string; // ISO timestamp
  pausedBy?: string; // User ID
}

interface ConnectionRequestsScreenProps {
  currentUserId: string;
  currentUserName: string;
  sentRequests: ConnectionRequest[];
  receivedRequests: ConnectionRequest[];
  activeConnections: ActiveConnection[];
  onBack: () => void;
  onRevokeRequest: (requestId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onExtendRequest: (requestId: string) => void;
  onPauseConnection: (connectionId: string) => void;
  onResumeConnection: (connectionId: string) => void;
  onRevokeConnection: (connectionId: string) => void;
  subscriptionTier: 'free' | 'premium' | 'exclusive';
}

// Calculate time remaining in a human-readable format
function getTimeRemaining(expiresAt: string): { text: string; isExpired: boolean; hoursRemaining: number } {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const diff = expiry - now;

  if (diff <= 0) {
    return { text: 'Expired', isExpired: true, hoursRemaining: 0 };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    return { text: `${Math.floor(hours / 24)}d ${hours % 24}h`, isExpired: false, hoursRemaining: hours };
  } else if (hours > 0) {
    return { text: `${hours}h ${minutes}m`, isExpired: false, hoursRemaining: hours };
  } else {
    return { text: `${minutes}m`, isExpired: false, hoursRemaining: 0 };
  }
}

type ModalType = 
  | 'revokeRequest'
  | 'extendRequest'
  | 'pauseConnection'
  | 'revokeConnection'
  | 'acceptRequest'
  | 'declineRequest'
  | 'eliteRequired'
  | null;

export function ConnectionRequestsScreen({
  currentUserId,
  currentUserName,
  sentRequests,
  receivedRequests,
  activeConnections,
  onBack,
  onRevokeRequest,
  onAcceptRequest,
  onDeclineRequest,
  onExtendRequest,
  onPauseConnection,
  onResumeConnection,
  onRevokeConnection,
  subscriptionTier,
}: ConnectionRequestsScreenProps) {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'connections'>('received');

  // Auto-refresh timer for countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render every minute to update countdowns
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRevokeRequest = () => {
    if (selectedItemId) {
      onRevokeRequest(selectedItemId);
      setActiveModal(null);
      setSelectedItemId(null);
    }
  };

  const handleExtendRequest = () => {
    if (selectedItemId) {
      onExtendRequest(selectedItemId);
      setActiveModal(null);
      setSelectedItemId(null);
    }
  };

  const handleAcceptRequest = () => {
    if (selectedItemId) {
      onAcceptRequest(selectedItemId);
      setActiveModal(null);
      setSelectedItemId(null);
    }
  };

  const handleDeclineRequest = () => {
    if (selectedItemId) {
      onDeclineRequest(selectedItemId);
      setActiveModal(null);
      setSelectedItemId(null);
    }
  };

  const handlePauseConnection = () => {
    if (selectedItemId) {
      onPauseConnection(selectedItemId);
      setActiveModal(null);
      setSelectedItemId(null);
    }
  };

  const handleRevokeConnection = () => {
    if (selectedItemId) {
      onRevokeConnection(selectedItemId);
      setActiveModal(null);
      setSelectedItemId(null);
    }
  };

  const openModal = (modal: ModalType, itemId: string) => {
    setSelectedItemId(itemId);
    setActiveModal(modal);
    setOpenMenuId(null);
  };

  const renderRequestCard = (request: ConnectionRequest, type: 'sent' | 'received') => {
    const timeInfo = getTimeRemaining(request.expiresAt);
    const isSender = type === 'sent';
    const otherUserName = isSender ? request.recipientName : request.senderName;

    return (
      <div key={request.id} className="bg-white rounded-2xl p-5 shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg text-gray-900 mb-1">{otherUserName}</h3>
            <div className="flex items-center gap-2">
              {request.status === 'pending' || request.status === 'extended' ? (
                <>
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600">
                    {isSender ? 'Request sent' : 'Request received'} • Expires in {timeInfo.text}
                  </span>
                </>
              ) : request.status === 'expired' ? (
                <>
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Request expired</span>
                </>
              ) : request.status === 'revoked' ? (
                <>
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Revoked</span>
                </>
              ) : request.status === 'declined' ? (
                <>
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Declined</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Accepted</span>
                </>
              )}
            </div>
          </div>

          {/* Menu for active requests */}
          {(request.status === 'pending' || request.status === 'extended') && isSender && (
            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === request.id ? null : request.id)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {openMenuId === request.id && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[160px] z-30">
                    <button
                      onClick={() => openModal('revokeRequest', request.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-all"
                    >
                      Revoke Request
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Extension badge */}
        {request.hasExtended && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg mb-3">
            <Clock className="w-3 h-3" />
            Extended +24h
          </div>
        )}

        {/* Actions for received requests */}
        {!isSender && (request.status === 'pending' || request.status === 'extended') && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => openModal('acceptRequest', request.id)}
              className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Share & Accept
            </button>
            <button
              onClick={() => openModal('declineRequest', request.id)}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
            >
              Decline
            </button>
            {!request.hasExtended && (
              <button
                onClick={() => openModal('extendRequest', request.id)}
                className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all whitespace-nowrap"
              >
                +24h
              </button>
            )}
          </div>
        )}

        {/* Expiration message */}
        {request.status === 'expired' && !isSender && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">This request has expired.</p>
          </div>
        )}

        {request.status === 'expired' && isSender && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">No response within the active window.</p>
          </div>
        )}
      </div>
    );
  };

  const renderConnectionCard = (connection: ActiveConnection) => {
    const otherUserName = connection.user1Id === currentUserId ? connection.user2Name : connection.user1Name;
    const canPause = subscriptionTier === 'exclusive';

    return (
      <div key={connection.id} className="bg-white rounded-2xl p-5 shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg text-gray-900 mb-1">{otherUserName}</h3>
            <div className="flex items-center gap-2">
              {connection.status === 'active' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Connection Active</span>
                </>
              ) : connection.status === 'paused' ? (
                <>
                  <Pause className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Connection Paused</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Access Revoked</span>
                </>
              )}
            </div>
          </div>

          {/* Menu for active connections */}
          {connection.status !== 'revoked' && (
            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === connection.id ? null : connection.id)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {openMenuId === connection.id && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[180px] z-30">
                    {connection.status === 'active' && (
                      <button
                        onClick={() => canPause ? openModal('pauseConnection', connection.id) : openModal('eliteRequired', connection.id)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-between"
                      >
                        <span>Pause Connection</span>
                        {!canPause && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Elite</span>
                        )}
                      </button>
                    )}
                    {connection.status === 'paused' && (
                      <button
                        onClick={() => {
                          onResumeConnection(connection.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-all"
                      >
                        Resume Connection
                      </button>
                    )}
                    <button
                      onClick={() => openModal('revokeConnection', connection.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-all"
                    >
                      Revoke Access
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Paused banner */}
        {connection.status === 'paused' && (
          <div className="mt-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-sm text-orange-800 mb-2">Connection is paused. No shared actions are available.</p>
            <button
              onClick={() => {
                onResumeConnection(connection.id);
              }}
              className="text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Resume Connection
            </button>
          </div>
        )}

        {/* Connection tools */}
        {connection.status === 'active' && (
          <div className="mt-4 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-lg">🔗</span>
              </div>
              <span className="text-sm text-gray-900">Shared Tools Available</span>
            </div>
            <p className="text-xs text-gray-600">Access compatibility insights, dual scans, and shared comparisons.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 transition-all hover:bg-white/30"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="text-center">
            <h1 className="text-3xl text-white mb-2">Connection Requests</h1>
            <p className="text-white/80 text-sm">Manage passport sharing and connections</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/60 backdrop-blur-sm p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 rounded-xl text-sm transition-all ${
              activeTab === 'received'
                ? 'bg-white text-rose-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Received ({receivedRequests.filter(r => r.status === 'pending' || r.status === 'extended').length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 rounded-xl text-sm transition-all ${
              activeTab === 'sent'
                ? 'bg-white text-rose-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sent ({sentRequests.filter(r => r.status === 'pending' || r.status === 'extended').length})
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 py-3 rounded-xl text-sm transition-all ${
              activeTab === 'connections'
                ? 'bg-white text-rose-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active ({activeConnections.filter(c => c.status === 'active').length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'received' && (
            <>
              {receivedRequests.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-md">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">No Received Requests</h3>
                  <p className="text-sm text-gray-600">You'll see passport requests from others here.</p>
                </div>
              ) : (
                receivedRequests.map(request => renderRequestCard(request, 'received'))
              )}
            </>
          )}

          {activeTab === 'sent' && (
            <>
              {sentRequests.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-md">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">No Sent Requests</h3>
                  <p className="text-sm text-gray-600">Share your passport to send a request.</p>
                </div>
              ) : (
                sentRequests.map(request => renderRequestCard(request, 'sent'))
              )}
            </>
          )}

          {activeTab === 'connections' && (
            <>
              {activeConnections.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-md">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">No Active Connections</h3>
                  <p className="text-sm text-gray-600">Accept a request to create a connection.</p>
                </div>
              ) : (
                activeConnections.map(connection => renderConnectionCard(connection))
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'revokeRequest' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Revoke request?</h2>
              <p className="text-gray-600 leading-relaxed">
                This will immediately remove access to your Compatibility Passport and end the request.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeRequest}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'extendRequest' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Review later?</h2>
              <p className="text-gray-600 leading-relaxed">
                You'll get one 24-hour extension. After that, the request will expire automatically.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExtendRequest}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                Add 24 hours
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'acceptRequest' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Compatibility Passports Shared</h2>
              <p className="text-gray-600 leading-relaxed">
                You can now explore compatibility together using shared tools.
              </p>
            </div>

            <button
              onClick={handleAcceptRequest}
              className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {activeModal === 'declineRequest' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Decline request?</h2>
              <p className="text-gray-600 leading-relaxed">
                This request will be permanently declined. No notification will be sent.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineRequest}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'pauseConnection' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pause className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Pause connection?</h2>
              <p className="text-gray-600 leading-relaxed">
                This temporarily disables shared tools. You can resume anytime.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePauseConnection}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'revokeConnection' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Revoke access?</h2>
              <p className="text-gray-600 leading-relaxed">
                This ends compatibility sharing immediately. You and this person will no longer be able to view shared passport insights.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeConnection}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'eliteRequired' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👑</span>
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Elite Feature</h2>
              <p className="text-gray-600 leading-relaxed">
                Connection Pause is available exclusively for Elite tier subscribers.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all"
            >
              Learn More About Elite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}