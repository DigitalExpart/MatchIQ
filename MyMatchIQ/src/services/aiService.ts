/**
 * AI Service Layer - Backend Integration
 * 
 * Pure pass-through service that calls backend endpoints.
 * No business logic, no scoring, no local fallbacks.
 * 
 * All AI processing happens on the backend.
 */
import { apiClient } from './apiClient';
import { MatchScan, UserProfile } from '../App';
import { ReflectionNotes } from '../components/screens/ReflectionNotesScreen';

// Backend response types (matching Pydantic models)
export interface ScanResultResponse {
  id: string;
  scan_id: string;
  overall_score: number;
  category: string;
  category_scores: Record<string, number>;
  red_flags: RedFlagResponse[];
  inconsistencies: InconsistencyResponse[];
  profile_mismatches: ProfileMismatchResponse[];
  confidence_score: number;
  confidence_reason?: string;
  data_sufficiency?: {
    is_sufficient: boolean;
    reason: string;
    missing_signals: string[];
  };
  conflict_density?: {
    has_conflicts: boolean;
    conflict_score: number;
    conflicting_categories: string[];
  };
  gating_recommendations?: string[];
  escalation_reason?: string;
  explanation_metadata?: Record<string, any>;
  ai_version: string;
  logic_version: string;
  strengths: string[];
  awareness_areas: string[];
  tier?: string;
  tier_limitations?: Record<string, any>;
  recommended_action?: string;
  action_label?: string;
  action_guidance?: string;
  created_at: string;
}

export interface RedFlagResponse {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  signal: string;
  evidence: string[];
  type?: string;
  escalation_reason?: string;
}

export interface InconsistencyResponse {
  type: string;
  description: string;
  questions: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface ProfileMismatchResponse {
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
}

export interface CoachResponse {
  message: string;
  mode: 'EXPLAIN' | 'REFLECT' | 'LEARN' | 'SAFETY';
  confidence: number;
  referenced_data: Record<string, any>;
  tier?: string;
  tier_limitations?: Record<string, any>;
  session_id?: string;  // Session ID for memory
  user_name?: string;  // User's name if known
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  message: string;
  is_question: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  scan_id?: string;
  user_name?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  messages: ChatMessage[];
}

export interface VersionInfo {
  api_version: string;
  logic_version: string;
  ai_version: string;
  active_version: {
    version: string;
    description: string;
    created_at: string;
  };
}

// Frontend-compatible types (converted from backend responses)
export interface CompatibilityAnalysis {
  overallScore: number;
  band: MatchScan['category'];
  bandLabel: string;
  bandDescription: string;
  categoryScores: Record<string, number>;
  strengths: string[];
  awarenessAreas: string[];
  redFlags: RedFlagResponse[];
  recommendedAction: 'proceed' | 'proceed-with-awareness' | 'pause-and-reflect';
  actionLabel: string;
  actionGuidance: string;
  confidenceScore: number;
  confidenceReason?: string;
  logicVersion: string;
  tier?: string;
  tierLimitations?: Record<string, any>;
}

/**
 * Run compatibility assessment
 */
export async function runAssessment(
  scan: MatchScan,
  userProfile: UserProfile,
  reflectionNotes?: ReflectionNotes
): Promise<ScanResultResponse> {
  const payload = {
    person_name: scan.name,
    interaction_type: scan.interactionType,
    scan_type: 'single' as const,
    answers: scan.answers.map(answer => ({
      question_id: answer.questionId || answer.question?.split(' ')[0] || '',
      category: answer.category || 'general',
      rating: answer.rating,
      question_text: answer.question || '',
    })),
    reflection_notes: reflectionNotes ? {
      good_moments: reflectionNotes.goodMoments,
      worst_moments: reflectionNotes.worstMoments,
      sad_moments: reflectionNotes.sadMoments,
      vulnerable_moments: reflectionNotes.vulnerableMoments,
      additional_notes: reflectionNotes.additionalNotes,
    } : undefined,
    categories_completed: scan.categoriesCompleted,
  };

  return apiClient.post<ScanResultResponse>('/assessments/', payload);
}

/**
 * Get scan result by ID
 */
export async function getScanResult(scanId: string): Promise<ScanResultResponse> {
  return apiClient.get<ScanResultResponse>(`/assessments/${scanId}/result`);
}

/**
 * Get AI Coach response
 */
export async function getCoachResponse(
  mode: 'EXPLAIN' | 'REFLECT' | 'LEARN' | 'SAFETY',
  scanId?: string,
  scanResultId?: string,
  category?: string,
  specificQuestion?: string,
  sessionId?: string
): Promise<CoachResponse> {
  const payload: any = {
    mode,
  };

  if (scanResultId) {
    payload.scan_result_id = scanResultId;
  } else if (scanId) {
    payload.scan_id = scanId;
  }

  if (category) {
    payload.category = category;
  }

  if (specificQuestion) {
    payload.specific_question = specificQuestion;
  }

  if (sessionId) {
    payload.session_id = sessionId;
  }

  return apiClient.post<CoachResponse>('/coach/', payload);
}

/**
 * Get chat session with history
 */
export async function getChatSession(sessionId: string): Promise<ChatSession> {
  return apiClient.get<ChatSession>(`/coach/sessions/${sessionId}`);
}

/**
 * List chat sessions for a user
 */
export async function listChatSessions(scanId?: string): Promise<ChatSession[]> {
  const params = scanId ? { scan_id: scanId } : {};
  return apiClient.get<ChatSession[]>('/coach/sessions', { params });
}

/**
 * Get version information
 */
export async function getVersionInfo(): Promise<VersionInfo> {
  return apiClient.get<VersionInfo>('/versions');
}

/**
 * Convert backend ScanResultResponse to frontend CompatibilityAnalysis
 */
export function convertToCompatibilityAnalysis(
  result: ScanResultResponse
): CompatibilityAnalysis {
  const categoryMap: Record<string, string> = {
    'high-potential': 'High Potential Match',
    'worth-exploring': 'Worth Exploring',
    'mixed-signals': 'Mixed Signals',
    'caution': 'Proceed with Caution',
    'high-risk': 'High Risk',
  };

  return {
    overallScore: result.overall_score,
    band: result.category as MatchScan['category'],
    bandLabel: categoryMap[result.category] || result.category,
    bandDescription: result.action_guidance || '',
    categoryScores: result.category_scores,
    strengths: result.strengths,
    awarenessAreas: result.awareness_areas,
    redFlags: result.red_flags,
    recommendedAction: (result.recommended_action || 'proceed') as any,
    actionLabel: result.action_label || '',
    actionGuidance: result.action_guidance || '',
    confidenceScore: result.confidence_score,
    confidenceReason: result.confidence_reason,
    logicVersion: result.logic_version,
    tier: result.tier,
    tierLimitations: result.tier_limitations,
  };
}

/**
 * Generate AI summary from analysis
 */
export function generateAISummary(analysis: CompatibilityAnalysis, scan: MatchScan): string {
  let summary = `Based on your comprehensive assessment, ${scan.name} shows `;
  
  if (analysis.overallScore >= 85) {
    summary += 'strong compatibility potential. ';
  } else if (analysis.overallScore >= 65) {
    summary += 'good compatibility with some areas to explore. ';
  } else if (analysis.overallScore >= 50) {
    summary += 'mixed signals that require careful consideration. ';
  } else {
    summary += 'significant concerns that need attention. ';
  }

  if (analysis.strengths.length > 0) {
    summary += `Strengths include: ${analysis.strengths.slice(0, 2).join(', ')}. `;
  }

  if (analysis.awarenessAreas.length > 0) {
    summary += `Areas of concern: ${analysis.awarenessAreas.slice(0, 2).join(', ')}. `;
  }

  if (analysis.confidenceReason) {
    summary += `Note: ${analysis.confidenceReason}. `;
  }

  return summary;
}

