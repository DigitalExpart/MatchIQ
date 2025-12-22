import { useState } from 'react';
import { PassportTier } from '../passport/PassportTierBadge';
import { PassportLauncherScreen } from './PassportLauncherScreen';
import { PassportQuestionnaireScreen, PassportAnswers } from './PassportQuestionnaireScreen';
import { PassportCardScreen } from './PassportCardScreen';
import { PassportScanResultScreen } from './PassportScanResultScreen';
import { generatePassportInsights } from '../../utils/passportAI';

type PassportScreen = 'launcher' | 'questionnaire' | 'card' | 'scan-result';

interface PassportDemoContainerProps {
  onBack: () => void;
  userName?: string;
  userTier?: 'free' | 'premier' | 'elite';
}

export function PassportDemoContainer({
  onBack,
  userName = 'Demo User',
  userTier = 'elite', // Set to elite for demo purposes
}: PassportDemoContainerProps) {
  const [currentScreen, setCurrentScreen] = useState<PassportScreen>('launcher');
  const [selectedTier, setSelectedTier] = useState<PassportTier>('lite');
  const [passportAnswers, setPassportAnswers] = useState<PassportAnswers>({});

  const handleStartPassport = (tier: PassportTier) => {
    setSelectedTier(tier);
    setCurrentScreen('questionnaire');
  };

  const handleQuestionnaireComplete = (answers: PassportAnswers) => {
    setPassportAnswers(answers);
    setCurrentScreen('card');
  };

  const handleEditPassport = () => {
    setCurrentScreen('questionnaire');
  };

  const handleSharePassport = () => {
    // Simulate scanning by showing the scan result screen
    setCurrentScreen('scan-result');
  };

  const handleBackFromCard = () => {
    setCurrentScreen('launcher');
  };

  const handleBackFromQuestionnaire = () => {
    setCurrentScreen('launcher');
  };

  const handleBackFromScanResult = () => {
    setCurrentScreen('card');
  };

  // Generate insights for scan result
  const insights = generatePassportInsights(selectedTier, passportAnswers);

  return (
    <>
      {currentScreen === 'launcher' && (
        <PassportLauncherScreen
          onStartPassport={handleStartPassport}
          onBack={onBack}
          userTier={userTier}
        />
      )}

      {currentScreen === 'questionnaire' && (
        <PassportQuestionnaireScreen
          tier={selectedTier}
          onComplete={handleQuestionnaireComplete}
          onBack={handleBackFromQuestionnaire}
          existingAnswers={passportAnswers}
        />
      )}

      {currentScreen === 'card' && (
        <PassportCardScreen
          tier={selectedTier}
          answers={passportAnswers}
          userName={userName}
          onBack={handleBackFromCard}
          onEdit={handleEditPassport}
          onShare={handleSharePassport}
        />
      )}

      {currentScreen === 'scan-result' && (
        <PassportScanResultScreen
          tier={selectedTier}
          insights={insights}
          userName={userName}
          onBack={handleBackFromScanResult}
        />
      )}
    </>
  );
}
