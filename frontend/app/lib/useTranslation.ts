import { translations, Language, TranslationKey } from './translations';

export function useTranslation(language: Language = 'en') {
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  // Function to replace placeholders in translations
  const tWithParams = (key: TranslationKey, params: Record<string, string | number> = {}): string => {
    let translation = t(key);
    
    // Replace placeholders like {index} with actual values
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, String(params[param]));
    });
    
    return translation;
  };

  return { t, tWithParams };
}