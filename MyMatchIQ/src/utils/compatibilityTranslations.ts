// Helper utilities for translating compatibility content
import { RedFlag } from './compatibilityEngine';

export function getRedFlagTranslationKey(category: RedFlag['category']): string {
  const categoryMap: Record<RedFlag['category'], string> = {
    'consent': 'compatibility.consentAlert',
    'boundaries': 'compatibility.consentAlert',
    'honesty': 'compatibility.honestyAlert',
    'trauma': 'compatibility.emotionalAlert',
    'emotional': 'compatibility.regulationAlert',
    'control': 'compatibility.controlAlert',
    'financial': 'compatibility.stabilityAlert',
    'safety': 'compatibility.consentAlert', // Use consent alert for critical safety
  };

  return categoryMap[category] || 'compatibility.softAwareness';
}

export function getRecommendationTranslationKey(action: 'proceed' | 'proceed-with-awareness' | 'pause-and-reflect'): string {
  const actionMap = {
    'proceed': 'compatibility.proceed',
    'proceed-with-awareness': 'compatibility.proceedAware',
    'pause-and-reflect': 'compatibility.pauseReflect',
  };

  return actionMap[action];
}
