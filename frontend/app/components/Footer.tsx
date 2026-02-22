'use client';

import { useTranslation } from '../lib/useTranslation';

interface FooterProps {
  language: 'en' | 'hi';
  isDarkTheme: boolean;
}

export default function Footer({ language, isDarkTheme }: FooterProps) {
  const { t } = useTranslation(language);

  // Quick links data
  const quickLinks = [
    { id: 'checkStatus', icon: '🔍', title: 'Check Application Status', description: 'Track your job card application progress' },
    { id: 'downloadForm', icon: '📄', title: 'Download Forms', description: 'Get application forms and guidelines' },
    { id: 'contactSupport', icon: '📞', title: 'Contact Support', description: 'Get help from our support team' },
    { id: 'faq', icon: '❓', title: 'FAQ', description: 'Find answers to common questions' }
  ];

  // Resources data
  const resources = [
    'documentation', 'guidelines', 'trainingMaterials', 'reports'
  ];

  // Social media data
  const socialMedia = [
    'facebook', 'twitter', 'youtube', 'instagram', 'linkedin'
  ];

  return (
    <footer className={`py-16 px-8 mt-20 ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-xl' : 'bg-white/90 backdrop-blur-lg shadow-xl'} transition-colors duration-300`}>
      <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <h3 className="text-xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('quickLinks')}
          </h3>
          <ul className="space-y-4 font-medium text-lg">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`hover:underline transition-colors duration-300 ${
                    isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-700'
                  }`}
                >
                  {t(link.title as any)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('resources')}
          </h3>
          <ul className="space-y-4 font-medium text-lg">
            {resources.map((resource: any, index: number) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`hover:underline transition-colors duration-300 ${
                    isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-700'
                  }`}
                >
                  {t(resource as any)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('contactUs')}
          </h3>
          <address className="not-italic space-y-2 text-lg font-normal select-text">
            <p>{t('ministry')}</p>
            <p>{t('government')}</p>
            <p>{t('address')}</p>
            <p className="pt-2">
              <a 
                href="mailto:info@smartrozgar.gov.in" 
                className={`hover:underline transition-colors duration-300 ${
                  isDarkTheme ? 'text-indigo-400 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-900'
                }`}
              >
                {t('email')}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="text-xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('followUs')}
          </h3>
          <div className="flex gap-6">
            {socialMedia.map((social: any, index: number) => (
              <a 
                key={index} 
                href="#" 
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-125 ${
                  isDarkTheme 
                    ? 'bg-indigo-900/70 text-indigo-300 hover:bg-indigo-700' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-300'
                }`}
                aria-label={t(social as any)}
              >
                <span className="font-extrabold select-none">{social.charAt(0).toUpperCase()}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-indigo-200/30 dark:border-indigo-700 mt-16 pt-12 text-center">
        <p className={isDarkTheme ? 'text-indigo-400 select-text' : 'text-indigo-700 select-text'}>
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
}