'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../../lib/api';

export default function CreateProjectPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    worker_need: 1,
    start_date: '',
    end_date: '',
    status: 'pending' as 'pending' | 'active' | 'completed',
    wage_per_worker: 374 // Minimum wage per manday
  });
  
  // Available workers state
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
  
  // Fetch available workers
  useEffect(() => {
    const fetchAvailableWorkers = async () => {
      try {
        setLoading(true);
        // Fetch workers whose job card is approved and who are available
        const workers = await adminApi.getAvailableWorkers();
        setAvailableWorkers(workers);
      } catch (err: any) {
        setError(err.message || 'Failed to load available workers');
        console.error('Error fetching available workers:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableWorkers();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'worker_need' || name === 'wage_per_worker' ? parseInt(value) || 1 : value
    }));
  };
  
  // Handle worker selection
  const handleWorkerSelection = (workerId: string) => {
    setSelectedWorkers(prev => {
      if (prev.includes(workerId)) {
        return prev.filter(id => id !== workerId);
      } else {
        return [...prev, workerId];
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Create the project
      const project = await adminApi.createProject(formData);
      
      // If workers were selected, assign them to the project
      if (selectedWorkers.length > 0) {
        await adminApi.assignWorkersToProject(project.id, selectedWorkers);
      }
      
      setSuccess('Project created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        location: '',
        worker_need: 1,
        start_date: '',
        end_date: '',
        status: 'pending',
        wage_per_worker: 374
      });

      setSelectedWorkers([]);
      
      // Redirect to projects list after success
      setTimeout(() => {
        window.location.href = '/admin/projects';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      console.error('Error creating project:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Filter workers by location (same district and panchayat as project)
  const filteredWorkers = availableWorkers.filter(worker => {
    // In a real implementation, this would check if the worker's district and panchayat
    // match the project's location and if they are available (not assigned to other work)
    // For now, we show all workers
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('createNewProject')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button 
                onClick={() => window.location.href = '/admin/projects'}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {t('back')}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('createNewProject')}</h2>
          
          {/* Wage Information Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <strong>{t('note')}:</strong> {t('minimumWageNotice')}
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                {t('projectName')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder={t('enterProjectName')}
                required
              />
            </div>
            
            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder={t('enterProjectDescription')}
              />
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                {t('location')} *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder={t('enterProjectLocation')}
                required
              />
            </div>
            
            {/* Worker Need */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                {t('workerNeed')} *
              </label>
              <input
                type="number"
                name="worker_need"
                min="1"
                value={formData.worker_need}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                required
              />
            </div>
            
            {/* Wage Per Worker */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                {t('wagePerWorker')} (₹) *
              </label>
              <input
                type="number"
                name="wage_per_worker"
                min="374"
                value={formData.wage_per_worker}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{t('minimumWageInfo')}</p>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  {t('startDate')} *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  {t('endDate')} *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  required
                />
              </div>
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                {t('status')}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              >
                <option value="pending">{t('pending')}</option>
                <option value="active">{t('active')}</option>
                <option value="completed">{t('completed')}</option>
              </select>
            </div>
            
            {/* Available Workers */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">{t('assignWorkers')}</h3>
              
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {filteredWorkers.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredWorkers.map((worker: any) => (
                        <li key={worker.user_id} className="p-4 hover:bg-blue-50 transition-colors duration-200">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`worker-${worker.user_id}`}
                              checked={selectedWorkers.includes(worker.user_id)}
                              onChange={() => handleWorkerSelection(worker.user_id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`worker-${worker.user_id}`} className="ml-3 flex flex-col">
                              <span className="text-gray-800 font-medium">{worker.name}</span>
                              <span className="text-gray-500 text-sm">
                                {t('district')}: {worker.district} | {t('panchayat')}: {worker.panchayat_id}
                              </span>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">{t('noAvailableWorkers')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => window.location.href = '/admin/projects'}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={submitting}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? t('creating') : t('createProject')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}