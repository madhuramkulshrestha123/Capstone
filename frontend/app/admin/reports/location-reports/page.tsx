"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/useTranslation';
import { FiArrowLeft, FiDownload, FiMapPin, FiUsers } from 'react-icons/fi';

export default function LocationReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);

  const locationData = {
    summary: {
      totalLocations: 42,
      activeProjects: 18,
      workersByLocation: 1247
    },
    locations: [
      { name: 'गांव नई दिल्ली', projects: 3, workers: 189, status: 'active' },
      { name: 'गांव रोहिणी', projects: 2, workers: 156, status: 'active' },
      { name: 'गांव राजौरी गार्डन', projects: 1, workers: 89, status: 'completed' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => router.push('/admin/reports')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <FiArrowLeft className="mr-2" />
                {language === 'hi' ? 'वापस' : 'Back'}
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FiMapPin className="mr-3 text-blue-600" />
                {language === 'hi' ? 'स्थान रिपोर्ट' : 'Location Reports'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiMapPin className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल स्थान' : 'Total Locations'}</p>
                <p className="text-2xl font-bold text-blue-600">{locationData.summary.totalLocations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'सक्रिय परियोजनाएं' : 'Active Projects'}</p>
                <p className="text-2xl font-bold text-green-600">{locationData.summary.activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'कार्यकर्ता' : 'Workers'}</p>
                <p className="text-2xl font-bold text-purple-600">{locationData.summary.workersByLocation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'hi' ? 'स्थान-वार विवरण' : 'Location-wise Details'}
          </h3>
          <div className="space-y-4">
            {locationData.locations.map((location, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{location.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    location.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {language === 'hi' ? 'सक्रिय' : 'Active'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-500">{language === 'hi' ? 'परियोजनाएं:' : 'Projects:'} </span>
                    <span className="font-medium">{location.projects}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{language === 'hi' ? 'कार्यकर्ता:' : 'Workers:'} </span>
                    <span className="font-medium">{location.workers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}