'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function KeyFeatures() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const navItems = [
    'aboutMinistry', 'aboutScheme', 'keyFeatures', 'schemeComponents',
    'mobileApps', 'raiseComplaint', 'login'
  ];

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
      {/* Header */}
      <header className={`py-5 px-4 md:px-6 flex items-center justify-between ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-lg shadow-lg'} transition-colors duration-300`}>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-none hover:opacity-80 transition-opacity"
        >
          {t('smartRozgarPortal')}
        </button>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`md:hidden p-2 rounded-lg ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-5">
          <button 
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${
              isDarkTheme 
                ? 'bg-indigo-700 text-white hover:bg-indigo-800 hover:shadow-xl hover:scale-105' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isDarkTheme ? t('lightMode') : t('darkMode')}
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className={`px-5 py-2 pl-12 rounded-lg border-2 ${
                isDarkTheme 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-indigo-600 focus:border-indigo-400' 
                  : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-indigo-600'
              } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow`}
            />
            <svg 
              className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkTheme ? 'text-indigo-400' : 'text-indigo-500'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${
              isDarkTheme 
                ? 'bg-purple-700 text-white hover:bg-purple-800 hover:shadow-xl hover:scale-105' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-lg hover:scale-105'
            }`}
          >
            {language === 'en' ? t('hindi') : t('english')}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className={`md:hidden fixed inset-0 z-50 ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="text-xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent"
              >
                {t('smartRozgarPortal')}
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`p-2 rounded-lg ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Mobile Controls */}
              <div className="flex flex-col space-y-3 pb-4 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}">
                <button 
                  onClick={() => { setIsDarkTheme(!isDarkTheme); setIsSidebarOpen(false); }}
                  className={`w-full px-5 py-3 rounded-lg font-semibold ${
                    isDarkTheme 
                      ? 'bg-indigo-700 text-white' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {isDarkTheme ? t('lightMode') : t('darkMode')}
                </button>
                <button 
                  onClick={() => { setLanguage(language === 'en' ? 'hi' : 'en'); setIsSidebarOpen(false); }}
                  className={`w-full px-5 py-3 rounded-lg font-semibold ${
                    isDarkTheme 
                      ? 'bg-purple-700 text-white' 
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {language === 'en' ? t('hindi') : t('english')}
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <button 
                    key={index}
                    onClick={() => { handleNavClick(item); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-5 py-3 rounded-lg font-medium transition-colors ${
                      item === 'login'
                        ? isDarkTheme 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-600 text-white'
                        : isDarkTheme 
                          ? 'text-white hover:bg-gray-800' 
                          : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t(item as any)}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <main className="container max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-14">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent px-4">
            {t('keyFeatures')}
          </h1>
          <p className="text-base md:text-2xl font-light max-w-3xl mx-auto px-4">
            {t('keyFeaturesDescription')}
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl transition-transform duration-300 hover:scale-105 ${
                isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'
              }`}
            >
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12">{feature.icon}</div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center text-indigo-700">
                {t(feature.title as any)}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center">
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