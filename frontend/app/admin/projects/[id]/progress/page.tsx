'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../../../lib/api';
import { useParams } from 'next/navigation';

export default function ProjectProgressPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // Project and progress state
  const [project, setProject] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingPayments, setGeneratingPayments] = useState(false);
  
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
  
  // Fetch project details and progress data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const projectResponse = await adminApi.getProjectById(projectId);
        setProject(projectResponse);
        
        // Fetch workers assigned to this project
        const workersResponse = await adminApi.getAssignedWorkersByProjectId(projectId);
        setWorkers(workersResponse || []);
        
        // Fetch real attendance data for this project
        const attendanceResponse = await adminApi.get(`/attendances/project/${projectId}/date-range?startDate=${dateRange.start}&endDate=${dateRange.end}`);
        
        // Fetch all workers with details to get job card IDs
        const allWorkersResponse = await adminApi.get('/users/workers/details');
        const allWorkers = allWorkersResponse.data || [];
        
        // Process attendance data to group by date
        const attendanceRecords = attendanceResponse.data || [];
        
        // Group attendance by date
        const attendanceByDate: any = {};
        attendanceRecords.forEach((record: any) => {
          const date = record.date;
          if (!attendanceByDate[date]) {
            attendanceByDate[date] = { present: 0, absent: 0, records: [] };
          }
          
          if (record.status === 'PRESENT') {
            attendanceByDate[date].present += 1;
          } else {
            attendanceByDate[date].absent += 1;
          }
          
          // Add worker details to the record
          const worker = allWorkers.find((w: any) => w.id === record.worker_id);
          attendanceByDate[date].records.push({
            ...record,
            worker_name: worker?.name || 'Unknown Worker',
            job_card_id: worker?.job_card_id || 'N/A'
          });
        });
        
        // Convert to array format
        const attendanceArray = Object.keys(attendanceByDate)
          .sort()
          .map(date => ({
            date,
            present: attendanceByDate[date].present,
            absent: attendanceByDate[date].absent,
            records: attendanceByDate[date].records
          }));
        
        setAttendanceData(attendanceArray);
        setFilteredAttendance(attendanceArray);
      } catch (err: any) {
        setError(err.message || 'Failed to load project data');
        console.error('Error fetching project data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchData();
    }
  }, [projectId, dateRange]);
  
  // Filter attendance data based on date range
  useEffect(() => {
    const filtered = attendanceData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredAttendance(filtered);
  }, [attendanceData, dateRange]);
  
  // Calculate attendance rate
  const calculateAttendanceRate = () => {
    if (filteredAttendance.length === 0) return 0;
    
    const totalPresent = filteredAttendance.reduce((sum, day) => sum + day.present, 0);
    const totalAttendance = filteredAttendance.reduce((sum, day) => sum + day.present + day.absent, 0);
    
    return totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0;
  };
  
  // Calculate total payments processed
  const calculateTotalPayments = () => {
    if (!project || filteredAttendance.length === 0) return 0;
    
    const dailyWage = project.wage_per_worker || 0;
    const totalPresentDays = filteredAttendance.reduce((sum, day) => sum + day.present, 0);
    
    return dailyWage * totalPresentDays;
  };
  
  // Generate payments from attendance
  const generatePaymentsFromAttendance = async () => {
    if (!project) return;
    
    try {
      setGeneratingPayments(true);
      const response = await adminApi.post(`/payments/generate-from-attendance/${projectId}`, {
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      
      alert(`${response.message || response.data?.message || `Successfully generated ${response.data?.length || 0} payment records`}. ${t('refreshPaymentManagement')}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate payments');
      console.error('Error generating payments:', err);
    } finally {
      setGeneratingPayments(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('projectProgress')}</h1>
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              {t('retry')}
            </button>
          </div>
        ) : project ? (
          <>
            {/* Project Header */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('assignedWorkers')}</p>
                    <p className="text-2xl font-bold text-gray-800">{workers.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('attendanceRate')}</p>
                    <p className="text-2xl font-bold text-gray-800">{calculateAttendanceRate()}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('paymentsProcessed')}</p>
                    <p className="text-2xl font-bold text-gray-800">₹{calculateTotalPayments().toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Date Range Filter */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('filterByDate')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('startDate')}</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('endDate')}</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Generate Payments Button */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{t('generatePayments')}</h3>
                  <p className="text-gray-600">{t('generatePaymentsDescription')}</p>
                </div>
                <button
                  onClick={generatePaymentsFromAttendance}
                  disabled={generatingPayments}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {generatingPayments ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('generatingPayments')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {t('generatePayments')}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Workers and Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Assigned Workers */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('assignedWorkers')}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('workerName')}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('assignedDate')}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workers.length > 0 ? (
                        workers.map((worker) => (
                          <tr key={worker.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{worker.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {worker.assigned_date ? new Date(worker.assigned_date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                worker.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                worker.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {worker.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">
                            {t('noWorkersAssigned')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Attendance Chart */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('attendance')}</h3>
                <div className="space-y-4">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((day, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>{new Date(day.date).toLocaleDateString('en-IN')}</span>
                          <span>{day.present} present, {day.absent} absent</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(day.present / (day.present + day.absent)) * 100}%` }}
                          ></div>
                        </div>
                        {/* Show worker details on hover */}
                        <div className="mt-2 text-xs text-gray-400">
                          {day.records.slice(0, 3).map((record: any, i: number) => (
                            <div key={i} className="flex justify-between">
                              <span>{record.worker_name}</span>
                              <span className={record.status === 'PRESENT' ? 'text-green-600' : 'text-red-600'}>
                                {record.status}
                              </span>
                            </div>
                          ))}
                          {day.records.length > 3 && (
                            <div className="text-center text-gray-500 mt-1">
                              +{day.records.length - 3} more workers
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t('noAttendanceData')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">{t('projectNotFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}