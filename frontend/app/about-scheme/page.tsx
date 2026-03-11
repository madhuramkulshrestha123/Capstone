'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutScheme() {
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

      <main className="container max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-14">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent px-4">
            {t('aboutTheScheme')}
          </h1>
          <p className="text-base md:text-2xl font-light max-w-3xl mx-auto px-4">
            {t('smartRozgarDescription')}
          </p>
        </section>

        {/* Introduction */}
        <section className={`p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-700">{t('introduction')}</h2>
          <p className="text-sm md:text-lg leading-relaxed">
            {t('schemeIntroduction')}
          </p>
        </section>

        {/* Why the Scheme */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-700">{t('whyTheScheme')}</h2>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('ruralUnemployment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('seasonalMigration')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('incomeInequality')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('infrastructureDevelopment')}</span>
              </li>
            </ul>
          </div>
          <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-purple-700">{t('whoCanBenefit')}</h2>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('ruralHouseholds')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('unskilledWorkers')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('womenWorkers')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('scStWorkers')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Types of Work */}
        <section className={`p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-indigo-700">{t('typesOfWork')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">{t('waterConservation')}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{t('waterConservationDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">{t('ruralConnectivity')}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{t('ruralConnectivityDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">{t('ruralInfrastructure')}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{t('ruralInfrastructureDesc')}</p>
            </div>
          </div>
        </section>

        {/* Duration & Guarantees */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-700">{t('durationGuarantees')}</h2>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 font-bold text-base md:text-lg">100</span>
                <span className="text-sm md:text-base">{t('daysOfEmployment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 font-bold text-base md:text-lg">15</span>
                <span className="text-sm md:text-base">{t('daysPaymentRule')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 font-bold text-base md:text-lg">₹374</span>
                <span className="text-sm md:text-base">{t('minimumWage')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 font-bold text-base md:text-lg">5</span>
                <span className="text-sm md:text-base">{t('kilometerRule')}</span>
              </li>
            </ul>
          </div>
          <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-purple-700">{t('paymentAssurance')}</h2>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm md:text-base">{t('directBankTransfer')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm md:text-base">{t('transparency')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm md:text-base">{t('grievanceRedressal')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm md:text-base">{t('socialAudit')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Visualization */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('howItWorks')}</h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-4">
            {[
              { step: '1', title: t('register'), desc: t('registerDesc') },
              { step: '2', title: t('work'), desc: t('workDesc') },
              { step: '3', title: t('attendance'), desc: t('attendanceDesc') },
              { step: '4', title: t('payment'), desc: t('paymentDesc') }
            ].map((item, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-12 h-1 bg-indigo-300"></div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer language={language} isDarkTheme={isDarkTheme} />
    </div>
  );
}