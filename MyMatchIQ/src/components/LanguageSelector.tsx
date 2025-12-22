import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES, Language } from '../contexts/LanguageContext';

// Languages that are coming soon
const COMING_SOON_LANGUAGES: Language[] = ['de', 'it'];

// Custom flag components using CSS
const FlagIcon = ({ code }: { code: string }) => {
  switch (code) {
    case 'en': // USA flag stripes
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden relative shadow-md">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
          </div>
          <div className="absolute top-0 left-0 w-4 h-4 bg-blue-700"></div>
        </div>
      );
    case 'es': // Spain flag
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
          <div className="flex flex-col h-full">
            <div className="h-1/4 bg-red-600"></div>
            <div className="h-2/4 bg-yellow-400"></div>
            <div className="h-1/4 bg-red-600"></div>
          </div>
        </div>
      );
    case 'fr': // France flag
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
          <div className="flex h-full">
            <div className="w-1/3 bg-blue-600"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-red-600"></div>
          </div>
        </div>
      );
    case 'pt': // Portuguese/Brazilian flag
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
          <div className="flex flex-col h-full bg-green-600">
            <div className="w-full h-full bg-yellow-400 relative flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            </div>
          </div>
        </div>
      );
    case 'de': // Germany flag
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
          <div className="flex flex-col h-full">
            <div className="h-1/3 bg-black"></div>
            <div className="h-1/3 bg-red-600"></div>
            <div className="h-1/3 bg-yellow-400"></div>
          </div>
        </div>
      );
    case 'it': // Italy flag
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
          <div className="flex h-full">
            <div className="w-1/3 bg-green-600"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-red-600"></div>
          </div>
        </div>
      );
    default:
      return <div className="w-8 h-8 rounded-full bg-gray-300"></div>;
  }
};

interface LanguageSelectorProps {
  selectedLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps = {}) {
  const { language: contextLanguage, setLanguage: contextSetLanguage } = useLanguage();
  
  // Use controlled mode if props provided, otherwise use context
  const currentLanguage = selectedLanguage ?? contextLanguage;
  const handleLanguageChange = onLanguageChange ?? contextSetLanguage;

  return (
    <>
      <div className="grid grid-cols-5 gap-3">
        {LANGUAGES.map((lang) => {
          const isComingSoon = COMING_SOON_LANGUAGES.includes(lang.code);
          const isDisabled = isComingSoon;
          
          return (
            <button
              key={lang.code}
              onClick={() => !isDisabled && handleLanguageChange(lang.code)}
              disabled={isDisabled}
              className={`p-3 rounded-xl transition-all text-center relative overflow-hidden ${
                isDisabled
                  ? 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed opacity-60'
                  : currentLanguage === lang.code
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-xl scale-105'
                  : 'bg-white border-2 border-rose-100 hover:border-rose-300 hover:shadow-md'
              }`}
            >
              {/* Coming Soon watermark at 45 degrees */}
              {isComingSoon && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div 
                    className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded whitespace-nowrap shadow-sm"
                    style={{ transform: 'rotate(-45deg)' }}
                  >
                    Coming soon!
                  </div>
                </div>
              )}
              
              {/* Flag Icon */}
              <div className={`flex justify-center mb-2 ${isComingSoon ? 'opacity-40' : ''}`}>
                <FlagIcon code={lang.code} />
              </div>
              <div className={`text-xs font-medium ${
                isComingSoon 
                  ? 'text-gray-400'
                  : currentLanguage === lang.code 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}>
                {lang.label}
              </div>
              {/* Selection indicator */}
              {currentLanguage === lang.code && !isComingSoon && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <div className="text-base font-medium text-gray-900">
          {LANGUAGES.find(l => l.code === currentLanguage)?.name}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {currentLanguage === 'en' && 'All features available in English'}
          {currentLanguage === 'es' && 'Todas las funciones disponibles en español'}
          {currentLanguage === 'fr' && 'Toutes les fonctionnalités disponibles en français'}
          {currentLanguage === 'pt' && 'Todos os recursos disponíveis em português'}
          {currentLanguage === 'de' && 'Coming soon!'}
          {currentLanguage === 'it' && 'Coming soon!'}
        </div>
      </div>
    </>
  );
}