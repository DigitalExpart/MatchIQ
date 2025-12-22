// MyMatchIQ Compatibility Engine
// Calculates compatibility scores and detects red flags with a safety-first approach

export interface CompatibilityAnswer {
  questionId: string;
  value: string;
  weight?: number;
}

export interface RedFlag {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'consent' | 'boundaries' | 'honesty' | 'control' | 'emotional' | 'trauma' | 'financial' | 'safety';
  signal: string;
  guidance?: string;
}

export interface CompatibilityResult {
  overallScore: number; // 0-100 internal score
  band: 'strong-alignment' | 'promising' | 'mixed-signals' | 'caution' | 'low-compatibility';
  bandLabel: string;
  bandDescription: string;
  strengths: string[];
  awarenessAreas: string[];
  redFlags: RedFlag[];
  recommendedAction: 'proceed' | 'proceed-with-awareness' | 'pause-and-reflect';
  actionLabel: string;
  actionGuidance: string;
}

export interface CategoryScore {
  category: string;
  score: number;
  label: string;
}

// Red flag detection rules
export function detectRedFlags(answers: CompatibilityAnswer[]): RedFlag[] {
  const flags: RedFlag[] = [];

  answers.forEach(answer => {
    // Consent & boundary misalignment
    if (answer.questionId === 'boundaries-consent' && 
        (answer.value === 'boundaries-not-important' || answer.value === 'consent-flexible')) {
      flags.push({
        severity: 'critical',
        category: 'consent',
        signal: 'Responses indicate potential boundary or consent awareness concerns',
        guidance: 'This area requires careful discussion before proceeding'
      });
    }

    // Relationship overlap or dishonesty
    if (answer.questionId === 'relationship-status' && 
        (answer.value === 'complicated' || answer.value === 'seeing-others')) {
      flags.push({
        severity: 'high',
        category: 'honesty',
        signal: 'Current relationship status may indicate complexity',
        guidance: 'Clear communication about current commitments is important'
      });
    }

    // Control or power imbalance beliefs
    if (answer.questionId === 'relationship-dynamics' && 
        (answer.value === 'control-preferred' || answer.value === 'traditional-strict')) {
      flags.push({
        severity: 'medium',
        category: 'control',
        signal: 'Relationship dynamic preferences suggest potential imbalance',
        guidance: 'Discussion about equality and autonomy is recommended'
      });
    }

    // Emotional volatility
    if (answer.questionId === 'conflict-style' && answer.value === 'explosive') {
      flags.push({
        severity: 'medium',
        category: 'emotional',
        signal: 'Conflict resolution approach may indicate emotional intensity',
        guidance: 'Understanding communication patterns during disagreements is key'
      });
    }

    // Unhealed trauma paired with low accountability
    if (answer.questionId === 'past-relationships' && answer.value === 'all-their-fault') {
      flags.push({
        severity: 'high',
        category: 'trauma',
        signal: 'Perspective on past relationships suggests limited self-reflection',
        guidance: 'Emotional readiness and accountability are important for healthy relationships'
      });
    }

    // Financial instability paired with avoidance
    if (answer.questionId === 'financial-approach' && answer.value === 'avoid-discussing') {
      flags.push({
        severity: 'medium',
        category: 'financial',
        signal: 'Financial communication patterns may need attention',
        guidance: 'Open dialogue about finances is important for long-term compatibility'
      });
    }

    // Safety concerns
    if (answer.questionId === 'anger-management' && 
        (answer.value === 'often-lose-control' || answer.value === 'physical-expression')) {
      flags.push({
        severity: 'critical',
        category: 'safety',
        signal: 'Responses indicate potential safety considerations',
        guidance: 'Personal safety should be carefully evaluated before proceeding'
      });
    }
  });

  return flags;
}

// Calculate category scores
export function calculateCategoryScores(answers: CompatibilityAnswer[]): CategoryScore[] {
  const categories = new Map<string, { total: number; count: number }>();

  answers.forEach(answer => {
    const category = answer.questionId.split('-')[0];
    const score = answer.weight || 50;
    
    if (!categories.has(category)) {
      categories.set(category, { total: 0, count: 0 });
    }
    
    const cat = categories.get(category)!;
    cat.total += score;
    cat.count += 1;
  });

  const categoryScores: CategoryScore[] = [];
  const categoryLabels: Record<string, string> = {
    values: 'Core Values',
    lifestyle: 'Lifestyle Fit',
    communication: 'Communication Style',
    boundaries: 'Boundaries & Consent',
    emotional: 'Emotional Intelligence',
    financial: 'Financial Alignment',
    family: 'Family & Future',
    intimacy: 'Intimacy & Connection'
  };

  categories.forEach((data, category) => {
    categoryScores.push({
      category,
      score: Math.round(data.total / data.count),
      label: categoryLabels[category] || category
    });
  });

  return categoryScores.sort((a, b) => b.score - a.score);
}

// Calculate overall compatibility score
export function calculateCompatibilityScore(answers: CompatibilityAnswer[]): CompatibilityResult {
  // Calculate base score
  let baseScore = 0;
  let totalWeight = 0;

  answers.forEach(answer => {
    const weight = answer.weight || 50;
    baseScore += weight;
    totalWeight += 100;
  });

  const rawScore = totalWeight > 0 ? Math.round((baseScore / totalWeight) * 100) : 0;

  // Detect red flags
  const redFlags = detectRedFlags(answers);

  // Apply score caps based on red flags
  let adjustedScore = rawScore;
  const criticalFlags = redFlags.filter(f => f.severity === 'critical');
  const highFlags = redFlags.filter(f => f.severity === 'high');
  const mediumFlags = redFlags.filter(f => f.severity === 'medium');

  if (criticalFlags.length > 0) {
    adjustedScore = Math.min(adjustedScore, 45); // Cap at "caution" range
  } else if (highFlags.length >= 2) {
    adjustedScore = Math.min(adjustedScore, 60); // Cap at "mixed signals" range
  } else if (highFlags.length === 1 || mediumFlags.length >= 2) {
    adjustedScore = Math.min(adjustedScore, 75); // Cap at "promising" range
  }

  // Determine band
  let band: CompatibilityResult['band'];
  let bandLabel: string;
  let bandDescription: string;

  if (adjustedScore >= 80) {
    band = 'strong-alignment';
    bandLabel = 'Strong Alignment';
    bandDescription = 'Indicators suggest meaningful compatibility across key areas';
  } else if (adjustedScore >= 65) {
    band = 'promising';
    bandLabel = 'Promising with Awareness';
    bandDescription = 'Good foundation with some areas that may benefit from discussion';
  } else if (adjustedScore >= 50) {
    band = 'mixed-signals';
    bandLabel = 'Mixed Signals';
    bandDescription = 'Some alignment exists, but important differences should be explored';
  } else if (adjustedScore >= 35) {
    band = 'caution';
    bandLabel = 'Caution Advised';
    bandDescription = 'Significant differences or concerns warrant careful consideration';
  } else {
    band = 'low-compatibility';
    bandLabel = 'Low Compatibility';
    bandDescription = 'Fundamental differences suggest limited long-term alignment';
  }

  // Determine strengths and awareness areas
  const categoryScores = calculateCategoryScores(answers);
  const strengths = categoryScores
    .filter(c => c.score >= 70)
    .map(c => c.label)
    .slice(0, 3);
  
  const awarenessAreas = categoryScores
    .filter(c => c.score < 60)
    .map(c => c.label)
    .slice(0, 3);

  // Determine recommended action
  let recommendedAction: CompatibilityResult['recommendedAction'];
  let actionLabel: string;
  let actionGuidance: string;

  if (criticalFlags.length > 0 || adjustedScore < 40) {
    recommendedAction = 'pause-and-reflect';
    actionLabel = 'Pause and Reflect';
    actionGuidance = 'Important differences were identified. Taking time to reflect before proceeding may support emotional safety and clarity.';
  } else if (redFlags.length > 0 || adjustedScore < 65) {
    recommendedAction = 'proceed-with-awareness';
    actionLabel = 'Proceed with Awareness';
    actionGuidance = 'There is meaningful potential here, with some areas that may benefit from discussion and mutual understanding.';
  } else {
    recommendedAction = 'proceed';
    actionLabel = 'Proceed with Confidence';
    actionGuidance = 'Strong alignment detected. You may choose to continue with confidence and intention.';
  }

  return {
    overallScore: adjustedScore,
    band,
    bandLabel,
    bandDescription,
    strengths: strengths.length > 0 ? strengths : ['Early assessment—more data needed'],
    awarenessAreas: awarenessAreas.length > 0 ? awarenessAreas : [],
    redFlags,
    recommendedAction,
    actionLabel,
    actionGuidance
  };
}

// Get band color scheme
export function getBandColorScheme(band: CompatibilityResult['band']) {
  const schemes = {
    'strong-alignment': {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      icon: 'text-emerald-600'
    },
    'promising': {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-200',
      icon: 'text-blue-600'
    },
    'mixed-signals': {
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      icon: 'text-amber-600'
    },
    'caution': {
      gradient: 'from-orange-600 to-red-600',
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-200',
      icon: 'text-orange-600'
    },
    'low-compatibility': {
      gradient: 'from-gray-500 to-gray-700',
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      border: 'border-gray-200',
      icon: 'text-gray-600'
    }
  };

  return schemes[band];
}