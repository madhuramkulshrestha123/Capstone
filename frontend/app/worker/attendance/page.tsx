'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi } from '../../lib/api';

export default function WorkerAttendance() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [workerData, setWorkerData] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [selectedProject, setSelectedProject] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState<any[]>([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem('isWorker');
    const workerDataStr = localStorage.getItem('workerData');
    
    if (!isWorker || !workerDataStr) {
      window.location.href = '/auth';
      return;
    }
    
    try {
      const data = JSON.parse(workerDataStr);
      setWorkerData(data);
      fetchAttendanceData(data.id);
    } catch (error) {
      console.error('Error parsing worker data:', error);
      window.location.href = '/auth';
    }
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

  useEffect(() => {
    filterAttendance();
  }, [attendanceData, dateRange, selectedProject, searchDate]);

  const fetchAttendanceData = async (workerId: string) => {
    try {
      setLoading(true);
      
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
      setFilteredAttendance(transformedData);
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
      setFilteredAttendance(mockAttendance);
    } finally {
      setLoading(false);
    }
  };

  const filterAttendance = () => {
    let filtered = [...attendanceData];
    
    // Filter by date range
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= fromDate && recordDate <= toDate;
      });
    }
    
    // Filter by project
    if (selectedProject) {
      filtered = filtered.filter(record => record.project_id === selectedProject);
    }
    
    // Filter by search date
    if (searchDate) {
      filtered = filtered.filter(record => 
        record.date === searchDate
      );
    }
    
    setFilteredAttendance(filtered);
  };

  const getAttendanceSummary = () => {
    const totalDays = attendanceData.length;
    const presents = attendanceData.filter(record => record.status === 'PRESENT').length;
    const absents = attendanceData.filter(record => record.status === 'ABSENT').length;
    const percentage = totalDays > 0 ? Math.round((presents / totalDays) * 100) : 0;
    
    return { totalDays, presents, absents, percentage };
  };

  const getProjectWiseSummary = () => {
    const projectSummary: any = {};
    
    attendanceData.forEach(record => {
      if (!projectSummary[record.project_id]) {
        projectSummary[record.project_id] = {
          projectName: record.project_name,
          totalDays: 0,
          presents: 0,
          absents: 0
        };
      }
      
      projectSummary[record.project_id].totalDays++;
      if (record.status === 'PRESENT') {
        projectSummary[record.project_id].presents++;
      } else {
        projectSummary[record.project_id].absents++;
      }
    });
    
    return Object.values(projectSummary);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const handleLogout = () => {
    localStorage.removeItem('workerData');
    localStorage.removeItem('isWorker');
    window.location.href = '/auth';
  };

  const downloadPDF = () => {
    // PDF download functionality would be implemented here
    alert('PDF download functionality will be implemented');
  };

  const downloadExcel = () => {
    // Excel download functionality would be implemented here
    alert('Excel download functionality will be implemented');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkTheme ? 'bg-gray-900' : 'bg-indigo-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  const summary = getAttendanceSummary();
  const projectSummary = getProjectWiseSummary();
  
  // Create unique projects array without using Set spread operator
  const uniqueProjects: string[] = [];
  const projectIds = attendanceData.map(record => record.project_id);
  projectIds.forEach(id => {
    if (id && !uniqueProjects.includes(id)) {
      uniqueProjects.push(id);
    }
  });

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sticky Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 ${isDarkTheme ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800' : 'bg-white/95 backdrop-blur-lg border-b border-gray-200'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkTheme ? 'bg-blue-600' : 'bg-blue-500'}`}>
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Smart Rozgar Portal
                </span>
              </div>
            </div>

            {/* Center - Primary Navigation (Hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => window.location.href = '/worker/work-history'}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Work History
              </button>
              <button 
                onClick={() => window.location.href = '/worker/attendance'}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkTheme ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} border-b-2 border-blue-500`}
              >
                Attendance
              </button>
              <button 
                onClick={() => window.location.href = '/worker/payments'}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Payments
              </button>
              <button 
                onClick={() => window.location.href = '/raise-complaint'}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Complaints
              </button>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Toggle Dark Mode"
              >
                {isDarkTheme ? '☀️' : '🌙'}
              </button>
              
              <button 
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isDarkTheme ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkTheme ? 'bg-blue-600' : 'bg-blue-500'}`}>
                    <span className="text-white font-medium">👤</span>
                  </div>
                  <span className="hidden sm:inline">Profile</span>
                  <svg className={`w-4 h-4 transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 profile-dropdown-container ${isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                  >
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          window.location.href = '/worker/profile';
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${isDarkTheme ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        View Profile
                      </button>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${isDarkTheme ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                      >
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Worker Info Header */}
        <div className={`rounded-3xl p-8 mb-8 shadow-xl ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Worker Name</h2>
              <p className="text-2xl font-semibold">{workerData?.name || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Job Card Number</h2>
              <p className="text-2xl font-semibold">{workerData?.job_card_id || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">Active Projects</h2>
              <p className="text-2xl font-semibold">
                {workerData?.work_history?.filter((work: any) => work.status !== 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-2xl p-6 shadow-lg ${isDarkTheme ? 'bg-gray-800/90' : 'bg-white/90'}`}>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Working Days</p>
              <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{summary.totalDays}</p>
            </div>
          </div>
          
          <div className={`rounded-2xl p-6 shadow-lg ${isDarkTheme ? 'bg-gray-800/90' : 'bg-white/90'}`}>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Presents</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{summary.presents}</p>
            </div>
          </div>
          
          <div className={`rounded-2xl p-6 shadow-lg ${isDarkTheme ? 'bg-gray-800/90' : 'bg-white/90'}`}>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Absents</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">{summary.absents}</p>
            </div>
          </div>
          
          <div className={`rounded-2xl p-6 shadow-lg ${isDarkTheme ? 'bg-gray-800/90' : 'bg-white/90'}`}>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Attendance %</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{summary.percentage}%</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className={`rounded-3xl p-8 mb-8 shadow-xl ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Filters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Projects</option>
                {uniqueProjects.map(projectId => {
                  const project = attendanceData.find(p => p.project_id === projectId);
                  return (
                    <option key={projectId} value={projectId}>
                      {project?.project_name}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Search by Date</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Attendance Log Table */}
        <div className={`rounded-3xl p-8 mb-8 shadow-xl ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Attendance Log
            </h2>
            <div className="flex space-x-3">
              <button 
                onClick={downloadPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                📄 PDF
              </button>
              <button 
                onClick={downloadExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📊 Excel
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Project Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <tr 
                      key={record.id} 
                      className={`hover:${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(record.date)}</td>
                      <td className="px-6 py-4">{record.project_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === 'PRESENT' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                        }`}>
                          {record.status === 'PRESENT' ? '🟢 Present' : '🔴 Absent'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{record.marked_by}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project-wise Summary */}
        {projectSummary.length > 0 && (
          <div className={`rounded-3xl p-8 shadow-xl ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Project-wise Summary
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Project</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total Days</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Presents</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Absents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projectSummary.map((project: any, index: number) => (
                    <tr 
                      key={index} 
                      className={`hover:${isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                    >
                      <td className="px-6 py-4 font-medium">{project.projectName}</td>
                      <td className="px-6 py-4">{project.totalDays}</td>
                      <td className="px-6 py-4 text-green-700 dark:text-green-300 font-semibold">{project.presents}</td>
                      <td className="px-6 py-4 text-red-700 dark:text-red-300 font-semibold">{project.absents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-8 px-6 mt-12 ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-xl' : 'bg-white/90 backdrop-blur-lg shadow-xl'} transition-colors duration-300`}>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Smart Rozgar Portal. All rights reserved.</p>
          <p className="mt-2 text-sm">Generated by Smart Rozgaar Portal</p>
        </div>
      </footer>
    </div>
  );
}