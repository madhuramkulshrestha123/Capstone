'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RaiseComplaint() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [step, setStep] = useState(1);

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

  const complaintCategories = [
    'paymentDelay',
    'attendanceIssue',
    'workConditions',
    'jobCardRelated',
    'corruption',
    'other'
  ];

  const [formData, setFormData] = useState({
    name: '',
    jobCardNumber: '',
    mobileNumber: '',
    complaintCategory: '',
    description: '',
    proof: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        proof: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      jobCardNumber: '',
      mobileNumber: '',
      complaintCategory: '',
      description: '',
      proof: null
    });
    setStep(1);
  };

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

      <main className="container max-w-4xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {t('raiseComplaint')}
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto">
            {t('complaintDescription')}
          </p>
        </section>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num 
                    ? 'bg-green-600 text-white' 
                    : isDarkTheme 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > num 
                      ? 'bg-green-600' 
                      : isDarkTheme 
                        ? 'bg-gray-700' 
                        : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Complaint Form */}
        {step === 1 && (
          <section className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('complaintForm')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2">{t('fullName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={t('enterFullName') as string}
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">{t('jobCardNumber')}</label>
                <input
                  type="text"
                  name="jobCardNumber"
                  value={formData.jobCardNumber}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={t('enterJobCardNumber') as string}
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">{t('mobileNumber')}</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={t('enterMobileNumber') as string}
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">{t('complaintCategory')}</label>
                <select
                  name="complaintCategory"
                  value={formData.complaintCategory}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">{t('selectCategory')}</option>
                  {complaintCategories.map(category => (
                    <option key={category} value={category}>{t(category as any)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">{t('complaintDescription')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={t('describeComplaint') as string}
                ></textarea>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">{t('uploadProof')}</label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                  isDarkTheme 
                    ? 'border-gray-600 hover:border-indigo-500' 
                    : 'border-gray-300 hover:border-indigo-500'
                }`}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className={`w-12 h-12 mx-auto mb-4 ${
                      isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className={`font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('clickToUpload')}
                    </p>
                    <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('supportedFormats')}
                    </p>
                  </label>
                </div>
                {formData.proof && (
                  <p className="mt-2 text-sm text-green-600">
                    {t('fileUploaded')}: {formData.proof.name}
                  </p>
                )}
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  {t('submitComplaint')}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <section className={`p-12 rounded-3xl shadow-xl text-center ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-green-600">{t('complaintSubmitted')}</h2>
            <p className="text-xl mb-2">{t('complaintIdGenerated')}</p>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-lg inline-block mb-6">
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">CR-{Date.now().toString().slice(-6)}</p>
            </div>
            <p className="text-lg mb-8">{t('expectedResolutionTime')}</p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">{t('importantNotice')}</h3>
              <ul className="text-left space-y-2 text-yellow-700 dark:text-yellow-300">
                <li>• {t('saveComplaintId')}</li>
                <li>• {t('keepProofDocuments')}</li>
                <li>• {t('followUpIfNeeded')}</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {t('trackComplaint')}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {t('submitAnother')}
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Tracking */}
        {step === 3 && (
          <section className={`p-8 rounded-3xl shadow-xl ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">{t('complaintTracking')}</h2>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="flex">
                <input
                  type="text"
                  placeholder={t('enterComplaintId') as string}
                  className={`flex-1 px-4 py-3 rounded-l-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-r-lg font-semibold hover:bg-indigo-700 transition-colors">
                  {t('search')}
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className="text-xl font-bold mb-4">{t('complaintStatus')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('status')}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    {t('statusInReview')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('assignedTo')}</span>
                  <span className="font-medium">Block Development Officer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('resolutionTime')}</span>
                  <span>{t('resolutionTimeline')}</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {t('submitAnotherComplaint')}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer language={language} isDarkTheme={isDarkTheme} />
    </div>
  );
}