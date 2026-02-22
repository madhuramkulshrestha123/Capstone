"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/useTranslation';
import { FiArrowLeft, FiDownload, FiUsers, FiUserCheck } from 'react-icons/fi';

export default function WorkerReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);

  const workerData = {
    summary: {
      totalWorkers: 1247,
      activeWorkers: 1147,
      newRegistrations: 89,
      skillCategories: 12
    },
    workers: [
      { name: 'राम प्रसाद', id: 'WRK001', skill: 'मजदूर', status: 'active', projects: 3 },
      { name: 'सीता देवी', id: 'WRK002', skill: 'मजदूर', status: 'active', projects: 2 },
      { name: 'मोहन सिंह', id: 'WRK003', skill: 'मजदूर', status: 'active', projects: 1 },
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
                <FiUsers className="mr-3 text-orange-600" />
                {language === 'hi' ? 'कर्मचारी रिपोर्ट' : 'Worker Reports'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiUsers className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल कर्मचारी' : 'Total Workers'}</p>
                <p className="text-2xl font-bold text-orange-600">{workerData.summary.totalWorkers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUserCheck className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'सक्रिय कर्मचारी' : 'Active Workers'}</p>
                <p className="text-2xl font-bold text-green-600">{workerData.summary.activeWorkers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'नए पंजीकरण' : 'New Registrations'}</p>
                <p className="text-2xl font-bold text-blue-600">{workerData.summary.newRegistrations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'कौशल श्रेणियां' : 'Skill Categories'}</p>
                <p className="text-2xl font-bold text-purple-600">{workerData.summary.skillCategories}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'hi' ? 'कर्मचारी सूची' : 'Worker List'}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'नाम' : 'Name'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'कार्यकर्ता आईडी' : 'Worker ID'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'कौशल' : 'Skill'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'परियोजनाएं' : 'Projects'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'स्थिति' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workerData.workers.map((worker, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {worker.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.skill}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {language === 'hi' ? 'सक्रिय' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}