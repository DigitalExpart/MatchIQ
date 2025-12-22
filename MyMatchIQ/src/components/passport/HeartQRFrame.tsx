import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { PassportTier } from './PassportTierBadge';
import { Scan } from 'lucide-react';

interface HeartQRFrameProps {
  value: string;
  tier?: PassportTier;
  size?: number;
  className?: string;
  showScanHint?: boolean;
}

const TIER_STYLES = {
  lite: {
    // Calm teal aesthetic
    gradient: ['#14b8a6', '#06b6d4', '#0891b2'],
    glowColor: 'rgba(20, 184, 166, 0.15)',
    borderWidth: '2.5',
    label: 'Lite Passport',
  },
  standard: {
    // Calm purple aesthetic
    gradient: ['#9333ea', '#a855f7', '#7c3aed'],
    glowColor: 'rgba(147, 51, 234, 0.18)',
    borderWidth: '3',
    label: 'Standard Passport',
  },
  deep: {
    // Calm rose aesthetic
    gradient: ['#f43f5e', '#ec4899', '#db2777'],
    glowColor: 'rgba(244, 63, 94, 0.18)',
    borderWidth: '3.5',
    label: 'Deep Passport',
  },
};

export function HeartQRFrame({ 
  value, 
  tier = 'standard',
  size = 280, 
  className = '',
  showScanHint = true 
}: HeartQRFrameProps) {
  const style = TIER_STYLES[tier];
  const qrSize = Math.floor(size * 0.58);
  const padding = Math.floor(size * 0.08);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      className={`relative flex flex-col items-center ${className}`}
    >
      {/* Main container */}
      <div 
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Heart-shaped border with tier-based styling */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ 
            filter: `drop-shadow(0 10px 25px ${style.glowColor})`,
          }}
        >
          <defs>
            <linearGradient id={`heartGradient-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: style.gradient[0], stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: style.gradient[1], stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: style.gradient[2], stopOpacity: 1 }} />
            </linearGradient>
            
            {/* Subtle pulse animation for the heart */}
            <filter id={`glow-${tier}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Heart path - calm, rounded design */}
          <motion.path
            d="M50,88 C50,88 18,65 18,42 C18,32 23,26 30,26 C37,26 43,32 50,42 C57,32 63,26 70,26 C77,26 82,32 82,42 C82,65 50,88 50,88 Z"
            fill="none"
            stroke={`url(#heartGradient-${tier})`}
            strokeWidth={style.borderWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${tier})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* QR Code container - centered and elevated */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="bg-white rounded-3xl shadow-xl border-2 border-gray-100"
            style={{ padding }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            <QRCodeSVG
              value={value}
              size={qrSize}
              level="H"
              includeMargin={false}
              fgColor="#1e293b"
              bgColor="#ffffff"
            />
          </motion.div>
        </div>

        {/* Ambient glow effect - tier specific */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl -z-10 opacity-40"
          style={{ 
            background: `radial-gradient(circle, ${style.glowColor} 0%, transparent 70%)` 
          }}
        />
      </div>

      {/* Scan hint with tier badge */}
      {showScanHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <Scan className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              Scan with MyMatchIQ
            </span>
          </div>
          
          <div className="text-xs text-gray-500 text-center max-w-xs leading-relaxed">
            {style.label} • Privacy Protected
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Compact version for lists/cards
export function CompactQRIndicator({ 
  tier = 'standard',
  size = 60,
  className = ''
}: { 
  tier?: PassportTier; 
  size?: number;
  className?: string;
}) {
  const style = TIER_STYLES[tier];
  
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`miniHeart-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: style.gradient[0], stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: style.gradient[2], stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>
        
        <path
          d="M50,88 C50,88 18,65 18,42 C18,32 23,26 30,26 C37,26 43,32 50,42 C57,32 63,26 70,26 C77,26 82,32 82,42 C82,65 50,88 50,88 Z"
          fill={`url(#miniHeart-${tier})`}
          opacity="0.2"
        />
        <path
          d="M50,88 C50,88 18,65 18,42 C18,32 23,26 30,26 C37,26 43,32 50,42 C57,32 63,26 70,26 C77,26 82,32 82,42 C82,65 50,88 50,88 Z"
          fill="none"
          stroke={`url(#miniHeart-${tier})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Mini QR grid indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-0.5 p-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 bg-gray-800 rounded-sm"
              style={{ opacity: Math.random() > 0.3 ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// QR Frame with tier badge overlay
export function HeartQRFrameWithBadge({ 
  value, 
  tier = 'standard',
  size = 280,
  badgePosition = 'top',
  className = ''
}: HeartQRFrameProps & { 
  badgePosition?: 'top' | 'bottom';
}) {
  const style = TIER_STYLES[tier];
  
  return (
    <div className={`relative ${className}`}>
      {/* Badge positioned above or below */}
      {badgePosition === 'top' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 flex justify-center"
        >
          <div className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
            <span className="text-sm text-gray-700 font-medium">
              {style.label}
            </span>
          </div>
        </motion.div>
      )}
      
      <HeartQRFrame 
        value={value} 
        tier={tier} 
        size={size}
        showScanHint={badgePosition === 'bottom'}
      />
    </div>
  );
}
