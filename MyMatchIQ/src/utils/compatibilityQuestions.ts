// MyMatchIQ Compatibility Passport Questions
// Tier-aware, multiple-choice only, safety-first design

import { SubscriptionTier } from '../App';

export interface CompatibilityQuestion {
  id: string;
  tier: 'free' | 'premium' | 'exclusive'; // Maps to Basic/Premier/Elite
  category: string;
  question: string;
  whyMatters?: string;
  options: {
    value: string;
    label: string;
    weight: number; // 0-100 for scoring
  }[];
}

export const COMPATIBILITY_QUESTIONS: CompatibilityQuestion[] = [
  // ===== BASIC TIER: Foundational Clarity =====
  {
    id: 'relationship-status',
    tier: 'free',
    category: 'Foundational Clarity',
    question: 'What is your current relationship status?',
    whyMatters: 'Clear availability is essential for honest connection',
    options: [
      { value: 'single', label: 'Single and available', weight: 100 },
      { value: 'divorced', label: 'Divorced/separated, ready to date', weight: 90 },
      { value: 'complicated', label: 'It\'s complicated', weight: 20 },
      { value: 'seeing-others', label: 'Casually seeing others', weight: 60 }
    ]
  },
  {
    id: 'relationship-intent',
    tier: 'free',
    category: 'Foundational Clarity',
    question: 'What are you looking for right now?',
    whyMatters: 'Aligned intentions prevent mismatched expectations',
    options: [
      { value: 'long-term', label: 'Long-term committed relationship', weight: 100 },
      { value: 'serious-dating', label: 'Serious dating, open to more', weight: 90 },
      { value: 'casual-open', label: 'Casual dating, seeing where it goes', weight: 70 },
      { value: 'just-fun', label: 'Just having fun for now', weight: 40 },
      { value: 'unsure', label: 'Not sure yet', weight: 50 }
    ]
  },
  {
    id: 'communication-frequency',
    tier: 'free',
    category: 'Foundational Clarity',
    question: 'How do you prefer to communicate in early dating?',
    whyMatters: 'Communication styles impact connection quality',
    options: [
      { value: 'daily-check-ins', label: 'Daily check-ins feel right', weight: 80 },
      { value: 'few-times-week', label: 'A few times a week is good', weight: 90 },
      { value: 'weekly', label: 'Once a week is enough', weight: 70 },
      { value: 'sporadic', label: 'Sporadic, when we feel like it', weight: 60 }
    ]
  },
  {
    id: 'core-values',
    tier: 'free',
    category: 'Foundational Clarity',
    question: 'Which value is most important to you in a partner?',
    whyMatters: 'Shared values create lasting compatibility',
    options: [
      { value: 'honesty', label: 'Honesty and transparency', weight: 100 },
      { value: 'kindness', label: 'Kindness and empathy', weight: 100 },
      { value: 'ambition', label: 'Ambition and drive', weight: 90 },
      { value: 'stability', label: 'Stability and reliability', weight: 95 },
      { value: 'adventure', label: 'Adventure and spontaneity', weight: 85 }
    ]
  },
  {
    id: 'lifestyle-match',
    tier: 'free',
    category: 'Foundational Clarity',
    question: 'How would you describe your ideal weekend?',
    whyMatters: 'Lifestyle compatibility affects day-to-day harmony',
    options: [
      { value: 'social-active', label: 'Out with friends, staying active', weight: 80 },
      { value: 'quiet-home', label: 'Quiet time at home, recharging', weight: 80 },
      { value: 'mix-both', label: 'Mix of social and downtime', weight: 90 },
      { value: 'always-busy', label: 'Always on the go, exploring', weight: 75 },
      { value: 'spontaneous', label: 'Depends on the mood', weight: 70 }
    ]
  },

  // ===== PREMIER TIER: Deeper Compatibility & Readiness =====
  {
    id: 'conflict-style',
    tier: 'premium',
    category: 'Emotional Readiness',
    question: 'How do you typically handle disagreements?',
    whyMatters: 'Conflict resolution style predicts relationship health',
    options: [
      { value: 'calm-discuss', label: 'Calmly discuss to understand', weight: 100 },
      { value: 'need-space-first', label: 'Need space, then talk it out', weight: 85 },
      { value: 'avoid-conflict', label: 'Tend to avoid conflict', weight: 60 },
      { value: 'heated-resolve', label: 'Get heated but resolve quickly', weight: 70 },
      { value: 'explosive', label: 'Often lose my temper', weight: 20 }
    ]
  },
  {
    id: 'past-relationships',
    tier: 'premium',
    category: 'Emotional Readiness',
    question: 'How do you view your past relationships?',
    whyMatters: 'Self-reflection indicates emotional growth',
    options: [
      { value: 'learned-grew', label: 'I learned and grew from them', weight: 100 },
      { value: 'mutual-mismatch', label: 'We weren\'t right for each other', weight: 90 },
      { value: 'still-processing', label: 'Still processing some feelings', weight: 65 },
      { value: 'all-their-fault', label: 'They were the problem, not me', weight: 30 },
      { value: 'prefer-not-discuss', label: 'Prefer not to discuss', weight: 50 }
    ]
  },
  {
    id: 'emotional-availability',
    tier: 'premium',
    category: 'Emotional Readiness',
    question: 'How comfortable are you with emotional intimacy?',
    whyMatters: 'Emotional openness builds deep connection',
    options: [
      { value: 'very-comfortable', label: 'Very comfortable sharing feelings', weight: 100 },
      { value: 'takes-time', label: 'Takes time, but I open up', weight: 85 },
      { value: 'somewhat-guarded', label: 'Somewhat guarded until trust is built', weight: 70 },
      { value: 'prefer-privacy', label: 'Prefer to keep emotions private', weight: 55 },
      { value: 'very-uncomfortable', label: 'Uncomfortable with deep emotions', weight: 40 }
    ]
  },
  {
    id: 'attachment-style',
    tier: 'premium',
    category: 'Emotional Readiness',
    question: 'In relationships, do you tend to...',
    whyMatters: 'Attachment patterns influence relationship dynamics',
    options: [
      { value: 'secure-balanced', label: 'Feel secure and balanced', weight: 100 },
      { value: 'need-reassurance', label: 'Need regular reassurance', weight: 70 },
      { value: 'value-independence', label: 'Highly value my independence', weight: 75 },
      { value: 'hot-and-cold', label: 'Feel hot and cold unpredictably', weight: 50 },
      { value: 'fear-closeness', label: 'Pull away when things get close', weight: 45 }
    ]
  },
  {
    id: 'deal-breaker-kids',
    tier: 'premium',
    category: 'Future Alignment',
    question: 'What\'s your stance on having children?',
    whyMatters: 'Family goals must align for long-term compatibility',
    options: [
      { value: 'definitely-want', label: 'Definitely want children', weight: 100 },
      { value: 'open-to-it', label: 'Open to it with the right person', weight: 90 },
      { value: 'unsure', label: 'Unsure at this point', weight: 70 },
      { value: 'probably-not', label: 'Probably not', weight: 80 },
      { value: 'definitely-not', label: 'Definitely do not want children', weight: 100 }
    ]
  },
  {
    id: 'life-timeline',
    tier: 'premium',
    category: 'Future Alignment',
    question: 'When do you see yourself settling into a long-term relationship?',
    whyMatters: 'Timeline alignment prevents frustration',
    options: [
      { value: 'ready-now', label: 'I\'m ready now', weight: 100 },
      { value: 'within-year', label: 'Within the next year', weight: 95 },
      { value: 'few-years', label: 'In the next few years', weight: 85 },
      { value: 'no-rush', label: 'No specific timeline', weight: 70 },
      { value: 'not-priority', label: 'Not a current priority', weight: 50 }
    ]
  },

  // ===== ELITE TIER: Integrity, Healing, Finance, Power Dynamics =====
  {
    id: 'boundaries-consent',
    tier: 'exclusive',
    category: 'Integrity & Safety',
    question: 'How do you approach boundaries in relationships?',
    whyMatters: 'Boundary respect is foundational to safety and trust',
    options: [
      { value: 'sacred-respect', label: 'Boundaries are sacred and must be respected', weight: 100 },
      { value: 'important-communicate', label: 'Important—we should communicate them clearly', weight: 95 },
      { value: 'depends-situation', label: 'Depends on the situation', weight: 60 },
      { value: 'boundaries-flexible', label: 'Boundaries should be flexible in love', weight: 40 },
      { value: 'boundaries-not-important', label: 'Not something I think about much', weight: 20 }
    ]
  },
  {
    id: 'relationship-dynamics',
    tier: 'exclusive',
    category: 'Integrity & Safety',
    question: 'How do you view decision-making in relationships?',
    whyMatters: 'Power dynamics affect relationship health',
    options: [
      { value: 'equal-partnership', label: 'Equal partnership—we decide together', weight: 100 },
      { value: 'collaborative', label: 'Collaborative with different strengths', weight: 95 },
      { value: 'traditional-balanced', label: 'Traditional roles but balanced respect', weight: 80 },
      { value: 'one-leads', label: 'One person should lead', weight: 50 },
      { value: 'control-preferred', label: 'I prefer to be in control', weight: 30 }
    ]
  },
  {
    id: 'anger-management',
    tier: 'exclusive',
    category: 'Integrity & Safety',
    question: 'When you\'re angry or frustrated, you typically...',
    whyMatters: 'Emotional regulation is critical for safety',
    options: [
      { value: 'pause-process', label: 'Pause and process before responding', weight: 100 },
      { value: 'express-verbally', label: 'Express it verbally but respectfully', weight: 90 },
      { value: 'need-cool-down', label: 'Need to cool down alone first', weight: 85 },
      { value: 'often-lose-control', label: 'Sometimes lose control of my words', weight: 30 },
      { value: 'physical-expression', label: 'Express it physically (slam doors, etc.)', weight: 20 }
    ]
  },
  {
    id: 'financial-approach',
    tier: 'exclusive',
    category: 'Financial Alignment',
    question: 'How do you approach financial discussions in dating?',
    whyMatters: 'Financial communication predicts long-term compatibility',
    options: [
      { value: 'open-transparent', label: 'Open and transparent when it\'s relevant', weight: 100 },
      { value: 'comfortable-discussing', label: 'Comfortable discussing once serious', weight: 90 },
      { value: 'private-matter', label: 'Keep finances private until committed', weight: 75 },
      { value: 'uncomfortable', label: 'Feel uncomfortable discussing money', weight: 55 },
      { value: 'avoid-discussing', label: 'Prefer to avoid discussing it', weight: 35 }
    ]
  },
  {
    id: 'financial-stability',
    tier: 'exclusive',
    category: 'Financial Alignment',
    question: 'How would you describe your current financial situation?',
    whyMatters: 'Financial stability affects relationship stress levels',
    options: [
      { value: 'stable-secure', label: 'Stable and secure', weight: 100 },
      { value: 'managing-well', label: 'Managing well, building stability', weight: 90 },
      { value: 'some-challenges', label: 'Some challenges but handling them', weight: 75 },
      { value: 'significant-stress', label: 'Significant financial stress', weight: 50 },
      { value: 'crisis-mode', label: 'In crisis mode', weight: 30 }
    ]
  },
  {
    id: 'therapy-growth',
    tier: 'exclusive',
    category: 'Healing & Growth',
    question: 'What\'s your relationship with therapy or personal growth work?',
    whyMatters: 'Commitment to growth indicates emotional maturity',
    options: [
      { value: 'active-therapy', label: 'Currently in therapy or doing growth work', weight: 100 },
      { value: 'past-helpful', label: 'Done it in the past, found it helpful', weight: 95 },
      { value: 'open-to-it', label: 'Open to it if needed', weight: 85 },
      { value: 'not-for-me', label: 'Not really for me', weight: 60 },
      { value: 'dont-believe', label: 'Don\'t believe in it', weight: 40 }
    ]
  },
  {
    id: 'accountability',
    tier: 'exclusive',
    category: 'Healing & Growth',
    question: 'When things go wrong, you tend to...',
    whyMatters: 'Accountability is essential for healthy relationships',
    options: [
      { value: 'own-mistakes', label: 'Own my mistakes and work to improve', weight: 100 },
      { value: 'reflect-apologize', label: 'Reflect and apologize when needed', weight: 95 },
      { value: 'depends-situation', label: 'Depends on the situation', weight: 70 },
      { value: 'defensive', label: 'Get defensive initially', weight: 50 },
      { value: 'blame-others', label: 'Usually not my fault', weight: 25 }
    ]
  },
  {
    id: 'trauma-healing',
    tier: 'exclusive',
    category: 'Healing & Growth',
    question: 'Have you done work to heal from past relationship trauma or patterns?',
    whyMatters: 'Healing prevents repeating unhealthy patterns',
    options: [
      { value: 'active-healing', label: 'Yes, actively working on it', weight: 100 },
      { value: 'made-progress', label: 'Yes, made significant progress', weight: 95 },
      { value: 'some-work', label: 'Some work, still learning', weight: 80 },
      { value: 'no-trauma', label: 'No significant trauma to address', weight: 90 },
      { value: 'not-yet', label: 'Not yet, but aware I should', weight: 60 },
      { value: 'no-need', label: 'Don\'t feel I need to', weight: 45 }
    ]
  }
];

// Get questions available for a specific tier
export function getQuestionsForTier(tier: SubscriptionTier): CompatibilityQuestion[] {
  const tierMap = {
    free: ['free'],
    premium: ['free', 'premium'],
    exclusive: ['free', 'premium', 'exclusive']
  };

  const allowedTiers = tierMap[tier];
  return COMPATIBILITY_QUESTIONS.filter(q => allowedTiers.includes(q.tier));
}

// Get question count for tier
export function getQuestionCountForTier(tier: SubscriptionTier): number {
  return getQuestionsForTier(tier).length;
}

// Get tier label
export function getTierLabel(tier: SubscriptionTier): string {
  const labels = {
    free: 'Lite Passport (15Q)',
    premium: 'Standard Passport (25Q)',
    exclusive: 'Deep Passport (45Q)'
  };
  return labels[tier];
}
