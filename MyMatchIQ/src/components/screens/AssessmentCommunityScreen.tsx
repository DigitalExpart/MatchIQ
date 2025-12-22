import { useState } from 'react';
import { ArrowLeft, CheckCircle, Lock, Crown, Users, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SubscriptionTier } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AssessmentCommunityScreenProps {
  onBack: () => void;
  subscriptionTier: SubscriptionTier;
  onNavigateToSubscription: () => void;
}

interface CommunityUser {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  passportReady: boolean;
  verified: boolean;
}

const MOCK_USERS: CommunityUser[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    location: 'Austin, TX',
    photo: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    passportReady: true,
    verified: true,
  },
  {
    id: '2',
    name: 'Michael',
    age: 32,
    location: 'Portland, OR',
    photo: 'https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    passportReady: true,
    verified: false,
  },
  {
    id: '3',
    name: 'Emma',
    age: 26,
    location: 'Denver, CO',
    photo: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    passportReady: true,
    verified: true,
  },
  {
    id: '4',
    name: 'David',
    age: 30,
    location: 'Seattle, WA',
    photo: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    passportReady: true,
    verified: false,
  },
  {
    id: '5',
    name: 'Olivia',
    age: 29,
    location: 'Boston, MA',
    photo: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    passportReady: true,
    verified: true,
  },
  {
    id: '6',
    name: 'James',
    age: 34,
    location: 'Chicago, IL',
    photo: 'https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    passportReady: true,
    verified: true,
  },
];

export function AssessmentCommunityScreen({ 
  onBack, 
  subscriptionTier,
  onNavigateToSubscription 
}: AssessmentCommunityScreenProps) {
  const { t } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<CommunityUser | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<CommunityUser | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<CommunityUser | null>(null);

  const hasAccess = subscriptionTier === 'premium' || subscriptionTier === 'exclusive';

  const handleUserTap = (user: CommunityUser) => {
    if (!hasAccess) return;
    
    // Check if request is already pending
    if (pendingRequests.has(user.id)) {
      return;
    }
    
    setSelectedUser(user);
    setShowRequestModal(true);
  };

  const handleSendRequest = () => {
    if (!selectedUser) return;
    
    // Add to pending requests
    setPendingRequests(prev => new Set(prev).add(selectedUser.id));
    
    // Show pending confirmation modal
    setPendingUser(selectedUser);
    setShowRequestModal(false);
    setShowPendingModal(true);
    
    // Clear selected user after a delay
    setTimeout(() => {
      setSelectedUser(null);
    }, 100);
  };

  const handleClosePendingModal = () => {
    setShowPendingModal(false);
    setPendingUser(null);
  };

  const handleCloseModal = () => {
    setShowRequestModal(false);
    setSelectedUser(null);
  };

  const handleRevokeRequest = (user: CommunityUser) => {
    setUserToRevoke(user);
    setShowRevokeModal(true);
  };

  const confirmRevokeRequest = () => {
    if (!userToRevoke) return;
    
    // Remove from pending requests
    setPendingRequests(prev => {
      const newSet = new Set(prev);
      newSet.delete(userToRevoke.id);
      return newSet;
    });
    
    // Close modal
    setShowRevokeModal(false);
    setUserToRevoke(null);
  };

  const cancelRevokeRequest = () => {
    setShowRevokeModal(false);
    setUserToRevoke(null);
  };

  // Locked state for Free users
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-8"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="text-center">
              <Users className="w-12 h-12 text-white mx-auto mb-4" />
              <h1 className="text-3xl text-white mb-2">{t('assessmentCommunity.locked')}</h1>
              <p className="text-white/90">{t('assessmentCommunity.premierFeature')}</p>
            </div>
          </div>
        </div>

        {/* Locked Content */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            
            <h2 className="text-2xl text-gray-900 mb-3">{t('assessmentCommunity.locked')}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t('assessmentCommunity.lockedMessage')}
            </p>

            {/* Preview Grid (Blurred) */}
            <div className="grid grid-cols-2 gap-4 mb-8 blur-sm opacity-50 pointer-events-none">
              {MOCK_USERS.slice(0, 4).map((user) => (
                <div key={user.id} className="bg-gray-100 rounded-2xl p-4">
                  <div className="aspect-square bg-gray-300 rounded-xl mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>

            <button
              onClick={onNavigateToSubscription}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              {t('assessmentCommunity.upgradeToPremier')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-8"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="text-center">
            <Users className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-3xl text-white mb-2">{t('assessmentCommunity.title')}</h1>
            <p className="text-white/90">{t('assessmentCommunity.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* User Grid */}
      <div className="px-6 -mt-12 relative z-10">
        {/* Pending Requests Section */}
        {pendingRequests.size > 0 && (
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3 px-2">{t('assessmentCommunity.requestPending')}</h3>
            <div className="space-y-3">
              {MOCK_USERS.filter(user => pendingRequests.has(user.id)).map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-lg p-4 border-2 border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Photo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                      <ImageWithFallback
                        src={user.photo}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg text-gray-900">{user.name}, {user.age}</h3>
                      <p className="text-sm text-gray-600 mb-1">{user.location}</p>
                      
                      {/* Status */}
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700">{t('assessmentCommunity.pendingReview')}</span>
                      </div>
                      
                      {/* Countdown */}
                      <p className="text-xs text-gray-500">{t('assessmentCommunity.expiresIn48Hours')}</p>
                    </div>

                    {/* Revoke Button */}
                    <button
                      onClick={() => handleRevokeRequest(user)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm flex-shrink-0"
                    >
                      {t('assessmentCommunity.revokeRequest')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {MOCK_USERS.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">{t('assessmentCommunity.noUsers')}</h3>
            <p className="text-gray-600">{t('assessmentCommunity.noUsersMessage')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserTap(user)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all active:scale-95"
              >
                {/* Photo */}
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  <ImageWithFallback
                    src={user.photo}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Verified Badge */}
                  {user.verified && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg text-gray-900">{user.name}, {user.age}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{user.location}</p>
                  
                  {/* Status Badge */}
                  {user.passportReady && (
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg px-3 py-1.5 inline-block">
                      <span className="text-xs text-rose-700">{t('assessmentCommunity.passportReady')}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
          <p className="text-xs text-center text-gray-600 leading-relaxed">
            No browsing. No messaging. Request passport access to evaluate compatibility with intent.
          </p>
        </div>
      </div>

      {/* Request Passport Modal */}
      {showRequestModal && selectedUser && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-[fadeIn_0.2s_ease-out]"
            onClick={handleCloseModal}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 pointer-events-auto animate-[slideUp_0.3s_ease-out]">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-100">
                  <ImageWithFallback
                    src={selectedUser.photo}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl text-gray-900 mb-1">{t('assessmentCommunity.requestTitle')}</h2>
                <p className="text-gray-600">{selectedUser.name}, {selectedUser.age} • {selectedUser.location}</p>
              </div>

              {/* Message */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {t('assessmentCommunity.requestMessage').replace('{{name}}', selectedUser.name)}
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSendRequest}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all"
                >
                  {t('assessmentCommunity.sendRequest')}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  {t('assessmentCommunity.cancel')}
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-center text-gray-500 mt-4">
                They will receive a request notification and can choose to accept or decline.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Pending Request Modal */}
      {showPendingModal && pendingUser && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-[fadeIn_0.2s_ease-out]"
            onClick={handleClosePendingModal}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 pointer-events-auto animate-[slideUp_0.3s_ease-out]">
              {/* Success Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-1">{t('assessmentCommunity.requestSent')}</h2>
                <p className="text-gray-600">{pendingUser.name}, {pendingUser.age} • {pendingUser.location}</p>
              </div>

              {/* Message */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {t('assessmentCommunity.pendingMessage').replace('{{name}}', pendingUser.name)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleClosePendingModal}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                {t('assessmentCommunity.close')}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Revoke Request Modal */}
      {showRevokeModal && userToRevoke && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-[fadeIn_0.2s_ease-out]"
            onClick={cancelRevokeRequest}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 pointer-events-auto animate-[slideUp_0.3s_ease-out]">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-100">
                  <ImageWithFallback
                    src={userToRevoke.photo}
                    alt={userToRevoke.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl text-gray-900 mb-1">{t('assessmentCommunity.revokeTitle')}</h2>
                <p className="text-gray-600">{userToRevoke.name}, {userToRevoke.age} • {userToRevoke.location}</p>
              </div>

              {/* Message */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {t('assessmentCommunity.revokeMessage').replace('{{name}}', userToRevoke.name)}
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={confirmRevokeRequest}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all"
                >
                  {t('assessmentCommunity.revoke')}
                </button>
                <button
                  onClick={cancelRevokeRequest}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  {t('assessmentCommunity.cancel')}
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-center text-gray-500 mt-4">
                This will remove the request from the pending list.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}