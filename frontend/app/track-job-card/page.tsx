'use client';

import { useState } from 'react';

const imgUrls = [
  '/images/1stpic.png',
  '/images/2ndpic.png',
  '/images/3rdpic.png',
];

const hindiText = {
  title: 'अपना जॉब आवेदन ट्रैक करें',
  desc: 'अपना आवेदन संख्या नीचे डालें और अपने जॉब आवेदन की स्थिति तुरंत जानें। अपडेट रहें और कोई सूचना न चूकें!',
  galleryTitle: 'मनरेगा दैनिक मजदूरी श्रमिकों और आवेदन दस्तावेज़',
  worker: 'मनरेगा दैनिक मजदूरी श्रमिक',
  documents: 'आवेदन के दस्तावेज़',
  applicationNumber: 'आवेदन संख्या',
  applicationPlaceholder: 'अपना ट्रैकिंग नंबर दर्ज करें',
  track: 'आवेदन ट्रैक करें',
  darkMode: 'डार्क मोड',
  lightMode: 'लाइट मोड',
  english: 'English',
  hindi: 'हिंदी',
  alert: 'आवेदन संख्या'
};

const englishText = {
  title: 'Track Your Job Application',
  desc: 'Enter your application number below to get real-time status updates about your job application. Stay informed and never miss an update!',
  galleryTitle: 'MNREGA Daily Wage Workers & Application Documents',
  worker: 'MNREGA Daily Wage Worker',
  documents: 'Job Application Documents',
  applicationNumber: 'Application Number',
  applicationPlaceholder: 'Enter your tracking number',
  track: 'Track Application',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',
  english: 'English',
  hindi: 'Hindi',
  alert: 'Application Number'
};

export default function TrackJobCardPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [error, setError] = useState('');

  const content = language === 'en' ? englishText : hindiText;

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (trackingNumber.trim() === '') {
    setError("Application Number can't be empty");
    return;
  }
  if (
    !/^[a-zA-Z0-9]+$/.test(trackingNumber) ||
    !/[a-zA-Z]/.test(trackingNumber) ||
    !/[0-9]/.test(trackingNumber)
  ) {
    setError('Application Number should contain both alphabets and numbers only');
    return;
  }
  setError('');
  alert(`${content.alert}: ${trackingNumber}`);
};


  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkTheme
          ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-blue-900 text-white'
          : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'
      } font-sans`}
    >
      {/* Header */}
      <header
        className={`py-6 px-8 flex items-center justify-between ${
          isDarkTheme
            ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg'
            : 'bg-white/90 backdrop-blur-lg shadow-lg'
        } transition-colors duration-300`}
      >
        <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-none">
          {content.title}
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={toggleTheme}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${
              isDarkTheme
                ? 'bg-indigo-700 text-white hover:bg-indigo-800 hover:shadow-xl hover:scale-105'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isDarkTheme ? content.lightMode : content.darkMode}
          </button>
          <button
            onClick={toggleLanguage}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${
              isDarkTheme
                ? 'bg-purple-700 text-white hover:bg-purple-800 hover:shadow-xl hover:scale-105'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-lg hover:scale-105'
            }`}
          >
            {content.english}/{content.hindi}
          </button>
        </div>
      </header>

      {/* Banner */}
      <div className="w-full flex flex-col items-center mt-10 mb-8">
        <div
          className={`rounded-3xl shadow-2xl p-8 px-12 text-center ${
            isDarkTheme
              ? 'bg-gradient-to-r from-indigo-800 to-blue-900 text-white'
              : 'bg-gradient-to-r from-indigo-100 to-purple-200 text-indigo-900'
          }`}
          style={{ maxWidth: 700 }}
        >
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">{content.title}</h1>
          <p className="text-lg font-light mb-2">{content.desc}</p>
        </div>
      </div>

      {/* Gallery Title */}
      <div className="w-full flex flex-col items-center mb-4">
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent text-center select-none">
          {content.galleryTitle}
        </h2>
      </div>

      {/* Image Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12 px-8 place-items-center">
        {imgUrls.map((src, idx) => (
          <figure
            key={idx}
            className={`overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-black-950 p-4 flex flex-col items-center cursor-pointer border-2 border-black w-full`}
            style={{ minWidth: 250, maxWidth: 360 }}
          >
            <img
              src={src}
              alt="MNREGA related"
              className="w-full h-48 object-cover rounded-lg mb-2 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            />
            <figcaption
              className={`py-1 text-center text-base font-semibold bg-transparent ${
                isDarkTheme ? 'text-indigo-100' : 'text-indigo-800'
              }`}
            >
              {idx < 2 ? content.worker : content.documents}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Application tracking form */}
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-lg mx-auto ${
          isDarkTheme ? 'bg-gray-900' : 'bg-white'
        } rounded-2xl shadow-xl p-8 flex flex-col space-y-7 transition-colors duration-300`}
      >
        <label
          htmlFor="trackingNumber"
          className={`text-lg font-semibold ${isDarkTheme ? 'text-indigo-100' : 'text-indigo-800'}`}
        >
          {content.applicationNumber} <span className="text-red-600">*</span>
        </label>
        <>
          <input
            id="trackingNumber"
            type="text"
            placeholder={content.applicationPlaceholder}
            value={trackingNumber}
            onChange={(e) => {
              setTrackingNumber(e.target.value);
              if (error) setError('');
            }}
            required
            className={`w-full rounded-lg border-[2px] focus:border-indigo-700 focus:ring-2 focus:ring-indigo-400 px-4 py-3 text-lg ${
              isDarkTheme
                ? 'bg-indigo-950 text-white border-black placeholder-indigo-200'
                : 'bg-indigo-50 text-indigo-900 border-black placeholder-indigo-400'
            } transition-shadow duration-300`}
            style={{ fontFamily: 'inherit' }}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 font-semibold">{error}</p>
          )}
        </>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-700 to-purple-700 text-white font-extrabold text-xl rounded-xl py-4 shadow-lg hover:from-indigo-800 hover:to-purple-800 transform hover:scale-105 transition-all duration-300"
        >
          {content.track}
        </button>
      </form>
    </div>
  );
}
