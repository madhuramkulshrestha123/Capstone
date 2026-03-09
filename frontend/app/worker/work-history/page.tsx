'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';

export default function WorkerWorkHistory() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [workerData, setWorkerData] = useState<any>(null);
  const [filteredWorkHistory, setFilteredWorkHistory] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [loading, setLoading] = useState(true);

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
      setFilteredWorkHistory(data.work_history || []);
    } catch (error) {
      console.error('Error parsing worker data:', error);
      window.location.href = '/auth';
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply filters whenever filters or workerData changes
    if (workerData?.work_history) {
      let result = [...workerData.work_history];
      
      if (filters.location) {
        result = result.filter(work => 
          (work.location && work.location.toLowerCase().includes(filters.location.toLowerCase())) ||
          (work.district && work.district.toLowerCase().includes(filters.location.toLowerCase())) ||
          (work.block && work.block.toLowerCase().includes(filters.location.toLowerCase()))
        );
      }
      
      if (filters.status) {
        result = result.filter(work => 
          work.status && work.status.toLowerCase().includes(filters.status.toLowerCase())
        );
      }
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        result = result.filter(work => {
          const workStartDate = new Date(work.start_date);
          return workStartDate >= fromDate;
        });
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        result = result.filter(work => {
          const workEndDate = work.end_date ? new Date(work.end_date) : new Date();
          return workEndDate <= toDate;
        });
      }
      
      setFilteredWorkHistory(result);
    }
  }, [filters, workerData]);

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('workerData');
    localStorage.removeItem('isWorker');
    window.location.href = '/auth';
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkTheme ? 'bg-gray-900' : 'bg-indigo-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading work history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-5 px-6 flex items-center justify-between ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-lg shadow-lg'} transition-colors duration-300`}>
        <button 
          onClick={() => window.location.href = '/worker/dashboard'}
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent select-none hover:opacity-80 transition-opacity"
        >
          Work History
        </button>
        <div className="flex items-center space-x-5">
          <button 
            onClick={toggleTheme}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${
              isDarkTheme 
                ? 'bg-indigo-700 text-white hover:bg-indigo-800 hover:shadow-xl hover:scale-105' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button 
            onClick={toggleLanguage}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out ${
              isDarkTheme 
                ? 'bg-purple-700 text-white hover:bg-purple-800 hover:shadow-xl hover:scale-105' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-lg hover:scale-105'
            }`}
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg font-semibold shadow-md transform transition-transform duration-300 ease-in-out bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className={`rounded-3xl p-8 mb-8 shadow-xl ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Welcome, {workerData?.name || 'Worker'}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Job Card ID: <span className="font-semibold text-indigo-600">{workerData?.job_card_id || 'N/A'}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Login: {formatDateTime(workerData?.login_time)}
              </p>
            </div>
            <div className={`mt-4 md:mt-0 px-6 py-3 rounded-xl ${workerData?.current_status === 'assigned' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'}`}>
              <p className="text-center font-semibold">
                Status: {workerData?.current_status === 'assigned' ? 'Currently Assigned' : 'Available for Work'}
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className={`rounded-3xl p-8 mb-8 shadow-xl ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Filter Work History
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by location..."
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                From Date
              </label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                To Date
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <button 
              onClick={() => setFilters({ location: '', status: '', dateFrom: '', dateTo: '' })}
              className={`px-6 py-3 rounded-lg font-medium ${
                isDarkTheme 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } transition-colors`}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Work History Results */}
        <div className={`rounded-3xl p-8 shadow-xl ${isDarkTheme ? 'bg-gray-800/90 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Work History ({filteredWorkHistory.length})
            </h2>
          </div>
          
          {filteredWorkHistory.length > 0 ? (
            <div className="space-y-6">
              {filteredWorkHistory.map((work: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl border-l-4 ${
                    work.status === 'completed' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{work.name || work.project_name || 'Unnamed Project'}</h3>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                          <p className="font-medium">{work.location || work.district || work.village || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                          <p className="font-medium">
                            {formatDate(work.start_date)} to {formatDate(work.end_date)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Wage</p>
                          <p className="font-medium">₹{work.wage_per_worker || work.wage || 0}</p>
                        </div>
                        
                        {work.category && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                            <p className="font-medium">{work.category}</p>
                          </div>
                        )}
                        
                        {work.supervisor_name && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Supervisor</p>
                            <p className="font-medium">{work.supervisor_name}</p>
                          </div>
                        )}
                        
                        {work.total_days_worked && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Days Worked</p>
                            <p className="font-medium">{work.total_days_worked} days</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`mt-3 md:mt-0 px-4 py-2 rounded-full text-sm font-medium self-start ${
                      work.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                    }`}>
                      {work.status === 'completed' ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                  
                  {work.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                      <p className="text-gray-700 dark:text-gray-300">{work.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No Work History Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {workerData?.work_history && workerData.work_history.length > 0 
                  ? 'No work history matches your current filters.' 
                  : 'You have no work history yet.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 px-6 mt-12 ${isDarkTheme ? 'bg-gray-900/90 backdrop-blur-lg shadow-xl' : 'bg-white/90 backdrop-blur-lg shadow-xl'} transition-colors duration-300`}>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Smart Rozgar Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}