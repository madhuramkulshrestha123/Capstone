'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../lib/useTranslation';
import { adminApi } from '../lib/api';
import Chatbot from '../components/Chatbot';


/*
 * CUSTOMIZATION INSTRUCTIONS:
 * 
 * To customize this dashboard with your own images and data:
 * 
 * 1. REPLACE IMAGES:
 *    - Carousel images: /public/images/carousel1.jpg through carousel3.jpg
 *    - Gallery images: /public/images/gallery1.jpg through gallery3.jpg (optional)
 *    - Recommended sizes:
 *      * Carousel images: 1200x400 pixels
 *      * Gallery images: 600x400 pixels
 * 
 * 2. UPDATE TEXT CONTENT:
 *    - Modify the translations in /app/lib/translations.ts
 *    - Change the custom data in the arrays (navItems, applySteps, quickLinks, etc.)
 * 
 * 3. ADD/REMOVE SECTIONS:
 *    - Copy existing sections and modify them
 *    - Remove sections by deleting the relevant code blocks
 * 
 * 4. CHANGE COLORS:
 *    - Modify the gradient colors in the className attributes
 *    - Update the theme colors in the useState hooks
 */

export default function Dashboard() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  


  // Demand Job Modal State
  const [isDemandJobModalOpen, setIsDemandJobModalOpen] = useState(false);
  const [jobId, setJobId] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [workerDetails, setWorkerDetails] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Notice board data
  const notices = [
    { title: 'newGuidelines', description: 'newGuidelinesDesc', date: '2025-10-01' },
    { title: 'workshop', description: 'workshopDesc', date: '2025-09-25' },
    { title: 'paymentUpdate', description: 'paymentUpdateDesc', date: '2025-10-20' },
    { title: 'newApp', description: 'newAppDesc', date: '2025-09-30' }
  ];
  
  // Upcoming features data
  const upcomingFeatures = [
    { title: 'payments', description: 'paymentsDescription' },
    { title: 'mobileAttendance', description: 'mobileAttendanceDescription' },
    { title: 'jobDemand', description: 'jobDemandDescription' },
    { title: 'mobileOtp', description: 'mobileOtpDescription' }
  ];
  
  // Resources data
  const resources = [
    'documentation', 'guidelines', 'trainingMaterials', 'reports'
  ];
  
  // Social media data
  const socialMedia = [
    'facebook', 'twitter', 'youtube', 'instagram', 'linkedin'
  ];
  
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');



  // Updated carousel images to use local placeholder images
  const carouselImages = [
    '/images/carousel1.jpg',  // Replace with your own images
    '/images/carousel2.jpg',  // Replace with your own images
    '/images/carousel3.jpg',  // Replace with your own images
  ];

  // Updated navigation items with custom data
  const navItems = [
    'aboutMinistry', 'aboutScheme', 'keyFeatures', 'schemeComponents',
    'mobileApps', 'raiseComplaint', 'login'
  ];

  // Updated application steps with custom data
  const applySteps = [
    'Visit your nearest Panchayat office',
    'Fill out the job card application form',
    'Submit required documents',
    'Verification by authorities',
    'Receive your job card'
  ];

  // Updated quick links with custom data
  const quickLinks = [
    { id: 'checkStatus', icon: '🔍', title: 'Check Application Status', description: 'Track your job card application progress' },
    { id: 'downloadForm', icon: '📄', title: 'Download Forms', description: 'Get application forms and guidelines' },
    { id: 'contactSupport', icon: '📞', title: 'Contact Support', description: 'Get help from our support team' },
    { id: 'faq', icon: '❓', title: 'FAQ', description: 'Find answers to common questions' }
  ];

  // Updated gallery images with custom data
  const galleryImages = [
    { src: '/images/gallery1.jpg', alt: 'Community Work 1' },
    { src: '/images/gallery2.jpg', alt: 'Community Work 2' },
    { src: '/images/gallery3.jpg', alt: 'Community Work 3' }
  ];

  // Handle navigation
  const handleNavClick = (item: string) => {
    // Navigate to different pages based on the item
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
        // Scroll to section if it exists on the same page
        const element = document.getElementById(item);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
    }
  };

  // Handle quick link click
  const handleQuickLinkClick = (id: string) => {
    // Handle quick link actions
    console.log(`Quick link clicked: ${id}`);
  };

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Demand Job Modal Functions
  const openDemandJobModal = () => setIsDemandJobModalOpen(true);
  const closeDemandJobModal = () => {
    setIsDemandJobModalOpen(false);
    resetDemandJobForm();
  };

  const resetDemandJobForm = () => {
    setJobId('');
    setAadhaarNumber('');
    setWorkerDetails(null);
    setIsVerified(false);
    setError('');
  };

  // Verify Worker
  const verifyWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await adminApi.verifyWorker(aadhaarNumber, jobId);
      setWorkerDetails(response.data);
      setIsVerified(true);
    } catch (err: any) {
      setError(err.message || 'Failed to verify worker details. Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demand Work
  const demandWork = async () => {
    try {
      const response = await adminApi.demandWork(jobId);
      alert('Work demand submitted successfully!');
      closeDemandJobModal();
    } catch (err: any) {
      alert(err.message || 'Failed to submit work demand. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'}`}>
      
      {/* Header */}
      <header className={`py-5 px-6 flex items-center justify-between ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-lg shadow-lg'} transition-colors duration-300`}>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-none hover:opacity-80 transition-opacity"
        >
          {t('smartRozgarPortal')}
        </button>
        <div className="flex items-center space-x-5">
          <button 
            onClick={toggleTheme}
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
            onClick={toggleLanguage}
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

      {/* Navigation Bar */}
      <nav className={`py-3 px-6 ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg shadow-inner' : 'bg-white/90 backdrop-blur-lg shadow-inner'} sticky top-0 z-20 transition-colors duration-300`}>
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

      <main className="container max-w-7xl mx-auto px-6 py-10 space-y-14">
        
        {/* Carousel */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-indigo-300/30">
            <div 
              className="flex transition-transform duration-700 ease-in-out will-change-transform" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1 */}
              <div className="w-full flex-shrink-0">
                <div className="relative h-96 md:h-[28rem]">
                  <img 
                    src="/images/carousel1.jpg" 
                    alt="Daily Wage Job at your Convenience" 
                    className="w-full h-full object-cover rounded-3xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/1200x400/4F46E5/FFFFFF?text=Daily+Wage+Job+at+your+Convenience';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent rounded-3xl"></div>
                  <div className="absolute bottom-8 left-8 text-white max-w-xl select-text">
                    <h3 className="text-3xl font-extrabold drop-shadow-lg">
                      {t('slide1Title')}
                    </h3>
                    <p className="mt-3 text-lg font-light drop-shadow-md max-w-lg">
                      {t('slide1Description')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Slide 2 */}
              <div className="w-full flex-shrink-0">
                <div className="relative h-96 md:h-[28rem]">
                  <img 
                    src="/images/carousel2.jpg" 
                    alt="Transparent and Fast" 
                    className="w-full h-full object-cover rounded-3xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/1200x400/7C3AED/FFFFFF?text=Transparent+and+Fast';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent rounded-3xl"></div>
                  <div className="absolute bottom-8 left-8 text-white max-w-xl select-text">
                    <h3 className="text-3xl font-extrabold drop-shadow-lg">
                      {t('slide2Title')}
                    </h3>
                    <p className="mt-3 text-lg font-light drop-shadow-md max-w-lg">
                      {t('slide2Description')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Slide 3 */}
              <div className="w-full flex-shrink-0">
                <div className="relative h-96 md:h-[28rem]">
                  <img 
                    src="/images/carousel3.jpg" 
                    alt="Zero Paper Work and Secure" 
                    className="w-full h-full object-cover rounded-3xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/1200x400/2563EB/FFFFFF?text=Zero+Paper+Work+and+Secure';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent rounded-3xl"></div>
                  <div className="absolute bottom-8 left-8 text-white max-w-xl select-text">
                    <h3 className="text-3xl font-extrabold drop-shadow-lg">
                      {t('slide3Title')}
                    </h3>
                    <p className="mt-3 text-lg font-light drop-shadow-md max-w-lg">
                      {t('slide3Description')}
                    </p>
                  </div>
                </div>
              </div>
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
              {[0, 1, 2].map((index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-indigo-700' : 'w-3 bg-indigo-300/60'
                  }`}
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
              Our vision is to provide sustainable employment opportunities to all rural households and improve their quality of life through various employment schemes. We aim to empower communities through digital transformation and transparent governance.
            </p>
          </div>
        </section>

        {/* Apply Job Card Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('applyForJobCard')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`p-10 rounded-3xl shadow-xl transition-transform duration-300 hover:scale-[1.03] ${
              isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'
            }`}>
              <h3 className="text-2xl font-semibold mb-8 text-indigo-700 select-text">{t('howToApply')}</h3>
              <ol className="space-y-6 list-decimal list-inside font-light text-lg">
                {applySteps.map((step, index) => (
                  <li key={index} className="select-text">{t(step as any)}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col space-y-6">
              <a 
                href="/apply-job-card"
                className={`p-10 rounded-3xl shadow-xl transition-transform duration-300 transform hover:scale-[1.03] flex items-center justify-center text-2xl font-semibold ${
                  isDarkTheme 
                    ? 'bg-blue-700 hover:bg-blue-800 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {t('applyButton')}
              </a>
              
              <a 
                href="/track-application"
                className={`p-10 rounded-3xl shadow-xl transition-transform duration-300 transform hover:scale-[1.03] flex items-center justify-center text-2xl font-semibold ${
                  isDarkTheme 
                    ? 'bg-green-700 hover:bg-green-800 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {t('trackButton')}
              </a>
              
              <button 
                onClick={openDemandJobModal}
                className={`p-10 rounded-3xl shadow-xl transition-transform duration-300 transform hover:scale-[1.03] flex items-center justify-center text-2xl font-semibold ${
                  isDarkTheme 
                    ? 'bg-indigo-700 hover:bg-indigo-800 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {t('demandJob')}
              </button>
            </div>
          </div>
        </section>

        {/* Notice Board */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('noticeBoard')}
          </h2>
          <div className={`rounded-3xl shadow-xl overflow-hidden divide-y ${
            isDarkTheme ? 'bg-gray-900/90 divide-gray-700' : 'bg-white/90 divide-gray-200'
          }`}>
            <ul>
              {notices.map((notice: any, index: number) => (
                <li key={index} className="p-6 hover:bg-indigo-600/10 hover:transition-colors cursor-pointer transition-colors duration-300">
                  <div className="flex justify-between items-start gap-6">
                    <div>
                      <h3 className="text-lg font-semibold select-text">{t(notice.title as any)}</h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-300 select-text">{t(notice.description as any)}</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full select-text ${
                      isDarkTheme ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
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
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-text">
            {t('upcomingFeaturesTitle')}
          </h2>
          <div className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <p className="text-lg mb-6 select-text">Soon you will be able to access all services online instead of visiting your panchayat office. Our digital transformation will make the process more efficient and transparent.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingFeatures.map((feature: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl flex items-start transition-transform duration-300 hover:scale-[1.02] ${
                    isDarkTheme ? 'bg-gray-800/70' : 'bg-indigo-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center mr-4 ${
                    isDarkTheme ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    <svg 
                      className="w-7 h-7" 
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
                    <h3 className="text-xl font-semibold mb-2 select-text">{t(feature.title)}</h3>
                    <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} select-text`}>
                      {t(feature.description)}
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
                  <a 
                    href="#" 
                    className={`hover:underline transition-colors duration-300 ${
                      isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-700'
                    }`}
                  >
                    {t(link.title as any)}
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
              {resources.map((resource: any, index: number) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`hover:underline transition-colors duration-300 ${
                      isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-700'
                    }`}
                  >
                    {t(resource as any)}
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
                <a 
                  href="mailto:info@smartrozgar.gov.in" 
                  className={`hover:underline transition-colors duration-300 ${
                    isDarkTheme ? 'text-indigo-400 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-900'
                  }`}
                >
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
              {socialMedia.map((social: any, index: number) => (
                <a 
                  key={index} 
                  href="#" 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-125 ${
                    isDarkTheme 
                      ? 'bg-indigo-900/70 text-indigo-300 hover:bg-indigo-700' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-300'
                  }`}
                  aria-label={t(social as any)}
                >
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

      {/* Chatbot */}
      <Chatbot language={language} isDarkTheme={isDarkTheme} />
      
      {/* Demand Job Modal */}
      {isDemandJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
            isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{t('demandJob')}</h3>
                <button 
                  onClick={closeDemandJobModal}
                  className={`text-gray-500 hover:text-gray-700 ${
                    isDarkTheme ? 'hover:text-gray-300' : ''
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {!isVerified ? (
                <form onSubmit={verifyWorker}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('aadhaarNumber')}
                      </label>
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDarkTheme 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder={t('enterAadhaar') as string}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('jobCardId')}
                      </label>
                      <input
                        type="text"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDarkTheme 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder={t('enterJobCardId') as string}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeDemandJobModal}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isDarkTheme 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg font-medium text-white ${
                        isLoading 
                          ? 'bg-indigo-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isLoading ? t('verifying') : t('verify')}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-lg mb-2">{t('workerDetails')}</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">{t('name')}:</span> {workerDetails?.name || 'N/A'}</p>
                      <p><span className="font-medium">{t('aadhaarNumber')}:</span> {workerDetails?.aadhaar_number || 'N/A'}</p>
                      <p><span className="font-medium">{t('jobCardId')}:</span> {jobId}</p>
                      <p><span className="font-medium">{t('currentStatus')}:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          workerDetails?.current_status === 'available' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                        }`}>
                          {workerDetails?.current_status || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2">{t('workHistory')}</h4>
                    {workerDetails?.work_history && workerDetails.work_history.length > 0 ? (
                      <div className="space-y-3">
                        {workerDetails.work_history.map((work: any, index: number) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg ${
                              isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
                            }`}
                          >
                            <p className="font-medium">{work.name || work.project_name || 'Unnamed Project'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {work.start_date ? new Date(work.start_date).toLocaleDateString() : 'N/A'} to {work.end_date ? new Date(work.end_date).toLocaleDateString() : 'N/A'} - ₹{work.wage_per_worker || work.wage || 0}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">{t('noWorkHistory')}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeDemandJobModal}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isDarkTheme 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {t('close')}
                    </button>
                    <button
                      onClick={demandWork}
                      className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {t('demandWork')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}