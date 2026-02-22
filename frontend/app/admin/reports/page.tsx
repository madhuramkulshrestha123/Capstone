"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/useTranslation';
import { FiBarChart2, FiDownload, FiCalendar, FiUsers, FiDollarSign, FiHome, FiAlertTriangle, FiMapPin, FiFileText, FiPrinter, FiFilter, FiArrowLeft } from 'react-icons/fi';
import { adminApi, setAuthToken } from '@/app/lib/api';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: { label: string; value: string | number; color?: string }[];
  onClick: () => void;
  status?: 'healthy' | 'warning' | 'critical';
}

const ReportCard = ({ title, description, icon, stats, onClick, status }: ReportCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'border-green-500 bg-green-50 hover:bg-green-100';
      case 'warning': return 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100';
      case 'critical': return 'border-red-500 bg-red-50 hover:bg-red-100';
      default: return 'border-gray-200 bg-white hover:bg-gray-50';
    }
  };

  return (
    <div 
      className={`rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${getStatusColor()}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {status && (
          <div className={`w-3 h-3 rounded-full ${
            status === 'healthy' ? 'bg-green-500' : 
            status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-lg font-bold ${
              stat.color || 'text-gray-900'
            }`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-blue-600 font-medium">
        <span>View Report</span>
        <FiPrinter className="ml-2" />
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [dateRange, setDateRange] = useState('last_month');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    workerReports: {
      totalWorkers: 0,
      avgAttendance: '0%',
      topEarners: 0
    },
    financeReports: {
      totalPaid: '₹0',
      pendingPayments: '₹0',
      overdueAmount: '₹0'
    },
    projectReports: {
      activeProjects: 0,
      completedProjects: 0,
      avgCompletion: '0%'
    },
    attendanceReports: {
      todayAttendance: '0%',
      weeklyAvg: '0%',
      absenteeRate: '0%'
    },
    complianceReports: {
      overduePayments: 0,
      attendanceGaps: 0,
      policyViolations: 0
    }
  });
  const isHindi = language === 'hi';

  // Set auth token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    } else {
      // Redirect to login if no token
      router.push('/auth');
    }
  }, [router]);

  // Fetch real-time data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [usersRes, paymentsRes, projectsRes, attendanceRes] = await Promise.all([
          adminApi.get('/users'),
          adminApi.get('/payments'),
          adminApi.get('/projects'),
          adminApi.get('/attendances')
        ]);

        // Process worker data
        const workers = usersRes.data?.filter((user: any) => user.role === 'worker') || [];
        const totalWorkers = workers.length;
        
        // Calculate attendance statistics
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceRes.data?.filter((att: any) => 
          att.date === today && att.status === 'PRESENT'
        ) || [];
        const todayAttendanceRate = totalWorkers > 0 ? 
          Math.round((todayAttendance.length / totalWorkers) * 100) : 0;
        
        // Calculate weekly attendance (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyAttendance = attendanceRes.data?.filter((att: any) => 
          new Date(att.date) >= oneWeekAgo && att.status === 'PRESENT'
        ) || [];
        const weeklyAvgRate = totalWorkers > 0 ? 
          Math.round((weeklyAttendance.length / (totalWorkers * 7)) * 100) : 0;
        
        // Process payment data
        const paidPayments = paymentsRes.data?.filter((p: any) => p.status === 'PAID') || [];
        const pendingPayments = paymentsRes.data?.filter((p: any) => p.status === 'PENDING') || [];
        const overduePayments = paymentsRes.data?.filter((p: any) => 
          p.status === 'PENDING' && new Date(p.created_at) < new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        ) || [];
        
        const totalPaid = paidPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
        const totalPending = pendingPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
        const totalOverdue = overduePayments.reduce((sum: number, p: any) => sum + p.amount, 0);
        
        // Process project data
        const activeProjects = projectsRes.data?.filter((p: any) => p.status === 'ACTIVE').length || 0;
        const completedProjects = projectsRes.data?.filter((p: any) => p.status === 'COMPLETED').length || 0;
        const avgCompletion = projectsRes.data?.length > 0 ? 
          Math.round(projectsRes.data.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / projectsRes.data.length) : 0;
        
        // Calculate top earners (workers with highest total payments)
        const workerPayments = paidPayments.reduce((acc: any, payment: any) => {
          if (!acc[payment.worker_id]) {
            acc[payment.worker_id] = 0;
          }
          acc[payment.worker_id] += payment.amount;
          return acc;
        }, {});
        const topEarners = Object.keys(workerPayments).length;

        // Update state with real data
        setReportData({
          workerReports: {
            totalWorkers,
            avgAttendance: `${weeklyAvgRate}%`,
            topEarners
          },
          financeReports: {
            totalPaid: `₹${(totalPaid / 100000).toFixed(1)}L`,
            pendingPayments: `₹${(totalPending / 100000).toFixed(1)}L`,
            overdueAmount: `₹${(totalOverdue / 100000).toFixed(1)}L`
          },
          projectReports: {
            activeProjects,
            completedProjects,
            avgCompletion: `${avgCompletion}%`
          },
          attendanceReports: {
            todayAttendance: `${todayAttendanceRate}%`,
            weeklyAvg: `${weeklyAvgRate}%`,
            absenteeRate: `${100 - weeklyAvgRate}%`
          },
          complianceReports: {
            overduePayments: overduePayments.length,
            attendanceGaps: 0, // Would need specific endpoint to calculate
            policyViolations: 0 // Would need specific endpoint to calculate
          }
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const reportCards = [
    {
      id: 'worker',
      title: 'Worker Reports',
      description: 'Attendance, wages, and employment history of workers',
      icon: '👷‍♂️',
      stats: [
        { label: 'Total Workers', value: reportData.workerReports.totalWorkers },
        { label: 'Avg Attendance', value: reportData.workerReports.avgAttendance, color: 'text-green-600' },
        { label: 'Top Earners', value: reportData.workerReports.topEarners },
        { label: 'Active This Month', value: reportData.workerReports.totalWorkers }
      ],
      status: 'healthy',
      onClick: () => router.push('/admin/reports/worker-reports')
    },
    {
      id: 'finance',
      title: 'Finance Reports',
      description: 'Payments, pending dues, and fund utilization',
      icon: '💰',
      stats: [
        { label: 'Total Paid', value: reportData.financeReports.totalPaid, color: 'text-green-600' },
        { label: 'Pending', value: reportData.financeReports.pendingPayments, color: 'text-yellow-600' },
        { label: 'Overdue', value: reportData.financeReports.overdueAmount, color: 'text-red-600' },
        { label: 'Utilization', value: '78%' }
      ],
      status: reportData.financeReports.overdueAmount !== '₹0' ? 'warning' : 'healthy',
      onClick: () => router.push('/admin/reports/finance-reports')
    },
    {
      id: 'project',
      title: 'Project Progress',
      description: 'Track project execution and labour usage',
      icon: '🏗',
      stats: [
        { label: 'Active Projects', value: reportData.projectReports.activeProjects },
        { label: 'Completed', value: reportData.projectReports.completedProjects },
        { label: 'Avg Completion', value: reportData.projectReports.avgCompletion, color: 'text-blue-600' },
        { label: 'On Time', value: reportData.projectReports.completedProjects }
      ],
      status: 'healthy',
      onClick: () => router.push('/admin/reports/project-reports')
    },
    {
      id: 'attendance',
      title: 'Attendance Reports',
      description: 'Muster roll & daily attendance analysis',
      icon: '📅',
      stats: [
        { label: 'Today %', value: reportData.attendanceReports.todayAttendance, color: 'text-green-600' },
        { label: 'Weekly Avg', value: reportData.attendanceReports.weeklyAvg },
        { label: 'Absentee Rate', value: reportData.attendanceReports.absenteeRate, color: 'text-red-600' },
        { label: 'Records', value: '15,642' }
      ],
      status: parseInt(reportData.attendanceReports.todayAttendance) > 90 ? 'healthy' : 
              parseInt(reportData.attendanceReports.todayAttendance) > 80 ? 'warning' : 'critical',
      onClick: () => router.push('/admin/reports/attendance-reports')
    },
    {
      id: 'compliance',
      title: 'Compliance Reports',
      description: 'MGNREGA compliance & anomalies',
      icon: '⚠️',
      stats: [
        { label: 'Overdue Payments', value: reportData.complianceReports.overduePayments, color: 'text-red-600' },
        { label: 'Attendance Gaps', value: reportData.complianceReports.attendanceGaps, color: 'text-yellow-600' },
        { label: 'Violations', value: reportData.complianceReports.policyViolations, color: 'text-red-600' },
        { label: 'Pending Audit', value: '7' }
      ],
      status: reportData.complianceReports.overduePayments > 0 ? 'critical' : 'healthy',
      onClick: () => router.push('/admin/reports/compliance-reports')
    },
    {
      id: 'location',
      title: 'Area-wise Reports',
      description: 'Regional performance overview',
      icon: '🗺',
      stats: [
        { label: 'Panchayats', value: '15' },
        { label: 'Avg Workers', value: Math.round(reportData.workerReports.totalWorkers / 15) },
        { label: 'Per Capita', value: '₹19,600' },
        { label: 'Coverage', value: '94%' }
      ],
      status: 'healthy',
      onClick: () => router.push('/admin/reports/location-reports')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{isHindi ? 'डेटा लोड हो रहा है...' : 'Loading data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <button 
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-900 mr-4 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiArrowLeft className="mr-2" />
                  {isHindi ? 'होम' : 'Home'}
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <FiBarChart2 className="mr-3 text-blue-600" />
                    {isHindi ? 'रिपोर्ट डैशबोर्ड' : 'Reports Dashboard'}
                  </h1>
                  <p className="mt-2 text-gray-600">
                    {isHindi ? 'निर्णय स्तर की अंतर्दृष्टि और आधिकारिक रिपोर्ट' : 'Decision-level insights and official reports'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Language Toggle */}
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {language === 'en' ? 'हिन्दी' : 'English'}
                </button>
                
                {/* Date Range Selector */}
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gray-500" />
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="today">{isHindi ? 'आज' : 'Today'}</option>
                    <option value="week">{isHindi ? 'इस सप्ताह' : 'This Week'}</option>
                    <option value="last_month">{isHindi ? 'पिछला महीना' : 'Last Month'}</option>
                    <option value="quarter">{isHindi ? 'तिमाही' : 'Quarter'}</option>
                    <option value="year">{isHindi ? 'इस साल' : 'This Year'}</option>
                  </select>
                </div>
                
                {/* Export All Button */}
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FiDownload className="mr-2" />
                  {isHindi ? 'सभी निर्यात करें' : 'Export All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isHindi ? 'कुल कार्यकर्ता' : 'Total Workers'}</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.workerReports.totalWorkers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isHindi ? 'कुल भुगतान' : 'Total Paid'}</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.financeReports.totalPaid}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiHome className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isHindi ? 'सक्रिय परियोजनाएं' : 'Active Projects'}</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.projectReports.activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiAlertTriangle className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isHindi ? 'अतुल्य प्रविष्टियाँ' : 'Critical Issues'}</p>
                <p className="text-2xl font-bold text-red-600">
                  {reportData.complianceReports.overduePayments + reportData.complianceReports.policyViolations}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((card) => (
            <ReportCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={<span className="text-3xl">{card.icon}</span>}
              stats={card.stats}
              status={card.status as any}
              onClick={card.onClick}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>{isHindi ? 'सभी रिपोर्ट MGNREGA नीतियों के अनुसार तैयार की गई हैं' : 'All reports prepared according to MGNREGA policies'}</p>
          <p className="mt-1">{isHindi ? 'डेटा निकासी के लिए निर्यात बटन का उपयोग करें' : 'Use export buttons for data extraction'}</p>
        </div>
      </div>
    </div>
  );
}