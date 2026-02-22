'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutMinistry() {
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
            {t('ministry')}
          </h1>
          <p className="text-2xl font-light max-w-3xl mx-auto">
            {t('empoweringRuralLivelihoods')}
          </p>
        </section>

        {/* Overview Section */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-indigo-700">{t('overview')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('roleOfMinistry')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('roleOfMinistryDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('ruralEmploymentMission')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('ruralEmploymentMissionDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('visionMission')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('visionMissionDesc')}</p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">{t('vision')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>{t('inclusiveGrowth')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>{t('financialTransparency')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span>{t('skillDevelopment')}</span>
              </li>
            </ul>
          </div>
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-purple-700">{t('mission')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>{t('employmentGeneration')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>{t('socialSecurity')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3">✓</span>
                <span>{t('povertyReduction')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('organizationalStructure')}</h2>
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-red-700 font-bold">Central</span>
              </div>
              <p className="font-semibold">{t('centralGovernment')}</p>
            </div>
            <div className="h-16 w-1 bg-gray-300"></div>
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-orange-700 font-bold">State</span>
              </div>
              <p className="font-semibold">{t('stateGovernment')}</p>
            </div>
            <div className="h-16 w-1 bg-gray-300"></div>
            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-yellow-700 font-bold">District</span>
              </div>
              <p className="font-semibold">{t('districtLevel')}</p>
            </div>
            <div className="h-16 w-1 bg-gray-300"></div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-green-700 font-bold">Panchayat</span>
              </div>
              <p className="font-semibold">{t('panchayatLevel')}</p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('milestones')}</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-300"></div>
            <div className="space-y-12">
              {[
                { year: '2005', event: t('mgnregaLaunch') },
                { year: '2010', event: t('digitalInitiative') },
                { year: '2015', event: t('smartRozgaarLaunch') },
                { year: '2020', event: t('mobileAppLaunch') },
                { year: '2025', event: t('aiIntegration') }
              ].map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`inline-block px-4 py-2 rounded-lg ${isDarkTheme ? 'bg-indigo-900 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
                      <span className="font-bold">{item.year}</span>
                    </div>
                    <p className="mt-2">{item.event}</p>
                  </div>
                  <div className="w-4 h-4 bg-indigo-600 rounded-full border-4 border-white relative z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer language={language} isDarkTheme={isDarkTheme} />
    </div>
  );
}