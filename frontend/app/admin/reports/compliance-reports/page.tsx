"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/useTranslation';
import { FiArrowLeft, FiDownload, FiFileText, FiAlertTriangle, FiClock, FiUserX, FiBarChart2 } from 'react-icons/fi';

export default function ComplianceReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('violations');

  // Mock data
  const complianceData = {
    summary: {
      overduePayments: 23,
      attendanceGaps: 15,
      policyViolations: 3,
      pendingAudits: 7
    },
    violations: [
      { id: '1', type: 'PAYMENT_DELAY', description: 'भुगतान 15 दिनों से अधिक से अधिक देर से', project: 'गांव सड़क निर्माण', amount: '₹2,45,000', daysOverdue: 22 },
      { id: '2', type: 'ATTENDANCE_GAP', description: 'उपस्थिति लॉक के बाद अंकित', project: 'जल संरक्षण', workerCount: 8, date: '2024-01-18' },
      { id: '3', type: 'BANK_VERIFICATION', description: 'कार्यकर्ता का बैंक खाता सत्यापित नहीं', workerCount: 12, status: 'PENDING' },
    ],
    mgnregaCompliance: {
      wageRateCompliance: '98%',
      workLimitCompliance: '95%',
      mandatoryWorkCompliance: '92%',
      documentationCompliance: '89%'
    }
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
                <FiAlertTriangle className="mr-3 text-red-600" />
                {language === 'hi' ? 'अनुपालन रिपोर्ट' : 'Compliance Reports'}
              </h1>
            </div>
            
            <div className="flex space-x-1 border-b border-gray-200">
              {['violations', 'mgnrega', 'audit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'violations' && (language === 'hi' ? 'उल्लंघन' : 'Violations')}
                  {tab === 'mgnrega' && (language === 'hi' ? 'MGNREGA अनुपालन' : 'MGNREGA Compliance')}
                  {tab === 'audit' && (language === 'hi' ? 'ऑडिट' : 'Audit')}
                </button>
              ))}
            </div>
            
            <div className="flex items-center mt-4 space-x-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              
              <button 
                onClick={() => handleExport('compliance')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
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
        {activeTab === 'violations' && (
          <>
            {/* Critical Issues Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FiClock className="text-red-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'अतुल्य भुगतान' : 'Overdue Payments'}</p>
                    <p className="text-2xl font-bold text-red-600">{complianceData.summary.overduePayments}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border-2 border-yellow-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FiAlertTriangle className="text-yellow-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'उपस्थिति अंतर' : 'Attendance Gaps'}</p>
                    <p className="text-2xl font-bold text-yellow-600">{complianceData.summary.attendanceGaps}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FiUserX className="text-orange-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'नीति उल्लंघन' : 'Policy Violations'}</p>
                    <p className="text-2xl font-bold text-orange-600">{complianceData.summary.policyViolations}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiBarChart2 className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{language === 'hi' ? 'लंबित ऑडिट' : 'Pending Audits'}</p>
                    <p className="text-2xl font-bold text-blue-600">{complianceData.summary.pendingAudits}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Violations List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {language === 'hi' ? 'महत्वपूर्ण उल्लंघन' : 'Critical Violations'}
                </h2>
                <button 
                  onClick={() => handleExport('compliance-audit')}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FiDownload className="mr-2" /> {language === 'hi' ? 'ऑडिट रिपोर्ट' : 'Audit Report'}
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {complianceData.violations.map((violation) => (
                  <div key={violation.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${
                          violation.type === 'PAYMENT_DELAY' ? 'bg-red-100' :
                          violation.type === 'ATTENDANCE_GAP' ? 'bg-yellow-100' : 'bg-orange-100'
                        }`}>
                          <FiAlertTriangle className={`${
                            violation.type === 'PAYMENT_DELAY' ? 'text-red-600' :
                            violation.type === 'ATTENDANCE_GAP' ? 'text-yellow-600' : 'text-orange-600'
                          }`} />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {violation.type === 'PAYMENT_DELAY' && (language === 'hi' ? 'भुगतान विलंब' : 'Payment Delay')}
                            {violation.type === 'ATTENDANCE_GAP' && (language === 'hi' ? 'उपस्थिति अंतर' : 'Attendance Gap')}
                            {violation.type === 'BANK_VERIFICATION' && (language === 'hi' ? 'बैंक सत्यापन' : 'Bank Verification')}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {language === 'hi' ? 'तत्काल ध्यान आवश्यक' : 'Immediate Attention'}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">{violation.description}</p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">{language === 'hi' ? 'परियोजना:' : 'Project:'} </span>
                            <span className="font-medium text-gray-900">{violation.project}</span>
                          </div>
                          {violation.amount && (
                            <div>
                              <span className="text-gray-500">{language === 'hi' ? 'राशि:' : 'Amount:'} </span>
                              <span className="font-medium text-red-600">{violation.amount}</span>
                            </div>
                          )}
                          {violation.daysOverdue && (
                            <div>
                              <span className="text-gray-500">{language === 'hi' ? 'देर:' : 'Overdue:'} </span>
                              <span className="font-medium text-red-600">{violation.daysOverdue} {language === 'hi' ? 'दिन' : 'days'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'mgnrega' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {language === 'hi' ? 'MGNREGA अनुपालन मेट्रिक्स' : 'MGNREGA Compliance Metrics'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">
                  {language === 'hi' ? 'मजदूरी दर अनुपालन' : 'Wage Rate Compliance'}
                </h3>
                <p className="text-3xl font-bold text-green-600">{complianceData.mgnregaCompliance.wageRateCompliance}</p>
                <p className="text-sm text-green-700 mt-2">
                  {language === 'hi' ? 'मानक मजदूरी दरों का अनुपालन' : 'Compliance with standard wage rates'}
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  {language === 'hi' ? 'कार्य सीमा अनुपालन' : 'Work Limit Compliance'}
                </h3>
                <p className="text-3xl font-bold text-blue-600">{complianceData.mgnregaCompliance.workLimitCompliance}</p>
                <p className="text-sm text-blue-700 mt-2">
                  {language === 'hi' ? '100 दिनों की कार्य सीमा का अनुपालन' : 'Compliance with 100-day work limit'}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">
                  {language === 'hi' ? 'अनिवार्य कार्य अनुपालन' : 'Mandatory Work Compliance'}
                </h3>
                <p className="text-3xl font-bold text-yellow-600">{complianceData.mgnregaCompliance.mandatoryWorkCompliance}</p>
                <p className="text-sm text-yellow-700 mt-2">
                  {language === 'hi' ? 'अनिवार्य कार्य श्रेणियों का अनुपालन' : 'Compliance with mandatory work categories'}
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">
                  {language === 'hi' ? 'दस्तावेजीकरण अनुपालन' : 'Documentation Compliance'}
                </h3>
                <p className="text-3xl font-bold text-purple-600">{complianceData.mgnregaCompliance.documentationCompliance}</p>
                <p className="text-sm text-purple-700 mt-2">
                  {language === 'hi' ? 'आवश्यक दस्तावेजीकरण का अनुपालन' : 'Compliance with required documentation'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {language === 'hi' ? 'ऑडिट रिपोर्ट' : 'Audit Reports'}
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  {language === 'hi' ? 'त्रैमासिक ऑडिट' : 'Quarterly Audit'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'hi' ? 'अगला ऑडिट: मार्च 2024' : 'Next Audit: March 2024'}
                </p>
                <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {language === 'hi' ? 'विस्तृत रिपोर्ट देखें' : 'View Detailed Report'}
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  {language === 'hi' ? 'वार्षिक लेखा परीक्षा' : 'Annual Financial Audit'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'hi' ? 'अगला लेखा परीक्षा: जून 2024' : 'Next Financial Audit: June 2024'}
                </p>
                <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {language === 'hi' ? 'विस्तृत रिपोर्ट देखें' : 'View Detailed Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}