import { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DatingInsightsScreenProps {
  onBack: () => void;
  initialCategory?: InsightCategory;
}

type InsightCategory = 'daily-tips' | 'emotional-alignment' | 'communication' | 'red-flags' | 'compatibility';

interface InsightItem {
  text: string;
  icon?: string;
}

const insightsData = {
  'daily-tips': {
    title: 'Daily Dating Tips',
    icon: Sparkles,
    color: 'from-amber-500 to-yellow-500',
    tips: [
      {
        text: 'Pay attention to how they talk about past relationships. It reveals emotional maturity and readiness for new connections.',
      },
      {
        text: 'Notice their level of curiosity about you. Genuine interest is shown through thoughtful questions and active listening.',
      },
      {
        text: 'Observe how they treat service staff, strangers, and people who can\'t offer them anything. This reveals true character.',
      },
      {
        text: 'Watch for consistency between their online presence and in-person behavior. Authenticity matters.',
      },
      {
        text: 'Take note of how they handle unexpected changes or disappointments. Flexibility and grace under pressure indicate emotional resilience.',
      },
      {
        text: 'Notice whether they respect your boundaries without defensiveness. Boundary respect is a foundation of healthy relationships.',
      },
      {
        text: 'Pay attention to their relationship with technology during dates. Present-moment engagement shows respect and interest.',
      },
    ],
  },
  'emotional-alignment': {
    title: 'Emotional Alignment',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    tips: [
      {
        text: 'Look for consistency between words and actions. This reveals authentic emotional availability.',
      },
      {
        text: 'Notice if they can express vulnerability appropriately. Emotional openness (not oversharing) indicates readiness for deeper connection.',
      },
      {
        text: 'Observe how they respond to your emotions. Empathy and validation are key indicators of emotional intelligence.',
      },
      {
        text: 'Check if their life goals and timeline align with yours. Misalignment in major life directions creates friction over time.',
      },
      {
        text: 'Watch for reciprocity in emotional investment. Balanced give-and-take prevents resentment and burnout.',
      },
      {
        text: 'Notice their comfort level with both independence and togetherness. Healthy relationships require both.',
      },
      {
        text: 'Pay attention to how they handle your successes. Genuine partners celebrate rather than compete.',
      },
    ],
  },
  'communication': {
    title: 'Communication Style',
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-500',
    tips: [
      {
        text: 'Notice how they handle disagreements. Healthy communication is key to long-term compatibility.',
      },
      {
        text: 'Observe whether they can apologize sincerely and take accountability. This shows maturity and integrity.',
      },
      {
        text: 'Check if they listen to understand rather than just respond. Active listening builds genuine connection.',
      },
      {
        text: 'Notice their communication frequency and style. Compatibility in communication preferences reduces frustration.',
      },
      {
        text: 'Watch how they handle difficult conversations. Avoidance or aggression are both problematic patterns.',
      },
      {
        text: 'Pay attention to whether they ask clarifying questions or make assumptions. Curiosity prevents misunderstandings.',
      },
      {
        text: 'Observe if they can discuss needs and expectations directly. Clear communication prevents unspoken resentment.',
      },
    ],
  },
  'red-flags': {
    title: 'Red Flag Awareness',
    icon: AlertTriangle,
    color: 'from-purple-500 to-violet-500',
    tips: [
      {
        text: 'Trust your intuition. If something feels off, it probably is. Your safety comes first.',
      },
      {
        text: 'Watch for love-bombing: excessive attention, gifts, or declarations too early. This can indicate manipulation rather than genuine interest.',
      },
      {
        text: 'Notice if they respect your "no" without pressure or guilt. Boundary violations early signal deeper issues.',
      },
      {
        text: 'Be cautious if they badmouth all their exes or take no responsibility for past relationship failures.',
      },
      {
        text: 'Watch for controlling behavior disguised as care: monitoring your location, demanding access to devices, or isolating you from friends.',
      },
      {
        text: 'Notice inconsistent stories or frequent lies, even about small things. Dishonesty rarely stays small.',
      },
      {
        text: 'Be alert to hot-and-cold behavior: intense connection followed by sudden withdrawal. This creates unhealthy attachment patterns.',
      },
      {
        text: 'Trust your gut if they dismiss your feelings, gaslight you, or make you question your reality.',
      },
    ],
  },
  'compatibility': {
    title: 'Compatibility Signals',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    tips: [
      {
        text: 'Notice shared values around family, career, finances, and lifestyle. Core value alignment matters more than shared hobbies.',
      },
      {
        text: 'Observe how you feel after spending time together: energized or drained. Compatibility includes energetic compatibility.',
      },
      {
        text: 'Check if you can be your authentic self without performance or pretense. The right match feels comfortable.',
      },
      {
        text: 'Notice whether humor styles align. Laughter and playfulness strengthen connection during challenges.',
      },
      {
        text: 'Watch for complementary strengths and weaknesses. Partners should elevate each other, not duplicate or compete.',
      },
      {
        text: 'Pay attention to conflict resolution compatibility. Similar approaches to handling tension prevent escalation.',
      },
      {
        text: 'Observe attachment style compatibility. Anxious-avoidant pairings often create painful cycles without awareness and work.',
      },
      {
        text: 'Notice whether you share a vision for the relationship\'s future. Alignment on pace and direction prevents heartbreak.',
      },
    ],
  },
};

export function DatingInsightsScreen({ onBack, initialCategory = 'daily-tips' }: DatingInsightsScreenProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<InsightCategory>(initialCategory);

  const currentInsight = insightsData[activeCategory];
  const IconComponent = currentInsight.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-br ${currentInsight.color} px-6 pt-12 pb-8 relative overflow-hidden transition-all duration-500`}>
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
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">{currentInsight.title}</h1>
            <p className="text-white/80 text-sm">Essential insights for meaningful connections</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Category Tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-6 shadow-sm">
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => setActiveCategory('daily-tips')}
              className={`py-3 px-2 rounded-xl text-xs transition-all ${
                activeCategory === 'daily-tips'
                  ? 'bg-white text-amber-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-4 h-4 mx-auto mb-1" />
              Daily
            </button>
            <button
              onClick={() => setActiveCategory('emotional-alignment')}
              className={`py-3 px-2 rounded-xl text-xs transition-all ${
                activeCategory === 'emotional-alignment'
                  ? 'bg-white text-rose-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="w-4 h-4 mx-auto mb-1" />
              Emotion
            </button>
            <button
              onClick={() => setActiveCategory('communication')}
              className={`py-3 px-2 rounded-xl text-xs transition-all ${
                activeCategory === 'communication'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 mx-auto mb-1" />
              Talk
            </button>
            <button
              onClick={() => setActiveCategory('red-flags')}
              className={`py-3 px-2 rounded-xl text-xs transition-all ${
                activeCategory === 'red-flags'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
              Flags
            </button>
            <button
              onClick={() => setActiveCategory('compatibility')}
              className={`py-3 px-2 rounded-xl text-xs transition-all ${
                activeCategory === 'compatibility'
                  ? 'bg-white text-emerald-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 mx-auto mb-1" />
              Match
            </button>
          </div>
        </div>

        {/* Tips Content */}
        <div className="space-y-3">
          {currentInsight.tips.map((tip, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${currentInsight.color} flex items-center justify-center`}>
                  <span className="text-white text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed">{tip.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-900 mb-1">Use These Insights</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                These insights are designed to help you evaluate potential matches with clarity and intention. 
                Use them during and after interactions to build awareness of compatibility signals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}