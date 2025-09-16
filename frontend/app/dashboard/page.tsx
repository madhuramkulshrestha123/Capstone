'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../lib/useTranslation';
import { Language } from '../lib/translations';

export default function Dashboard() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState<Language>('en'); // 'en' or 'hi'
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, tWithParams } = useTranslation(language);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const carouselImages = [
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ];

  const navItems = [
    'aboutMinistry', 'aboutScheme', 'keyFeatures', 'schemeComponents',
    'mobileApps', 'login', 'whatsNew', 'raiseComplaint'
  ];

  const applySteps = ['step1', 'step2', 'step3', 'step4', 'step5'];
  const quickLinks = ['home', 'aboutUs', 'contact', 'faq'];
  const resources = ['documentation', 'guidelines', 'trainingMaterials', 'reports'];
  const socialMedia = ['facebook', 'twitter', 'youtube', 'instagram'];

  const notices = [
    { title: 'newGuidelines', description: 'newGuidelinesDesc', date: 'Sep 10, 2025' },
    { title: 'workshop', description: 'workshopDesc', date: 'Sep 5, 2025' },
    { title: 'paymentUpdate', description: 'paymentUpdateDesc', date: 'Sep 1, 2025' },
    { title: 'newApp', description: 'newAppDesc', date: 'Aug 28, 2025' }
  ];

  const upcomingFeatures = ['payments', 'mobileAttendance', 'jobDemand', 'mobileOtp'];
  const nextSlide = () => setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'}`}>
      
      {/* Header */}
      <header className={`py-5 px-6 flex items-center justify-between ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-lg shadow-lg'} transition-colors duration-300`}>
        <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-none">
          {t('smartRozgarPortal')}
        </div>
        <div className="flex items-center space-x-5">
          <button 
            onClick={toggleTheme}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${isDarkTheme ? 'bg-indigo-700 text-white hover:bg-indigo-800 hover:shadow-xl hover:scale-105' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-lg hover:scale-105'}`}
          >
            {isDarkTheme ? t('lightMode') : t('darkMode')}
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className={`px-5 py-2 pl-12 rounded-lg border-2 ${isDarkTheme ? 'bg-gray-700 text-white placeholder-gray-400 border-indigo-600 focus:border-indigo-400' : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-indigo-600'} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow`}
            />
            <svg 
              className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={toggleLanguage}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${isDarkTheme ? 'bg-purple-700 text-white hover:bg-purple-800 hover:shadow-xl hover:scale-105' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-lg hover:scale-105'}`}
          >
            {language === 'en' ? t('hindi') : t('english')}
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className={`py-3 px-6 ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg shadow-inner' : 'bg-white/90 backdrop-blur-lg shadow-inner'} sticky top-0 z-20 transition-colors duration-300`}>
        <ul className="flex flex-wrap justify-center gap-3 md:gap-6 font-medium tracking-wide">
          {navItems.map((item, index) => (
            <li key={index} className="my-2">
              <a 
                href="#" 
                className={`px-5 py-2 rounded-lg transition-transform duration-300 ease-in-out hover:scale-110 ${isDarkTheme ? 'text-white hover:bg-indigo-700 hover:shadow-md' : 'text-gray-900 hover:bg-indigo-200 hover:text-indigo-700 hover:shadow-md'}`}
              >
                {t(item as any)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="container max-w-7xl mx-auto px-6 py-10 space-y-14">

        {/* Carousel */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-indigo-300/30">
            <div 
              className="flex transition-transform duration-700 ease-in-out will-change-transform" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselImages.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="relative h-96 md:h-[28rem]">
                    <img 
                      src={image} 
                      alt={`Slide ${index + 1}`} 
                      className="w-full h-full object-cover rounded-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent rounded-3xl"></div>
                    <div className="absolute bottom-8 left-8 text-white max-w-xl select-text">
                      <h3 className="text-3xl font-extrabold drop-shadow-lg">
                        {tWithParams('slideTitle', { index: index + 1 })}
                      </h3>
                      <p className="mt-3 text-lg font-light drop-shadow-md max-w-lg">
                        {t('slideDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-indigo-600/80 hover:bg-indigo-700 rounded-full p-3 drop-shadow-lg transition-all duration-300 shadow-lg"
              aria-label="Previous slide"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-indigo-600/80 hover:bg-indigo-700 rounded-full p-3 drop-shadow-lg transition-all duration-300 shadow-lg"
              aria-label="Next slide"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
              {carouselImages.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-indigo-700' : 'w-3 bg-indigo-300/60'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="mb-16">
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
              {t('vision')}
            </h2>
            <p className="text-lg leading-relaxed select-text">
              {t('visionText')}
            </p>
          </div>
        </section>

        {/* Apply Job Card Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('applyForJobCard')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`p-10 rounded-3xl shadow-xl transition-transform duration-300 hover:scale-[1.03] ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
              <h3 className="text-2xl font-semibold mb-8 text-indigo-700 select-text">{t('howToApply')}</h3>
              <ol className="space-y-6 list-decimal list-inside font-light text-lg">
                {applySteps.map((step, index) => (
                  <li key={index} className="select-text">{t(step as any)}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col space-y-8">
              <a 
                href="/apply-job-card"
                className={`py-6 px-10 rounded-3xl text-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center ${isDarkTheme ? 'bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'}`}
              >
                {t('applyButton')}
              </a>

              <Link href="/track-job-card">
                <span
                  className="block w-full py-6 px-10 rounded-3xl text-xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(to right, #17ad52, #128043)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Track Your Job Card
                </span>
              </Link>


              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className={`p-6 rounded-2xl shadow-xl text-center transition-shadow duration-300 ${isDarkTheme ? 'bg-gray-900/90' : 'bg-white/90'}`}>
                  <div className="text-4xl font-extrabold text-indigo-700 select-text">1.2M+</div>
                  <div className="text-sm mt-2 font-medium">{t('jobCardsIssued')}</div>
                </div>
                <div className={`p-6 rounded-2xl shadow-xl text-center transition-shadow duration-300 ${isDarkTheme ? 'bg-gray-900/90' : 'bg-white/90'}`}>
                  <div className="text-4xl font-extrabold text-purple-700 select-text">98%</div>
                  <div className="text-sm mt-2 font-medium">{t('satisfactionRate')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notice Board */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('noticeBoard')}
          </h2>
          <div className={`rounded-3xl shadow-xl overflow-hidden divide-y ${isDarkTheme ? 'bg-gray-900/90 divide-gray-700' : 'bg-white/90 divide-gray-200'}`}>
            <ul>
              {notices.map((notice, index) => (
                <li key={index} className="p-6 hover:bg-indigo-600/10 hover:transition-colors cursor-pointer transition-colors duration-300">
                  <div className="flex justify-between items-start gap-6">
                    <div>
                      <h3 className="text-lg font-semibold select-text">{t(notice.title as any)}</h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-300 select-text">{t(notice.description as any)}</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full select-text ${isDarkTheme ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                      {notice.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Upcoming Online Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('upcomingFeaturesTitle')}
          </h2>
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <p className="text-lg mb-6 select-text">{t('upcomingFeaturesDescription')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingFeatures.map((feature, index) => (
                <div key={index} className={`p-6 rounded-xl flex items-start transition-transform duration-300 hover:scale-[1.02] ${isDarkTheme ? 'bg-gray-800/70' : 'bg-indigo-50'}`}>
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center mr-4 ${isDarkTheme ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 select-text">{t(feature as any)}</h3>
                    <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} select-text`}>
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
      <footer className={`py-16 px-8 mt-20 ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-xl' : 'bg-white/90 backdrop-blur-lg shadow-xl'} transition-colors duration-300`}>
        <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-4 font-medium text-lg">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className={`hover:underline transition-colors duration-300 ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-700'}`}>
                    {t(link as any)}
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
              {resources.map((link, index) => (
                <li key={index}>
                  <a href="#" className={`hover:underline transition-colors duration-300 ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-700'}`}>
                    {t(link as any)}
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
                <a href="mailto:info@smartrozgar.gov.in" className={`hover:underline transition-colors duration-300 ${isDarkTheme ? 'text-indigo-400 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-900'}`}>
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
              {socialMedia.map((social, index) => (
                <a key={index} href="#" className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-125 ${isDarkTheme ? 'bg-indigo-900/70 text-indigo-300 hover:bg-indigo-700' : 'bg-indigo-100 text-indigo-700 hover:text-indigo-300'}`} aria-label={t(social as any)}>
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

      {/* Floating Chatbot */}
      <div className="fixed bottom-7 right-7 z-50">
        <button className={`px-5 py-4 rounded-full shadow-2xl transform transition-transform duration-300 hover:scale-110 focus:outline-none ${isDarkTheme ? 'bg-indigo-700 text-white shadow-indigo-900' : 'bg-indigo-600 text-white shadow-indigo-700'}`} aria-label="Chatbot">
          <div className="flex items-center space-x-3 select-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-semibold">{t('chatbotMessage')}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
