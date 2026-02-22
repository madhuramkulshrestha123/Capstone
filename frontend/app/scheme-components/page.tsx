'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SchemeComponents() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  // Handle navigation
  const handleNavClick = (item: string) => {
    switch(item) {
      case 'aboutMinistry':
        window.location.href = '/about-ministry';
        break;
      case 'aboutScheme':
        window.location.href = '/about-scheme';
        break;
      case 'keyFeatures':
        window.location.href = '/key-features';
        break;
      case 'schemeComponents':
        window.location.href = '/scheme-components';
        break;
      case 'mobileApps':
        window.location.href = '/mobile-apps';
        break;
      case 'raiseComplaint':
        window.location.href = '/raise-complaint';
        break;
      case 'login':
        window.location.href = '/auth';
        break;
      default:
        window.location.href = '/dashboard';
        break;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'}`}>
      <Header 
        language={language}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        toggleLanguage={toggleLanguage}
        showSearch={true}
        showBackButton={false}
        showNavigation={true}
        onNavClick={handleNavClick}
      />

      <main className="container max-w-7xl mx-auto px-6 py-10 space-y-14">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t('schemeComponents')}
          </h1>
          <p className="text-2xl font-light max-w-3xl mx-auto">
            {t('schemeComponentsDesc')}
          </p>
        </section>

        {/* Main Components */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">{t('coreComponents')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('jobCardSystem')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('workDemand')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('planningImplementation')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('wagePayment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('socialAudit')}</span>
              </li>
            </ul>
          </div>
          
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-purple-700">{t('governanceStructure')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('gramSabha')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('gpMonitoring')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('stateOversight')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('centralMonitoring')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How it Works */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('howSchemeWorks')}</h2>
          <div className="flex flex-col space-y-6">
            {[
              { step: '1', title: t('jobCardApplication'), desc: t('jobCardApplicationDesc') },
              { step: '2', title: t('workDemandFiling'), desc: t('workDemandFilingDesc') },
              { step: '3', title: t('gpPlanning'), desc: t('gpPlanningDesc') },
              { step: '4', title: t('workAllocation'), desc: t('workAllocationDesc') },
              { step: '5', title: t('workExecution'), desc: t('workExecutionDesc') },
              { step: '6', title: t('paymentProcessing'), desc: t('paymentProcessingDesc') }
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer language={language} isDarkTheme={isDarkTheme} />
    </div>
  );
}
