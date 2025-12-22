import { PassportQuestionData } from '../components/passport/PassportQuestion';
import { PassportTier } from '../components/passport/PassportTierBadge';

// LITE TIER: 15 Questions
const LITE_QUESTIONS: PassportQuestionData[] = [
  // Intentions & Relationship Outlook (5)
  {
    id: 'lite-intentions-1',
    category: 'Intentions & Relationship Outlook',
    question: 'What are you looking for right now?',
    options: [
      { id: 'casual', label: 'Casual dating and exploring' },
      { id: 'intentional', label: 'Intentional dating with potential for something serious' },
      { id: 'serious', label: 'A committed long-term relationship' },
      { id: 'open', label: 'Open to seeing where things go' },
    ],
  },
  {
    id: 'lite-intentions-2',
    category: 'Intentions & Relationship Outlook',
    question: 'How important is long-term compatibility to you?',
    options: [
      { id: 'very', label: 'Very important - I want to build something lasting' },
      { id: 'somewhat', label: 'Somewhat important - I value it but stay flexible' },
      { id: 'not-priority', label: 'Not my main priority right now' },
      { id: 'depends', label: 'Depends on the connection' },
    ],
  },
  {
    id: 'lite-intentions-3',
    category: 'Intentions & Relationship Outlook',
    question: 'How do you typically approach new relationships?',
    options: [
      { id: 'slow', label: 'I take my time and move slowly' },
      { id: 'steady', label: 'I like a steady, intentional pace' },
      { id: 'fast', label: 'I tend to move quickly when I feel a connection' },
      { id: 'varies', label: 'It varies depending on the person' },
    ],
  },
  {
    id: 'lite-intentions-4',
    category: 'Intentions & Relationship Outlook',
    question: 'What matters most to you in a partner?',
    multiSelect: true,
    maxSelect: 2,
    options: [
      { id: 'emotional', label: 'Emotional availability and communication' },
      { id: 'values', label: 'Shared values and life goals' },
      { id: 'chemistry', label: 'Physical chemistry and attraction' },
      { id: 'stability', label: 'Stability and reliability' },
      { id: 'fun', label: 'Fun and spontaneity' },
    ],
  },
  {
    id: 'lite-intentions-5',
    category: 'Intentions & Relationship Outlook',
    question: 'How do you feel about defining the relationship early on?',
    options: [
      { id: 'important', label: 'I think it is important to clarify expectations' },
      { id: 'comfortable', label: 'I am comfortable with it but not in a rush' },
      { id: 'prefer-wait', label: 'I prefer to wait and see how things develop' },
      { id: 'unnecessary', label: 'I think labels can be unnecessary' },
    ],
  },

  // Communication Style (5)
  {
    id: 'lite-comm-1',
    category: 'Communication Style',
    question: 'How do you prefer to communicate when something is bothering you?',
    options: [
      { id: 'immediately', label: 'I bring it up immediately' },
      { id: 'think-first', label: 'I think it through, then address it calmly' },
      { id: 'wait', label: 'I wait to see if it resolves on its own' },
      { id: 'avoid', label: 'I tend to avoid conflict if possible' },
    ],
  },
  {
    id: 'lite-comm-2',
    category: 'Communication Style',
    question: 'How do you like to stay connected with a partner?',
    options: [
      { id: 'frequent', label: 'Frequent texting or calls throughout the day' },
      { id: 'moderate', label: 'Regular check-ins but not constant' },
      { id: 'quality', label: 'Quality time together over constant communication' },
      { id: 'independent', label: 'Independent - we connect when it feels natural' },
    ],
  },
  {
    id: 'lite-comm-3',
    category: 'Communication Style',
    question: 'When you are stressed, how do you prefer to handle it?',
    options: [
      { id: 'talk-it-out', label: 'I like to talk it out with someone' },
      { id: 'process-alone', label: 'I need time alone to process' },
      { id: 'distraction', label: 'I prefer distraction or activity' },
      { id: 'depends-mood', label: 'It depends on my mood' },
    ],
  },
  {
    id: 'lite-comm-4',
    category: 'Communication Style',
    question: 'How direct are you when expressing your needs?',
    options: [
      { id: 'very-direct', label: 'Very direct - I say what I need clearly' },
      { id: 'direct-kind', label: 'Direct but thoughtful in delivery' },
      { id: 'subtle', label: 'I tend to be more subtle or indirect' },
      { id: 'struggle', label: 'I sometimes struggle to express my needs' },
    ],
  },
  {
    id: 'lite-comm-5',
    category: 'Communication Style',
    question: 'How do you respond to feedback or criticism?',
    options: [
      { id: 'open', label: 'I am open to it and appreciate honesty' },
      { id: 'depends-delivery', label: 'I am receptive if it is delivered kindly' },
      { id: 'defensive', label: 'I can be defensive at first' },
      { id: 'take-personally', label: 'I tend to take it personally' },
    ],
  },

  // Emotional Awareness (5)
  {
    id: 'lite-emotional-1',
    category: 'Emotional Awareness',
    question: 'How in tune are you with your emotions?',
    options: [
      { id: 'very', label: 'Very - I understand and can name what I am feeling' },
      { id: 'mostly', label: 'Mostly - I am working on it' },
      { id: 'sometimes', label: 'Sometimes I am not sure what I am feeling' },
      { id: 'struggle', label: 'I often struggle to identify my emotions' },
    ],
  },
  {
    id: 'lite-emotional-2',
    category: 'Emotional Awareness',
    question: 'How comfortable are you being vulnerable?',
    options: [
      { id: 'comfortable', label: 'I am comfortable sharing openly' },
      { id: 'takes-time', label: 'It takes time but I can get there' },
      { id: 'selective', label: 'I am selective about when and with whom' },
      { id: 'difficult', label: 'It is difficult for me to open up' },
    ],
  },
  {
    id: 'lite-emotional-3',
    category: 'Emotional Awareness',
    question: 'How do you typically process difficult emotions?',
    options: [
      { id: 'talk', label: 'By talking through them with someone' },
      { id: 'reflect', label: 'Through journaling or self-reflection' },
      { id: 'distract', label: 'By staying busy or distracting myself' },
      { id: 'time', label: 'I just need time for them to pass' },
    ],
  },
  {
    id: 'lite-emotional-4',
    category: 'Emotional Awareness',
    question: 'How aware are you of how your emotions affect others?',
    options: [
      { id: 'very-aware', label: 'Very aware - I try to manage my reactions' },
      { id: 'aware', label: 'Aware and working on it' },
      { id: 'sometimes', label: 'Sometimes - depends on the situation' },
      { id: 'not-much', label: 'Not something I think about much' },
    ],
  },
  {
    id: 'lite-emotional-5',
    category: 'Emotional Awareness',
    question: 'How do you handle emotional overwhelm?',
    options: [
      { id: 'pause', label: 'I pause, breathe, and give myself space' },
      { id: 'reach-out', label: 'I reach out to someone I trust' },
      { id: 'shutdown', label: 'I tend to shut down or withdraw' },
      { id: 'reactive', label: 'I can become reactive in the moment' },
    ],
  },
];

// STANDARD TIER: 25 Questions (includes all LITE + 10 more)
const STANDARD_ADDITIONAL: PassportQuestionData[] = [
  // Values & Lifestyle (5)
  {
    id: 'standard-values-1',
    category: 'Values & Lifestyle',
    question: 'What role does personal growth play in your life?',
    options: [
      { id: 'central', label: 'It is central - I am always working on myself' },
      { id: 'important', label: 'Important - I am open to growth opportunities' },
      { id: 'balanced', label: 'I balance growth with acceptance' },
      { id: 'content', label: 'I am pretty content where I am' },
    ],
  },
  {
    id: 'standard-values-2',
    category: 'Values & Lifestyle',
    question: 'How important is financial stability in a relationship?',
    options: [
      { id: 'very', label: 'Very important - it is a foundation for partnership' },
      { id: 'important', label: 'Important but not the main priority' },
      { id: 'somewhat', label: 'Somewhat - we can figure it out together' },
      { id: 'not-priority', label: 'Not a priority - love matters more' },
    ],
  },
  {
    id: 'standard-values-3',
    category: 'Values & Lifestyle',
    question: 'How do you balance independence and togetherness?',
    options: [
      { id: 'both', label: 'I value both equally and intentionally' },
      { id: 'lean-together', label: 'I lean toward togetherness' },
      { id: 'lean-independent', label: 'I lean toward independence' },
      { id: 'struggle', label: 'I sometimes struggle with this balance' },
    ],
  },
  {
    id: 'standard-values-4',
    category: 'Values & Lifestyle',
    question: 'What is your ideal weekend?',
    multiSelect: true,
    maxSelect: 2,
    options: [
      { id: 'adventure', label: 'Adventure and trying new things' },
      { id: 'relaxing', label: 'Relaxing at home' },
      { id: 'social', label: 'Social time with friends or family' },
      { id: 'productive', label: 'Being productive or working on projects' },
      { id: 'mix', label: 'A mix - I like variety' },
    ],
  },
  {
    id: 'standard-values-5',
    category: 'Values & Lifestyle',
    question: 'How aligned do your values need to be with a partner?',
    options: [
      { id: 'very', label: 'Very aligned - core values must match' },
      { id: 'mostly', label: 'Mostly aligned with room for differences' },
      { id: 'some', label: 'Some alignment, but diversity is healthy' },
      { id: 'flexible', label: 'Flexible - differences can be enriching' },
    ],
  },

  // Conflict & Boundaries (5)
  {
    id: 'standard-conflict-1',
    category: 'Conflict & Boundaries',
    question: 'How do you typically handle disagreements?',
    options: [
      { id: 'calm-discuss', label: 'I stay calm and discuss things rationally' },
      { id: 'need-space', label: 'I need space first, then discuss' },
      { id: 'get-heated', label: 'I can get heated but work through it' },
      { id: 'avoid', label: 'I tend to avoid confrontation' },
    ],
  },
  {
    id: 'standard-conflict-2',
    category: 'Conflict & Boundaries',
    question: 'How clear are you about your boundaries?',
    options: [
      { id: 'very-clear', label: 'Very clear - I communicate them openly' },
      { id: 'clear-learning', label: 'Clear and still learning to enforce them' },
      { id: 'figuring-out', label: 'I am still figuring out what my boundaries are' },
      { id: 'struggle', label: 'I struggle to set boundaries' },
    ],
  },
  {
    id: 'standard-conflict-3',
    category: 'Conflict & Boundaries',
    question: 'After a conflict, how do you reconnect?',
    options: [
      { id: 'talk-through', label: 'I like to talk it through completely' },
      { id: 'apologize-move-on', label: 'Apologize and move forward' },
      { id: 'quality-time', label: 'Through quality time or affection' },
      { id: 'need-time', label: 'I need time before I can reconnect' },
    ],
  },
  {
    id: 'standard-conflict-4',
    category: 'Conflict & Boundaries',
    question: 'How do you respond when a boundary is crossed?',
    options: [
      { id: 'address-immediately', label: 'I address it immediately' },
      { id: 'address-calmly', label: 'I address it calmly when I am ready' },
      { id: 'struggle-speak', label: 'I struggle to speak up' },
      { id: 'internalize', label: 'I tend to internalize it' },
    ],
  },
  {
    id: 'standard-conflict-5',
    category: 'Conflict & Boundaries',
    question: 'What helps you feel safe during difficult conversations?',
    multiSelect: true,
    maxSelect: 2,
    options: [
      { id: 'calm-tone', label: 'Calm tone and respectful language' },
      { id: 'time-space', label: 'Having time and space to think' },
      { id: 'validation', label: 'Feeling heard and validated' },
      { id: 'solutions', label: 'Focus on solutions, not blame' },
      { id: 'physical-comfort', label: 'Physical comfort or reassurance' },
    ],
  },
];

// DEEP TIER: 45 Questions (includes all STANDARD + 20 more)
const DEEP_ADDITIONAL: PassportQuestionData[] = [
  // Pace & Consistency (5)
  {
    id: 'deep-pace-1',
    category: 'Pace & Consistency',
    question: 'How consistent are you in your emotional availability?',
    options: [
      { id: 'very', label: 'Very consistent - people can count on me' },
      { id: 'mostly', label: 'Mostly consistent with occasional fluctuations' },
      { id: 'varies', label: 'It varies depending on what else is happening' },
      { id: 'unpredictable', label: 'I can be unpredictable' },
    ],
  },
  {
    id: 'deep-pace-2',
    category: 'Pace & Consistency',
    question: 'How do you handle the in-between stages of dating?',
    options: [
      { id: 'comfortable', label: 'I am comfortable with uncertainty' },
      { id: 'prefer-clarity', label: 'I prefer clarity and definition' },
      { id: 'anxious', label: 'I can feel anxious without structure' },
      { id: 'go-with-flow', label: 'I go with the flow easily' },
    ],
  },
  {
    id: 'deep-pace-3',
    category: 'Pace & Consistency',
    question: 'How steady are you in showing up for someone?',
    options: [
      { id: 'very-steady', label: 'Very steady - I follow through consistently' },
      { id: 'steady-effort', label: 'Steady with intentional effort' },
      { id: 'depends-capacity', label: 'Depends on my capacity at the time' },
      { id: 'inconsistent', label: 'I can be inconsistent' },
    ],
  },
  {
    id: 'deep-pace-4',
    category: 'Pace & Consistency',
    question: 'When things get routine, how do you respond?',
    options: [
      { id: 'appreciate', label: 'I appreciate stability and routine' },
      { id: 'balance', label: 'I like balance between routine and novelty' },
      { id: 'need-newness', label: 'I need newness to stay engaged' },
      { id: 'bored', label: 'I can get bored easily' },
    ],
  },
  {
    id: 'deep-pace-5',
    category: 'Pace & Consistency',
    question: 'How predictable is your communication pattern?',
    options: [
      { id: 'very', label: 'Very predictable - I am reliable' },
      { id: 'mostly', label: 'Mostly predictable with flexibility' },
      { id: 'depends', label: 'Depends on my mood or schedule' },
      { id: 'erratic', label: 'I can be erratic' },
    ],
  },

  // Long-Term Thinking (5)
  {
    id: 'deep-longterm-1',
    category: 'Long-Term Thinking',
    question: 'How do you think about the future in relationships?',
    options: [
      { id: 'actively', label: 'I actively plan and envision it' },
      { id: 'consider', label: 'I consider it but stay present-focused' },
      { id: 'prefer-present', label: 'I prefer to focus on the present' },
      { id: 'overwhelmed', label: 'Thinking long-term feels overwhelming' },
    ],
  },
  {
    id: 'deep-longterm-2',
    category: 'Long-Term Thinking',
    question: 'What is your relationship with commitment?',
    options: [
      { id: 'embrace', label: 'I embrace it when it is right' },
      { id: 'cautious', label: 'I am cautious but open to it' },
      { id: 'nervous', label: 'It makes me nervous' },
      { id: 'avoid', label: 'I tend to avoid it' },
    ],
  },
  {
    id: 'deep-longterm-3',
    category: 'Long-Term Thinking',
    question: 'How important is shared vision for the future?',
    options: [
      { id: 'essential', label: 'Essential - we need aligned goals' },
      { id: 'important', label: 'Important but can evolve together' },
      { id: 'flexible', label: 'Flexible - we will figure it out' },
      { id: 'not-priority', label: 'Not a priority for me' },
    ],
  },
  {
    id: 'deep-longterm-4',
    category: 'Long-Term Thinking',
    question: 'How do you handle major life transitions?',
    options: [
      { id: 'adapt-well', label: 'I adapt well and stay grounded' },
      { id: 'navigate', label: 'I navigate them with support' },
      { id: 'struggle', label: 'I struggle but get through' },
      { id: 'derailed', label: 'They can derail me' },
    ],
  },
  {
    id: 'deep-longterm-5',
    category: 'Long-Term Thinking',
    question: 'What role does partnership play in your long-term goals?',
    options: [
      { id: 'integrated', label: 'It is integrated into my vision' },
      { id: 'important', label: 'Important but not the whole picture' },
      { id: 'separate', label: 'I keep them somewhat separate' },
      { id: 'unsure', label: 'I am not sure yet' },
    ],
  },

  // Trust & Emotional Safety (5)
  {
    id: 'deep-trust-1',
    category: 'Trust & Emotional Safety',
    question: 'How easily do you trust new romantic partners?',
    options: [
      { id: 'easily', label: 'I trust easily until given reason not to' },
      { id: 'earned', label: 'Trust is earned over time' },
      { id: 'guarded', label: 'I am guarded at first' },
      { id: 'struggle', label: 'I struggle with trust' },
    ],
  },
  {
    id: 'deep-trust-2',
    category: 'Trust & Emotional Safety',
    question: 'How do you create emotional safety for others?',
    options: [
      { id: 'intentional', label: 'I am very intentional about it' },
      { id: 'naturally', label: 'It comes naturally to me' },
      { id: 'learning', label: 'I am learning how to do this better' },
      { id: 'unsure', label: 'I am not sure how' },
    ],
  },
  {
    id: 'deep-trust-3',
    category: 'Trust & Emotional Safety',
    question: 'What makes you feel emotionally safe with someone?',
    multiSelect: true,
    maxSelect: 3,
    options: [
      { id: 'consistency', label: 'Consistency in their words and actions' },
      { id: 'vulnerability', label: 'Their willingness to be vulnerable too' },
      { id: 'respect', label: 'Respect for my boundaries' },
      { id: 'validation', label: 'Feeling heard and validated' },
      { id: 'reliability', label: 'Knowing they will show up for me' },
    ],
  },
  {
    id: 'deep-trust-4',
    category: 'Trust & Emotional Safety',
    question: 'How do you respond when trust is broken?',
    options: [
      { id: 'communicate', label: 'I communicate and assess if it can be rebuilt' },
      { id: 'cautious', label: 'I become more cautious but try to work through it' },
      { id: 'withdraw', label: 'I withdraw and protect myself' },
      { id: 'end-it', label: 'It is very hard for me to move past it' },
    ],
  },
  {
    id: 'deep-trust-5',
    category: 'Trust & Emotional Safety',
    question: 'How aware are you of your attachment patterns?',
    options: [
      { id: 'very-aware', label: 'Very aware and actively working on them' },
      { id: 'aware', label: 'Aware and learning' },
      { id: 'somewhat', label: 'Somewhat - still exploring' },
      { id: 'not-much', label: 'Not something I have thought much about' },
    ],
  },

  // Additional Deep Questions (5)
  {
    id: 'deep-additional-1',
    category: 'Self-Reflection',
    question: 'How do you handle your own patterns in relationships?',
    options: [
      { id: 'recognize-work', label: 'I recognize them and actively work on them' },
      { id: 'aware-trying', label: 'I am aware and trying to improve' },
      { id: 'notice-sometimes', label: 'I notice them sometimes' },
      { id: 'unaware', label: 'I am not very aware of my patterns' },
    ],
  },
  {
    id: 'deep-additional-2',
    category: 'Emotional Regulation',
    question: 'How well do you manage stress in relationships?',
    options: [
      { id: 'well', label: 'Well - I have healthy coping mechanisms' },
      { id: 'mostly-well', label: 'Mostly well with occasional struggles' },
      { id: 'struggle', label: 'I struggle with this' },
      { id: 'impacts-heavily', label: 'Stress heavily impacts my relationships' },
    ],
  },
  {
    id: 'deep-additional-3',
    category: 'Accountability',
    question: 'How do you handle taking responsibility in conflicts?',
    options: [
      { id: 'quickly', label: 'I take responsibility quickly and sincerely' },
      { id: 'eventually', label: 'Eventually, after processing' },
      { id: 'defensive', label: 'I can be defensive at first' },
      { id: 'struggle', label: 'I struggle with this' },
    ],
  },
  {
    id: 'deep-additional-4',
    category: 'Growth & Healing',
    question: 'How actively are you working on past relationship wounds?',
    options: [
      { id: 'actively', label: 'Very actively - through therapy or deep work' },
      { id: 'working-on', label: 'I am working on it in my own way' },
      { id: 'aware', label: 'I am aware but not actively addressing them' },
      { id: 'not-much', label: 'Not something I am focused on' },
    ],
  },
  {
    id: 'deep-additional-5',
    category: 'Relationship Capacity',
    question: 'How much emotional capacity do you have for a relationship right now?',
    options: [
      { id: 'full', label: 'Full capacity - I am ready and available' },
      { id: 'good', label: 'Good capacity with healthy boundaries' },
      { id: 'limited', label: 'Limited - but open to the right person' },
      { id: 'low', label: 'Low - I am focusing on myself' },
    ],
  },
];

export function getQuestionsForTier(tier: PassportTier): PassportQuestionData[] {
  if (tier === 'lite') {
    return LITE_QUESTIONS;
  } else if (tier === 'standard') {
    return [...LITE_QUESTIONS, ...STANDARD_ADDITIONAL];
  } else {
    return [...LITE_QUESTIONS, ...STANDARD_ADDITIONAL, ...DEEP_ADDITIONAL];
  }
}

export function getTotalQuestionsForTier(tier: PassportTier): number {
  if (tier === 'lite') return 15;
  if (tier === 'standard') return 25;
  return 45;
}
