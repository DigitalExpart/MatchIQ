import { motion } from 'motion/react';
import { PassportTierBadge, PassportDepthIndicator, PassportTier } from './PassportTierBadge';
import { HeartQRFrame, CompactQRIndicator, HeartQRFrameWithBadge } from './HeartQRFrame';
import { Heart, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

// Example component showing badge usage on passport cards
export function PassportCardWithBadge({ 
  tier = 'standard',
  userName = 'Alex',
  completionDate = 'Dec 13, 2025'
}: { 
  tier?: PassportTier;
  userName?: string;
  completionDate?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-sm"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl text-gray-900 mb-1">{userName}'s Passport</h3>
            <p className="text-sm text-gray-600">Ready to share</p>
          </div>
          <PassportDepthIndicator tier={tier} size="md" />
        </div>
        <PassportTierBadge tier={tier} size="md" showQuestionCount />
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Completed {completionDate}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
            <div className="text-2xl text-gray-900 mb-1">
              {tier === 'lite' ? '15' : tier === 'standard' ? '25' : '45'}
            </div>
            <div className="text-xs text-gray-600">Questions</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
            <div className="text-2xl text-gray-900 mb-1">
              {tier === 'lite' ? '5' : tier === 'standard' ? '8' : '12'}
            </div>
            <div className="text-xs text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Example component showing QR code in scan results
export function ScanResultWithQR({ 
  tier = 'standard',
  matchScore = 87,
  partnerName = 'Jordan'
}: {
  tier?: PassportTier;
  matchScore?: number;
  partnerName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h3 className="text-xl text-gray-900">Compatibility Unlocked</h3>
        </div>
        <p className="text-sm text-gray-600">
          {partnerName} scanned your passport
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <HeartQRFrameWithBadge 
          value={`mymatchiq://passport/result/${tier}/user123`}
          tier={tier}
          size={220}
          badgePosition="top"
        />
      </div>

      <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
        <div className="text-center mb-2">
          <div className="text-4xl text-emerald-700 mb-1">{matchScore}%</div>
          <div className="text-sm text-emerald-700">Compatibility Score</div>
        </div>
      </div>
    </motion.div>
  );
}

// Example component showing compact indicator in lists
export function PassportListItem({ 
  tier = 'standard',
  userName = 'Taylor',
  status = 'pending',
  timestamp = '2 hours ago'
}: {
  tier?: PassportTier;
  userName?: string;
  status?: 'pending' | 'accepted' | 'completed';
  timestamp?: string;
}) {
  const statusConfig = {
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
    accepted: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Accepted' },
    completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  };
  
  const config = statusConfig[status];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all cursor-pointer"
    >
      <CompactQRIndicator tier={tier} size={56} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-gray-900 truncate">{userName}</h4>
          <PassportTierBadge tier={tier} size="sm" variant="minimal" />
        </div>
        <p className="text-sm text-gray-600 truncate">{timestamp}</p>
      </div>

      <div className={`px-3 py-1.5 ${config.bg} ${config.color} rounded-full text-xs font-medium`}>
        {config.label}
      </div>
    </motion.div>
  );
}

// Example showing reflection week entry point
export function ReflectionWeekBanner({ 
  tier = 'standard',
  weekNumber = 1,
  isActive = true
}: {
  tier?: PassportTier;
  weekNumber?: number;
  isActive?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl shadow-lg ${
        isActive 
          ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg text-gray-900">Reflection Week {weekNumber}</h3>
              <PassportTierBadge tier={tier} size="sm" />
            </div>
            <p className="text-sm text-gray-600">
              {isActive 
                ? 'Continue your compatibility journey'
                : 'Complete your current week first'}
            </p>
          </div>
          
          {isActive ? (
            <Clock className="w-5 h-5 text-purple-600 animate-pulse" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-300" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PassportDepthIndicator tier={tier} size="sm" />
            <span className="text-sm text-gray-700">
              {tier === 'lite' ? '15' : tier === 'standard' ? '25' : '45'} questions
            </span>
          </div>

          {isActive && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all">
              <span className="text-sm">Start Week</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Decorative element */}
      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      )}
    </motion.div>
  );
}

// Full showcase component for documentation/testing
export function PassportBadgeSystemShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl text-gray-900 mb-3">
            MyMatchIQ Passport Badge System
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A calm, trustworthy visual language for compatibility depth without gamification or status hierarchy
          </p>
        </div>

        {/* Badge Variations */}
        <section>
          <h2 className="text-2xl text-gray-900 mb-6">Passport Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['lite', 'standard', 'deep'] as PassportTier[]).map(tier => (
              <div key={tier} className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-sm text-gray-600 mb-4 uppercase tracking-wider">
                    {tier} passport
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Default</p>
                      <PassportTierBadge tier={tier} size="md" />
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Minimal</p>
                      <PassportTierBadge tier={tier} size="md" variant="minimal" />
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Card</p>
                      <PassportTierBadge tier={tier} size="md" variant="card" />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-2">Depth Indicator</p>
                      <PassportDepthIndicator tier={tier} size="md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QR Frame Variations */}
        <section>
          <h2 className="text-2xl text-gray-900 mb-6">Heart-Framed QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['lite', 'standard', 'deep'] as PassportTier[]).map(tier => (
              <div key={tier} className="flex justify-center">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <HeartQRFrame 
                    value={`mymatchiq://passport/${tier}/demo`}
                    tier={tier}
                    size={240}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Context Examples */}
        <section>
          <h2 className="text-2xl text-gray-900 mb-6">In Context</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg text-gray-700 mb-4">Passport Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['lite', 'standard', 'deep'] as PassportTier[]).map(tier => (
                  <PassportCardWithBadge key={tier} tier={tier} userName="Alex" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg text-gray-700 mb-4">Scan Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['lite', 'standard', 'deep'] as PassportTier[]).map(tier => (
                  <div key={tier} className="flex justify-center">
                    <ScanResultWithQR tier={tier} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg text-gray-700 mb-4">Request List Items</h3>
              <div className="bg-white rounded-3xl p-6 shadow-lg space-y-3">
                <PassportListItem tier="lite" userName="Taylor" status="pending" />
                <PassportListItem tier="standard" userName="Jordan" status="accepted" />
                <PassportListItem tier="deep" userName="Morgan" status="completed" />
              </div>
            </div>

            <div>
              <h3 className="text-lg text-gray-700 mb-4">Reflection Week Entry</h3>
              <div className="space-y-4">
                <ReflectionWeekBanner tier="standard" weekNumber={1} isActive />
                <ReflectionWeekBanner tier="deep" weekNumber={2} isActive={false} />
              </div>
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl text-gray-900 mb-6">Design Principles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Calm Color Hierarchy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Teal → Purple → Rose progression represents depth without implying superiority. 
                  All tiers use soft, muted palettes.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Meaningful Iconography</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Heart (connection), Layers (depth), Brain (introspection) align with 
                  MatchIQ's heart-brain philosophy.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Trust Through Transparency</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Question counts are always visible. QR codes clearly state "MyMatchIQ only" 
                  and include privacy protection indicators.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">No Gamification</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Avoided: progress bars, achievement unlocks, competitive rankings. 
                  Focus on reflection depth and compatibility clarity.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
