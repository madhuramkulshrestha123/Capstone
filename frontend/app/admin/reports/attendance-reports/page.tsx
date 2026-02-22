"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/lib/useTranslation';
import { FiArrowLeft, FiDownload, FiFileText, FiCalendar, FiUsers, FiCheckCircle, FiXCircle, FiBarChart2 } from 'react-icons/fi';

export default function AttendanceReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  const [dateRange, setDateRange] = useState('week');
  const [selectedDate, setSelectedDate] = useState('2024-01-20');

  // Mock data
  const attendanceData = {
    summary: {
      todayAttendance: '92%',
      weeklyAvg: '89%',
      absenteeRate: '11%',
      totalRecords: 15642
    },
    dailyAttendance: [
      { date: '2024-01-20', present: 1147, absent: 100, total: 1247, attendanceRate: '92%' },
      { date: '2024-01-19', present: 1123, absent: 124, total: 1247, attendanceRate: '90%' },
      { date: '2024-01-18', present: 1189, absent: 58, total: 1247, attendanceRate: '95%' },
      { date: '2024-01-17', present: 1098, absent: 149, total: 1247, attendanceRate: '88%' },
      { date: '2024-01-16', present: 1201, absent: 46, total: 1247, attendanceRate: '96%' },
    ],
    projectAttendance: [
      { project: 'गांव सड़क निर्माण', present: 456, absent: 34, total: 490, rate: '93%' },
      { project: 'जल संरक्षण', present: 389, absent: 21, total: 410, rate: '95%' },
      { project: 'सीवेज सुविधा', present: 289, absent: 45, total: 334, rate: '87%' },
    ]
  };

  const workerAttendance = [
    { id: '1', name: 'राम प्रसाद', workerId: 'WRK001', present: 22, absent: 3, total: 25, rate: '88%' },
    { id: '2', name: 'सीता देवी', workerId: 'WRK002', present: 25, absent: 0, total: 25, rate: '100%' },
    { id: '3', name: 'मोहन सिंह', workerId: 'WRK003', present: 18, absent: 7, total: 25, rate: '72%' },
    { id: '4', name: 'गीता कुमारी', workerId: 'WRK004', present: 24, absent: 1, total: 25, rate: '96%' },
  ];

  const handleExport = (type: string) => {
    alert(`${type} export initiated`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => router.push('/admin/reports')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <FiArrowLeft className="mr-2" />
                {language === 'hi' ? 'वापस' : 'Back'}
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FiCalendar className="mr-3 text-orange-600" />
                {language === 'hi' ? 'उपस्थिति रिपोर्ट' : 'Attendance Reports'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-gray-500" />
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="day">{language === 'hi' ? 'दैनिक' : 'Daily'}</option>
                  <option value="week">{language === 'hi' ? 'साप्ताहिक' : 'Weekly'}</option>
                  <option value="month">{language === 'hi' ? 'मासिक' : 'Monthly'}</option>
                  <option value="quarter">{language === 'hi' ? 'तिमाही' : 'Quarterly'}</option>
                </select>
              </div>
              
              {dateRange === 'day' && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              )}
              
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              
              <button 
                onClick={() => handleExport('attendance')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <FiDownload className="mr-2" />
                {language === 'hi' ? 'निर्यात' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'आज की उपस्थिति' : 'Today\'s Attendance'}</p>
                <p className="text-2xl font-bold text-green-600">{attendanceData.summary.todayAttendance}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBarChart2 className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'साप्ताहिक औसत' : 'Weekly Average'}</p>
                <p className="text-2xl font-bold text-blue-600">{attendanceData.summary.weeklyAvg}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiXCircle className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'अनुपस्थिति दर' : 'Absentee Rate'}</p>
                <p className="text-2xl font-bold text-red-600">{attendanceData.summary.absenteeRate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{language === 'hi' ? 'कुल रिकॉर्ड' : 'Total Records'}</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceData.summary.totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Attendance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'hi' ? 'दैनिक उपस्थिति प्रवृत्ति' : 'Daily Attendance Trend'}
            </h3>
            <div className="space-y-4">
              {attendanceData.dailyAttendance.map((day) => (
                <div key={day.date} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-600">
                        <FiCheckCircle className="inline mr-1" /> {day.present}
                      </span>
                      <span className="text-red-600">
                        <FiXCircle className="inline mr-1" /> {day.absent}
                      </span>
                      <span className="font-medium">{day.attendanceRate}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{width: day.attendanceRate}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project-wise Attendance */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'hi' ? 'परियोजना-वार उपस्थिति' : 'Project-wise Attendance'}
            </h3>
            <div className="space-y-4">
              {attendanceData.projectAttendance.map((project) => (
                <div key={project.project} className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{project.project}</div>
                    <div className="text-sm text-gray-600">
                      {project.present} {language === 'hi' ? 'उपस्थित' : 'present'} • {project.absent} {language === 'hi' ? 'अनुपस्थित' : 'absent'}
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-lg font-bold text-gray-900">{project.rate}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round((project.present / project.total) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Worker Attendance Table */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'hi' ? 'कर्मचारी उपस्थिति' : 'Worker Attendance'}
            </h3>
            <button 
              onClick={() => handleExport('worker-attendance')}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <FiFileText className="mr-2" />
              {language === 'hi' ? 'पीडीएफ निर्यात करें' : 'Export PDF'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'कर्मचारी आईडी' : 'Worker ID'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'नाम' : 'Name'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'उपस्थित' : 'Present'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'अनुपस्थित' : 'Absent'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'कुल' : 'Total'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'hi' ? 'दर' : 'Rate'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workerAttendance.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {worker.workerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {worker.present}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {worker.absent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {worker.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        parseInt(worker.rate) >= 90 
                          ? 'bg-green-100 text-green-800' 
                          : parseInt(worker.rate) >= 80 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {worker.rate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}