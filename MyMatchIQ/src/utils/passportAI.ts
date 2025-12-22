import { PassportTier } from '../components/passport/PassportTierBadge';
import { PassportAnswers } from '../components/screens/PassportQuestionnaireScreen';

export interface PassportInsights {
  greenFlags: string[];
  yellowFlags: string[];
  redFlags: string[];
  patterns: string[];
}

/**
 * Generate AI insights based on passport tier and answers
 * This is a rule-based AI system that analyzes patterns in responses
 */
export function generatePassportInsights(
  tier: PassportTier,
  answers: PassportAnswers
): PassportInsights {
  const insights: PassportInsights = {
    greenFlags: [],
    yellowFlags: [],
    redFlags: [],
    patterns: [],
  };

  // Analyze communication style
  const commStyle = answers['lite-comm-1'];
  if (commStyle === 'immediately' || commStyle === 'think-first') {
    insights.greenFlags.push('Addresses issues proactively rather than avoiding conflict');
  } else if (commStyle === 'avoid') {
    insights.yellowFlags.push('May struggle with direct communication during conflicts');
  }

  // Analyze emotional availability
  const emotionalAwareness = answers['lite-emotional-1'];
  if (emotionalAwareness === 'very' || emotionalAwareness === 'mostly') {
    insights.greenFlags.push('Shows strong emotional self-awareness');
  } else if (emotionalAwareness === 'struggle') {
    insights.yellowFlags.push('Still developing emotional awareness skills');
  }

  // Analyze vulnerability comfort
  const vulnerability = answers['lite-emotional-2'];
  if (vulnerability === 'comfortable' || vulnerability === 'takes-time') {
    insights.greenFlags.push('Capable of emotional vulnerability and openness');
  } else if (vulnerability === 'difficult') {
    insights.yellowFlags.push('May need time and safety to open up emotionally');
  }

  // Analyze relationship intentions
  const intentions = answers['lite-intentions-1'];
  if (intentions === 'serious' || intentions === 'intentional') {
    insights.patterns.push('Seeking meaningful, intentional connection');
  } else if (intentions === 'casual') {
    insights.patterns.push('Currently exploring with a casual approach');
  }

  // STANDARD TIER INSIGHTS
  if (tier === 'standard' || tier === 'deep') {
    // Analyze boundaries
    const boundaries = answers['standard-conflict-2'];
    if (boundaries === 'very-clear' || boundaries === 'clear-learning') {
      insights.greenFlags.push('Has healthy boundaries and communicates them');
    } else if (boundaries === 'struggle') {
      insights.yellowFlags.push('Working on establishing and maintaining boundaries');
    }

    // Analyze conflict handling
    const conflictStyle = answers['standard-conflict-1'];
    if (conflictStyle === 'calm-discuss') {
      insights.greenFlags.push('Approaches disagreements calmly and rationally');
    } else if (conflictStyle === 'avoid') {
      insights.yellowFlags.push('Tendency to avoid confrontation - may need encouragement to address issues');
    }

    // Analyze values alignment importance
    const valuesAlignment = answers['standard-values-5'];
    if (valuesAlignment === 'very' || valuesAlignment === 'mostly') {
      insights.patterns.push('Prioritizes shared values and alignment');
    } else if (valuesAlignment === 'flexible') {
      insights.patterns.push('Comfortable with differences and diversity in partnership');
    }
  }

  // DEEP TIER INSIGHTS
  if (tier === 'deep') {
    // Analyze consistency
    const consistency = answers['deep-pace-1'];
    if (consistency === 'very' || consistency === 'mostly') {
      insights.greenFlags.push('Demonstrates consistent emotional availability and reliability');
    } else if (consistency === 'unpredictable') {
      insights.redFlags.push('Emotional availability may fluctuate unpredictably');
    }

    // Analyze trust patterns
    const trust = answers['deep-trust-1'];
    if (trust === 'easily') {
      insights.patterns.push('Trusts easily - values openness but may need healthy skepticism');
    } else if (trust === 'earned') {
      insights.greenFlags.push('Has healthy trust boundaries - earned over time');
    } else if (trust === 'struggle') {
      insights.redFlags.push('Trust challenges may require patience and understanding');
    }

    // Analyze attachment awareness
    const attachmentAwareness = answers['deep-trust-5'];
    if (attachmentAwareness === 'very-aware' || attachmentAwareness === 'aware') {
      insights.greenFlags.push('Self-aware about attachment patterns and actively working on them');
    } else if (attachmentAwareness === 'not-much') {
      insights.yellowFlags.push('May benefit from exploring attachment patterns');
    }

    // Analyze commitment relationship
    const commitment = answers['deep-longterm-2'];
    if (commitment === 'embrace') {
      insights.greenFlags.push('Embraces commitment when alignment is present');
    } else if (commitment === 'avoid') {
      insights.redFlags.push('May have commitment challenges that need addressing');
    }

    // Analyze emotional capacity
    const capacity = answers['deep-additional-5'];
    if (capacity === 'full' || capacity === 'good') {
      insights.greenFlags.push('Has strong emotional capacity for partnership');
    } else if (capacity === 'low') {
      insights.yellowFlags.push('Currently focusing on personal growth - may have limited relationship capacity');
    }

    // Pattern analysis for consistency
    const paceConsistency = answers['deep-pace-3'];
    const commConsistency = answers['deep-pace-5'];
    if (paceConsistency === 'very-steady' && commConsistency === 'very') {
      insights.patterns.push('Shows high consistency across emotional availability and communication');
    }

    // Growth and healing analysis
    const healing = answers['deep-additional-4'];
    if (healing === 'actively') {
      insights.greenFlags.push('Actively addressing past relationship patterns through intentional work');
    } else if (healing === 'not-much') {
      insights.yellowFlags.push('Past relationship wounds may still be influencing current patterns');
    }
  }

  // Ensure we have insights for each tier
  if (insights.greenFlags.length === 0) {
    insights.greenFlags.push('Shows openness to self-reflection and relationship growth');
  }

  if (tier === 'lite' && insights.patterns.length === 0) {
    insights.patterns.push('Still building compatibility profile - more depth available with additional questions');
  }

  return insights;
}
