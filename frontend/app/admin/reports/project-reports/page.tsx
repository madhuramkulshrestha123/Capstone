"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/useTranslation';
import { FiArrowLeft, FiDownload, FiFileText, FiBarChart2 } from 'react-icons/fi';

export default function ProjectReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);

  const projectData = {
    summary: {
      totalProjects: 24,
      activeProjects: 18,
      completedProjects: 6,
      totalBudget: '₹2,50,00,000'
    },
    projects: [
      { name: 'गांव सड़क निर्माण', status: 'active', progress: 75, budget: '₹80,00,000' },
      { name: 'जल संरक्षण', status: 'active', progress: 60, budget: '₹60,00,000' },
      { name: 'सीवेज सुविधा', status: 'active', progress: 45, budget: '₹50,00,000' },
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
                <FiBarChart2 className="mr-3 text-purple-600" />
                {language === 'hi' ? 'परियोजना रिपोर्ट' : 'Project Reports'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiBarChart2 className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल परियोजनाएं' : 'Total Projects'}</p>
                <p className="text-2xl font-bold text-purple-600">{projectData.summary.totalProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiBarChart2 className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'सक्रिय परियोजनाएं' : 'Active Projects'}</p>
                <p className="text-2xl font-bold text-green-600">{projectData.summary.activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBarChart2 className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'पूर्ण परियोजनाएं' : 'Completed Projects'}</p>
                <p className="text-2xl font-bold text-blue-600">{projectData.summary.completedProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiBarChart2 className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल बजट' : 'Total Budget'}</p>
                <p className="text-2xl font-bold text-yellow-600">{projectData.summary.totalBudget}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'hi' ? 'परियोजना प्रगति' : 'Project Progress'}
          </h3>
          <div className="space-y-4">
            {projectData.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <span className="text-sm font-medium text-gray-600">{project.budget}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full" 
                    style={{width: `${project.progress}%`}}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">
                    {language === 'hi' ? 'प्रगति:' : 'Progress:'} {project.progress}%
                  </span>
                  <span className="text-green-600 font-medium">
                    {language === 'hi' ? 'सक्रिय' : 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}