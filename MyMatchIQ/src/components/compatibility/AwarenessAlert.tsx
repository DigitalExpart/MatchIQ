// Non-accusatory awareness alert for red flags
import { AlertCircle, Lock, Info } from 'lucide-react';
import { RedFlag } from '../../utils/compatibilityEngine';

interface AwarenessAlertProps {
  flags: RedFlag[];
  variant?: 'compact' | 'detailed';
}

export function AwarenessAlert({ flags, variant = 'detailed' }: AwarenessAlertProps) {
  if (flags.length === 0) return null;

  // Get highest severity
  const hasCritical = flags.some(f => f.severity === 'critical');
  const hasHigh = flags.some(f => f.severity === 'high');

  const severity = hasCritical ? 'critical' : hasHigh ? 'high' : 'medium';

  const config = {
    critical: {
      icon: Lock,
      gradient: 'from-orange-100 to-red-100',
      border: 'border-orange-300',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900',
      title: 'Important Considerations'
    },
    high: {
      icon: AlertCircle,
      gradient: 'from-amber-100 to-orange-100',
      border: 'border-amber-300',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900',
      title: 'Areas for Awareness'
    },
    medium: {
      icon: Info,
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      title: 'Points to Consider'
    }
  };

  const { icon: Icon, gradient, border, iconColor, textColor, title } = config[severity];

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r ${gradient} border ${border} rounded-2xl p-4`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h4 className={`text-sm ${textColor} mb-1`}>{title}</h4>
            <p className="text-sm text-gray-700">
              Some responses indicate areas that may benefit from discussion before proceeding.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-6`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg ${textColor} mb-2`}>{title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            The assessment has identified patterns that may require awareness or open conversation. 
            These signals don't determine outcomes—they highlight areas worth understanding.
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {flags.map((flag, index) => (
          <div key={index} className="bg-white/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
              <div className="flex-1">
                <p className="text-sm text-gray-800 mb-1">{flag.signal}</p>
                {flag.guidance && (
                  <p className="text-xs text-gray-600 italic">{flag.guidance}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
