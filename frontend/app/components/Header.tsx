'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';

interface HeaderProps {
  language: 'en' | 'hi';
  isDarkTheme: boolean;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  showSearch?: boolean;
  showBackButton?: boolean;
  showNavigation?: boolean;
  onBack?: () => void;
  onNavClick?: (item: string) => void;
}

export default function Header({
  language,
  isDarkTheme,
  toggleTheme,
  toggleLanguage,
  showSearch = true,
  showBackButton = false,
  showNavigation = false,
  onBack,
  onNavClick
}: HeaderProps) {
  const { t } = useTranslation(language);

  return (
    <>
      <header className={`py-5 px-6 flex items-center justify-between ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-lg shadow-lg'} transition-colors duration-300`}>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-none hover:opacity-80 transition-opacity"
        >
          {t('smartRozgarPortal')}
        </button>
        
        <div className="flex items-center space-x-5">
          {showBackButton && (
            <button 
              onClick={onBack}
              className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${
                isDarkTheme 
                  ? 'bg-green-700 text-white hover:bg-green-800 hover:shadow-xl hover:scale-105' 
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              {t('back')}
            </button>
          )}
          
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
          
          {showSearch && (
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
          )}
          
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
      {showNavigation && (
        <nav className={`py-3 px-6 ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg shadow-inner' : 'bg-white/90 backdrop-blur-lg shadow-inner'} sticky top-0 z-20 transition-colors duration-300`}>
          <ul className="flex flex-wrap justify-center gap-3 md:gap-6 font-medium tracking-wide">
            {['aboutMinistry', 'aboutScheme', 'keyFeatures', 'schemeComponents', 'mobileApps', 'raiseComplaint', 'login'].map((item, index) => (
              <li key={index} className="my-2">
                <button 
                  onClick={() => onNavClick && onNavClick(item)}
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
      )}
    </>
  );
}