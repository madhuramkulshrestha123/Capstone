'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../lib/useTranslation';
import { supervisorApi, setAuthToken } from '../lib/api';

export default function SupervisorDashboard() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // State for statistics
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalJobCardApplications: 0,
    totalActiveWorkers: 0,
    pendingPayments: 0,
    upcomingDeadlines: 0,
    managedEmployees: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Fetch statistics and activities
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [statsData, activitiesData] = await Promise.all([
          supervisorApi.getDashboardStats(),
          supervisorApi.getRecentActivities()
        ]);
        
        setStats(statsData);
        setRecentActivities(activitiesData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation items for supervisor
  const navItems = [
    { id: 'dashboard', label: 'dashboard', icon: '📊' },
    { id: 'projects', label: 'projects', icon: '🏗️' },
    { id: 'attendance', label: 'attendance', icon: '📋' },
    { id: 'workers', label: 'workers', icon: '👷' },
    { id: 'payments', label: 'payments', icon: '💰' },
    { id: 'reports', label: 'reports', icon: '📈' },
    { id: 'settings', label: 'settings', icon: '⚙️' }
  ];

  // Handle logout
  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('supervisorDashboard')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? t('hindi') : t('english')}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="font-bold">S</span>
                </div>
                <span>Supervisor</span>
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href="#" 
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-100 transition-colors duration-200 text-gray-700 hover:text-indigo-700"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{t(item.label as any) || item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Statistics Cards */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('statistics')}</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Projects */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                      <span className="text-2xl">🏗️</span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{t('totalProjects')}</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalProjects}</p>
                    </div>
                  </div>
                </div>

                {/* Total Job Card Applications */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{t('totalJobCardApplications')}</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalJobCardApplications}</p>
                    </div>
                  </div>
                </div>

                {/* Total Active Workers */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                      <span className="text-2xl">👷</span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{t('totalActiveWorkers')}</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalActiveWorkers}</p>
                    </div>
                  </div>
                </div>

                {/* Pending Payments */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{t('payments')}</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.pendingPayments}</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{t('upcomingDeadlines')}</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.upcomingDeadlines}</p>
                    </div>
                  </div>
                </div>

                {/* Managed Employees */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{t('managedEmployees')}</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.managedEmployees}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Recent Activities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('recentActivities')}</h2>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">
                  Failed to load activities
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No recent activities
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="p-6 hover:bg-indigo-50/50 transition-colors duration-200">
                      <div className="flex justify-between">
                        <p className="text-gray-800 font-medium">{activity.action}</p>
                        <span className="text-gray-500 text-sm">{activity.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}