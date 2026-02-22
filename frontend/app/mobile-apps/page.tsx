'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MobileApps() {
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

  const apps = [
    {
      title: 'workerApp',
      description: 'workerAppDesc',
      userType: 'workers',
      platforms: ['android', 'web'],
      features: ['attendance', 'paymentStatus', 'workHistory', 'complaints'],
      icon: (
        <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      screenshots: ['/images/worker-app-1.jpg', '/images/worker-app-2.jpg', '/images/worker-app-3.jpg']
    },
    {
      title: 'supervisorApp',
      description: 'supervisorAppDesc',
      userType: 'supervisors',
      platforms: ['android', 'web'],
      features: ['attendanceMarking', 'workerManagement', 'projectTracking', 'reports'],
      icon: (
        <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      screenshots: ['/images/supervisor-app-1.jpg', '/images/supervisor-app-2.jpg']
    },
    {
      title: 'adminApp',
      description: 'adminAppDesc',
      userType: 'administrators',
      platforms: ['web'],
      features: ['dashboard', 'analytics', 'userManagement', 'paymentProcessing'],
      icon: (
        <svg className="w-16 h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.545-.825 3.098-1.65 4.653-2.475a1.724 1.724 0 001.065-2.572c-1.756-.426-3.098.89-3.098 2.573 0 1.683 1.342 2.999 3.098 2.573a1.724 1.724 0 001.066-2.573c-.925-1.552-1.751-3.104-2.475-4.653a1.724 1.724 0 00-2.573-1.066c-1.545.825-3.098 1.65-4.653 2.475a1.724 1.724 0 00-1.065 2.572c1.756.426 3.098-.89 3.098-2.573 0-1.683-1.342-2.999-3.098-2.573a1.724 1.724 0 00-1.066 2.573c.925 1.552 1.751 3.104 2.475 4.653z" />
        </svg>
      ),
      screenshots: ['/images/admin-app-1.jpg', '/images/admin-app-2.jpg', '/images/admin-app-3.jpg']
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
            {t('mobileApps')}
          </h1>
          <p className="text-2xl font-light max-w-3xl mx-auto">
            {t('mobileAppsDescription')}
          </p>
        </section>

        {/* Apps Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {apps.map((app, index) => (
            <div 
              key={index} 
              className={`rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'
              }`}
            >
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  {app.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-indigo-700">
                  {t(app.title as any)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  {t(app.description as any)}
                </p>
                
                <div className={`text-center text-sm px-3 py-2 rounded-full inline-block mb-6 ${
                  isDarkTheme ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {t('for')} {t(app.userType as any)}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-center">{t('platforms')}</h4>
                  <div className="flex justify-center space-x-3">
                    {app.platforms.map((platform, idx) => (
                      <span 
                        key={idx} 
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {platform === 'android' ? '📱 Android' : '💻 Web'}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-center">{t('keyFeatures')}</h4>
                  <ul className="space-y-2">
                    {app.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">{t(feature as any)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className={`p-4 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                <button className={`w-full py-3 rounded-lg font-semibold ${
                  isDarkTheme 
                    ? 'bg-indigo-700 text-white hover:bg-indigo-600' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } transition-colors`}>
                  {t('downloadApp')}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Screenshots Section */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('appScreenshots')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('attendanceMarking')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('attendanceMarkingDesc')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('paymentStatus')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('paymentStatusDesc')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('complaintTracking')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('complaintTrackingDesc')}</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">{t('benefitsForWorkers')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('anytimeAccess')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('realTimeUpdates')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('easyNavigation')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                <span>{t('multilingualSupport')}</span>
              </li>
            </ul>
          </div>
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 text-purple-700">{t('benefitsForAuthorities')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('efficientMonitoring')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('reducedPaperwork')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('fasterProcessing')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 text-xl">✓</span>
                <span>{t('betterTransparency')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Download CTA */}
        <section className={`p-16 rounded-3xl shadow-xl text-center ${isDarkTheme ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} text-white`}>
          <h2 className="text-4xl font-bold mb-6">{t('downloadOurApps')}</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            {t('downloadAppsDescription')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.25 14.25v-2.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v2.5a.75.75 0 00.75.75h3a.75.75 0 00.75-.75zM12 2.25a.75.75 0 01.75.75v9.5a.75.75 0 01-1.5 0v-9.5A.75.75 0 0112 2.25z"/>
                <path fillRule="evenodd" d="M12 15a3 3 0 100-6 3 3 0 000 6zm-5.25 3a.75.75 0 01.75-.75h9.5a.75.75 0 010 1.5h-9.5a.75.75 0 01-.75-.75z" clipRule="evenodd"/>
              </svg>
              {t('downloadAndroid')}
            </button>
            <button className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {t('downloadWeb')}
            </button>
          </div>
        </section>

        {/* Support Section */}
        <section className={`p-10 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('needHelp')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('callSupport')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('tollFreeNumber')}</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('emailSupport')}</h3>
              <p className="text-gray-600 dark:text-gray-300">support@smartrozgar.gov.in</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a1 1 0 001-1V9a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('chatSupport')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('available247')}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer language={language} isDarkTheme={isDarkTheme} />
    </div>
  );
}