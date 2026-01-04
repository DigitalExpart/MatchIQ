import { useState } from 'react';
import { ArrowRight, ArrowLeft, Heart, Globe } from 'lucide-react';
import { UserProfile } from '../../App';
import { Logo } from '../Logo';
import { LanguageSelector } from '../LanguageSelector';
import { useLanguage, LANGUAGES, Language } from '../../contexts/LanguageContext';

interface OnboardingScreenProps {
  onComplete: (datingGoal: UserProfile['datingGoal']) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { t, setLanguage } = useLanguage();
  const [step, setStep] = useState(0);
  const [datingGoal, setDatingGoal] = useState<UserProfile['datingGoal'] | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const steps = [
    {
      icon: 'logo' as const,
      title: t('onboarding.welcome'),
      description: t('onboarding.welcomeDesc'),
    },
    {
      icon: Globe,
      title: t('onboarding.languageTitle'),
      description: t('onboarding.languageDesc'),
    },
    {
      icon: Heart,
      title: t('onboarding.datingGoal'),
      description: t('onboarding.datingGoalDesc'),
    },
  ];

  const handleNext = () => {
    if (step === 1) {
      // Apply selected language
      setLanguage(selectedLanguage);
      setStep(2);
    } else if (step === 2 && datingGoal) {
      // After dating goal, go to sign up
      onComplete(datingGoal);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentStep = steps[step];
  const Icon = typeof currentStep.icon === 'string' ? null : currentStep.icon;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 w-full max-w-full">
      {/* Floating hearts decoration */}
      <div className="absolute top-20 right-12 animate-float-heart opacity-30">
        <Heart className="w-16 h-16 text-rose-400/50 fill-rose-300/40" />
      </div>
      <div className="absolute bottom-40 left-10 animate-float-heart opacity-30" style={{ animationDelay: '2s' }}>
        <Heart className="w-12 h-12 text-pink-400/50 fill-pink-300/40" />
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 relative z-10 w-full">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col px-6 py-12 max-w-md mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 animate-gentle-pulse">
            {Icon ? <Icon className="w-10 h-10 text-rose-600 mx-auto" /> : <Logo size={48} />}
          </div>
          <h2 className="text-2xl text-gray-900 mb-3 romantic-title">{steps[step].title}</h2>
          <p className="text-gray-600">{steps[step].description}</p>
        </div>

        {/* Content */}
        <div className="flex-1">
          {step === 0 && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-gray-900 mb-2">{t('onboarding.howItWorks')}</h3>
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-xs">1</span>
                    <span>{t('onboarding.step1')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-xs">2</span>
                    <span>{t('onboarding.step2')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-xs">3</span>
                    <span>{t('onboarding.step3')}</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <button
                onClick={() => setDatingGoal('casual')}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  datingGoal === 'casual'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 bg-white hover:border-rose-300'
                }`}
              >
                <h3 className="text-gray-900 mb-1">{t('onboarding.casualTitle')}</h3>
                <p className="text-sm text-gray-600">{t('onboarding.casualDesc')}</p>
              </button>

              <button
                onClick={() => setDatingGoal('serious')}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  datingGoal === 'serious'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 bg-white hover:border-rose-300'
                }`}
              >
                <h3 className="text-gray-900 mb-1">{t('onboarding.seriousTitle')}</h3>
                <p className="text-sm text-gray-600">{t('onboarding.seriousDesc')}</p>
              </button>

              <button
                onClick={() => setDatingGoal('long-term')}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  datingGoal === 'long-term'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 bg-white hover:border-rose-300'
                }`}
              >
                <h3 className="text-gray-900 mb-1">{t('onboarding.longTermTitle')}</h3>
                <p className="text-sm text-gray-600">{t('onboarding.longTermDesc')}</p>
              </button>

              <button
                onClick={() => setDatingGoal('marriage')}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  datingGoal === 'marriage'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 bg-white hover:border-rose-300'
                }`}
              >
                <h3 className="text-gray-900 mb-1">{t('onboarding.marriageTitle')}</h3>
                <p className="text-sm text-gray-600">{t('onboarding.marriageDesc')}</p>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white text-gray-700 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('common.back')}</span>
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 2 && !datingGoal}
            className={`flex-1 px-6 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
              step === 2 && !datingGoal
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <span>{t('common.continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}