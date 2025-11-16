'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../lib/api';

export default function WorkDemandPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // Work demand requests state
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Project selection state
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectLoading, setProjectLoading] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  
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
  
  // Fetch all work demand requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch work demand requests
        const response = await adminApi.getWorkDemandRequests(statusFilter);
        setRequests(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load work demand requests');
        console.error('Error fetching work demand requests:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [statusFilter]);
  
  // Fetch projects for project selection modal
  const fetchProjects = async () => {
    try {
      setProjectLoading(true);
      const response = await adminApi.getProjects();
      setProjects(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setProjectLoading(false);
    }
  };
  
  // Handle request approval with project selection
  const handleApproveRequest = async (requestId: string, projectId?: string) => {
    try {
      // If project ID is provided, approve with project assignment
      if (projectId) {
        // Approve the work demand request with project ID
        await adminApi.approveWorkDemandRequest(requestId, projectId);
        setSuccess('Request approved and worker assigned to project successfully!');
        setShowProjectModal(false);
        setSelectedProjectId('');
      } else {
        // Check if the request already has a project
        const request = requests.find(r => r.id === requestId);
        if (request && request.project_id) {
          // Already has a project, approve directly
          await adminApi.approveWorkDemandRequest(requestId);
          setSuccess('Request approved successfully!');
        } else {
          // No project assigned, show project selection modal
          setSelectedRequestId(requestId);
          await fetchProjects();
          setShowProjectModal(true);
          return;
        }
      }
      
      // Refresh the requests list
      const response = await adminApi.getWorkDemandRequests(statusFilter);
      setRequests(response.data || []);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to approve request');
      console.error('Error approving request:', err);
    }
  };
  
  // Handle project selection and approval
  const handleProjectSelection = async () => {
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }
    
    await handleApproveRequest(selectedRequestId, selectedProjectId);
  };
  
  // Handle request rejection
  const handleRejectRequest = async (requestId: string) => {
    try {
      await adminApi.rejectWorkDemandRequest(requestId);
      setSuccess('Request rejected successfully!');
      
      // Refresh the requests list
      const response = await adminApi.getWorkDemandRequests(statusFilter);
      setRequests(response.data || []);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reject request');
      console.error('Error rejecting request:', err);
    }
  };
  
  // Filter requests based on status
  const filteredRequests = statusFilter === 'all' 
    ? requests 
    : requests.filter(request => request.status === statusFilter);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('workDemandRequests')}</h1>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('workDemandRequests')}</h2>
        
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
        
        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('all')}
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('pending')}
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                statusFilter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('approved')}
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                statusFilter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('rejected')}
            </button>
          </div>
        </div>
        
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('project')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('requestTime')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.worker_name}</div>
                          <div className="text-sm text-gray-500">{request.worker_aadhaar}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.project_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.request_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {t(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                {t('approve')}
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                {t('reject')}
                              </button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <span className="text-green-600">{t('approved')}</span>
                          )}
                          {request.status === 'rejected' && (
                            <span className="text-red-600">{t('rejected')}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {t('noWorkDemandRequestsFound')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Project Selection Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{t('selectProject')}</h3>
                <button 
                  onClick={() => {
                    setShowProjectModal(false);
                    setSelectedProjectId('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                {t('selectProjectForWorker')} {requests.find(r => r.id === selectedRequestId)?.worker_name}
              </p>
              
              {projectLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    {projects.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {projects.map((project: any) => (
                          <li key={project.id} className="p-4 hover:bg-blue-50 transition-colors duration-200">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id={`project-${project.id}`}
                                name="selectedProject"
                                checked={selectedProjectId === project.id}
                                onChange={() => setSelectedProjectId(project.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={`project-${project.id}`} className="ml-3 flex flex-col">
                                <span className="text-gray-800 font-medium">{project.name}</span>
                                <span className="text-gray-500 text-sm">
                                  {t('workersNeeded')}: {project.worker_need} | {t('workersAssigned')}: {project.assigned_workers || 0}
                                </span>
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">{t('noProjectsAvailable')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectModal(false);
                        setSelectedProjectId('');
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleProjectSelection}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      disabled={!selectedProjectId}
                    >
                      {t('approveAndAssign')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}