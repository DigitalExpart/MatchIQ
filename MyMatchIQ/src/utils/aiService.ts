/**
 * AI Service for Compatibility Analysis, Coaching, and Insights
 * Integrates with backend AI engine
 */

import { MatchScan, ScanAnswer, UserProfile } from '../App';
import { ReflectionNotes } from '../components/screens/ReflectionNotesScreen';
import { apiClient } from './apiClient';

export interface AIInsight {
  type: 'compatibility' | 'inconsistency' | 'coach' | 'deep-insight' | 'profile-match';
  title: string;
  message: string;
  severity?: 'low' | 'medium' | 'high';
  confidence: number;
  evidence?: string[];
  recommendations?: string[];
}

export interface InconsistencyDetection {
  detected: boolean;
  inconsistencies: Array<{
    type: string;
    description: string;
    questions: string[];
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface CompatibilityAnalysis {
  overallScore: number;
  band: MatchScan['category'];
  bandLabel: string;
  bandDescription: string;
  categoryScores?: Record<string, number>;
  strengths: string[];
  awarenessAreas: string[];
  redFlags: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    signal: string;
    evidence: string[];
  }>;
  recommendedAction: 'proceed' | 'proceed-with-awareness' | 'pause-and-reflect';
  actionLabel: string;
  actionGuidance: string;
  insights: AIInsight[];
}

export interface AICoachResponse {
  message: string;
  category: 'safety' | 'communication' | 'emotional' | 'values' | 'general';
  actionable: string[];
  relatedQuestions?: string[];
}

// Knowledge base for RAG (in production, this would be a vector database)
class KnowledgeBase {
  private interactions: Array<{
    scan: MatchScan;
    userProfile: UserProfile;
    outcome?: 'positive' | 'negative' | 'neutral';
    feedback?: string;
    timestamp: number;
  }> = [];

  private patterns: Array<{
    pattern: string;
    description: string;
    accuracy: number;
    usageCount: number;
  }> = [];

  addInteraction(scan: MatchScan, userProfile: UserProfile, outcome?: 'positive' | 'negative' | 'neutral', feedback?: string) {
    this.interactions.push({
      scan,
      userProfile,
      outcome,
      feedback,
      timestamp: Date.now(),
    });
  }

  getRelevantPatterns(query: string, limit: number = 5): Array<{ pattern: string; description: string; accuracy: number }> {
    // Simple keyword matching (in production, use semantic search with embeddings)
    const queryLower = query.toLowerCase();
    return this.patterns
      .filter(p => 
        p.pattern.toLowerCase().includes(queryLower) || 
        p.description.toLowerCase().includes(queryLower)
      )
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, limit);
  }

  updatePattern(pattern: string, description: string, wasAccurate: boolean) {
    const existing = this.patterns.find(p => p.pattern === pattern);
    if (existing) {
      existing.usageCount++;
      // Update accuracy using moving average
      existing.accuracy = (existing.accuracy * (existing.usageCount - 1) + (wasAccurate ? 1 : 0)) / existing.usageCount;
    } else {
      this.patterns.push({
        pattern,
        description,
        accuracy: wasAccurate ? 1 : 0,
        usageCount: 1,
      });
    }
  }

  getSimilarScans(scan: MatchScan, limit: number = 3): MatchScan[] {
    // Find similar scans based on score, category, and answer patterns
    return this.interactions
      .map(i => i.scan)
      .filter(s => 
        Math.abs(s.score - scan.score) < 15 &&
        s.category === scan.category
      )
      .slice(0, limit);
  }
}

const knowledgeBase = new KnowledgeBase();

/**
 * Calculate AI-powered compatibility score
 * Calls backend API for processing
 */
export async function calculateAIScore(
  answers: ScanAnswer[],
  userProfile: UserProfile,
  reflectionNotes?: ReflectionNotes
): Promise<{ score: number; category: MatchScan['category'] }> {
  try {
    // Call backend API for assessment processing
    const response = await apiClient.post('/assessments/', {
      scan_type: 'single',
      answers: answers.map(a => ({
        question_id: a.questionId || a.question?.split(' ')[0] || '',
        category: a.category || 'general',
        rating: a.rating,
        question_text: a.question || ''
      })),
      reflection_notes: reflectionNotes ? {
        good_moments: reflectionNotes.goodMoments,
        worst_moments: reflectionNotes.worstMoments,
        sad_moments: reflectionNotes.sadMoments,
        vulnerable_moments: reflectionNotes.vulnerableMoments,
        additional_notes: reflectionNotes.additionalNotes
      } : undefined,
      user_id: userProfile.email || 'user' // Would come from auth in production
    });

    return {
      score: response.overall_score,
      category: response.category as MatchScan['category']
    };
  } catch (error) {
    console.error('Error calling backend API, falling back to local calculation:', error);
    // Fallback to local calculation if API fails
    return calculateAIScoreLocal(answers, userProfile, reflectionNotes);
  }
}

/**
 * Local fallback calculation (used if API fails)
 */
function calculateAIScoreLocal(
  answers: ScanAnswer[],
  userProfile: UserProfile,
  reflectionNotes?: ReflectionNotes
): { score: number; category: MatchScan['category'] } {
  // Base score from ratings
  const ratingScores = {
    'strong-match': 100,
    'good': 75,
    'neutral': 50,
    'yellow-flag': 25,
    'red-flag': 0,
  };

  // Weight answers based on user profile and dating goal
  let weightedScore = 0;
  let totalWeight = 0;

  answers.forEach(answer => {
    let weight = 1.0; // Default weight
    
    // Weight based on user's dating goal
    if (userProfile.datingGoal === 'marriage' || userProfile.datingGoal === 'long-term') {
      // For serious relationships, weight values, future goals, and emotional maturity higher
      if (answer.question.toLowerCase().includes('value') || 
          answer.question.toLowerCase().includes('future') ||
          answer.question.toLowerCase().includes('goal') ||
          answer.question.toLowerCase().includes('emotion') ||
          answer.question.toLowerCase().includes('commitment')) {
        weight = 1.5; // 50% more important
      }
    } else if (userProfile.datingGoal === 'casual') {
      // For casual dating, weight communication and lifestyle fit higher
      if (answer.question.toLowerCase().includes('communicat') ||
          answer.question.toLowerCase().includes('lifestyle') ||
          answer.question.toLowerCase().includes('interest')) {
        weight = 1.3;
      }
    }

    // Weight based on user age - older users may value different things
    if (userProfile.age >= 30) {
      // Older users: weight maturity, stability, and future planning higher
      if (answer.question.toLowerCase().includes('mature') ||
          answer.question.toLowerCase().includes('stability') ||
          answer.question.toLowerCase().includes('future') ||
          answer.question.toLowerCase().includes('plan')) {
        weight *= 1.2;
      }
    } else if (userProfile.age < 25) {
      // Younger users: weight communication, fun, and compatibility higher
      if (answer.question.toLowerCase().includes('communicat') ||
          answer.question.toLowerCase().includes('fun') ||
          answer.question.toLowerCase().includes('interest')) {
        weight *= 1.1;
      }
    }

    // Use self-assessment data if available to weight questions
    if (userProfile.selfAssessmentAnswers && userProfile.selfAssessmentAnswers.length > 0) {
      // If user has completed self-assessment, weight questions that align with their blueprint
      const userValues = userProfile.selfAssessmentAnswers
        .filter(a => a.importance === 'high' || a.isDealBreaker)
        .map(a => a.category?.toLowerCase() || '');
      
      userValues.forEach(value => {
        if (answer.question.toLowerCase().includes(value) || 
            answer.category?.toLowerCase().includes(value)) {
          weight *= 1.3; // Higher weight for questions matching user's important values
        }
      });
    }

    const answerScore = ratingScores[answer.rating] || 50;
    weightedScore += answerScore * weight;
    totalWeight += weight;
  });

  let baseScore = Math.round(weightedScore / totalWeight);

  // AI adjustments based on patterns, profile, and insights
  let aiAdjustment = 0;
  let adjustmentReason = '';

  // Profile-based adjustments
  // Check if responses align with user's dating goal
  const goalAnswers = answers.filter(a =>
    a.question.toLowerCase().includes('goal') ||
    a.question.toLowerCase().includes('future') ||
    a.question.toLowerCase().includes('relationship') ||
    a.question.toLowerCase().includes('commitment')
  );

  if (goalAnswers.length > 0) {
    const goalRatings = goalAnswers.map(a => a.rating);
    const hasStrongMatch = goalRatings.includes('strong-match');
    const hasRedFlag = goalRatings.includes('red-flag');

    if (userProfile.datingGoal === 'marriage' && hasRedFlag) {
      aiAdjustment -= 12;
      adjustmentReason += 'Goal misalignment detected (-12). ';
    } else if (userProfile.datingGoal === 'marriage' && hasStrongMatch) {
      aiAdjustment += 5;
      adjustmentReason += 'Strong goal alignment (+5). ';
    } else if (userProfile.datingGoal === 'casual' && hasStrongMatch && goalRatings.every(r => r === 'strong-match')) {
      // Casual daters might be too serious - slight reduction
      aiAdjustment -= 3;
      adjustmentReason += 'May be too serious for casual dating (-3). ';
    }
  }

  // Age-based adjustments
  if (userProfile.age >= 35) {
    // Older users: penalize immaturity more, reward maturity more
    const maturityAnswers = answers.filter(a =>
      a.question.toLowerCase().includes('mature') ||
      a.question.toLowerCase().includes('immature') ||
      a.question.toLowerCase().includes('responsibility')
    );
    maturityAnswers.forEach(a => {
      if (a.rating === 'red-flag' || a.rating === 'yellow-flag') {
        aiAdjustment -= 2;
      } else if (a.rating === 'strong-match') {
        aiAdjustment += 2;
      }
    });
  }

  // Bio-based insights (if user has a bio, use it to understand preferences)
  if (userProfile.bio) {
    const bioLower = userProfile.bio.toLowerCase();
    const valuesAnswers = answers.filter(a =>
      a.question.toLowerCase().includes('value') ||
      a.question.toLowerCase().includes('priorit')
    );

    // Check if bio mentions specific values that should align
    if (bioLower.includes('family') || bioLower.includes('career') || bioLower.includes('travel')) {
      valuesAnswers.forEach(a => {
        if (a.rating === 'strong-match') {
          aiAdjustment += 1;
        } else if (a.rating === 'red-flag') {
          aiAdjustment -= 3;
        }
      });
    }
  }

  // Check for inconsistencies (reduce score)
  const inconsistencies = detectInconsistencies(answers);
  if (inconsistencies.detected) {
    const highSeverity = inconsistencies.inconsistencies.filter(i => i.severity === 'high').length;
    const mediumSeverity = inconsistencies.inconsistencies.filter(i => i.severity === 'medium').length;
    aiAdjustment -= (highSeverity * 10 + mediumSeverity * 5);
    adjustmentReason += `Inconsistencies detected (-${Math.abs(highSeverity * 10 + mediumSeverity * 5)} points). `;
  }

  // Reflection notes analysis
  if (reflectionNotes) {
    const hasGoodMoments = reflectionNotes.goodMoments && reflectionNotes.goodMoments.length > 30;
    const hasWorstMoments = reflectionNotes.worstMoments && reflectionNotes.worstMoments.length > 30;
    const hasVulnerableMoments = reflectionNotes.vulnerableMoments && reflectionNotes.vulnerableMoments.length > 30;

    // Positive adjustments
    if (hasGoodMoments && !hasWorstMoments) {
      aiAdjustment += 5;
      adjustmentReason += 'Strong positive reflections (+5). ';
    }
    if (hasVulnerableMoments && baseScore >= 70) {
      aiAdjustment += 3;
      adjustmentReason += 'Emotional depth potential (+3). ';
    }

    // Negative adjustments
    if (hasWorstMoments && !hasGoodMoments) {
      aiAdjustment -= 8;
      adjustmentReason += 'Concerning reflections (-8). ';
    }
    if (hasWorstMoments && hasGoodMoments) {
      // Balanced but concerning - slight reduction
      aiAdjustment -= 3;
      adjustmentReason += 'Mixed reflections (-3). ';
    }
  }

  // Use RAG to find similar patterns from users with similar profiles
  const tempScan: MatchScan = {
    id: 'temp',
    name: 'temp',
    date: new Date().toLocaleDateString(),
    score: baseScore,
    category: 'mixed-signals',
    interactionType: '',
    deck: '',
    answers,
  };
  
  // Find similar scans from users with similar profiles (age range, dating goal)
  const similarScans = knowledgeBase.getSimilarScans(tempScan);
  const profileSimilarScans = similarScans.filter(s => {
    // In production, this would check user profiles from the knowledge base
    // For now, we'll use all similar scans but weight them
    return true;
  });

  if (profileSimilarScans.length > 0) {
    // Average score of similar scans, weighted by profile similarity
    const avgSimilarScore = profileSimilarScans.reduce((sum, s) => sum + s.score, 0) / profileSimilarScans.length;
    const difference = avgSimilarScore - baseScore;
    // Adjust towards similar patterns (weighted more for profile-matched users)
    const profileWeight = 0.3; // Higher weight when considering user profile
    aiAdjustment += Math.round(difference * profileWeight);
    if (Math.abs(difference) > 10) {
      adjustmentReason += `Profile-matched pattern adjustment (${difference > 0 ? '+' : ''}${Math.round(difference * profileWeight)}). `;
    }
  }

  // Calculate final AI score
  const finalScore = Math.max(0, Math.min(100, baseScore + aiAdjustment));

  // Determine category based on AI-adjusted score
  let category: MatchScan['category'];
  if (finalScore >= 85) category = 'high-potential';
  else if (finalScore >= 65) category = 'worth-exploring';
  else if (finalScore >= 45) category = 'mixed-signals';
  else if (finalScore >= 25) category = 'caution';
  else category = 'high-risk';

  return { score: finalScore, category };
}

/**
 * Analyze compatibility with deep insights
 */
export async function analyzeCompatibility(
  scan: MatchScan,
  userProfile: UserProfile,
  reflectionNotes?: ReflectionNotes
): Promise<CompatibilityAnalysis> {
  const insights: AIInsight[] = [];
  
  // Calculate category scores
  const categoryScores: Record<string, number> = {};
  const categoryAnswers: Record<string, ScanAnswer[]> = {};
  
  scan.answers.forEach(answer => {
    const category = answer.category || 'general';
    if (!categoryAnswers[category]) {
      categoryAnswers[category] = [];
    }
    categoryAnswers[category].push(answer);
  });

  Object.keys(categoryAnswers).forEach(category => {
    const answers = categoryAnswers[category];
    const ratingScores = {
      'strong-match': 100,
      'good': 75,
      'neutral': 50,
      'yellow-flag': 25,
      'red-flag': 0,
    };
    const total = answers.reduce((sum, a) => sum + (ratingScores[a.rating] || 50), 0);
    categoryScores[category] = Math.round(total / answers.length);
  });

  // Detect inconsistencies
  const inconsistencies = detectInconsistencies(scan.answers);
  if (inconsistencies.detected) {
    inconsistencies.inconsistencies.forEach(inc => {
      insights.push({
        type: 'inconsistency',
        title: 'Response Inconsistency Detected',
        message: inc.description,
        severity: inc.severity,
        confidence: 0.75,
        evidence: inc.questions,
        recommendations: [
          'Consider revisiting these responses',
          'Look for patterns in your answers',
          'Trust your initial instincts'
        ],
      });
    });
  }

  // Profile comparison (lie detection)
  const profileMatch = compareWithProfile(scan, userProfile);
  if (profileMatch.mismatches.length > 0) {
    insights.push({
      type: 'profile-match',
      title: 'Profile Alignment Check',
      message: `Found ${profileMatch.mismatches.length} potential misalignments between your responses and profile`,
      severity: profileMatch.mismatches.some(m => m.severity === 'high') ? 'high' : 'medium',
      confidence: 0.8,
      evidence: profileMatch.mismatches.map(m => m.description),
      recommendations: profileMatch.recommendations,
    });
  }

  // Deep insights using RAG
  const deepInsights = await generateDeepInsights(scan, reflectionNotes);
  insights.push(...deepInsights);

  // Compatibility insights
  const strengths: string[] = [];
  const concerns: string[] = [];
  
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score >= 75) {
      strengths.push(`${category} shows strong compatibility (${score}%)`);
    } else if (score < 50) {
      concerns.push(`${category} shows potential concerns (${score}%)`);
    }
  });

  // Generate recommendations using user profile
  const recommendations = generateRecommendations(scan, categoryScores, reflectionNotes, userProfile);

  return {
    overallScore: scan.score,
    categoryScores,
    strengths,
    concerns,
    recommendations,
    insights,
  };
}

/**
 * Detect inconsistencies in user responses
 */
export function detectInconsistencies(answers: ScanAnswer[]): InconsistencyDetection {
  const inconsistencies: InconsistencyDetection['inconsistencies'] = [];

  // Check for contradictory ratings on similar topics
  const emotionalAnswers = answers.filter(a => 
    a.question.toLowerCase().includes('emotion') || 
    a.question.toLowerCase().includes('feel') ||
    a.question.toLowerCase().includes('stress')
  );
  
  if (emotionalAnswers.length >= 2) {
    const ratings = emotionalAnswers.map(a => a.rating);
    const hasStrongMatch = ratings.includes('strong-match');
    const hasRedFlag = ratings.includes('red-flag');
    
    if (hasStrongMatch && hasRedFlag) {
      inconsistencies.push({
        type: 'emotional-contradiction',
        description: 'Mixed signals detected in emotional responses - some very positive, some concerning',
        questions: emotionalAnswers.map(a => a.question),
        severity: 'medium',
      });
    }
  }

  // Check communication consistency
  const communicationAnswers = answers.filter(a =>
    a.question.toLowerCase().includes('communicat') ||
    a.question.toLowerCase().includes('listen') ||
    a.question.toLowerCase().includes('express')
  );

  if (communicationAnswers.length >= 2) {
    const ratings = communicationAnswers.map(a => a.rating);
    const uniqueRatings = new Set(ratings);
    if (uniqueRatings.size === communicationAnswers.length && ratings.includes('red-flag')) {
      inconsistencies.push({
        type: 'communication-pattern',
        description: 'Inconsistent communication patterns detected',
        questions: communicationAnswers.map(a => a.question),
        severity: 'low',
      });
    }
  }

  // Check for pattern: all positive but reflection notes mention concerns
  // This would be checked when reflection notes are available

  return {
    detected: inconsistencies.length > 0,
    inconsistencies,
  };
}

/**
 * Compare responses with user profile to detect potential lies and misalignments
 */
export function compareWithProfile(
  scan: MatchScan,
  userProfile: UserProfile
): {
  matches: number;
  mismatches: Array<{ description: string; severity: 'low' | 'medium' | 'high' }>;
  recommendations: string[];
} {
  const mismatches: Array<{ description: string; severity: 'low' | 'medium' | 'high' }> = [];
  const recommendations: string[] = [];

  // Check dating goal alignment
  const goalAnswers = scan.answers.filter(a =>
    a.question.toLowerCase().includes('goal') ||
    a.question.toLowerCase().includes('future') ||
    a.question.toLowerCase().includes('relationship') ||
    a.question.toLowerCase().includes('commitment')
  );

  if (goalAnswers.length > 0 && userProfile.datingGoal) {
    const hasMismatch = goalAnswers.some(a => {
      const answerLower = a.question.toLowerCase();
      if (userProfile.datingGoal === 'marriage' && a.rating === 'red-flag') {
        return answerLower.includes('commitment') || answerLower.includes('marriage') || answerLower.includes('long-term');
      }
      if (userProfile.datingGoal === 'casual' && a.rating === 'strong-match') {
        return answerLower.includes('marriage') || answerLower.includes('commitment');
      }
      return false;
    });

    if (hasMismatch) {
      mismatches.push({
        description: `Your responses about relationship goals may not align with your profile (${userProfile.datingGoal})`,
        severity: 'high',
      });
      recommendations.push(`Review your relationship goals - your profile indicates you're looking for ${userProfile.datingGoal} relationships`);
    }
  }

  // Check values alignment with user's self-assessment if available
  const valuesAnswers = scan.answers.filter(a =>
    a.question.toLowerCase().includes('value') ||
    a.question.toLowerCase().includes('priorit')
  );

  if (valuesAnswers.length > 0) {
    const lowValueRatings = valuesAnswers.filter(a => 
      a.rating === 'yellow-flag' || a.rating === 'red-flag'
    ).length;

    if (lowValueRatings > valuesAnswers.length * 0.5) {
      mismatches.push({
        description: 'Significant value misalignment detected in responses',
        severity: 'medium',
      });
      recommendations.push('Consider if your values truly align with what you indicated in your profile');
    }

    // Check against self-assessment blueprint if available
    if (userProfile.selfAssessmentAnswers && userProfile.selfAssessmentAnswers.length > 0) {
      const userImportantValues = userProfile.selfAssessmentAnswers
        .filter(a => a.importance === 'high' || a.isDealBreaker)
        .map(a => a.category?.toLowerCase() || '');

      valuesAnswers.forEach(answer => {
        const answerCategory = answer.category?.toLowerCase() || '';
        const matchesImportantValue = userImportantValues.some(v => answerCategory.includes(v));
        
        if (matchesImportantValue && (answer.rating === 'yellow-flag' || answer.rating === 'red-flag')) {
          mismatches.push({
            description: `Response conflicts with your important value: ${answer.category}`,
            severity: 'high',
          });
        }
      });
    }
  }

  // Check age-appropriate expectations
  if (userProfile.age) {
    const maturityAnswers = scan.answers.filter(a =>
      a.question.toLowerCase().includes('mature') ||
      a.question.toLowerCase().includes('responsibility') ||
      a.question.toLowerCase().includes('immature')
    );

    if (userProfile.age >= 30) {
      // Older users should expect more maturity
      const immaturityFlags = maturityAnswers.filter(a => 
        a.rating === 'red-flag' || a.rating === 'yellow-flag'
      ).length;

      if (immaturityFlags > maturityAnswers.length * 0.4) {
        mismatches.push({
          description: `At ${userProfile.age}, you may want to consider if maturity levels align with your expectations`,
          severity: 'medium',
        });
        recommendations.push('Consider whether maturity levels match your life stage');
      }
    }
  }

  // Check bio alignment if available
  if (userProfile.bio) {
    const bioLower = userProfile.bio.toLowerCase();
    const bioKeywords: string[] = [];

    if (bioLower.includes('family')) bioKeywords.push('family');
    if (bioLower.includes('career') || bioLower.includes('work')) bioKeywords.push('career');
    if (bioLower.includes('travel') || bioLower.includes('adventure')) bioKeywords.push('travel');
    if (bioLower.includes('fitness') || bioLower.includes('health')) bioKeywords.push('fitness');
    if (bioLower.includes('creative') || bioLower.includes('art')) bioKeywords.push('creative');

    bioKeywords.forEach(keyword => {
      const relatedAnswers = scan.answers.filter(a =>
        a.question.toLowerCase().includes(keyword) ||
        a.category?.toLowerCase().includes(keyword)
      );

      const negativeRatings = relatedAnswers.filter(a => 
        a.rating === 'yellow-flag' || a.rating === 'red-flag'
      ).length;

      if (negativeRatings > relatedAnswers.length * 0.5 && relatedAnswers.length > 0) {
        mismatches.push({
          description: `Your bio mentions ${keyword}, but responses show potential misalignment`,
          severity: 'medium',
        });
      }
    });
  }

  return {
    matches: scan.answers.length - mismatches.length,
    mismatches,
    recommendations,
  };
}

/**
 * Generate deep insights using RAG
 */
async function generateDeepInsights(
  scan: MatchScan,
  reflectionNotes?: ReflectionNotes
): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  // Use RAG to find similar patterns
  const similarScans = knowledgeBase.getSimilarScans(scan);
  const relevantPatterns = knowledgeBase.getRelevantPatterns(
    `${scan.category} ${scan.score} compatibility`
  );

  // Analyze reflection notes for deeper insights
  if (reflectionNotes) {
    const hasGoodMoments = reflectionNotes.goodMoments && reflectionNotes.goodMoments.length > 20;
    const hasWorstMoments = reflectionNotes.worstMoments && reflectionNotes.worstMoments.length > 20;
    const hasVulnerableMoments = reflectionNotes.vulnerableMoments && reflectionNotes.vulnerableMoments.length > 20;

    if (hasGoodMoments && hasWorstMoments) {
      insights.push({
        type: 'deep-insight',
        title: 'Balanced Relationship Dynamics',
        message: 'Your reflections show both positive and challenging moments, indicating a realistic and balanced perspective on this relationship.',
        confidence: 0.85,
        recommendations: [
          'Focus on communication during challenging moments',
          'Build on the positive experiences you\'ve shared',
          'Address concerns before they become patterns'
        ],
      });
    }

    if (hasVulnerableMoments && scan.score >= 75) {
      insights.push({
        type: 'deep-insight',
        title: 'Emotional Depth Potential',
        message: 'The presence of vulnerable moments combined with high compatibility scores suggests strong potential for emotional intimacy.',
        confidence: 0.8,
        recommendations: [
          'Continue fostering safe spaces for vulnerability',
          'Build trust gradually',
          'Maintain open communication'
        ],
      });
    }
  }

  // Pattern-based insights from RAG
  if (relevantPatterns.length > 0) {
    const topPattern = relevantPatterns[0];
    if (topPattern.accuracy > 0.7) {
      insights.push({
        type: 'deep-insight',
        title: 'Pattern Recognition',
        message: `Based on similar assessments, ${topPattern.description}`,
        confidence: topPattern.accuracy,
        recommendations: [
          'Consider this pattern in your decision-making',
          'Look for these signs in future interactions'
        ],
      });
    }
  }

  return insights;
}

/**
 * Generate personalized recommendations based on user profile and assessment
 */
function generateRecommendations(
  scan: MatchScan,
  categoryScores: Record<string, number>,
  reflectionNotes?: ReflectionNotes,
  userProfile?: UserProfile
): string[] {
  const recommendations: string[] = [];

  // Score-based recommendations
  if (scan.score >= 85) {
    if (userProfile?.datingGoal === 'marriage' || userProfile?.datingGoal === 'long-term') {
      recommendations.push('High compatibility detected - this aligns well with your goal of a serious relationship');
      recommendations.push('Consider taking next steps to deepen the connection');
    } else {
      recommendations.push('High compatibility detected - consider deepening the connection');
    }
    recommendations.push('Continue building on your strong foundation');
  } else if (scan.score >= 65) {
    if (userProfile?.datingGoal === 'marriage') {
      recommendations.push('Good potential, but ensure long-term goals align before committing');
    } else {
      recommendations.push('Good potential - focus on areas of concern');
    }
    recommendations.push('Give it time to develop naturally');
  } else if (scan.score < 50) {
    if (userProfile?.datingGoal === 'marriage' || userProfile?.datingGoal === 'long-term') {
      recommendations.push('Significant concerns detected - this may not align with your relationship goals');
    } else {
      recommendations.push('Significant concerns detected - proceed with caution');
    }
    recommendations.push('Consider having open conversations about key issues');
  }

  // Profile-based recommendations
  if (userProfile) {
    if (userProfile.age >= 30 && scan.score < 60) {
      recommendations.push(`At ${userProfile.age}, consider whether this connection meets your maturity and life stage expectations`);
    }

    if (userProfile.datingGoal === 'marriage' && categoryScores['Values Match'] < 70) {
      recommendations.push('For marriage goals, values alignment is crucial - address this area');
    }

    if (userProfile.selfAssessmentComplete && scan.score >= 70) {
      recommendations.push('Your self-assessment shows you know what you want - trust your blueprint insights');
    }
  }

  // Category-specific recommendations
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score < 50) {
      recommendations.push(`Focus on improving ${category} - this area needs attention`);
    }
  });

  // Reflection-based recommendations
  if (reflectionNotes?.worstMoments) {
    recommendations.push('Address the challenging moments you noted through open dialogue');
  }

  if (reflectionNotes?.vulnerableMoments && scan.score >= 70) {
    recommendations.push('Build on the vulnerable moments - they show potential for deep connection');
  }

  return recommendations;
}

/**
 * Get AI Coach response based on context
 */
export async function getAICoach(
  scan: MatchScan,
  userProfile: UserProfile,
  category: 'safety' | 'communication' | 'emotional' | 'values' | 'general',
  specificQuestion?: string
): Promise<AICoachResponse> {
  try {
    // First, ensure we have a scan result ID
    // For now, we'll need to create/get the scan result
    // In production, this would be stored from the assessment creation
    
    // Call backend coach API
    const response = await apiClient.post('/coach/', {
      mode: specificQuestion ? 'LEARN' : 'EXPLAIN',
      scan_id: scan.id,
      category: category,
      specific_question: specificQuestion,
      user_id: userProfile.email || 'user'
    });
    
    // Convert backend response to AICoachResponse format
    return {
      message: response.message,
      category: category,
      actionable: [], // Backend doesn't return actionable items in coach response
      relatedQuestions: []
    };
  } catch (error) {
    console.error('Error calling backend coach API, falling back to local:', error);
    // Fallback to local implementation
    return getAICoachLocal(scan, userProfile, category, specificQuestion);
  }
}

function getAICoachLocal(
  scan: MatchScan,
  userProfile: UserProfile,
  category: 'safety' | 'communication' | 'emotional' | 'values' | 'general',
  specificQuestion?: string
): Promise<AICoachResponse> {
  const categoryAnswers = scan.answers.filter(a => {
    if (category === 'safety') {
      return a.question.toLowerCase().includes('safe') || 
             a.question.toLowerCase().includes('red flag') ||
             a.rating === 'red-flag';
    }
    if (category === 'communication') {
      return a.question.toLowerCase().includes('communicat') ||
             a.question.toLowerCase().includes('listen');
    }
    if (category === 'emotional') {
      return a.question.toLowerCase().includes('emotion') ||
             a.question.toLowerCase().includes('feel');
    }
    if (category === 'values') {
      return a.question.toLowerCase().includes('value') ||
             a.question.toLowerCase().includes('priorit');
    }
    return true;
  });

  // Use RAG to find relevant coaching patterns
  const relevantPatterns = knowledgeBase.getRelevantPatterns(
    `${category} coaching ${scan.score}`
  );

  let message = '';
  const actionable: string[] = [];

  // If this is the initial load (no specific question), add welcome message
  if (!specificQuestion) {
    message = `Hi! I'm Amora, your AI dating coach. Welcome! `;
  }

  if (category === 'safety' && categoryAnswers.some(a => a.rating === 'red-flag')) {
    message += 'Safety concerns detected. Trust your instincts - if something feels off, it likely is. Red flags are called red flags for a reason.';
    actionable.push('Document concerning behaviors');
    actionable.push('Set clear boundaries');
    actionable.push('Consider ending the connection if safety is compromised');
  } else if (category === 'communication' && categoryAnswers.some(a => a.rating === 'yellow-flag')) {
    message += 'Communication patterns show some concerns. Healthy relationships require open, honest dialogue where both parties feel heard.';
    actionable.push('Practice active listening');
    actionable.push('Express your needs clearly');
    actionable.push('Address communication issues early');
  } else if (category === 'emotional' && scan.score >= 75) {
    message += 'Strong emotional compatibility detected. This suggests potential for deep connection and mutual understanding.';
    actionable.push('Continue fostering emotional intimacy');
    actionable.push('Maintain open communication about feelings');
    actionable.push('Build trust gradually');
  } else {
    if (!specificQuestion) {
      message += `Based on your assessment, here's what to focus on in the ${category} area. I'm here to help guide you through any questions or concerns you might have.`;
    } else {
      message = `Based on your assessment, here's what to focus on in the ${category} area.`;
    }
    actionable.push('Continue observing patterns');
    actionable.push('Trust your instincts');
    actionable.push('Have open conversations about concerns');
  }

  // Add RAG-based insights
  if (relevantPatterns.length > 0 && relevantPatterns[0].accuracy > 0.7) {
    message += ` Research shows that ${relevantPatterns[0].description}`;
  }

  return {
    message,
    category,
    actionable,
    relatedQuestions: categoryAnswers.map(a => a.question).slice(0, 3),
  };
}

/**
 * Learn from user feedback to improve accuracy
 */
export function learnFromFeedback(
  scan: MatchScan,
  userProfile: UserProfile,
  wasAccurate: boolean,
  feedback?: string
) {
  // Store interaction for RAG
  knowledgeBase.addInteraction(
    scan,
    userProfile,
    wasAccurate ? 'positive' : 'negative',
    feedback
  );

  // Update patterns based on accuracy
  const pattern = `${scan.category}-${scan.score}-${scan.answers.map(a => a.rating).join('-')}`;
  knowledgeBase.updatePattern(
    pattern,
    `Pattern: ${scan.category} with score ${scan.score}`,
    wasAccurate
  );
}

/**
 * Get AI summary for results screen
 */
export async function getAISummary(
  analysis: CompatibilityAnalysis,
  scan: MatchScan,
  reflectionNotes?: ReflectionNotes
): Promise<string> {
  let summary = `Based on your comprehensive assessment, ${scan.name} shows `;
  
  if (scan.score >= 85) {
    summary += 'strong compatibility potential. ';
  } else if (scan.score >= 65) {
    summary += 'good compatibility with some areas to explore. ';
  } else if (scan.score >= 50) {
    summary += 'mixed signals that require careful consideration. ';
  } else {
    summary += 'significant concerns that need attention. ';
  }

  if (analysis.strengths.length > 0) {
    summary += `Strengths include: ${analysis.strengths.slice(0, 2).join(', ')}. `;
  }

  if (analysis.concerns.length > 0) {
    summary += `Areas of concern: ${analysis.concerns.slice(0, 2).join(', ')}. `;
  }

  if (reflectionNotes?.goodMoments) {
    summary += 'Your reflections show meaningful positive experiences. ';
  }

  if (analysis.insights.some(i => i.type === 'inconsistency')) {
    summary += 'Note: Some inconsistencies were detected in your responses - consider reviewing them. ';
  }

  return summary;
}

