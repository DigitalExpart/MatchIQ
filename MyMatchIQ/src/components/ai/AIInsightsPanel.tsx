import { useState } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Eye, CheckCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { AIInsight, CompatibilityAnalysis } from '../../utils/aiService';
import { MatchScan } from '../../App';

interface AIInsightsPanelProps {
  analysis: CompatibilityAnalysis;
  scan: MatchScan;
}

export function AIInsightsPanel({ analysis }: AIInsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'compatibility':
        return <TrendingUp className="w-5 h-5" />;
      case 'inconsistency':
        return <AlertTriangle className="w-5 h-5" />;
      case 'coach':
        return <Lightbulb className="w-5 h-5" />;
      case 'deep-insight':
        return <Eye className="w-5 h-5" />;
      case 'profile-match':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: AIInsight['type'], severity?: string) => {
    if (severity === 'high') return 'red';
    if (severity === 'medium') return 'amber';
    if (type === 'compatibility' || type === 'deep-insight') return 'emerald';
    if (type === 'coach') return 'blue';
    return 'purple';
  };

  if (analysis.insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          <p className="text-xs text-gray-500">Powered by advanced analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {analysis.insights.map((insight, index) => {
          const color = getInsightColor(insight.type, insight.severity);
          const isExpanded = expandedInsight === index;
          
          return (
            <div
              key={index}
              className={`border-2 rounded-2xl p-4 transition-all ${
                insight.severity === 'high'
                  ? 'border-red-200 bg-red-50'
                  : insight.severity === 'medium'
                  ? 'border-amber-200 bg-amber-50'
                  : `border-${color}-200 bg-${color}-50`
              }`}
            >
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setExpandedInsight(isExpanded ? null : index)}
              >
                <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0 text-${color}-600`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                  {insight.confidence && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${color}-500`}
                          style={{ width: `${insight.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {insight.evidence && insight.evidence.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Evidence:</h5>
                      <ul className="space-y-1">
                        {insight.evidence.map((item, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insight.recommendations && insight.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Recommendations:</h5>
                      <ul className="space-y-2">
                        {insight.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className={`text-${color}-500 mt-1`}>✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

