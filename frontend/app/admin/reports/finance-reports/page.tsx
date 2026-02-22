"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/useTranslation';
import { FiArrowLeft, FiDownload, FiFileText, FiDollarSign, FiTrendingUp, FiPieChart } from 'react-icons/fi';

export default function FinanceReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('summary');

  // Mock data
  const financeData = {
    summary: {
      totalBudget: '₹2,50,00,000',
      utilizedAmount: '₹1,87,50,000',
      pendingPayments: '₹32,45,000',
      savings: '₹30,05,000'
    },
    monthlyBreakdown: [
      { month: 'January 2024', budget: '₹25,00,000', utilized: '₹22,50,000', pending: '₹2,50,000' },
      { month: 'February 2024', budget: '₹25,00,000', utilized: '₹23,75,000', pending: '₹1,25,000' },
      { month: 'March 2024', budget: '₹25,00,000', utilized: '₹24,30,000', pending: '₹70,000' },
    ],
    projectWise: [
      { project: 'गांव सड़क निर्माण', budget: '₹80,00,000', utilized: '₹72,00,000', status: '90%' },
      { project: 'जल संरक्षण', budget: '₹60,00,000', utilized: '₹54,00,000', status: '90%' },
      { project: 'सीवेज सुविधा', budget: '₹50,00,000', utilized: '₹45,00,000', status: '90%' },
      { project: 'ग्रामीण विकास', budget: '₹60,00,000', utilized: '₹16,50,000', status: '27.5%' },
    ]
  };

  const handleExport = (type: string) => {
    alert(`${type} export initiated`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                <FiDollarSign className="mr-3 text-green-600" />
                {language === 'hi' ? 'वित्तीय रिपोर्ट' : 'Financial Reports'}
              </h1>
            </div>
            
            <div className="flex space-x-1 border-b border-gray-200">
              {['summary', 'monthly', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'summary' && (language === 'hi' ? 'सारांश' : 'Summary')}
                  {tab === 'monthly' && (language === 'hi' ? 'मासिक विश्लेषण' : 'Monthly Analysis')}
                  {tab === 'projects' && (language === 'hi' ? 'परियोजना-वार' : 'Project-wise')}
                </button>
              ))}
            </div>
            
            <div className="flex items-center mt-4 space-x-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              
              <button 
                onClick={() => handleExport('finance')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FiDownload className="mr-2" />
                {language === 'hi' ? 'निर्यात' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'summary' && (
          <>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiDollarSign className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल बजट' : 'Total Budget'}</p>
                    <p className="text-2xl font-bold text-blue-600">{financeData.summary.totalBudget}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FiTrendingUp className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'उपयोग की गई राशि' : 'Utilized Amount'}</p>
                    <p className="text-2xl font-bold text-green-600">{financeData.summary.utilizedAmount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FiPieChart className="text-yellow-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'लंबित भुगतान' : 'Pending Payments'}</p>
                    <p className="text-2xl font-bold text-yellow-600">{financeData.summary.pendingPayments}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FiDollarSign className="text-purple-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'बचत' : 'Savings'}</p>
                    <p className="text-2xl font-bold text-purple-600">{financeData.summary.savings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Utilization Chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {language === 'hi' ? 'बजट उपयोग का विश्लेषण' : 'Budget Utilization Analysis'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'उपयोग की गई राशि' : 'Utilized Amount'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {financeData.summary.utilizedAmount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full" 
                      style={{width: '75%'}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {language === 'hi' ? '75% बजट उपयोग किया गया' : '75% of budget utilized'}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'लंबित भुगतान' : 'Pending Payments'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {financeData.summary.pendingPayments}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-yellow-600 h-4 rounded-full" 
                      style={{width: '13%'}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {language === 'hi' ? '13% भुगतान लंबित' : '13% payments pending'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'monthly' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {language === 'hi' ? 'मासिक वित्तीय विश्लेषण' : 'Monthly Financial Analysis'}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'hi' ? 'महीना' : 'Month'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'hi' ? 'बजट' : 'Budget'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'hi' ? 'उपयोग की गई राशि' : 'Utilized'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'hi' ? 'लंबित' : 'Pending'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'hi' ? 'उपयोग (%)' : 'Utilization (%)'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financeData.monthlyBreakdown.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {month.utilized}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {month.pending}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${90 - index * 5}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{90 - index * 5}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {language === 'hi' ? 'परियोजना-वार वित्तीय विश्लेषण' : 'Project-wise Financial Analysis'}
            </h3>
            
            <div className="space-y-4">
              {financeData.projectWise.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{project.project}</h4>
                    <span className="text-sm font-medium text-gray-600">
                      {project.budget}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">{language === 'hi' ? 'उपयोग की गई राशि:' : 'Utilized:'} </span>
                      <span className="font-medium text-green-600">{project.utilized}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{language === 'hi' ? 'स्थिति:' : 'Status:'} </span>
                      <span className="font-medium text-blue-600">{project.status}</span>
                    </div>
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: project.status}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}