'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import { Language } from '../lib/translations';

export default function Dashboard() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState<Language>('en'); // 'en' for English, 'hi' for Hindi
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, tWithParams } = useTranslation(language);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  // Dummy carousel images
  const carouselImages = [
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  ];

  // Navigation items
  const navItems = [
    'aboutMinistry',
    'aboutScheme',
    'keyFeatures',
    'schemeComponents',
    'mobileApps',
    'login',
    'whatsNew',
    'raiseComplaint'
  ];

  // How to apply steps
  const applySteps = [
    'step1',
    'step2',
    'step3',
    'step4',
    'step5'
  ];

  // Quick links
  const quickLinks = [
    'home',
    'aboutUs',
    'contact',
    'faq'
  ];

  // Resources
  const resources = [
    'documentation',
    'guidelines',
    'trainingMaterials',
    'reports'
  ];

  // Social media
  const socialMedia = [
    'facebook',
    'twitter',
    'youtube',
    'instagram'
  ];

  // Notice board items
  const notices = [
    {
      title: 'newGuidelines',
      description: 'newGuidelinesDesc',
      date: 'Sep 10, 2025'
    },
    {
      title: 'workshop',
      description: 'workshopDesc',
      date: 'Sep 5, 2025'
    },
    {
      title: 'paymentUpdate',
      description: 'paymentUpdateDesc',
      date: 'Sep 1, 2025'
    },
    {
      title: 'newApp',
      description: 'newAppDesc',
      date: 'Aug 28, 2025'
    }
  ];

  // Upcoming features
  const upcomingFeatures = [
    'payments',
    'mobileAttendance',
    'jobDemand',
    'mobileOtp'
  ];

  // Handle carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 flex items-center justify-between ${isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'} shadow-sm`}>
        <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {t('smartRozgarPortal')}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDarkTheme 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {isDarkTheme ? t('lightMode') : t('darkMode')}
          </button>
          
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className={`px-4 py-2 pl-10 rounded-lg ${
                isDarkTheme 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-indigo-300`}
            />
            <svg 
              className={`w-5 h-5 absolute left-3 top-2.5 ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <button 
            onClick={toggleLanguage}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDarkTheme 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {language === 'en' ? t('hindi') : t('english')}
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className={`py-3 px-6 ${isDarkTheme ? 'bg-gray-700/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'} shadow-sm sticky top-0 z-10`}>
        <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
          {navItems.map((item, index) => (
            <li key={index} className="my-1">
              <a 
                href="#" 
                className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkTheme 
                    ? 'text-white hover:bg-indigo-600' 
                    : 'text-gray-900 hover:bg-indigo-100 hover:text-indigo-700'
                }`}
              >
                {t(item as any)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Carousel */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselImages.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="relative h-80 md:h-96">
                    <img 
                      src={image} 
                      alt={`Slide ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold">
                        {tWithParams('slideTitle', { index: index + 1 })}
                      </h3>
                      <p className="mt-2 max-w-lg">
                        {t('slideDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {carouselImages.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="mb-12">
          <div className={`p-8 rounded-2xl shadow-lg ${isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t('vision')}
            </h2>
            <p className="text-lg leading-relaxed">
              {t('visionText')}
            </p>
          </div>
        </section>

        {/* Apply Job Card Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('applyForJobCard')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-8 rounded-2xl shadow-lg ${isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'}`}>
              <h3 className="text-2xl font-semibold mb-6 text-indigo-600">{t('howToApply')}</h3>
              <ol className="space-y-4">
                {applySteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                      isDarkTheme ? 'bg-indigo-600' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="pt-1">{t(step as any)}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="flex flex-col space-y-6">
              <a 
                href="/apply-job-card"
                className={`py-5 px-8 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center ${
                  isDarkTheme 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
                }`}
              >
                {t('applyButton')}
              </a>
              <button 
                className={`py-5 px-8 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl ${
                  isDarkTheme 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                }`}
              >
                {t('trackButton')}
              </button>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className={`p-5 rounded-2xl shadow-lg ${
                  isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'
                }`}>
                  <div className="text-3xl font-bold text-indigo-600">1.2M+</div>
                  <div className="text-sm mt-1">
                    {t('jobCardsIssued')}
                  </div>
                </div>
                <div className={`p-5 rounded-2xl shadow-lg ${
                  isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'
                }`}>
                  <div className="text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-sm mt-1">
                    {t('satisfactionRate')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notice Board */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('noticeBoard')}
          </h2>
          <div className={`rounded-2xl shadow-lg overflow-hidden ${isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'}`}>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notices.map((notice, index) => (
                <li key={index} className="p-6 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{t(notice.title as any)}</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{t(notice.description as any)}</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      isDarkTheme ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {notice.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Upcoming Online Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('upcomingFeaturesTitle')}
          </h2>
          <div className={`p-8 rounded-2xl shadow-lg ${isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'}`}>
            <p className="text-lg mb-6">
              {t('upcomingFeaturesDescription')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl flex items-start transition-all duration-200 hover:scale-[1.02] ${
                    isDarkTheme ? 'bg-gray-700/50' : 'bg-indigo-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    isDarkTheme ? 'bg-indigo-600' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{t(feature as any)}</h3>
                    <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t(`${feature}Description` as any)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-12 px-6 mt-16 ${isDarkTheme ? 'bg-gray-800/80 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'} shadow-lg`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('quickLinks')}
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className={`hover:underline transition-colors duration-200 ${
                        isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600'
                      }`}
                    >
                      {t(link as any)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('resources')}
              </h3>
              <ul className="space-y-3">
                {resources.map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className={`hover:underline transition-colors duration-200 ${
                        isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600'
                      }`}
                    >
                      {t(link as any)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('contactUs')}
              </h3>
              <address className="not-italic space-y-2">
                <p>{t('ministry')}</p>
                <p>{t('government')}</p>
                <p>{t('address')}</p>
                <p className="pt-2">
                  <a 
                    href="mailto:info@smartrozgar.gov.in" 
                    className={`hover:underline transition-colors duration-200 ${
                      isDarkTheme ? 'text-indigo-300' : 'text-indigo-600'
                    }`}
                  >
                    {t('email')}
                  </a>
                </p>
              </address>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('followUs')}
              </h3>
              <div className="flex space-x-4">
                {socialMedia.map((social, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      isDarkTheme 
                        ? 'bg-indigo-900/50 text-indigo-200 hover:bg-indigo-700' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                    aria-label={t(social as any)}
                  >
                    <span className="font-medium">{social.charAt(0)}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center">
            <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
              {t('copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`px-4 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 ${
          isDarkTheme 
            ? 'bg-indigo-600 text-white' 
            : 'bg-indigo-500 text-white'
        }`}>
          <div className="flex items-center">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium">{t('chatbotMessage')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}