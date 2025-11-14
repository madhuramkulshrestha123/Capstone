'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';

export default function AdminJobCardApplications() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // State for applications
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch applications
  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    
    try {
      let url = 'http://localhost:3001/api/v1/job-card-applications/applications';
      if (selectedStatus !== 'all') {
        url = `http://localhost:3001/api/v1/job-card-applications/applications/status/${selectedStatus}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        setApplications(result.data);
      } else {
        const errorResult = await response.json();
        setError(errorResult.error?.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('An error occurred while fetching applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (trackingId: string, status: string) => {
    try {
      const endpoint = status === 'approved' 
        ? `http://localhost:3001/api/v1/admin/applications/${trackingId}/approve`
        : `http://localhost:3001/api/v1/admin/applications/${trackingId}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        // Refresh the applications list
        fetchApplications();
        alert(`Application ${status} successfully`);
      } else {
        const errorResult = await response.json();
        alert(`Failed to ${status} application: ${errorResult.error?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Error ${status} application:`, err);
      alert(`Failed to ${status} application`);
    }
  };

  // Get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('sentToAuthority');
      case 'approved':
        return t('identityVerified');
      case 'rejected':
        return t('rejected');
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">{t('jobCardApplications')}</h1>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
                >
                  {language === 'en' ? t('hindi') : t('english')}
                </button>
              </div>
            </div>
            <p className="text-indigo-100 mt-2">
              {t('manageJobCardApplications')}
            </p>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">{t('filterByStatus')}:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              >
                <option value="all">{t('all')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="approved">{t('approved')}</option>
                <option value="rejected">{t('rejected')}</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('trackingId')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('aadhaarNumber')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('headOfHouseholdName')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('district')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('submittedOn')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application.trackingId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {application.trackingId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.aadhaarNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.headOfHouseholdName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.district}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            application.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : application.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {getStatusDisplayText(application.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {application.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateApplicationStatus(application.trackingId, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                {t('approve')}
                              </button>
                              <button
                                onClick={() => updateApplicationStatus(application.trackingId, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                {t('reject')}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {applications.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">{t('noApplicationsFound')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}