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
        
        // Clear cache before fetching fresh data
        adminApi.clearAllCache();
        
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

    // Add small delay to prevent immediate rapid requests
    const timer = setTimeout(() => {
      fetchData();
    }, 100);
    
    return () => clearTimeout(timer);
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
    { id: 'payments', label: 'paymentManagement', icon: '💰', href: '/admin/payment-management' },
    { id: 'attendance', label: 'attendanceManagement', icon: '📋', href: '/admin/attendance' },
    { id: 'reports', label: 'reports', icon: '📈', href: '/admin/reports' },
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
                href="/admin/payment-management" 
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">स्मार्ट रोज़गार पोर्टल</h3>
              <p className="text-gray-300 mb-4">
                Empowering rural communities through digital employment opportunities and transparent job management.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.29 0 11.278-6.035 11.278-11.278 0-.176 0-.35-.012-.524A8.141 8.141 0 0020 7.29a8.106 8.106 0 01-2.357.646 4.108 4.108 0 001.797-2.254 8.184 8.184 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.108 4.108 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/admin/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/admin/projects" className="text-gray-300 hover:text-white transition-colors">Projects</a></li>
                <li><a href="/admin/job-card-applications" className="text-gray-300 hover:text-white transition-colors">Job Cards</a></li>
                <li><a href="/admin/workers" className="text-gray-300 hover:text-white transition-colors">Workers</a></li>
                <li><a href="/admin/payment-management" className="text-gray-300 hover:text-white transition-colors">Payments</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Smart Employment Portal, Uttar Pradesh, India</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>0562 279 579</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>contact@smartrozgarportal.in</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} स्मार्ट रोज़गार पोर्टल. All rights reserved.</p>
            <p className="mt-2 text-sm">Designed for transparent and efficient employment management</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
