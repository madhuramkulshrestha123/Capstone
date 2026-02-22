'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function KeyFeatures() {
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

  const features = [
    {
      title: 'guaranteedEmployment',
      description: 'guaranteedEmploymentDesc',
      icon: (
        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'digitalAttendance',
      description: 'digitalAttendanceDesc',
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'timelyPayment',
      description: 'timelyPaymentDesc',
      icon: (
        <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'bankLinkedPayments',
      description: 'bankLinkedPaymentsDesc',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      title: 'transparencyAudits',
      description: 'transparencyAuditsDesc',
      icon: (
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: 'grievanceRedressal',
      description: 'grievanceRedressalDesc',
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

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
            {t('keyFeatures')}
          </h1>
          <p className="text-2xl font-light max-w-3xl mx-auto">
            {t('keyFeaturesDescription')}
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-3xl shadow-xl transition-transform duration-300 hover:scale-105 ${
                isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'
              }`}
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-indigo-700">
                {t(feature.title as any)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {t(feature.description as any)}
              </p>
            </div>
          ))}
        </section>

        {/* Comparison Table */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('comparison')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <th className="p-4 text-left font-semibold">{t('feature')}</th>
                  <th className="p-4 text-center font-semibold">{t('traditionalSystem')}</th>
                  <th className="p-4 text-center font-semibold text-green-600">{t('smartRozgaar')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'registration', traditional: 'manual', smart: 'digital' },
                  { feature: 'attendance', traditional: 'paperBased', smart: 'mobileDigital' },
                  { feature: 'payment', traditional: 'cashDelayed', smart: 'directTransfer' },
                  { feature: 'transparency', traditional: 'limited', smart: 'realTime' },
                  { feature: 'grievance', traditional: 'slow', smart: 'fastResolution' },
                  { feature: 'monitoring', traditional: 'manual', smart: 'automated' }
                ].map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} ${
                      index % 2 === 0 ? (isDarkTheme ? 'bg-gray-800/50' : 'bg-gray-50/50') : ''
                    }`}
                  >
                    <td className="p-4 font-medium">{t(item.feature as any)}</td>
                    <td className="p-4 text-center">{t(item.traditional as any)}</td>
                    <td className="p-4 text-center font-semibold text-green-600">{t(item.smart as any)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">{t('benefitsForWorkers')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('assuredIncome')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('dignityRespect')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('skillDevelopment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('financialSecurity')}</span>
              </li>
            </ul>
          </div>
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-purple-700">{t('benefitsForSociety')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('ruralDevelopment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('womenEmpowerment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('assetCreation')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('socialCohesion')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Statistics */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('impactStatistics')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 mb-2">100+</div>
              <div className="text-lg font-medium">{t('daysGuaranteed')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">15</div>
              <div className="text-lg font-medium">{t('paymentDays')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-pink-600 mb-2">₹374</div>
              <div className="text-lg font-medium">{t('minWage')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-lg font-medium">{t('satisfactionRate')}</div>
            </div>
          </div>
        </section>
      </main>

      <Footer language={language} isDarkTheme={isDarkTheme} />
    </div>
  );
}