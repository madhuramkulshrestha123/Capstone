'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SchemeComponents() {
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

      {/* Navigation Bar - Desktop Only */}
      <nav className={`hidden md:block py-3 px-6 ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg shadow-inner' : 'bg-white/90 backdrop-blur-lg shadow-inner'} sticky top-0 z-20 transition-colors duration-300`}>
        <ul className="flex flex-wrap justify-center gap-3 md:gap-6 font-medium tracking-wide">
          {navItems.map((item, index) => (
            <li key={index} className="my-2">
              <button 
                onClick={() => handleNavClick(item)}
                className={`px-5 py-2 rounded-lg transition-transform duration-300 ease-in-out hover:scale-110 ${
                  item === 'login' 
                    ? `font-bold ${isDarkTheme 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'}`
                    : isDarkTheme 
                      ? 'text-white hover:bg-indigo-700 hover:shadow-md' 
                      : 'text-gray-900 hover:bg-indigo-200 hover:text-indigo-700 hover:shadow-md'
                }`}
              >
                {t(item as any)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="container max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-14">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent px-4">
            {t('schemeComponents')}
          </h1>
          <p className="text-base md:text-2xl font-light max-w-3xl mx-auto px-4">
            {t('schemeComponentsDesc')}
          </p>
        </section>

        {/* Main Components */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          <div className={`p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-700">{t('coreComponents')}</h2>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('jobCardSystem')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('workDemand')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('planningImplementation')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('wagePayment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('socialAudit')}</span>
              </li>
            </ul>
          </div>
          
          <div className={`p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-purple-700">{t('governanceStructure')}</h2>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('gramSabha')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('gpMonitoring')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('stateOversight')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-lg md:text-xl">✓</span>
                <span className="text-sm md:text-base">{t('centralMonitoring')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How it Works */}
        <section className={`p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-indigo-700">{t('howSchemeWorks')}</h2>
          <div className="flex flex-col space-y-4 md:space-y-6">
            {[
              { step: '1', title: t('jobCardApplication'), desc: t('jobCardApplicationDesc') },
              { step: '2', title: t('workDemandFiling'), desc: t('workDemandFilingDesc') },
              { step: '3', title: t('gpPlanning'), desc: t('gpPlanningDesc') },
              { step: '4', title: t('workAllocation'), desc: t('workAllocationDesc') },
              { step: '5', title: t('workExecution'), desc: t('workExecutionDesc') },
              { step: '6', title: t('paymentProcessing'), desc: t('paymentProcessingDesc') }
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3 md:mr-4 text-sm md:text-base">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{item.desc}</p>
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
