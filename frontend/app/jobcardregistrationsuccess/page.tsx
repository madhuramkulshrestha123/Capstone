'use client';

import { useTranslation } from '../lib/useTranslation';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JobCardRegistrationSuccess() {
  const { t } = useTranslation('en');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    // Get tracking ID from URL parameters
    const id = searchParams.get('trackingId');
    if (id) {
      setTrackingId(id);
    } else {
      // If no tracking ID, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  const handleTrackApplication = () => {
    router.push('/track-application');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <h1 className="text-2xl font-bold text-white text-center">
              {t('registrationSuccessful')}
            </h1>
          </div>

          {/* Success Message */}
          <div className="p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-medium text-gray-900">
                  {t('jobCardApplicationSubmitted')}
                </h3>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {t('trackingId')}: <span className="font-mono font-bold">{trackingId}</span>
                  </p>
                </div>
                <p className="mt-4 text-gray-600">
                  {t('youCanTrackJobCardApplication')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTrackApplication}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {t('trackMyApplication')}
              </button>
              <button
                onClick={handleGoHome}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg shadow-md hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                {t('goToHome')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}