'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../../../lib/api';
import { useParams } from 'next/navigation';

export default function AssignWorkersPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // Project and workers state
  const [project, setProject] = useState<any>(null);
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
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
  
  // Fetch project and available workers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const projectResponse = await adminApi.getProjectById(projectId);
        setProject(projectResponse);
        
        // Fetch available workers
        const workers = await adminApi.getAvailableWorkers();
        setAvailableWorkers(workers);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchData();
    }
  }, [projectId]);
  
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
      // Assign workers to the project
      await adminApi.assignWorkersToProject(projectId, selectedWorkers);
      
      setSuccess('Workers assigned to project successfully!');
      
      // Redirect to projects list after success
      setTimeout(() => {
        window.location.href = '/admin/projects';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to assign workers to project');
      console.error('Error assigning workers:', err);
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
            <h1 className="text-2xl font-bold">{t('assignWorkers')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? t('hindi') : t('english')}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('assignWorkers')}</h2>
          
          {project && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
              <p className="text-gray-600">{project.location}</p>
            </div>
          )}
          
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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Available Workers */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">{t('availableWorkers')}</h3>
                
                <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
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
                                District: {worker.district} | Panchayat: {worker.panchayat_id}
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
                  disabled={submitting || selectedWorkers.length === 0}
                >
                  {submitting ? t('assigning') : t('assignWorkers')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}