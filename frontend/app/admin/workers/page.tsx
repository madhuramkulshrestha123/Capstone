'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../lib/api';

export default function WorkersPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // Workers state
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Worker detail modal state
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Calculate statistics using useMemo for performance
  const workerStats = useMemo(() => {
    const total = workers.length;
    const assigned = workers.filter(worker => worker.current_status === 'assigned').length;
    const available = workers.filter(worker => worker.current_status === 'available').length;
    
    return { total, assigned, available };
  }, [workers]);
  
  // Set auth token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    } else {
      // Redirect to login if no token
      window.location.href = '/auth';
    }
  }, []);
  
  // Fetch all workers
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        // Fetch workers with job card details and work history
        const response = await adminApi.getWorkersWithDetails();
        setWorkers(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load workers');
        console.error('Error fetching workers:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkers();
  }, []);
  
  // Function to open worker detail modal
  const openWorkerDetail = (worker: any) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };
  
  // Function to close worker detail modal
  const closeWorkerDetail = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('workersPage')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? t('hindi') : t('english')}
              </button>
              <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {t('back')}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('workersPage')}</h2>
        
        {/* Worker Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Workers */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <span className="text-2xl">👷</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('totalWorkersPage')}</p>
                <p className="text-3xl font-bold text-gray-800">{workerStats.total}</p>
              </div>
            </div>
          </div>

          {/* Assigned Workers */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('assignedWorkersList')}</p>
                <p className="text-3xl font-bold text-gray-800">{workerStats.assigned}</p>
              </div>
            </div>
          </div>

          {/* Available Workers */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                <span className="text-2xl">🕒</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('availableWorkers')}</p>
                <p className="text-3xl font-bold text-gray-800">{workerStats.available}</p>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('workerName')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('jobCardIdLabel')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('currentStatus')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('workHistory')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('totalAmount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentDeadline')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workers.length > 0 ? (
                    workers.map((worker) => (
                      <tr 
                        key={worker.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => openWorkerDetail(worker)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                          <div className="text-sm text-gray-500">{worker.aadhaar_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {worker.job_card_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            worker.current_status === 'assigned' ? 'bg-green-100 text-green-800' :
                            worker.current_status === 'available' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {worker.current_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {worker.work_history?.length || 0} projects
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{worker.total_amount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {worker.payment_deadline || 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {t('noWorkersFound')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Worker Detail Modal */}
      {isModalOpen && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{t('workerDetails')}</h3>
                <button 
                  onClick={closeWorkerDetail}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Worker Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('personalInformation')}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">{t('name')}</p>
                      <p className="font-medium">{selectedWorker.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('aadhaarNumber')}</p>
                      <p className="font-medium">{selectedWorker.aadhaar_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('currentStatus')}</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedWorker.current_status === 'assigned' ? 'bg-green-100 text-green-800' :
                        selectedWorker.current_status === 'available' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedWorker.current_status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('district')}</p>
                      <p className="font-medium">{selectedWorker.district || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('panchayatId')}</p>
                      <p className="font-medium">{selectedWorker.panchayat_id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Job Card Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('jobCardDetails')}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">{t('jobCardIdLabel')}</p>
                      <p className="font-medium">{selectedWorker.job_card_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('totalAmount')}</p>
                      <p className="font-medium">₹{selectedWorker.total_amount || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('paymentDeadline')}</p>
                      <p className="font-medium">{selectedWorker.payment_deadline || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Work History */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('workHistory')}</h4>
                  {selectedWorker.work_history && selectedWorker.work_history.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('projectName')}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('startDate')}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('endDate')}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wagePerWorker')}</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedWorker.work_history.map((project: any, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                ₹{project.wage_per_worker || 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">{t('noWorkHistory')}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeWorkerDetail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}