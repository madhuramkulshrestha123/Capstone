'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../lib/api';

export default function AdminDashboard() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // State for panchayat information
  const [panchayatInfo, setPanchayatInfo] = useState({
    name: 'ग्राम पंचायत नई दिल्ली',
    district: 'Central Delhi',
    state: 'Delhi',
    id: 'GP-DE-2025-001'
  });
  
  // State for statistics
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalJobCardApplications: 0,
    totalActiveWorkers: 0,
    pendingPayments: 0,
    upcomingDeadlines: 0,
    managedEmployees: 0
  });
  
  // State for other data
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [panchayatData, statsData, activitiesData, applicationsData] = await Promise.all([
          adminApi.getPanchayatInfo(),
          adminApi.getDashboardStats(),
          adminApi.getRecentActivities(),
          adminApi.getPendingJobCardApplications()
        ]);
        
        setPanchayatInfo(panchayatData);
        setStats(statsData);
        setRecentActivities(activitiesData);
        setPendingApplications(applicationsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show a notification that data is currently mock data
  useEffect(() => {
    // In a real implementation, this would be removed
  }, [loading, error]);

  // Navigation items for admin
  const navItems = [
    { id: 'dashboard', label: 'dashboard', icon: '📊', href: '/admin/dashboard' },
    { id: 'projects', label: 'projects', icon: '🏗️', href: '/admin/projects' },
    { id: 'job-cards', label: 'jobCards', icon: '📝', href: '/admin/job-card-applications' },
    { id: 'workers', label: 'workers', icon: '👷', href: '/admin/workers' },
    { id: 'work-demand', label: 'workDemand', icon: '📋', href: '/admin/work-demand' },
    { id: 'payments', label: 'payments', icon: '💰', href: '#' },
    { id: 'attendance', label: 'attendance', icon: '📋', href: '#' },
    { id: 'reports', label: 'reports', icon: '📈', href: '#' },
    { id: 'employees', label: 'manageEmployees', icon: '👥', href: '#' },
    { id: 'settings', label: 'settings', icon: '⚙️', href: '#' }
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

  // Handle profile click
  const handleProfileClick = () => {
    // Redirect to profile page
    window.location.href = '/admin/profile';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileDropdown && !(event.target as Element).closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Loading spinner component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error message component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('adminDashboard')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? t('hindi') : t('english')}
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="font-bold">A</span>
                  </div>
                  <span>Admin</span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 profile-dropdown">
                    <button 
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                    >
                      {t('profile')}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={item.href || '#'} 
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-gray-700 hover:text-blue-700"
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
          {/* Panchayat Banner */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{panchayatInfo.name}</h2>
                  <p className="mt-2 opacity-90">
                    {language === 'en' ? t('district') : 'जिला'}: {panchayatInfo.district}, 
                    {language === 'en' ? t('state') : 'राज्य'}: {panchayatInfo.state}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm opacity-75">
                    {language === 'en' ? t('panchayatId') : 'पंचायत आईडी'}: {panchayatInfo.id}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Cards */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('statistics')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Projects */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                    <span className="text-2xl">🏗️</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('totalProjects')}</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalProjects}</p>
                  </div>
                </div>
              </div>

              {/* Total Job Card Applications */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('totalJobCardApplications')}</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalJobCardApplications}</p>
                  </div>
                </div>
              </div>

              {/* Total Active Workers */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
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
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('pendingPayments')}</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.pendingPayments}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('upcomingDeadlines')}</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.upcomingDeadlines}</p>
                  </div>
                </div>
              </div>

              {/* Managed Employees */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t('managedEmployees')}</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.managedEmployees}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Job Applications and Pending Job Card Applications */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Job Applications */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('recentActivities')}</h2>
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((application, index) => (
                    <li key={application.id || index} className="p-6 hover:bg-blue-50 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-800 font-medium">{application.headOfHouseholdName || application.name}</p>
                          <p className="text-gray-500 text-sm">
                            ID: {application.panchayat || application.panchayatId || 'N/A'} | 
                            {language === 'en' ? ' District: ' : ' जिला: '}
                            {application.district || 'N/A'}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {application.status || 'New'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pending Job Card Applications */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('pendingJobCardApplications')}</h2>
                <a href="/admin/job-card-applications" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm">
                  {t('viewAll')}
                </a>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {pendingApplications.map((application, index) => (
                    <li key={application.id || index} className="p-6 hover:bg-blue-50 transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-800 font-medium">{application.headOfHouseholdName || application.name}</p>
                          <p className="text-gray-500 text-sm">
                            ID: {application.panchayat || application.panchayatId || 'N/A'} | 
                            {language === 'en' ? ' District: ' : ' जिला: '}
                            {application.district || 'N/A'}
                          </p>                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {t('pending')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('quickActions')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a 
                href="/admin/job-card-applications" 
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('manageJobCards')}</h3>
                <p className="text-gray-500 text-sm">{t('approveRejectJobCards')}</p>
              </a>
              
              <a 
                href="#" 
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('processPayments')}</h3>
                <p className="text-gray-500 text-sm">{t('approveRejectPayments')}</p>
              </a>
              
              <a 
                href="/admin/projects" 
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('manageProjects')}</h3>
                <p className="text-gray-500 text-sm">{t('createUpdateProjects')}</p>
              </a>
              
              <a 
                href="#" 
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t('manageEmployees')}</h3>
                <p className="text-gray-500 text-sm">{t('addUpdateEmployees')}</p>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}