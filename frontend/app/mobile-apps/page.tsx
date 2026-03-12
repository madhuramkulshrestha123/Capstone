'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MobileApps() {
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
    'aboutMinistry',
    'aboutScheme',
    'keyFeatures',
    'schemeComponents',
    'mobileApps',
    'raiseComplaint',
    'login'
  ];

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
                {navItems.map((item: string, index: number) => (
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
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t('mobileApps')}
          </h1>
          <p className="text-base md:text-2xl font-light max-w-3xl mx-auto px-4">
            {t('downloadAppsDescription')}
          </p>
        </section>

        {/* Unified Mobile App Section */}
        <section className="mb-16">
          <div className={`p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Left Side - Content */}
              <div className="space-y-4 md:space-y-6 order-2 lg:order-2">
                <div className="flex items-center space-x-3 md:space-x-4 justify-center md:justify-start">
                  <img 
                    src="/images/apk logo.png" 
                    alt="Smart Rozgaar App Logo" 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/64x64/4F46E5/FFFFFF?text=Logo';
                    }}
                  />
                  <div>
                    <h3 className="text-lg md:text-2xl font-bold">Smart Rozgaar App</h3>
                    <p className={`text-xs md:text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Version 1.0.0 | 6 MB</p>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                      isDarkTheme ? 'bg-indigo-700' : 'bg-indigo-100'
                    }`}>
                      <svg className={`w-3 h-3 md:w-5 md:h-5 ${isDarkTheme ? 'text-white' : 'text-indigo-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-xs md:text-sm flex-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>For Workers & Supervisors:</strong> Single app for all field operations and management
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                      isDarkTheme ? 'bg-purple-700' : 'bg-purple-100'
                    }`}>
                      <svg className={`w-3 h-3 md:w-5 md:h-5 ${isDarkTheme ? 'text-white' : 'text-purple-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-xs md:text-sm flex-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Digital Attendance:</strong> Mark attendance on-site with GPS verification and OTP
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                      isDarkTheme ? 'bg-pink-700' : 'bg-pink-100'
                    }`}>
                      <svg className={`w-3 h-3 md:w-5 md:h-5 ${isDarkTheme ? 'text-white' : 'text-pink-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-xs md:text-sm flex-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Real-time Payments:</strong> Track wage payments and view payment history anytime
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                      isDarkTheme ? 'bg-blue-700' : 'bg-blue-100'
                    }`}>
                      <svg className={`w-3 h-3 md:w-5 md:h-5 ${isDarkTheme ? 'text-white' : 'text-blue-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className={`text-xs md:text-sm flex-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Multilingual Support:</strong> Available in English and Hindi for easy accessibility
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/Smart_Rozgaar_1.0.0.apk';
                    link.download = 'Smart_Rozgaar_1.0.0.apk';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full px-6 py-3 md:px-8 md:py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 flex items-center justify-center space-x-2 md:space-x-3 cursor-pointer"
                >
                  <img 
                    src="/images/apk.png" 
                    alt="Android APK" 
                    className="w-5 h-5 md:w-6 md:h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xNy41MjMgMTUuMzQxNGMtLjU1MTEgMC0uOTk5My0uMDAyNy0xLjQzMjItLjAyMzktMS40MjkzLS4wNjk0LTIuNzQwOS0uNDE2My0zLjkzMjctMS4yMjUzLS4yNTcxLS4xNzQzLS40ODU1LS4zNzU2LS42ODI4LS42MTczLS4wMzQ3LS4wNDI2LS4wNzA5LS4wODQ1LS4xMTE0LS4xMzA4LS4wMzc5LjA0NDItLjA3MjYuMDg0OS0uMTA4NS4xMjYxLS4yMDI1LjIzMjgtLjQzMTkuNDI3Mi0uNjg5Ni41OTU4LTEuMTg4OS43NzY3LTIuNDk3OSAxLjExMzctMy45MjQxIDEuMTc5Mi0uNDM1LjAyMDEtLjg4NTMuMDIwNC0xLjQzODYuMDIwNC0uMjIxMyAwLS40NDI2LS4wMDEzLS42NjM4LS4wMDM4IDEuNjc5NS0yLjQwODggMy4zNDgzLTQuODI1MSA1LjAyNTgtNy4yMzYxLjE2OTgtLjI0MzYuMzU1Mi0uNDY5My41NjkzLS42NjM5LjIxMDQtLjE5MTIuNDQ0NC0uMzUwNi43MTI2LS40NTkzLjI3MTYtLjExMDEuNTU0Ny0uMTY1OC44NTAzLS4xNjU4LjI5MjkgMCAuNTczNy4wNTQ3Ljg0MzYuMTYzNi4yNjc1LjEwNzkuNTAxMi4yNjY2LjcxMTcuNDU2NS4yMTQ5LjE5MzkuNDAxMi40MTg5LjU3MjEuNjYxNyAxLjY3NjcgMi40MTIxIDMuMzQ0OSA0LjgyOTUgNS4wMjM3IDcuMjM5My0uMjIzMS4wMDI1LS40NDY0LjAwMzktLjY2OTcuMDAzOS0uNTU2NSAwLTEuMDA5NS0uMDAwMy0xLjQ1NTgtLjAyMDN6TTEyLjAwMDEgMi4wMDAxYy0yLjc2MTQgMC01IDIuMjM4Ni01IDUuMDAwMSAwIDIuNzYxNCAyLjIzODYgNSA1IDVzNS0yLjIzODYgNS01YzAtMi43NjE1LTIuMjM4Ni01LjAwMDEtNS01LjAwMDF6bTAgMi4wMDAxYzEuNjU2OSAwIDMgMS4zNDMxIDMgMyAwIDEuNjU2OC0xLjM0MzEgMy0zIDNzLTMtMS4zNDMyLTMtM2MwLTEuNjU2OSAxLjM0MzEtMyAzLTN6Ii8+PC9zdmc+';
                    }}
                  />
                  <span className="text-sm md:text-base">Download Android APK</span>
                </button>
              </div>

              {/* Right Side - Mobile App Image */}
              <div className="relative flex justify-center items-center order-1 lg:order-1 mb-4 lg:mb-0">
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl transform rotate-2 ${isDarkTheme ? 'opacity-40' : 'opacity-60'}`}></div>
                <div className="relative">
                  <img 
                    src="/images/apk image -1.png" 
                    alt="Smart Rozgaar Mobile App" 
                    className="h-[400px] sm:h-[500px] md:h-[600px] w-auto object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/432x932/4F46E5/FFFFFF?text=Smart+Rozgaar+App';
                    }}
                  />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                    <svg className="w-8 h-8 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Features Showcase */}
        <section className={`p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            App Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* User Dashboard */}
            <div className="text-center group">
              <div className={`rounded-2xl overflow-hidden shadow-lg mb-4 transform transition-transform duration-300 group-hover:scale-105 ${
                isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="aspect-[9/19] relative">
                  <img 
                    src="/images/apk image -1.png" 
                    alt="User Dashboard" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/432x932/4F46E5/FFFFFF?text=User+Dashboard';
                    }}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">User Dashboard</h3>
              <p className={`text-sm md:text-base ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete overview of jobs, applications, and work status
              </p>
            </div>

            {/* Payments */}
            <div className="text-center group">
              <div className={`rounded-2xl overflow-hidden shadow-lg mb-4 transform transition-transform duration-300 group-hover:scale-105 ${
                isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="aspect-[9/19] relative">
                  <img 
                    src="/images/apk - payment.png" 
                    alt="Payment Management" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/432x932/7C3AED/FFFFFF?text=Payments';
                    }}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Payment Tracking</h3>
              <p className={`text-sm md:text-base ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time payment status and transaction history
              </p>
            </div>

            {/* Attendance Management */}
            <div className="text-center group">
              <div className={`rounded-2xl overflow-hidden shadow-lg mb-4 transform transition-transform duration-300 group-hover:scale-105 ${
                isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="aspect-[9/19] relative">
                  <img 
                    src="/images/apk - attendance.png" 
                    alt="Attendance Management" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/432x932/2563EB/FFFFFF?text=Attendance';
                    }}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Attendance Management</h3>
              <p className={`text-sm md:text-base ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Digital attendance marking with GPS and OTP verification
              </p>
            </div>

            {/* Secure Login */}
            <div className="text-center group">
              <div className={`rounded-2xl overflow-hidden shadow-lg mb-4 transform transition-transform duration-300 group-hover:scale-105 ${
                isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="aspect-[9/19] relative">
                  <img 
                    src="/images/apk - login.png" 
                    alt="Secure Login" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/432x932/EC4899/FFFFFF?text=Secure+Login';
                    }}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Secure Login</h3>
              <p className={`text-sm md:text-base ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Multi-factor authentication for enhanced security
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer language={language} isDarkTheme={isDarkTheme} />
    </div>
  );
}