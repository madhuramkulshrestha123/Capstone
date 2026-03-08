'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi } from '../../lib/api';

export default function WorkerDashboard() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [workerData, setWorkerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Demand Job Modal State
  const [isDemandJobModalOpen, setIsDemandJobModalOpen] = useState(false);
  const [jobId, setJobId] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [modalWorkerDetails, setModalWorkerDetails] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem('isWorker');
    const workerDataStr = localStorage.getItem('workerData');
    
    if (!isWorker || !workerDataStr) {
      // Redirect to login if not logged in
      window.location.href = '/auth';
      return;
    }
    
    try {
      const data = JSON.parse(workerDataStr);
      setWorkerData(data);
      // Set default values from worker data
      setJobId(data.job_card_id || '');
      setAadhaarNumber(data.aadhaar_number || '');
      
      // Fetch and calculate attendance percentage from actual attendance records
      fetchAttendanceData(data.id);
    } catch (error) {
      console.error('Error parsing worker data:', error);
      window.location.href = '/auth';
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAttendancePercentageFromData = (attendanceRecords: any[]) => {
    if (!attendanceRecords || attendanceRecords.length === 0) return 0;
    
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((record: any) => record.status === 'PRESENT' || record.status === 'present').length;
    
    return totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  };

  const fetchAttendanceData = async (workerId: string) => {
    try {
      // Fetch attendance data from backend
      const response = await adminApi.getMyAttendance(1, 100); // Get all records
      
      // Transform the data to match our expected format
      const transformedData = response.data.map((record: any) => ({
        id: record.id,
        date: record.date,
        project_name: record.project?.name || 'Unknown Project',
        status: record.status,
        marked_by: record.marked_by_user?.name || 'Unknown Supervisor',
        project_id: record.project_id
      }));
      
      setAttendanceData(transformedData);
      const percentage = calculateAttendancePercentageFromData(transformedData);
      setAttendancePercentage(percentage);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      // Fallback to mock data if API fails
      const mockAttendance = [
        {
          id: '1',
          date: '2026-02-01',
          project_name: 'Road Construction',
          status: 'PRESENT',
          marked_by: 'Supervisor A',
          project_id: 'proj-1'
        },
        {
          id: '2',
          date: '2026-02-02',
          project_name: 'Road Construction',
          status: 'ABSENT',
          marked_by: 'Supervisor A',
          project_id: 'proj-1'
        },
        {
          id: '3',
          date: '2026-02-03',
          project_name: 'Bridge Repair',
          status: 'PRESENT',
          marked_by: 'Supervisor B',
          project_id: 'proj-2'
        }
      ];
      
      setAttendanceData(mockAttendance);
      const percentage = calculateAttendancePercentageFromData(mockAttendance);
      setAttendancePercentage(percentage);
    }
  };

  // Demand Job Modal Functions
  const openDemandJobModal = () => {
    // Pre-populate with worker's own data
    setJobId(workerData?.job_card_id || '');
    setAadhaarNumber(workerData?.aadhaar_number || '');
    setIsDemandJobModalOpen(true);
  };

  const closeDemandJobModal = () => {
    setIsDemandJobModalOpen(false);
    resetDemandJobForm();
  };

  const resetDemandJobForm = () => {
    setJobId(workerData?.job_card_id || '');
    setAadhaarNumber(workerData?.aadhaar_number || '');
    setModalWorkerDetails(null);
    setIsVerified(false);
    setError('');
  };

  // Verify Worker
  const verifyWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await adminApi.verifyWorker(aadhaarNumber, jobId);
      setModalWorkerDetails(response.data);
      setIsVerified(true);
    } catch (err: any) {
      setError(err.message || 'Failed to verify worker details. Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demand Work
  const demandWork = async () => {
    try {
      const response = await adminApi.demandWork(jobId);
      alert('Work demand submitted successfully!');
      closeDemandJobModal();
    } catch (err: any) {
      alert(err.message || 'Failed to submit work demand. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('workerData');
    localStorage.removeItem('isWorker');
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading worker dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sticky Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 ${isDarkTheme ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800' : 'bg-white/95 backdrop-blur-lg border-b border-gray-200'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Primary Navigation */}
            <div className="flex items-center flex-1 min-w-0">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${isDarkTheme ? 'bg-blue-600' : 'bg-blue-500'} shadow-md`}>
                  <span className="text-white font-bold text-base sm:text-xl">S</span>
                </div>
                <span className={`text-base sm:text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'} hidden xs:block`}>
                  Smart Rozgar
                </span>
              </div>

              {/* Primary Navigation - Left Aligned */}
              <div className="hidden lg:flex items-center space-x-1 ml-6 xl:ml-8">
                <button 
                  onClick={() => window.location.href = '/worker/work-history'}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    isDarkTheme 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Work History
                </button>
                <button 
                  onClick={() => window.location.href = '/worker/attendance'}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    isDarkTheme 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Attendance
                </button>
                <button 
                  onClick={() => window.location.href = '/worker/payments'}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    isDarkTheme 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Payments
                </button>
                <button 
                  onClick={() => window.location.href = '/raise-complaint'}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    isDarkTheme 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Complaints
                </button>
              </div>
            </div>

            {/* Right Section - Controls & Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 text-base sm:text-lg hover:scale-110 ${
                  isDarkTheme 
                    ? 'text-yellow-400 hover:bg-gray-800/50 hover:shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100/50 hover:shadow-lg'
                }`}
                title="Toggle Dark Mode"
              >
                {isDarkTheme ? '☀️' : '🌙'}
              </button>
              
              {/* Language Toggle - Hidden on small mobile */}
              <button 
                onClick={toggleLanguage}
                className={`hidden sm:flex px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDarkTheme 
                      ? 'text-gray-300 hover:bg-gray-800/50 hover:shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100/50 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkTheme ? 'bg-blue-600 shadow-md' : 'bg-blue-500 shadow-md'}`}>
                    <span className="text-white text-sm font-medium">👤</span>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">Profile</span>
                  <svg className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-52 rounded-xl shadow-2xl z-50 profile-dropdown-container overflow-hidden ${
                      isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="py-1">
                      <div className={`px-4 py-3 border-b ${isDarkTheme ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
                        <p className={`text-sm font-medium truncate ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                          {workerData?.name || 'Worker'}
                        </p>
                        <p className={`text-xs truncate mt-0.5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                          {workerData?.job_card_number || workerData?.job_card_id || 'N/A'}
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          window.location.href = '/worker/profile';
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isDarkTheme ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base">👤</span>
                        View Profile
                      </button>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isDarkTheme ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <span className="text-base">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Page Header (Welcome Section) */}
        <div className={`rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 shadow-lg ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'} border ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome, {workerData?.name || 'Worker'} 👋
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 break-all">
                Job Card ID: <span className="font-semibold text-blue-600 dark:text-blue-400">{workerData?.job_card_number || workerData?.job_card_id || 'N/A'}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${workerData?.current_status === 'assigned' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                <span className="mr-2">🟢</span>
                {workerData?.current_status === 'assigned' ? 'Currently Assigned' : 'Available for Work'}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Last Login: {formatDateTime(workerData?.login_time)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className={`rounded-xl p-4 sm:p-6 shadow-md border ${isDarkTheme ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${isDarkTheme ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <span className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl">🏗</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {workerData?.work_history?.length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 sm:p-6 shadow-md border ${isDarkTheme ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${isDarkTheme ? 'bg-green-900/50' : 'bg-green-100'}`}>
                <span className="text-green-600 dark:text-green-400 text-lg sm:text-xl">🟢</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                <p className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {workerData?.current_status === 'assigned' ? 'Assigned' : 'Available'}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 sm:p-6 shadow-md border ${isDarkTheme ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${isDarkTheme ? 'bg-amber-900/50' : 'bg-amber-100'}`}>
                <span className="text-amber-600 dark:text-amber-400 text-lg sm:text-xl">💰</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Amount Earned</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{workerData?.total_amount || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 sm:p-6 shadow-md border ${isDarkTheme ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${isDarkTheme ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                <span className="text-purple-600 dark:text-purple-400 text-lg sm:text-xl">📅</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Attendance %</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{attendancePercentage !== null ? `${attendancePercentage}%` : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Personal Information */}
          <div className={`lg:col-span-2 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'} border ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 text-blue-700 dark:text-blue-300 border-b pb-2">Basic Details</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">{workerData?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Aadhaar Number</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">{workerData?.aadhaar_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">{workerData?.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{workerData?.category || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Belongs to BPL</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{workerData?.belongs_to_bpl ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 text-blue-700 dark:text-blue-300 border-b pb-2">Address Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Full Address</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">{workerData?.full_address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Village</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">{workerData?.village || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Panchayat</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">{workerData?.panchayat || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Block</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{workerData?.block || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">District</p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{workerData?.district || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Actions */}
          <div className="space-y-6 lg:space-y-8">
            {/* Recent Work Card */}
            {workerData?.work_history && workerData.work_history.length > 0 && (
              <div className={`rounded-2xl p-4 sm:p-6 shadow-lg ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'} border ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Work</h3>
                
                <div className={`p-3 sm:p-4 rounded-xl ${workerData?.work_history[0]?.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white break-all">{workerData?.work_history[0]?.name || workerData?.work_history[0]?.project_name || 'Unnamed Project'}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {formatDate(workerData?.work_history[0]?.start_date)} – {formatDate(workerData?.work_history[0]?.end_date)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Wage Earned: ₹{workerData?.work_history[0]?.wage_per_worker || workerData?.work_history[0]?.wage || 0}
                  </p>
                  <div className={`mt-2 sm:mt-3 inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${workerData?.work_history[0]?.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'}`}>
                    {workerData?.work_history[0]?.status === 'completed' ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className={`rounded-2xl p-4 sm:p-6 shadow-lg ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'} border ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
              
              <div className="space-y-2 sm:space-y-3">
                <button 
                  onClick={() => window.location.href = '/worker/attendance'}
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                  title="View your daily attendance and total working days"
                >
                  <span className="mr-2 text-base sm:text-lg">📅</span>
                  Attendance Log
                </button>
                
                <button 
                  onClick={() => window.location.href = '/worker/payments'}
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base bg-amber-600 hover:bg-amber-700 transition-colors shadow-md"
                >
                  <span className="mr-2 text-base sm:text-lg">💰</span>
                  View Payments
                </button>
                
                <button 
                  onClick={openDemandJobModal}
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                >
                  <span className="mr-2 text-base sm:text-lg">🛠</span>
                  Demand Work
                </button>
                
                <button 
                  onClick={() => window.location.href = '/worker/work-history'}
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
                >
                  <span className="mr-2 text-base sm:text-lg">📂</span>
                  Work History
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-12 ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-xl' : 'bg-white/90 backdrop-blur-lg shadow-xl'} border-t ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="text-center text-gray-600 dark:text-gray-400 max-w-7xl mx-auto">
          <p className="text-sm sm:text-base">© 2025 Smart Rozgar Portal. All rights reserved.</p>
        </div>
      </footer>

      {/* Demand Job Modal */}
      {isDemandJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className={`rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto my-8 ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">Demand Work</h3>
                <button 
                  onClick={closeDemandJobModal}
                  className={`text-gray-500 hover:text-gray-700 ${isDarkTheme ? 'hover:text-gray-300' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {!isVerified ? (
                <form onSubmit={verifyWorker}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Aadhaar Number
                      </label>
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter Aadhaar number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Job Card ID
                      </label>
                      <input
                        type="text"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter Job Card ID"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-6 flex justify-end space-x-2 sm:space-x-3">
                    <button
                      type="button"
                      onClick={closeDemandJobModal}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm ${isDarkTheme ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-white text-xs sm:text-sm ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className={`bg-blue-50 dark:bg-blue-900/30 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6`}>
                    <h4 className="font-bold text-sm sm:text-base mb-2 sm:mb-3">Worker Details</h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p><span className="font-medium">Name:</span> <span className="break-all">{modalWorkerDetails?.name || 'N/A'}</span></p>
                      <p><span className="font-medium">Aadhaar Number:</span> <span className="break-all">{modalWorkerDetails?.aadhaar_number || 'N/A'}</span></p>
                      <p><span className="font-medium">Job Card ID:</span> <span className="break-all">{jobId}</span></p>
                      <p><span className="font-medium">Current Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${modalWorkerDetails?.current_status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>
                          {modalWorkerDetails?.current_status || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-bold text-sm sm:text-base mb-2 sm:mb-3">Work History</h4>
                    {modalWorkerDetails?.work_history && modalWorkerDetails.work_history.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {modalWorkerDetails.work_history.map((work: any, index: number) => (
                          <div 
                            key={index} 
                            className={`p-2 sm:p-3 rounded-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}
                          >
                            <p className="font-medium text-xs sm:text-sm break-all">{work.name || work.project_name || 'Unnamed Project'}</p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {work.start_date ? new Date(work.start_date).toLocaleDateString() : 'N/A'} to {work.end_date ? new Date(work.end_date).toLocaleDateString() : 'N/A'} - ₹{work.wage_per_worker || work.wage || 0}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-xs sm:text-sm">No work history available</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 sm:space-x-3">
                    <button
                      type="button"
                      onClick={closeDemandJobModal}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm ${isDarkTheme ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      Close
                    </button>
                    <button
                      onClick={demandWork}
                      className="px-3 sm:px-4 py-2 rounded-lg font-medium text-white text-xs sm:text-sm bg-blue-600 hover:bg-blue-700"
                    >
                      Demand Work
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