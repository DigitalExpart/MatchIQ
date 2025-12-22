import { useState } from 'react';
import { ArrowLeft, Link as LinkIcon, Clock, Shield } from 'lucide-react';
import { SubscriptionTier } from '../../App';
import { ExpiringShareLinkModal, ExpiredPassportNotice, RevokeConfirmation } from '../ExpiringShareLinkModal';

interface ExpiringLinkDemoScreenProps {
  onBack: () => void;
  tier: SubscriptionTier;
}

type DemoView = 'main' | 'expired' | 'revoked';

export function ExpiringLinkDemoScreen({ onBack, tier }: ExpiringLinkDemoScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [demoView, setDemoView] = useState<DemoView>('main');
  const [activeLinks, setActiveLinks] = useState<Array<{
    id: string;
    url: string;
    expiresAt: string;
    duration: string;
  }>>([]);

  const handleGenerateLink = async (duration: string): Promise<string> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockLink = `https://mymatchiq.app/p/${Math.random().toString(36).substring(7)}`;
        
        // Calculate expiration
        const now = new Date();
        const hours = duration === '24h' ? 24 : duration === '72h' ? 72 : 168;
        const expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000);

        setActiveLinks((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            url: mockLink,
            expiresAt: expiresAt.toISOString(),
            duration,
          },
        ]);

        resolve(mockLink);
      }, 1500);
    });
  };

  const handleRevokeLink = (linkId: string) => {
    setActiveLinks((prev) => prev.filter((link) => link.id !== linkId));
    setDemoView('revoked');
    setTimeout(() => setDemoView('main'), 3000);
  };

  if (demoView === 'expired') {
    return <ExpiredPassportNotice onClose={() => setDemoView('main')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 px-6 pt-12 pb-16 relative overflow-hidden">
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
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">Expiring Share Links</h1>
            <p className="text-white/90">Control passport visibility with time-limited access</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-8 relative z-10 pb-20 space-y-6">
        {/* Feature Overview */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg text-gray-900">How It Works</h2>
          
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-2xl">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Time-Limited Access</h3>
              <p className="text-sm text-gray-600">
                Choose how long someone can view your Compatibility Passport—24 hours, 72 hours, 7 days, or set a custom duration (Elite only).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Privacy Protection</h3>
              <p className="text-sm text-gray-600">
                Links automatically expire, and you can revoke access anytime. Your passport is always read-only.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <LinkIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Flexible Sharing</h3>
              <p className="text-sm text-gray-600">
                Share via link or QR code. Perfect for first dates, early conversations, or intentional connections.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg text-gray-900 mb-4">Try the Feature</h2>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Create Expiring Link
          </button>

          <button
            onClick={() => setDemoView('expired')}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            View Expired Passport Demo
          </button>
        </div>

        {/* Active Links */}
        {activeLinks.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg text-gray-900 mb-4">Active Links ({activeLinks.length})</h2>

            <div className="space-y-3">
              {activeLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-900">
                          {link.duration === '24h' ? '24 hours' : link.duration === '72h' ? '72 hours' : '7 days'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-mono break-all">{link.url}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(link.expiresAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeLink(link.id)}
                    className="w-full py-2 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm border border-red-200"
                  >
                    Revoke Access
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revoke Confirmation */}
        {demoView === 'revoked' && (
          <RevokeConfirmation onClose={() => setDemoView('main')} />
        )}

        {/* Tier Badge */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200">
          <p className="text-sm text-center text-purple-900">
            {tier === 'exclusive' ? (
              <>
                <strong>Elite Tier Active</strong> — All expiration options available, including custom durations
              </>
            ) : (
              <>
                Upgrade to <strong>Elite</strong> to unlock custom expiration durations
              </>
            )}
          </p>
        </div>
      </div>

      {/* Modal */}
      <ExpiringShareLinkModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        tier={tier}
        onGenerateLink={handleGenerateLink}
        onRevokeLink={handleRevokeLink}
      />
    </div>
  );
}
