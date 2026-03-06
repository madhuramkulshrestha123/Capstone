'use client';

import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import type { jsPDF } from 'jspdf';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../lib/api';

interface Project {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'completed';
}

interface Worker {
  id: string;
  name: string;
  job_card_id: string;
  skill: string;
}

interface AttendanceRecord {
  id: string;
  worker_id: string;
  project_id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
  marked_by: string;
  created_at: string;
  updated_at: string;
  worker_name: string;
  job_card_id: string;
  skill: string;
  supervisor_name?: string;
}

interface WorkerAttendance {
  worker: Worker;
  attendance: AttendanceRecord | null;
}

export default function AttendanceManagementPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // State management
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projectWorkers, setProjectWorkers] = useState<Worker[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [editReason, setEditReason] = useState<string>('');
  
  // Summary statistics
  const summaryStats = useMemo(() => {
    const presentCount = attendanceRecords.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendanceRecords.filter(a => a.status === 'ABSENT').length;
    const totalCount = attendanceRecords.length;
    const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
    
    return {
      presentCount,
      absentCount,
      totalCount,
      attendancePercentage
    };
  }, [attendanceRecords]);
  
  // Filter active projects for the selected date
  const activeProjects = useMemo(() => {
    return projects.filter(project => {
      const projectStartDate = new Date(project.start_date);
      const projectEndDate = new Date(project.end_date);
      const selectedDate = new Date(date);
      
      return selectedDate >= projectStartDate && selectedDate <= projectEndDate;
    });
  }, [projects, date]);
  
  // Filter project workers based on search term
  const filteredProjectWorkers = useMemo(() => {
    return projectWorkers.filter((worker: Worker) => 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.job_card_id.includes(searchTerm)
    );
  }, [projectWorkers, searchTerm]);
  
  // Initialize auth token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    } else {
      window.location.href = '/auth';
    }
  }, []);
  
  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await adminApi.get('/projects');
        setProjects(response.data || []);
      } catch (err: any) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Fetch workers
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await adminApi.get('/users/workers/details');
        setWorkers(response.data || []);
      } catch (err: any) {
        setError('Failed to load workers');
        console.error('Error fetching workers:', err);
      }
    };
    
    fetchWorkers();
  }, []);
  
  // Fetch assigned workers and attendance records for selected date and project
  useEffect(() => {
    if (!selectedProject || !date) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all workers with details to get job card IDs
        const allWorkersResponse = await adminApi.get('/users/workers/details');
        const allWorkers = allWorkersResponse.data || [];
        
        // Fetch assigned workers for the project
        const workersResponse = await adminApi.getAssignedWorkersByProjectId(selectedProject);
        
        // Enhance project workers with job card IDs from all workers data
        const enhancedProjectWorkers = (workersResponse || []).map((worker: any) => {
          const workerDetails = allWorkers.find((w: any) => w.id === worker.id);
          return {
            ...worker,
            job_card_id: workerDetails?.job_card_id || worker.job_card_id || 'N/A'
          };
        });
        
        setProjectWorkers(enhancedProjectWorkers);
        
        // Fetch attendance records
        const attendanceResponse = await adminApi.get(`/attendances/project/${selectedProject}/date-range?startDate=${date}&endDate=${date}`);
        
        // Fetch user details to get supervisor names
        const usersResponse = await adminApi.get('/users');
        const users = usersResponse.data || [];
        
        // Enhance attendance records with worker names and supervisor names
        const enhancedAttendanceRecords = (attendanceResponse.data || []).map((record: any) => {
          const supervisor = users.find((user: any) => user.user_id === record.marked_by);
          return {
            ...record,
            supervisor_name: supervisor ? supervisor.name : 'Unknown User'
          };
        });
        
        setAttendanceRecords(enhancedAttendanceRecords);
        setError('');
      } catch (err: any) {
        setError('Failed to load attendance records');
        console.error('Error fetching data:', err);
        setProjectWorkers([]);
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedProject, date]);
  
  // Mark attendance
  const markAttendance = async (workerId: string, status: 'PRESENT' | 'ABSENT') => {
    try {
      const response = await adminApi.get('/users/profile');
      const supervisorId = response.data.id;
      
      await adminApi.post('/attendances', {
        worker_id: workerId,
        project_id: selectedProject,
        date: date,
        status: status,
        marked_by: supervisorId
      });
      
      // Refresh attendance records
      const attendanceResponse = await adminApi.get(`/attendances/project/${selectedProject}/date-range?startDate=${date}&endDate=${date}`);
      setAttendanceRecords(attendanceResponse.data || []);
      setSuccess(`Attendance marked as ${status.toLowerCase()}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to mark attendance');
      console.error('Error marking attendance:', err);
    }
  };
  
  // Handle edit attendance
  const handleEditAttendance = (attendance: AttendanceRecord) => {
    setSelectedAttendance(attendance);
    setShowEditModal(true);
    setEditReason('');
  };
  
  // Save attendance edit
  const saveAttendanceEdit = async () => {
    if (!selectedAttendance || !editReason) {
      setError('Reason is required for attendance edit');
      return;
    }
    
    try {
      const newStatus = selectedAttendance.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
      await adminApi.patch(`/attendances/${selectedAttendance.id}`, {
        status: newStatus,
        edit_reason: editReason
      });
      
      // Refresh attendance records
      const attendanceResponse = await adminApi.get(`/attendances/project/${selectedProject}/date-range?startDate=${date}&endDate=${date}`);
      setAttendanceRecords(attendanceResponse.data || []);
      setSuccess(`Attendance updated to ${newStatus.toLowerCase()}`);
      setShowEditModal(false);
      setSelectedAttendance(null);
      setEditReason('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to update attendance');
      console.error('Error updating attendance:', err);
    }
  };
  
  // Export to Excel
  const exportToExcel = () => {
    try {
      // @ts-ignore
      import('xlsx').then((XLSX) => {
        // Prepare data for export
        const exportData = filteredProjectWorkers.map(worker => {
          const attendanceRecord = attendanceRecords.find(a => a.worker_id === worker.id);
          return {
            'Worker Name': worker.name,
            'Job Card ID': worker.job_card_id || 'N/A',
            'Project Name': projects.find(p => p.id === selectedProject)?.name || 'N/A',
            'Date': date,
            'Attendance': attendanceRecord ? attendanceRecord.status : 'Not Marked',
            'Marked By': attendanceRecord?.supervisor_name || 'N/A',
            'Time': attendanceRecord 
              ? new Date(attendanceRecord.created_at).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : 'N/A'
          };
        });
        
        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
        
        // Generate filename
        const projectName = projects.find(p => p.id === selectedProject)?.name || 'Attendance';
        const filename = `${projectName}_Attendance_${date}.xlsx`;
        
        // Export file
        XLSX.writeFile(wb, filename);
        
        setSuccess('Excel file exported successfully!');
        setTimeout(() => setSuccess(''), 3000);
      });
    } catch (error) {
      setError('Failed to export Excel file');
      console.error('Excel export error:', error);
    }
  };
  
  // Export to PDF
  const exportToPdf = () => {
    try {
      // @ts-ignore
      import('jspdf').then((jsPDF) => {
        const doc = new jsPDF.default();
        
        // Set document properties
        doc.setProperties({
          title: 'Muster Roll - Attendance Report',
          subject: 'Government of India - MGNREGA Attendance Report',
          author: 'Ministry of Rural Development',
          keywords: 'attendance, muster roll, mgnrega, government, india',
          creator: 'Smart Rozgar Portal'
        });
        
        // Add official header with government emblem styling
        doc.setFillColor(0, 0, 139); // Dark blue
        doc.rect(0, 0, 210, 25, 'F');
        
        doc.setTextColor(255, 255, 255); // White text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('GOVERNMENT OF INDIA', 105, 12, { align: 'center' });
        doc.setFontSize(12);
        doc.text('MINISTRY OF RURAL DEVELOPMENT', 105, 20, { align: 'center' });
        
        // Reset color
        doc.setTextColor(0, 0, 0);
        
        // Add muster roll title
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 139); // Dark blue
        doc.text('MUSTER ROLL', 105, 35, { align: 'center' });
        
        // Add NREGA text
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('National Rural Employment Guarantee Act, 2005', 105, 42, { align: 'center' });
        
        // Add decorative line
        doc.setDrawColor(0, 0, 139);
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);
        
        // Project details section
        const projectName = projects.find(p => p.id === selectedProject)?.name || 'Attendance Report';
        let currentY = 55;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${projectName} - Attendance Report`, 20, currentY);
        
        currentY += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(date).toLocaleDateString('en-IN')}`, 20, currentY);
        
        currentY += 8;
        doc.text('Generated by Smart Rozgar Portal - MGNREGA Inspired System', 20, currentY);
        
        // Add decorative line
        currentY += 10;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(15, currentY, 195, currentY);
        
        // Attendance table
        currentY += 10;
        doc.setFontSize(10);
        
        // Table header
        const headers = ['Sr.No', 'Worker Name', 'Job Card ID', 'Attendance', 'Marked By', 'Time'];
        const colWidths = [20, 50, 40, 25, 35, 20];
        let startX = 15;
        
        // Header row
        doc.setFillColor(22, 160, 133); // Teal color
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        
        for (let i = 0; i < headers.length; i++) {
          doc.rect(startX, currentY, colWidths[i], 8, 'F');
          doc.text(headers[i], startX + colWidths[i]/2, currentY + 5, { align: 'center' });
          startX += colWidths[i];
        }
        
        currentY += 8;
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        // Table rows with proper pagination
        const pageHeight = doc.internal.pageSize.height;
        let rowNumber = 1;
        
        filteredProjectWorkers.forEach((worker, index) => {
          // Check if we need a new page
          if (currentY > pageHeight - 60) {
            doc.addPage();
            currentY = 20;
          }
          
          const attendanceRecord = attendanceRecords.find(a => a.worker_id === worker.id);
          const rowData = [
            rowNumber.toString(),
            worker.name,
            worker.job_card_id || 'N/A',
            attendanceRecord ? attendanceRecord.status : 'Not Marked',
            attendanceRecord?.supervisor_name || 'N/A',
            attendanceRecord 
              ? new Date(attendanceRecord.created_at).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : 'N/A'
          ];
          
          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(15, currentY, 180, 8, 'F');
          }
          
          // Add row data
          let xPos = 15;
          rowData.forEach((data, i) => {
            // Truncate long text to fit in cell
            let displayText = data.toString();
            if (i === 1) { // Worker name column
              if (displayText.length > 25) displayText = displayText.substring(0, 22) + '...';
            } else if (i === 2) { // Job Card ID column
              if (displayText.length > 18) displayText = displayText.substring(0, 15) + '...';
            } else if (i === 4) { // Marked By column
              if (displayText.length > 15) displayText = displayText.substring(0, 12) + '...';
            }
            
            doc.text(displayText, xPos + colWidths[i]/2, currentY + 5, { align: 'center' });
            xPos += colWidths[i];
          });
          
          currentY += 8;
          rowNumber++;
        });
        
        // Add summary section
        if (currentY > pageHeight - 80) {
          doc.addPage();
          currentY = 20;
        }
        
        currentY += 15;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 139);
        doc.text('SUMMARY', 20, currentY);
        
        currentY += 10;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        // Summary statistics in a formatted box
        doc.setFillColor(248, 249, 250);
        doc.rect(15, currentY, 180, 45, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, currentY, 180, 45);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Workers: ${filteredProjectWorkers.length}`, 20, currentY + 10);
        doc.text(`Present: ${summaryStats.presentCount}`, 20, currentY + 20);
        doc.text(`Absent: ${summaryStats.absentCount}`, 20, currentY + 30);
        doc.text(`Attendance Rate: ${summaryStats.attendancePercentage}%`, 20, currentY + 40);
        
        // Add signature and stamp section
        currentY += 60;
        if (currentY > pageHeight - 60) {
          doc.addPage();
          currentY = 30;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Certified that the above information is true and correct', 20, currentY);
        
        currentY += 20;
        doc.setFont('helvetica', 'normal');
        doc.text('Authorized Signatory:', 20, currentY);
        
        // Add signature image
        try {
          doc.addImage('/images/signature.png', 'PNG', 60, currentY - 10, 40, 20);
        } catch (error) {
          console.error('Error adding signature image to PDF:', error);
          // Draw signature line if image fails to load
          doc.line(60, currentY + 5, 120, currentY + 5); // Signature line
        }
        
        // Add official stamp
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0); // Red color
        
        try {
          // Use actual stamp image from public folder
          doc.addImage('/images/stamp.png', 'PNG', 150, currentY - 15, 35, 35);
        } catch (error) {
          console.error('Error adding stamp image to PDF:', error);
          // Draw text stamp if image fails to load
          doc.text('OFFICIAL', 155, currentY);
          doc.text('STAMP', 155, currentY + 10);
        }
        
        doc.setTextColor(0, 0, 0); // Reset to black
        
        // Add page numbers
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`Page ${i} of ${totalPages}`, 105, pageHeight - 10, { align: 'center' });
        }
        
        // Save PDF
        const filename = `Muster_Roll_${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${date}.pdf`;
        doc.save(filename);
        
        setSuccess('PDF file exported successfully!');
        setTimeout(() => setSuccess(''), 3000);
      });
    } catch (error) {
      setError('Failed to export PDF file');
      console.error('PDF export error:', error);
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: 'PRESENT' | 'ABSENT' | null) => {
    if (status === 'PRESENT') return 'bg-green-100 text-green-800';
    if (status === 'ABSENT') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  // Get status text
  const getStatusText = (status: 'PRESENT' | 'ABSENT' | null) => {
    if (status === 'PRESENT') return t('present');
    if (status === 'ABSENT') return t('absent');
    return t('notMarked');
  };
  
  // Check if date is in the past
  const isPastDate = (dateString: string) => {
    const selected = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected < today;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('attendanceManagement')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {t('back')}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}
        
        {/* Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                <span className="text-xl">🟢</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('present')}</p>
                <p className="text-2xl font-bold text-gray-800">{summaryStats.presentCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100 text-red-600 mr-3">
                <span className="text-xl">🔴</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('absent')}</p>
                <p className="text-2xl font-bold text-gray-800">{summaryStats.absentCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('attendancePercentage')}</p>
                <p className="text-2xl font-bold text-gray-800">{summaryStats.attendancePercentage}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('workers')}</p>
                <p className="text-2xl font-bold text-gray-800">{summaryStats.totalCount}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectDate')}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectProject')}
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t('selectProject')}</option>
                {activeProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('searchWorker')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchByNameOrJobCard')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <span className="mr-2">📊</span>
                {t('exportExcel')}
              </button>
              <button
                onClick={exportToPdf}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <span className="mr-2">📄</span>
                {t('exportPdf')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Projects Section */}
        {activeProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('activeProjects')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map(project => {
                const projectStartDate = new Date(project.start_date);
                const projectEndDate = new Date(project.end_date);
                const selectedDateObj = new Date(date);
                const isActiveToday = selectedDateObj >= projectStartDate && selectedDateObj <= projectEndDate;
                
                return (
                  <div 
                    key={project.id} 
                    className={`bg-white border rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                      selectedProject === project.id ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isActiveToday 
                          ? 'bg-green-100 text-green-800' 
                          : selectedDateObj < projectStartDate 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
{isActiveToday ? 'Active Today' : selectedDateObj < projectStartDate ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <span>{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👷</span>
                        <span>{projectWorkers.length} {t('workers')}</span>
                      </div>
                    </div>
                    
                    {!isActiveToday && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-sm">{t('projectNotActiveOnSelectedDate')}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Worker Attendance Table */}
        {selectedProject && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {t('workerAttendance')} - {projects.find(p => p.id === selectedProject)?.name}
              </h2>
              <p className="text-gray-600 mt-1">
                {new Date(date).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('workerName')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('jobCardId')}
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('attendance')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('markedBy')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjectWorkers.length > 0 ? (
                      filteredProjectWorkers.map((worker: Worker) => {
                        const attendanceRecord = attendanceRecords.find(a => a.worker_id === worker.id);
                        const canEdit = attendanceRecord && (isPastDate(date) || attendanceRecord.status !== null);
                        
                        return (
                          <tr key={worker.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {worker.job_card_id}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              {attendanceRecord ? (
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(attendanceRecord.status)}`}>
                                  {getStatusText(attendanceRecord.status)}
                                </span>
                              ) : (
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  {t('notMarked')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {attendanceRecord?.supervisor_name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {attendanceRecord 
                                ? new Date(attendanceRecord.created_at).toLocaleTimeString('en-IN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })
                                : 'N/A'
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {!attendanceRecord ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => markAttendance(worker.id, 'PRESENT')}
                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                                  >
                                    {t('present')}
                                  </button>
                                  <button
                                    onClick={() => markAttendance(worker.id, 'ABSENT')}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                                  >
                                    {t('absent')}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEditAttendance(attendanceRecord)}
                                  disabled={!canEdit}
                                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                                    canEdit 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          {t('noWorkersFound')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Edit Attendance Modal */}
      {showEditModal && selectedAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{t('editAttendance')}</h3>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAttendance(null);
                    setEditReason('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">{t('workerName')}</p>
                  <p className="font-medium">{selectedAttendance.worker_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('currentStatus')}</p>
                  <p className={`font-medium ${selectedAttendance.status === 'PRESENT' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedAttendance.status}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('newStatus')}</p>
                  <p className={`font-medium ${selectedAttendance.status === 'PRESENT' ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedAttendance.status === 'PRESENT' ? 'ABSENT' : 'PRESENT'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('reasonForChange')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder={t('enterReasonForAttendanceChange')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAttendance(null);
                    setEditReason('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={saveAttendanceEdit}
                  disabled={!editReason.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}