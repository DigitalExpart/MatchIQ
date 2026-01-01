import { CompatibilityPassportFlow } from './components/compatibility/CompatibilityPassportFlow';
import { CompatibilityDemoScreen } from './components/screens/CompatibilityDemoScreen';
import { FeatureGuideScreen } from './components/screens/FeatureGuideScreen';
import { ScanSetupScreen } from './components/screens/ScanSetupScreen';
import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LandingPage } from './components/LandingPage';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { SignUpScreen } from './components/screens/SignUpScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { SignInScreen } from './components/screens/SignInScreen';
import { authService } from './utils/authService';
import { ScanTypeSelectionScreen } from './components/screens/ScanTypeSelectionScreen';
import { MatchScanFlowScreen } from './components/screens/MatchScanFlowScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { AICoachScreen } from './components/screens/AICoachScreen';
import { StyleGuideScreen } from './components/screens/StyleGuideScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SubscriptionScreen } from './components/screens/SubscriptionScreen';
import { CompareScreen } from './components/screens/CompareScreen';
import { LegalScreen } from './components/screens/LegalScreen';
import { DualScanScreen } from './components/screens/DualScanScreen';
import { DualScanInteractionScreen } from './components/screens/DualScanInteractionScreen';
import { DualScanCategoryScreen } from './components/screens/DualScanCategoryScreen';
import { DualScanFlowScreen } from './components/screens/DualScanFlowScreen';
import { DualScanResultsScreen } from './components/screens/DualScanResultsScreen';
import { BlueprintHomeScreen } from './components/screens/BlueprintHomeScreen';
import { BlueprintQuestionnaireScreen } from './components/screens/BlueprintQuestionnaireScreen';
import { BlueprintGenerationScreen } from './components/screens/BlueprintGenerationScreen';
import { BlueprintSummaryScreen } from './components/screens/BlueprintSummaryScreen';
import { BlueprintShareScreen } from './components/screens/BlueprintShareScreen';
import { BlueprintComparisonScreen } from './components/screens/BlueprintComparisonScreen';
import { IncomingBlueprintScreen } from './components/screens/IncomingBlueprintScreen';
import { PreCompatibilitySnapshotScreen } from './components/screens/PreCompatibilitySnapshotScreen';
import { LanguageSelectionScreen } from './components/screens/LanguageSelectionScreen';
import { PassportDemoContainer } from './components/screens/PassportDemoContainer';
import { PassportBadgeShowcaseScreen } from './components/screens/PassportBadgeShowcaseScreen';
import { PricingShowcaseScreen } from './components/screens/PricingShowcaseScreen';
import { ScanConfirmationScreen } from './components/screens/ScanConfirmationScreen';
import { GuidedScanFlowScreen } from './components/screens/GuidedScanFlowScreen';
import { ScanCompleteScreen } from './components/screens/ScanCompleteScreen';
import { ConnectionRequestsScreen } from './components/screens/ConnectionRequestsScreen';
import { DatingInsightsScreen } from './components/screens/DatingInsightsScreen';
import { PassportRequestReviewScreen } from './components/screens/PassportRequestReviewScreen';
import { ActiveConnectionScreen } from './components/screens/ActiveConnectionScreen';
import { ConnectionClosedScreen } from './components/screens/ConnectionClosedScreen';
import { AssessmentCommunityLockedScreen } from './components/screens/AssessmentCommunityLockedScreen';
import { FloatingHearts } from './components/FloatingHearts';
import { SelfAssessmentReminderBanner } from './components/SelfAssessmentReminderBanner';
import { AssessmentBlockedModal } from './components/AssessmentBlockedModal';
import type { ConnectionRequest, ActiveConnection } from './components/screens/ConnectionRequestsScreen';
import type { BlueprintAnswer } from './components/screens/BlueprintQuestionnaireScreen';
import type { DualScanAnswer, InteractionType } from './components/screens/DualScanFlowScreen';
import type { SelectedQuestion } from './components/screens/ScanSetupScreen';

export type Screen = 
  | 'welcome'
  | 'landing'
  | 'signIn'
  | 'signUp'
  | 'onboarding'
  | 'dashboard'
  | 'scanTypeSelection'
  | 'matchScan'
  | 'results'
  | 'history'
  | 'aiCoach'
  | 'styleGuide'
  | 'profile'
  | 'subscription'
  | 'compare'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'dualScan'
  | 'dualScanInteraction'
  | 'dualScanCategories'
  | 'dualScanFlow'
  | 'dualScanResults'
  | 'blueprintHome'
  | 'blueprintQuestionnaire'
  | 'blueprintGeneration'
  | 'blueprintSummary'
  | 'blueprintShare'
  | 'blueprintComparison'
  | 'incomingBlueprint'
  | 'preCompatibilitySnapshot'
  | 'languageSelection'
  | 'passport'
  | 'tieredPassport'
  | 'passportBadgeShowcase'
  | 'pricingShowcase'
  | 'compatibilityPassport'
  | 'compatibilityResults'
  | 'compatibilityDemo'
  | 'featureGuide'
  | 'scanSetup'
  | 'questionPicker'
  | 'scanConfirmation'
  | 'guidedScanFlow'
  | 'scanComplete'
  | 'connectionRequests'
  | 'datingInsights'
  | 'passportRequestReview'
  | 'activeConnection'
  | 'connectionClosed'
  | 'assessmentCommunityLocked';

export type SubscriptionTier = 'free' | 'premium' | 'exclusive';

export interface UserProfile {
  name: string;
  age: number;
  datingGoal: 'casual' | 'serious' | 'long-term' | 'marriage';
  language?: 'en' | 'es' | 'fr' | 'de' | 'it';
  location?: string;
  email?: string;
  phone?: string;
  bio?: string;
  // Self-assessment fields
  selfAssessmentComplete?: boolean;
  selfAssessmentProgress?: number; // 0-100
  selfAssessmentAnswers?: BlueprintAnswer[];
  blueprintQRCode?: string;
  lastAssessmentReminder?: string; // ISO timestamp
}

export interface MatchScan {
  id: string;
  name: string;
  date: string;
  score: number;
  category: 'high-potential' | 'worth-exploring' | 'mixed-signals' | 'caution' | 'high-risk';
  interactionType: string;
  deck: string;
  answers: ScanAnswer[];
  categoriesCompleted?: string[];
  notes?: string;
  tags?: string[];
  reflectionNotes?: {
    goodMoments?: string;
    worstMoments?: string;
    sadMoments?: string;
    vulnerableMoments?: string;
    additionalNotes?: string;
  };
}

export interface ScanAnswer {
  question: string;
  rating: 'strong-match' | 'good' | 'neutral' | 'yellow-flag' | 'red-flag';
  notes?: string;
  category?: string;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t, setLanguage } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingDatingGoal, setOnboardingDatingGoal] = useState<UserProfile['datingGoal'] | null>(null);
  const [scans, setScans] = useState<MatchScan[]>([]);
  const [currentScan, setCurrentScan] = useState<MatchScan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsightCategory, setSelectedInsightCategory] = useState<'daily-tips' | 'emotional-alignment' | 'communication' | 'red-flags' | 'compatibility'>('daily-tips');
  const [dualScanState, setDualScanState] = useState<{
    sessionId: string;
    role: 'A' | 'B';
    partnerName: string;
    currentStep: number;
    answers: DualScanAnswer[];
    score?: number;
    selectedCategories?: string[];
    isUnified?: boolean;
    interactionType?: InteractionType;
  } | null>(null);
  const [continuingScanId, setContinuingScanId] = useState<string | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [compareScans, setCompareScans] = useState<[MatchScan, MatchScan] | null>(null);
  const [blueprintAnswers, setBlueprintAnswers] = useState<BlueprintAnswer[] | null>(null);
  const [blueprintId, setBlueprintId] = useState<string | null>(null);
  const [showAssessmentBlockedModal, setShowAssessmentBlockedModal] = useState(false);
  const [showReminderBanner, setShowReminderBanner] = useState(false);
  const [guidedScanState, setGuidedScanState] = useState<{
    selectedQuestions: Map<string, SelectedQuestion>;
    totalQuestions: number;
  } | null>(null);
  
  // Premier Preview state
  const [premierPreviewActive, setPremierPreviewActive] = useState(false);
  const [premierPreviewExpiry, setPremierPreviewExpiry] = useState<number | null>(null);
  const [premierPreviewLastUsed, setPremierPreviewLastUsed] = useState<number | null>(null);
  
  // Connection requests state  
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);
  
  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('myMatchIQ_userProfile');
      const savedTier = localStorage.getItem('myMatchIQ_subscriptionTier');
      const savedScans = localStorage.getItem('myMatchIQ_scans');
      const savedBlueprint = localStorage.getItem('myMatchIQ_blueprint');
      const savedBlueprintId = localStorage.getItem('myMatchIQ_blueprintId');
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        
        // Set language from profile if available
        if (profile.language) {
          setLanguage(profile.language);
        }
        
        // Check for dual scan invite in URL
        const urlParams = new URLSearchParams(window.location.search);
        const dualScanId = urlParams.get('dualScan');
        
        if (dualScanId) {
          // Load the dual scan session
          handleDualScanInvite(dualScanId);
        } else {
          // If user has completed onboarding, skip to dashboard
          setCurrentScreen('dashboard');
        }
      } else {
        // Check for dual scan invite even without profile
        const urlParams = new URLSearchParams(window.location.search);
        const dualScanId = urlParams.get('dualScan');
        
        if (dualScanId) {
          // Need to complete onboarding first
          alert('Please complete your profile first before joining a dual scan!');
        }
      }
      
      if (savedTier) {
        setSubscriptionTier(savedTier as SubscriptionTier);
      }
      
      if (savedScans) {
        setScans(JSON.parse(savedScans));
      }
      
      if (savedBlueprint) {
        setBlueprintAnswers(JSON.parse(savedBlueprint));
      }
      
      if (savedBlueprintId) {
        setBlueprintId(savedBlueprintId);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save userProfile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('myMatchIQ_userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Save subscriptionTier to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('myMatchIQ_subscriptionTier', subscriptionTier);
  }, [subscriptionTier]);

  // Save scans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('myMatchIQ_scans', JSON.stringify(scans));
  }, [scans]);

  // Save blueprint answers to localStorage whenever they change
  useEffect(() => {
    if (blueprintAnswers) {
      localStorage.setItem('myMatchIQ_blueprint', JSON.stringify(blueprintAnswers));
    }
  }, [blueprintAnswers]);

  // Save blueprint ID to localStorage whenever it changes
  useEffect(() => {
    if (blueprintId) {
      localStorage.setItem('myMatchIQ_blueprintId', blueprintId);
    }
  }, [blueprintId]);

  const handleCompleteOnboarding = (datingGoal: UserProfile['datingGoal']) => {
    setOnboardingDatingGoal(datingGoal);
    setCurrentScreen('signUp');
  };

  const handleCompleteSignUp = (userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    location?: string;
    datingGoal?: string;
  }) => {
    const newProfile: UserProfile = {
      name: userData.name,
      email: userData.email,
      age: userData.age || 25,
      datingGoal: (userData.datingGoal || onboardingDatingGoal || 'serious') as UserProfile['datingGoal'],
      location: userData.location || '',
    };
    setUserProfile(newProfile);
    setCurrentScreen('dashboard');
  };

  const handleStartScan = () => {
    setContinuingScanId(null);
    setCurrentScreen('matchScan');
  };

  const handleCompleteScan = (scan: MatchScan) => {
    if (continuingScanId) {
      // Update existing scan
      setScans(prev => prev.map(s => s.id === continuingScanId ? scan : s));
      setContinuingScanId(null);
    } else {
      // Add new scan
      setScans(prev => [...prev, scan]);
    }
    setCurrentScan(scan);
    setCurrentScreen('results');
  };

  const handleContinueAssessment = () => {
    if (currentScan) {
      setContinuingScanId(currentScan.id);
      setCurrentScreen('matchScan');
    }
  };

  const handleNavigate = (screen: Screen) => {
    setNavigationHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    const result = await authService.signIn(email, password);
    if (result.success) {
      // Load user profile if available
      const account = authService.getAccount(result.userId!);
      if (account) {
        // Try to load existing profile or create a basic one
        const savedProfile = localStorage.getItem('myMatchIQ_userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserProfile(profile);
        } else if (account.name) {
          // Create a basic profile from account
          const basicProfile: UserProfile = {
            name: account.name,
            age: 25, // Default age, user can update later
            datingGoal: 'serious',
            email: account.email,
          };
          setUserProfile(basicProfile);
          localStorage.setItem('myMatchIQ_userProfile', JSON.stringify(basicProfile));
        }
      }
      setCurrentScreen('dashboard');
      return true;
    }
    return false;
  };

  const handleSignUp = async (email: string, password: string, name: string): Promise<boolean> => {
    const result = await authService.signUp(email, password, name);
    if (result.success) {
      // Create a basic profile for new user
      const basicProfile: UserProfile = {
        name,
        age: 25, // Default age, user can update later
        datingGoal: 'serious',
        email: email.toLowerCase(),
      };
      setUserProfile(basicProfile);
      localStorage.setItem('myMatchIQ_userProfile', JSON.stringify(basicProfile));
      setCurrentScreen('dashboard');
      return true;
    }
    return false;
  };

  const handleSignOut = () => {
    authService.signOut();
    // Clear user profile and navigate to sign in
    setUserProfile(null);
    setCurrentScreen('signIn');
    // Clear navigation history
    setNavigationHistory([]);
  };

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      // Default fallback to dashboard if no history
      setCurrentScreen('dashboard');
    }
  };

  const handleDeleteScan = (scanId: string) => {
    setScans(prev => prev.filter(s => s.id !== scanId));
    // If the deleted scan was the current scan, clear it
    if (currentScan?.id === scanId) {
      setCurrentScan(null);
      setCurrentScreen('dashboard');
    }
  };

  const handleUpdateScan = (scanId: string, updates: Partial<MatchScan>) => {
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, ...updates } : s));
    // If updating the current scan, update it too
    if (currentScan?.id === scanId) {
      setCurrentScan(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleCompareScans = (scan1: MatchScan, scan2: MatchScan) => {
    setCompareScans([scan1, scan2]);
    setCurrentScreen('compare');
  };

  const handleResetAllData = () => {
    setScans([]);
    setCurrentScan(null);
    setContinuingScanId(null);
    setCompareScans(null);
    // Clear localStorage
    localStorage.removeItem('myMatchIQ_scans');
  };

  // Dual scan handlers
  const handleDualScanInvite = (sessionId: string) => {
    try {
      const sessionData = localStorage.getItem(`paktIQ_dualSession_${sessionId}`);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        setDualScanState({
          sessionId,
          role: session.createdBy === userProfile?.name ? 'A' : 'B',
          partnerName: session.createdBy === userProfile?.name ? (session.userBName || 'Partner') : session.userAName,
          currentStep: 0,
          answers: [],
        });
        
        setCurrentScreen('dualScan');
      } else {
        // Session doesn't exist yet, show dual scan screen to see it
        setCurrentScreen('dualScan');
      }
    } catch (error) {
      console.error('Error loading dual scan:', error);
      setCurrentScreen('dashboard');
    }
  };

  const handleStartDualScan = (sessionId: string, role: 'A' | 'B', partnerName: string) => {
    setDualScanState({
      sessionId,
      role,
      partnerName,
      currentStep: 1,
      answers: [],
    });
    setCurrentScreen('dualScanInteraction');
  };

  const handleDualScanSelectInteraction = (interactionType: InteractionType) => {
    setDualScanState(prev => ({
      ...prev!,
      currentStep: 2,
      interactionType,
    }));
    setCurrentScreen('dualScanCategories');
  };

  const handleDualScanSelectCategories = (categories: string[], isUnified: boolean) => {
    setDualScanState(prev => ({
      ...prev!,
      currentStep: 3,
      selectedCategories: categories,
      isUnified,
    }));
    
    // Save the category preference to session storage
    if (prev?.sessionId) {
      const sessionKey = `paktIQ_dualSession_${prev.sessionId}`;
      const sessionData = localStorage.getItem(sessionKey);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        
        if (isUnified) {
          // Store unified categories for both users
          session.unifiedCategories = categories;
          session.isUnified = true;
        } else {
          // Store individual categories per role
          session.isUnified = false;
          if (prev.role === 'A') {
            session.userACategories = categories;
          } else {
            session.userBCategories = categories;
          }
        }
        
        localStorage.setItem(sessionKey, JSON.stringify(session));
      }
    }
    
    setCurrentScreen('dualScanFlow');
  };

  const handleCompleteDualScan = (score: number, answers: DualScanAnswer[]) => {
    setDualScanState(prev => ({
      ...prev!,
      currentStep: 4,
      score,
      answers,
    }));
    
    // Save to localStorage
    if (prev?.sessionId && prev.role) {
      const storageKey = `paktIQ_dualScan_${prev.sessionId}_${prev.role}`;
      localStorage.setItem(storageKey, JSON.stringify({ score, answers, completedAt: new Date().toISOString() }));
      
      // Update session completion status
      const sessionKey = `paktIQ_dualSession_${prev.sessionId}`;
      const sessionData = localStorage.getItem(sessionKey);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (prev.role === 'A') {
          session.userACompleted = true;
        } else {
          session.userBCompleted = true;
        }
        localStorage.setItem(sessionKey, JSON.stringify(session));
      }
    }
    
    setCurrentScreen('dualScanResults');
  };

  // Self-assessment handlers
  const generateBlueprintQRCode = (userId: string, answers: BlueprintAnswer[]): string => {
    const data = {
      userId,
      blueprintId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      answerCount: answers.length
    };
    // Generate a unique QR code identifier
    return `MMQ-${btoa(JSON.stringify(data)).substring(0, 12)}`;
  };

  const handleCompleteSelfAssessment = (answers: BlueprintAnswer[]) => {
    if (!userProfile) return;
    
    // Generate QR code
    const qrCode = generateBlueprintQRCode(userProfile.name, answers);
    
    // Generate blueprint ID if doesn't exist
    const newBlueprintId = blueprintId || Date.now().toString();
    setBlueprintId(newBlueprintId);
    
    // Update user profile with completed assessment
    const updatedProfile: UserProfile = {
      ...userProfile,
      selfAssessmentComplete: true,
      selfAssessmentProgress: 100,
      selfAssessmentAnswers: answers,
      blueprintQRCode: qrCode
    };
    
    setUserProfile(updatedProfile);
    setBlueprintAnswers(answers);
    
    // Go to generation screen
    setCurrentScreen('blueprintGeneration');
  };

  const handleSaveSelfAssessmentProgress = (answers: BlueprintAnswer[], progress: number) => {
    if (!userProfile) return;
    
    const updatedProfile: UserProfile = {
      ...userProfile,
      selfAssessmentComplete: false,
      selfAssessmentProgress: progress,
      selfAssessmentAnswers: answers,
      lastAssessmentReminder: new Date().toISOString()
    };
    
    setUserProfile(updatedProfile);
    setBlueprintAnswers(answers);
    
    // Navigation is handled by the component calling onBack()
    // This just saves the progress to the profile
  };

  const checkSelfAssessmentBeforeScan = (): boolean => {
    if (!userProfile?.selfAssessmentComplete) {
      setShowAssessmentBlockedModal(true);
      return false;
    }
    return true;
  };

  // Show reminder banner if assessment is incomplete
  useEffect(() => {
    if (!userProfile) return;
    
    const isIncomplete = !userProfile.selfAssessmentComplete;
    
    // Show banner if incomplete and on dashboard
    if (isIncomplete && currentScreen === 'dashboard') {
      // Check if we should show reminder (not shown in last 24 hours)
      const lastReminder = userProfile.lastAssessmentReminder;
      const shouldShow = !lastReminder || 
        (Date.now() - new Date(lastReminder).getTime() > 24 * 60 * 60 * 1000);
      
      setShowReminderBanner(shouldShow);
    } else {
      setShowReminderBanner(false);
    }
  }, [userProfile, currentScreen]);

  // Guided scan handlers
  const handleStartGuidedScan = (selectedQuestions: Map<string, SelectedQuestion>) => {
    const tierCounts = { free: 15, premium: 25, exclusive: 45 };
    setGuidedScanState({
      selectedQuestions,
      totalQuestions: tierCounts[subscriptionTier]
    });
    setCurrentScreen('scanConfirmation');
  };

  const handleStartGuidedScanFlow = () => {
    setCurrentScreen('guidedScanFlow');
  };

  const handleCompleteGuidedScan = (scan: MatchScan) => {
    setScans(prev => [...prev, scan]);
    setCurrentScan(scan);
    setGuidedScanState(null);
    setCurrentScreen('scanComplete');
  };

  // Connection request handlers
  const handleRevokeRequest = (requestId: string) => {
    setConnectionRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'revoked' as const, revokedAt: new Date().toISOString(), revokedBy: req.senderId === userProfile?.name ? 'sender' as const : 'recipient' as const } : req)
    );
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = connectionRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Update request status
    setConnectionRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'accepted' as const, acceptedAt: new Date().toISOString() } : req)
    );
    
    // Create active connection
    const newConnection: ActiveConnection = {
      id: Date.now().toString(),
      user1Id: request.senderId,
      user1Name: request.senderName,
      user2Id: request.recipientId,
      user2Name: request.recipientName,
      connectedAt: new Date().toISOString(),
      status: 'active',
    };
    setActiveConnections(prev => [...prev, newConnection]);
  };

  const handleDeclineRequest = (requestId: string) => {
    setConnectionRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'declined' as const } : req)
    );
  };

  const handleExtendRequest = (requestId: string) => {
    setConnectionRequests(prev => 
      prev.map(req => {
        if (req.id === requestId) {
          const newExpiry = new Date(new Date(req.expiresAt).getTime() + 24 * 60 * 60 * 1000).toISOString();
          return { ...req, status: 'extended' as const, expiresAt: newExpiry, hasExtended: true };
        }
        return req;
      })
    );
  };

  const handlePauseConnection = (connectionId: string) => {
    setActiveConnections(prev => 
      prev.map(conn => conn.id === connectionId ? { ...conn, status: 'paused' as const, pausedAt: new Date().toISOString(), pausedBy: userProfile?.name } : conn)
    );
  };

  const handleResumeConnection = (connectionId: string) => {
    setActiveConnections(prev => 
      prev.map(conn => conn.id === connectionId ? { ...conn, status: 'active' as const, pausedAt: undefined, pausedBy: undefined } : conn)
    );
  };

  const handleRevokeConnection = (connectionId: string) => {
    setActiveConnections(prev => 
      prev.map(conn => conn.id === connectionId ? { ...conn, status: 'revoked' as const } : conn)
    );
  };
  
  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loadingApp')}</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setCurrentScreen('onboarding')} />;
      case 'landing':
        return <LandingPage onStart={() => setCurrentScreen('onboarding')} />;
      case 'signIn':
        return (
          <SignInScreen
            onSignIn={handleSignIn}
            onSignUp={() => setCurrentScreen('signUp')}
            onBack={() => setCurrentScreen('welcome')}
          />
        );
      case 'onboarding':
        return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
      case 'signUp':
        return (
          <SignUpScreen
            onComplete={handleCompleteSignUp}
            onBack={() => setCurrentScreen('onboarding')}
            onSignIn={() => setCurrentScreen('signIn')}
            datingGoal={onboardingDatingGoal || undefined}
          />
        );
      case 'dashboard':
        return <DashboardScreen 
          onStartScan={handleStartScan} 
          onNavigate={handleNavigate} 
          onNavigateToDatingInsights={(category) => {
            setSelectedInsightCategory(category);
            handleNavigate('datingInsights');
          }}
          scans={scans} 
          subscriptionTier={subscriptionTier}
          onSignOut={handleSignOut}
        />; 
      case 'scanTypeSelection':
        return (
          <ScanTypeSelectionScreen 
            onBack={handleBack}
            onSelectSingleScan={() => handleNavigate('matchScan')}
            onSelectDualScan={() => handleNavigate('dualScan')}
          />
        );
      case 'matchScan':
        return (
          <MatchScanFlowScreen 
            onComplete={handleCompleteScan} 
            onBack={handleBack}
            existingScan={continuingScanId ? currentScan : undefined}
            userProfile={userProfile}
          />
        );
      case 'results':
        return (
          <ResultsScreen 
            scan={currentScan!} 
            onBack={handleBack} 
            onContinueAssessment={handleContinueAssessment}
            onUpdateScan={handleUpdateScan}
            userProfile={userProfile}
          />
        );
      case 'history':
        return <HistoryScreen scans={scans} onBack={handleBack} onViewScan={(scan) => { setCurrentScan(scan); handleNavigate('results'); }} onDeleteScan={handleDeleteScan} onCompareScans={handleCompareScans} onNavigateHome={() => setCurrentScreen('welcome')} />; 
      case 'aiCoach':
        return <AICoachScreen onBack={handleBack} onNavigateHome={() => setCurrentScreen('welcome')} />; 
      case 'styleGuide':
        return <StyleGuideScreen onBack={handleBack} />;
      case 'profile':
        return (
          <ProfileScreen 
            profile={userProfile} 
            subscriptionTier={subscriptionTier}
            onBack={handleBack} 
            onSave={setUserProfile}
            onManageSubscription={() => handleNavigate('subscription')}
            onResetAllData={handleResetAllData}
            onNavigate={handleNavigate}
          />
        );
      case 'subscription':
        return <SubscriptionScreen currentTier={subscriptionTier} onBack={handleBack} onSelectTier={setSubscriptionTier} />;
      case 'compare':
        return compareScans ? <CompareScreen scan1={compareScans[0]} scan2={compareScans[1]} onBack={handleBack} /> : <HistoryScreen scans={scans} onBack={handleBack} onViewScan={(scan) => { setCurrentScan(scan); handleNavigate('results'); }} onDeleteScan={handleDeleteScan} onCompareScans={handleCompareScans} />;
      case 'dualScan':
        return (
          <DualScanScreen 
            onBack={handleBack} 
            onStartDualScan={handleStartDualScan}
            onStartDualScanFlow={handleStartDualScan}
            userName={userProfile?.name || 'User'}
          />
        );
      case 'dualScanInteraction':
        return dualScanState ? (
          <DualScanInteractionScreen 
            partnerName={dualScanState.partnerName}
            onBack={handleBack}
            onSelectInteraction={handleDualScanSelectInteraction}
          />
        ) : <DashboardScreen onStartScan={handleStartScan} onNavigate={handleNavigate} scans={scans} />;
      case 'dualScanCategories':
        return dualScanState ? (
          <DualScanCategoryScreen 
            partnerName={dualScanState.partnerName}
            onBack={handleBack}
            onContinue={handleDualScanSelectCategories}
          />
        ) : <DashboardScreen onStartScan={handleStartScan} onNavigate={handleNavigate} scans={scans} subscriptionTier={subscriptionTier} />;
      case 'dualScanFlow':
        return dualScanState && dualScanState.selectedCategories.length > 0 ? (
          <DualScanFlowScreen 
            sessionId={dualScanState.sessionId}
            role={dualScanState.role}
            partnerName={dualScanState.partnerName}
            userName={userProfile?.name || 'User'}
            selectedCategories={dualScanState.selectedCategories}
            interactionType={dualScanState.interactionType}
            onComplete={handleCompleteDualScan}
            onBack={handleBack}
          />
        ) : <DashboardScreen onStartScan={handleStartScan} onNavigate={handleNavigate} scans={scans} />;
      case 'dualScanResults':
        return dualScanState ? (
          <DualScanResultsScreen 
            sessionId={dualScanState.sessionId}
            role={dualScanState.role}
            partnerName={dualScanState.partnerName}
            userName={userProfile?.name || 'User'}
            score={dualScanState.score}
            answers={dualScanState.answers}
            onBack={handleBack}
            onViewAllScans={() => handleNavigate('dualScan')}
          />
        ) : <DashboardScreen onStartScan={handleStartScan} onNavigate={handleNavigate} scans={scans} />;
      case 'privacy':
        return <LegalScreen type="privacy" onBack={handleBack} />;
      case 'terms':
        return <LegalScreen type="terms" onBack={handleBack} />;
      case 'contact':
        return <LegalScreen type="contact" onBack={handleBack} />;
      case 'blueprintHome':
        return (
          <BlueprintHomeScreen 
            onStartAssessment={() => handleNavigate('blueprintQuestionnaire')}
            onViewBlueprint={() => handleNavigate('blueprintSummary')}
            onShareBlueprint={() => handleNavigate('blueprintShare')}
            onBack={handleBack}
            hasBlueprint={blueprintAnswers !== null}
          />
        );
      case 'blueprintQuestionnaire':
        const isSelfAssessment = !userProfile?.selfAssessmentComplete;
        
        return (
          <BlueprintQuestionnaireScreen 
            onComplete={isSelfAssessment ? handleCompleteSelfAssessment : (answers) => {
              setBlueprintAnswers(answers);
              if (!blueprintId) {
                setBlueprintId(Date.now().toString());
              }
              handleNavigate('blueprintGeneration');
            }}
            onBack={handleBack}
            existingAnswers={userProfile?.selfAssessmentAnswers || blueprintAnswers || []}
            onSaveProgress={isSelfAssessment ? handleSaveSelfAssessmentProgress : undefined}
            isSelfAssessment={isSelfAssessment}
          />
        );
      case 'blueprintGeneration':
        return (
          <BlueprintGenerationScreen 
            onComplete={() => {
              // If this is the initial self-assessment, ensure it's marked complete
              if (userProfile && !userProfile.selfAssessmentComplete) {
                setUserProfile({
                  ...userProfile,
                  selfAssessmentComplete: true,
                  selfAssessmentProgress: 100
                });
              }
              handleNavigate('blueprintSummary');
            }}
          />
        );
      case 'blueprintSummary':
        return blueprintAnswers ? (
          <BlueprintSummaryScreen 
            answers={blueprintAnswers}
            onEdit={() => handleNavigate('blueprintQuestionnaire')}
            onShare={() => handleNavigate('blueprintShare')}
            onCompare={() => handleNavigate('blueprintComparison')}
            onBack={handleBack}
            onNavigateHome={() => handleNavigate('dashboard')}
            userName={userProfile?.name}
          />
        ) : (
          <BlueprintHomeScreen 
            onStartAssessment={() => handleNavigate('blueprintQuestionnaire')}
            onViewBlueprint={() => handleNavigate('blueprintSummary')}
            onShareBlueprint={() => handleNavigate('blueprintShare')}
            onBack={handleBack}
            hasBlueprint={false}
          />
        );
      case 'blueprintShare':
        return (
          <BlueprintShareScreen 
            onBack={handleBack}
            blueprintId={blueprintId || Date.now().toString()}
            userName={userProfile?.name || 'User'}
          />
        );
      case 'blueprintComparison':
        return blueprintAnswers ? (
          <BlueprintComparisonScreen 
            onBack={handleBack}
            onRunFullScan={() => handleNavigate('matchScan')}
            userAName={userProfile?.name || 'You'}
            userBName="Potential Match"
            compatibilityData={{
              overallScore: 75,
              mindsetAlignment: 82,
              lifestyleFit: 68,
              relationshipExpectations: 85,
              personalityMatch: 70,
              dealBreakerClashScore: 15,
              redFlags: [
                { severity: 'medium', description: 'Different views on work-life balance' }
              ],
              alignedValues: ['Honesty', 'Family', 'Ambition'],
              conflictAreas: ['Physical fitness priority', 'Social habits']
            }}
          />
        ) : (
          <BlueprintHomeScreen 
            onStartAssessment={() => handleNavigate('blueprintQuestionnaire')}
            onViewBlueprint={() => handleNavigate('blueprintSummary')}
            onShareBlueprint={() => handleNavigate('blueprintShare')}
            onBack={handleBack}
            hasBlueprint={false}
          />
        );
      case 'incomingBlueprint':
        return (
          <IncomingBlueprintScreen 
            senderName="Alex"
            blueprintId={blueprintId || 'demo123'}
            onViewBlueprint={() => handleNavigate('blueprintSummary')}
            onCreateOwn={() => handleNavigate('blueprintQuestionnaire')}
            onContinueAsGuest={() => handleNavigate('blueprintSummary')}
          />
        );
      case 'preCompatibilitySnapshot':
        return (
          <PreCompatibilitySnapshotScreen 
            onBack={handleBack}
            onRunFullScan={() => handleNavigate('matchScan')}
            onSaveComparison={() => handleNavigate('blueprintComparison')}
            userAName={userProfile?.name || 'You'}
            userBName="Potential Match"
            compatibilityData={{
              overallScore: 75,
              mindsetAlignment: 82,
              lifestyleFit: 68,
              relationshipExpectations: 85,
              personalityMatch: 70,
              dealBreakerClashScore: 15,
              redFlags: [
                { severity: 'medium', description: 'Different views on work-life balance' }
              ],
              alignedValues: ['Honesty', 'Family', 'Ambition'],
              conflictAreas: ['Physical fitness priority', 'Social habits']
            }}
          />
        );
      case 'languageSelection':
        return <LanguageSelectionScreen onBack={handleBack} />;
      case 'passport':
        return <PassportDemoContainer onBack={handleBack} />;
      case 'tieredPassport':
        return <PassportDemoContainer onBack={handleBack} />;
      case 'passportBadgeShowcase':
        return <PassportBadgeShowcaseScreen onBack={handleBack} />;
      case 'pricingShowcase':
        return <PricingShowcaseScreen onBack={handleBack} />;
      case 'compatibilityPassport':
        return (
          <CompatibilityPassportFlow 
            tier={subscriptionTier} 
            onBack={handleBack}
            onComplete={(answers) => {
              // Store answers and navigate to demo results
              console.log('Compatibility passport completed', answers);
              handleBack();
            }}
          />
        );
      case 'compatibilityResults':
        // Demo results screen - in production this would use actual results
        return handleBack();
      case 'compatibilityDemo':
        return <CompatibilityDemoScreen onBack={handleBack} tier={subscriptionTier} />;
      case 'featureGuide':
        return <FeatureGuideScreen onBack={handleBack} tier={subscriptionTier} />;
      case 'scanSetup':
        return (
          <ScanSetupScreen
            onBack={handleBack}
            onContinue={handleStartGuidedScan}
            subscriptionTier={subscriptionTier}
          />
        );
      case 'scanConfirmation':
        return guidedScanState ? (
          <ScanConfirmationScreen
            selectedQuestions={guidedScanState.selectedQuestions}
            totalQuestions={guidedScanState.totalQuestions}
            onStartScan={handleStartGuidedScanFlow}
          />
        ) : (
          <DashboardScreen onStartScan={handleStartScan} onNavigate={handleNavigate} scans={scans} subscriptionTier={subscriptionTier} />
        );
      case 'guidedScanFlow':
        return guidedScanState ? (
          <GuidedScanFlowScreen
            selectedQuestions={guidedScanState.selectedQuestions}
            subscriptionTier={subscriptionTier}
            onComplete={handleCompleteGuidedScan}
            onBack={handleBack}
          />
        ) : (
          <DashboardScreen onStartScan={handleStartScan} onNavigate={handleNavigate} scans={scans} subscriptionTier={subscriptionTier} />
        );
      case 'scanComplete':
        return currentScan ? (
          <ScanCompleteScreen
            onViewResults={() => setCurrentScreen('results')}
          />
        ) : (
          <DashboardScreen onStartScan={handleStartScan} onNavigate={handleNavigate} scans={scans} subscriptionTier={subscriptionTier} />
        );
      case 'connectionRequests':
        return (
          <ConnectionRequestsScreen
            currentUserId={userProfile?.name || 'user1'}
            currentUserName={userProfile?.name || 'User'}
            sentRequests={connectionRequests.filter(r => r.senderId === userProfile?.name)}
            receivedRequests={connectionRequests.filter(r => r.recipientId === userProfile?.name)}
            activeConnections={activeConnections}
            onBack={handleBack}
            onRevokeRequest={handleRevokeRequest}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onExtendRequest={handleExtendRequest}
            onPauseConnection={handlePauseConnection}
            onResumeConnection={handleResumeConnection}
            onRevokeConnection={handleRevokeConnection}
            subscriptionTier={subscriptionTier}
          />
        );
      case 'datingInsights':
        return (
          <DatingInsightsScreen
            onBack={handleBack}
            initialCategory={selectedInsightCategory}
          />
        );
      case 'passportRequestReview':
        return (
          <PassportRequestReviewScreen
            onBack={handleBack}
            subscriptionTier={subscriptionTier}
            onAccept={() => {
              // Handle accept - in production this would create a connection
              console.log('Passport request accepted');
              handleBack();
            }}
            onDecline={() => {
              // Handle decline - silent dismissal
              console.log('Passport request declined');
              handleBack();
            }}
          />
        );
      case 'activeConnection':
        return (
          <ActiveConnectionScreen
            connectionId="demo123"
            partnerName="Alex"
            partnerTier="standard"
            connectedAt={new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()} // 2 hours ago
            expiresAt={new Date(Date.now() + 46 * 60 * 60 * 1000).toISOString()} // 46 hours from now
            onBack={handleBack}
            onPauseConnection={() => {
              console.log('Connection paused');
              handleBack();
            }}
            onRevokeConnection={() => {
              console.log('Connection revoked');
              handleBack();
            }}
            onStartMatchScan={() => handleNavigate('scanSetup')}
            onStartAICoach={() => handleNavigate('aiCoach')}
            onViewReflectionPrompts={() => {
              console.log('View reflection prompts');
            }}
            subscriptionTier={subscriptionTier}
          />
        );
      case 'connectionClosed':
        return (
          <ConnectionClosedScreen
            partnerName="Alex"
            closedReason="expired"
            closedAt={new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()} // 12 hours ago
            onBack={handleBack}
            onRequestNewConnection={() => {
              console.log('Requesting new connection');
              handleBack();
            }}
          />
        );
      case 'assessmentCommunityLocked':
        return (
          <AssessmentCommunityLockedScreen
            onBack={handleBack}
            onUpgrade={() => handleNavigate('subscription')}
            onStartPreview={() => {
              // Activate 48-hour Premier Preview
              const expiryTime = Date.now() + (48 * 60 * 60 * 1000); // 48 hours from now
              setPremierPreviewActive(true);
              setPremierPreviewExpiry(expiryTime);
              setPremierPreviewLastUsed(Date.now());
              
              // Temporarily upgrade to premium tier
              setSubscriptionTier('premium');
              
              // Go back to previous screen
              handleBack();
            }}
          />
        );
      default:
        return <WelcomeScreen onStart={() => setCurrentScreen('onboarding')} />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <FloatingHearts />
      
      {/* Self-Assessment Reminder Banner */}
      {showReminderBanner && userProfile && (
        <SelfAssessmentReminderBanner
          progress={userProfile.selfAssessmentProgress || 0}
          onComplete={() => {
            setShowReminderBanner(false);
            setCurrentScreen('blueprintQuestionnaire');
          }}
          onDismiss={() => {
            setShowReminderBanner(false);
            // Update last reminder time
            setUserProfile({
              ...userProfile,
              lastAssessmentReminder: new Date().toISOString()
            });
          }}
        />
      )}
      
      {/* Assessment Blocked Modal */}
      {showAssessmentBlockedModal && userProfile && (
        <AssessmentBlockedModal
          progress={userProfile.selfAssessmentProgress || 0}
          onComplete={() => {
            setShowAssessmentBlockedModal(false);
            setCurrentScreen('blueprintQuestionnaire');
          }}
          onCancel={() => {
            setShowAssessmentBlockedModal(false);
          }}
        />
      )}
      
      {renderScreen()}
    </div>
  );
}