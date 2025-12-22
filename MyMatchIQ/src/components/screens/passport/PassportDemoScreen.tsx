import { useState } from 'react';
import { PassportCreationScreen } from './PassportCreationScreen';
import { QRPassportDisplayScreen } from './QRPassportDisplayScreen';
import { ScanPassportScreen } from './ScanPassportScreen';
import { PassportInsightScreen } from './PassportInsightScreen';
import { RequestPendingScreen } from './RequestPendingScreen';
import { CompatibilityAcceptedScreen } from './CompatibilityAcceptedScreen';
import { ReflectionWeekDashboard } from './ReflectionWeekDashboard';
import { QuestionSelectionScreen } from './QuestionSelectionScreen';
import { AnswerComparisonScreen } from './AnswerComparisonScreen';
import { ReflectionSummaryScreen } from './ReflectionSummaryScreen';
import { GraduationScreen } from './GraduationScreen';
import { One2OneLoveHandoffScreen } from './One2OneLoveHandoffScreen';

type PassportFlow =
  | 'creation'
  | 'qr-display'
  | 'scan'
  | 'insight'
  | 'pending'
  | 'accepted'
  | 'reflection-dashboard'
  | 'question-selection'
  | 'answer-comparison'
  | 'summary'
  | 'graduation'
  | 'one2one-handoff';

interface PassportDemoScreenProps {
  onBack: () => void;
}

export function PassportDemoScreen({ onBack }: PassportDemoScreenProps) {
  const [currentFlow, setCurrentFlow] = useState<PassportFlow>('creation');
  const [qrToken, setQrToken] = useState('');
  const [currentDay, setCurrentDay] = useState(3);
  const [questionsAskedToday, setQuestionsAskedToday] = useState(1);

  // Mock user data
  const userName = 'Alex';
  const partnerName = 'Jordan';

  // Mock answer data
  const mockAnswers = [
    {
      questionId: 'q1',
      question: 'What are you primarily looking for right now?',
      userAnswer: 'Long-term relationship',
      partnerAnswer: 'Long-term relationship',
      alignment: 'aligned' as const,
    },
    {
      questionId: 'q2',
      question: 'How do you prefer to handle disagreements?',
      userAnswer: 'Talk immediately',
      partnerAnswer: 'Take time to think',
      alignment: 'different' as const,
    },
    {
      questionId: 'q3',
      question: 'How important is personal space to you?',
      userAnswer: 'Very important',
      partnerAnswer: 'Somewhat important',
      alignment: 'discuss' as const,
    },
  ];

  // Handlers
  const handleGenerateQR = () => {
    const token = `matchiq-passport-${Date.now()}`;
    setQrToken(token);
    setCurrentFlow('qr-display');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My MatchIQ Compatibility Passport',
        text: 'Scan my Compatibility Passport to explore our connection',
        url: window.location.href,
      });
    } else {
      alert('Share functionality would open native share dialog');
    }
  };

  const handleRegenerate = () => {
    const token = `matchiq-passport-${Date.now()}`;
    setQrToken(token);
  };

  const handleRevoke = () => {
    if (confirm('Are you sure you want to revoke your QR Passport?')) {
      setQrToken('');
      setCurrentFlow('creation');
    }
  };

  const handleScanSuccess = (data: string) => {
    setCurrentFlow('insight');
  };

  const handleRequestReview = () => {
    setCurrentFlow('pending');
    // Simulate acceptance after 3 seconds
    setTimeout(() => {
      setCurrentFlow('accepted');
    }, 3000);
  };

  const handleDecline = () => {
    alert('Declined silently');
    setCurrentFlow('creation');
  };

  const handleBeginReflectionWeek = () => {
    setCurrentFlow('reflection-dashboard');
  };

  const handleSelectQuestions = () => {
    setCurrentFlow('question-selection');
  };

  const handleSendQuestions = (questionIds: string[]) => {
    setQuestionsAskedToday(questionsAskedToday + questionIds.length);
    setCurrentFlow('reflection-dashboard');
  };

  const handleViewAnswers = () => {
    setCurrentFlow('answer-comparison');
  };

  const handleContinueToSummary = () => {
    setCurrentFlow('summary');
  };

  const handleContinueToGraduation = () => {
    setCurrentFlow('graduation');
  };

  const handleContinueToOne2One = () => {
    setCurrentFlow('one2one-handoff');
  };

  const handleEndRespectfully = () => {
    alert('Ended respectfully. Both parties notified.');
    setCurrentFlow('creation');
  };

  const handleOpenOne2OneLove = () => {
    alert('Opening One2One Love (would launch new feature)');
    onBack();
  };

  // Render current flow
  switch (currentFlow) {
    case 'creation':
      return (
        <PassportCreationScreen
          userName={userName}
          onGenerateQR={handleGenerateQR}
          onBack={onBack}
        />
      );

    case 'qr-display':
      return (
        <QRPassportDisplayScreen
          qrValue={qrToken}
          onShare={handleShare}
          onRegenerate={handleRegenerate}
          onRevoke={handleRevoke}
          onBack={() => setCurrentFlow('creation')}
        />
      );

    case 'scan':
      return (
        <ScanPassportScreen
          onScanSuccess={handleScanSuccess}
          onBack={onBack}
        />
      );

    case 'insight':
      return (
        <PassportInsightScreen
          partnerName={partnerName}
          onRequestReview={handleRequestReview}
          onDecline={handleDecline}
          onBack={() => setCurrentFlow('scan')}
        />
      );

    case 'pending':
      return (
        <RequestPendingScreen
          partnerName={partnerName}
          onBack={onBack}
        />
      );

    case 'accepted':
      return (
        <CompatibilityAcceptedScreen
          partnerName={partnerName}
          onBeginReflectionWeek={handleBeginReflectionWeek}
        />
      );

    case 'reflection-dashboard':
      return (
        <ReflectionWeekDashboard
          partnerName={partnerName}
          currentDay={currentDay}
          questionsAskedToday={questionsAskedToday}
          questionsReceivedToday={2}
          maxQuestionsPerDay={3}
          onSelectQuestions={handleSelectQuestions}
          onViewAnswers={handleViewAnswers}
          onBack={onBack}
        />
      );

    case 'question-selection':
      return (
        <QuestionSelectionScreen
          partnerName={partnerName}
          questionsRemaining={3 - questionsAskedToday}
          onSendQuestions={handleSendQuestions}
          onBack={() => setCurrentFlow('reflection-dashboard')}
        />
      );

    case 'answer-comparison':
      return (
        <AnswerComparisonScreen
          partnerName={partnerName}
          answers={mockAnswers}
          onBack={() => setCurrentFlow('reflection-dashboard')}
        />
      );

    case 'summary':
      return (
        <ReflectionSummaryScreen
          partnerName={partnerName}
          onContinue={handleContinueToGraduation}
          onBack={() => setCurrentFlow('reflection-dashboard')}
        />
      );

    case 'graduation':
      return (
        <GraduationScreen
          partnerName={partnerName}
          onContinueToOne2One={handleContinueToOne2One}
          onEndRespectfully={handleEndRespectfully}
        />
      );

    case 'one2one-handoff':
      return (
        <One2OneLoveHandoffScreen
          partnerName={partnerName}
          onOpenOne2OneLove={handleOpenOne2OneLove}
        />
      );

    default:
      return null;
  }
}
