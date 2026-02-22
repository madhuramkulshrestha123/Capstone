'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../lib/api';

interface Payment {
  id: string;
  worker_id: string;
  project_id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

interface Worker {
  id: string;
  name: string;
  aadhaar_number: string;
  job_card_id?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  aadhaar_linked?: boolean;
  last_payment_date?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  wage_per_worker?: number;
  status: 'pending' | 'active' | 'completed';
}

interface AttendanceRecord {
  id: string;
  worker_id: string;
  project_id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  marked_by: string;
  created_at: string;
}

interface PaymentWithDetails extends Payment {
  worker_name: string;
  worker_aadhaar: string;
  worker_job_card: string;
  project_name: string;
  project_end_date: string;
  daysWorked: number;
  wage_per_day: number;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  aadhaar_linked?: boolean;
  last_payment_date?: string;
}

export default function PaymentManagementPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // State for payments and workers
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Selected payments for bulk actions
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  
  // Filter states
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Get unique projects for filter dropdown
  const uniqueProjects = useMemo(() => {
    return Array.from(new Set(payments.map(p => p.project_name)));
  }, [payments]);
  
  // Apply filters to payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Project filter
      if (projectFilter !== 'all' && payment.project_name !== projectFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all' && statusFilter !== 'deadline_approaching' && payment.status !== statusFilter) {
        return false;
      }
      
      // Deadline approaching filter
      if (statusFilter === 'deadline_approaching') {
        const dueDate = new Date(payment.project_end_date);
        dueDate.setDate(dueDate.getDate() + 15); // Payment due 15 days after project end
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only show payments that are pending and due within the next 5 days
        if (payment.status !== 'PENDING' || daysUntilDue > 5 || daysUntilDue < 0) {
          return false;
        }
      }
      
      // Time filter
      if (timeFilter !== 'all') {
        const paymentDate = new Date(payment.created_at);
        const now = new Date();
        const diffDays = Math.ceil((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (timeFilter) {
          case 'last7days':
            if (diffDays > 7) return false;
            break;
          case 'last30days':
            if (diffDays > 30) return false;
            break;
          case 'thismonth':
            if (paymentDate.getMonth() !== now.getMonth() || paymentDate.getFullYear() !== now.getFullYear()) return false;
            break;
          case 'lastmonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            if (!(paymentDate.getMonth() === lastMonth.getMonth() && paymentDate.getFullYear() === lastMonth.getFullYear())) return false;
            break;
        }
      }
      
      // Search term filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (!(payment.worker_name.toLowerCase().includes(lowerSearchTerm) ||
              payment.worker_job_card.toLowerCase().includes(lowerSearchTerm) ||
              payment.project_name.toLowerCase().includes(lowerSearchTerm))) {
          return false;
        }
      }
      
      return true;
    });
  }, [payments, projectFilter, statusFilter, timeFilter, searchTerm]);
  
  // Bank details modal
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);
  
  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalActiveWorkers = filteredPayments.length; // Count all workers with payment records
    
    const totalPendingPayments = filteredPayments.filter(p => p.status === 'PENDING').length;
    const totalAmountDue = filteredPayments
      .filter(p => p.status === 'PENDING' || p.status === 'APPROVED')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const paymentsDueThisWeek = filteredPayments.filter(p => {
      const dueDate = new Date(p.project_end_date);
      dueDate.setDate(dueDate.getDate() + 15); // Payment due 15 days after project end
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7 && (p.status === 'PENDING' || p.status === 'APPROVED');
    }).length;
    
    const overduePayments = filteredPayments.filter(p => {
      const dueDate = new Date(p.project_end_date);
      dueDate.setDate(dueDate.getDate() + 15); // Payment due 15 days after project end
      const today = new Date();
      return dueDate < today && (p.status === 'PENDING' || p.status === 'APPROVED');
    }).length;

    return {
      totalActiveWorkers,
      totalPendingPayments,
      totalAmountDue,
      paymentsDueThisWeek,
      overduePayments
    };
  }, [filteredPayments]);

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

  // Fetch all payments with worker and project details
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all payments
        const paymentsResponse = await adminApi.get('/payments');
        const paymentsData = paymentsResponse.data || [];

        // Fetch workers details
        const workersResponse = await adminApi.get('/users/workers/details');
        const workersData = workersResponse.data || [];

        // Fetch projects
        const projectsResponse = await adminApi.get('/projects');
        const projectsData = projectsResponse.data || [];

        // Fetch attendances to calculate days worked
        const attendanceResponse = await adminApi.get('/attendances');
        const attendanceData = attendanceResponse.data || [];

        // Combine all data to create payment records with details
        const detailedPayments: PaymentWithDetails[] = paymentsData.map((payment: Payment) => {
          const worker = workersData.find((w: Worker) => w.id === payment.worker_id);
          const project = projectsData.find((p: Project) => p.id === payment.project_id);
          
          // Calculate days worked for this worker on this project
          const workerAttendances = attendanceData.filter(
            (att: AttendanceRecord) => 
              att.worker_id === payment.worker_id && 
              att.project_id === payment.project_id &&
              att.status === 'PRESENT'
          );
          
          const daysWorked = workerAttendances.length;
          const wagePerDay = project?.wage_per_worker ? project.wage_per_worker : 0;

          return {
            ...payment,
            worker_name: worker?.name || 'Unknown',
            worker_aadhaar: worker?.aadhaar_number || 'N/A',
            worker_job_card: worker?.job_card_id || 'N/A',
            project_name: project?.name || 'Unknown',
            project_end_date: project?.end_date || '',
            daysWorked,
            wage_per_day: wagePerDay,
            bank_name: worker?.bank_name,
            account_number: worker?.account_number,
            ifsc_code: worker?.ifsc_code,
            aadhaar_linked: worker?.aadhaar_linked,
            last_payment_date: worker?.last_payment_date
          };
        });

        setPayments(detailedPayments);
      } catch (err: any) {
        setError(err.message || 'Failed to load payment data');
        console.error('Error fetching payment data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate payment due date (15 days after project end date)
  const getPaymentDueDate = (projectEndDate: string) => {
    const endDate = new Date(projectEndDate);
    endDate.setDate(endDate.getDate() + 15);
    return endDate.toISOString().split('T')[0];
  };

  // Get status color based on payment status and due date
  const getStatusColor = (status: string, projectEndDate: string) => {
    if (status === 'PAID') return 'bg-green-100 text-green-800';
    if (status === 'REJECTED') return 'bg-red-100 text-red-800';
    
    const dueDate = new Date(getPaymentDueDate(projectEndDate));
    const today = new Date();
    
    if (today > dueDate) {
      return 'bg-red-100 text-red-800'; // Overdue
    } else {
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3) {
        return 'bg-orange-100 text-orange-800'; // Due soon
      } else {
        return 'bg-yellow-100 text-yellow-800'; // Pending
      }
    }
  };

  // Get status display text
  const getStatusDisplay = (status: string, projectEndDate: string) => {
    if (status === 'PAID') return 'Paid';
    if (status === 'REJECTED') return 'Rejected';
    
    const dueDate = new Date(getPaymentDueDate(projectEndDate));
    const today = new Date();
    
    if (today > dueDate) {
      return 'Overdue';
    } else {
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3) {
        return 'Due Soon';
      } else {
        return 'Pending';
      }
    }
  };

  // Toggle selection of a payment
  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId) 
        : [...prev, paymentId]
    );
  };

  // Select all payments
  const selectAllPayments = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(p => p.id));
    }
  };

  // Handle marking selected payments as paid
  const handleMarkAsPaid = async () => {
    if (selectedPayments.length === 0) return;
    
    try {
      setLoading(true);
      
      // Mark each selected payment as paid
      for (const paymentId of selectedPayments) {
        await adminApi.patch(`/payments/${paymentId}/paid`, {});
      }
      
      // Refresh the payment data
      const paymentsResponse = await adminApi.get('/payments');
      const paymentsData = paymentsResponse.data || [];
      
      const workersResponse = await adminApi.get('/users/workers/details');
      const workersData = workersResponse.data || [];
      
      const projectsResponse = await adminApi.get('/projects');
      const projectsData = projectsResponse.data || [];
      
      const attendanceResponse = await adminApi.get('/attendances');
      const attendanceData = attendanceResponse.data || [];
      
      // Combine all data to create payment records with details
      const detailedPayments: PaymentWithDetails[] = paymentsData.map((payment: Payment) => {
        const worker = workersData.find((w: Worker) => w.id === payment.worker_id);
        const project = projectsData.find((p: Project) => p.id === payment.project_id);
        
        // Calculate days worked for this worker on this project
        const workerAttendances = attendanceData.filter(
          (att: AttendanceRecord) => 
            att.worker_id === payment.worker_id && 
            att.project_id === payment.project_id &&
            att.status === 'PRESENT'
        );
        
        const daysWorked = workerAttendances.length;
        const wagePerDay = project?.wage_per_worker ? project.wage_per_worker : 0;

        return {
          ...payment,
          worker_name: worker?.name || 'Unknown',
          worker_aadhaar: worker?.aadhaar_number || 'N/A',
          worker_job_card: worker?.job_card_id || 'N/A',
          project_name: project?.name || 'Unknown',
          project_end_date: project?.end_date || '',
          daysWorked,
          wage_per_day: wagePerDay,
          bank_name: worker?.bank_name,
          account_number: worker?.account_number,
          ifsc_code: worker?.ifsc_code,
          aadhaar_linked: worker?.aadhaar_linked,
          last_payment_date: worker?.last_payment_date
        };
      });

      setPayments(detailedPayments);
      setSelectedPayments([]);
      alert(`${selectedPayments.length} payments marked as paid successfully!`);
    } catch (err) {
      setError('Failed to update payments');
      console.error('Error marking payments as paid:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle export to Excel
  const handleExportExcel = (type: 'all' | 'by-project' | 'pending' | 'overdue') => {
    try {
      // @ts-ignore
      import('xlsx').then((XLSX) => {
        // Prepare data for export based on the selected type
        let exportData: any[] = [];
        
        switch(type) {
          case 'pending':
            exportData = filteredPayments.filter(p => p.status === 'PENDING').map(payment => ({
              'Worker Name': payment.worker_name,
              'Job Card ID': payment.worker_job_card,
              'Project Name': payment.project_name,
              'Days Worked': payment.daysWorked,
              'Wage/Day': `₹${payment.wage_per_day.toFixed(2)}`,
              'Total Amount': `₹${payment.amount.toFixed(2)}`,
              'Project End Date': new Date(payment.project_end_date).toLocaleDateString(),
              'Payment Due Date': getPaymentDueDate(payment.project_end_date),
              'Status': payment.status,
            }));
            break;
          case 'overdue':
            exportData = filteredPayments.filter(p => {
              const dueDate = new Date(p.project_end_date);
              dueDate.setDate(dueDate.getDate() + 15); // Payment due 15 days after project end
              const today = new Date();
              return dueDate < today && (p.status === 'PENDING' || p.status === 'APPROVED');
            }).map(payment => ({
              'Worker Name': payment.worker_name,
              'Job Card ID': payment.worker_job_card,
              'Project Name': payment.project_name,
              'Days Worked': payment.daysWorked,
              'Wage/Day': `₹${payment.wage_per_day.toFixed(2)}`,
              'Total Amount': `₹${payment.amount.toFixed(2)}`,
              'Project End Date': new Date(payment.project_end_date).toLocaleDateString(),
              'Payment Due Date': getPaymentDueDate(payment.project_end_date),
              'Status': payment.status,
            }));
            break;
          case 'by-project':
            // Group by project
            const groupedByProject: Record<string, PaymentWithDetails[]> = {};
            filteredPayments.forEach(payment => {
              if (!groupedByProject[payment.project_name]) {
                groupedByProject[payment.project_name] = [];
              }
              groupedByProject[payment.project_name].push(payment);
            });
            
            exportData = [];
            for (const [projectName, projectPayments] of Object.entries(groupedByProject as Record<string, PaymentWithDetails[]>)) {
              projectPayments.forEach(payment => {
                exportData.push({
                  'Project Name': projectName,
                  'Worker Name': payment.worker_name,
                  'Job Card ID': payment.worker_job_card,
                  'Days Worked': payment.daysWorked,
                  'Wage/Day': `₹${payment.wage_per_day.toFixed(2)}`,
                  'Total Amount': `₹${payment.amount.toFixed(2)}`,
                  'Project End Date': new Date(payment.project_end_date).toLocaleDateString(),
                  'Payment Due Date': getPaymentDueDate(payment.project_end_date),
                  'Status': payment.status,
                });
              });
            }
            break;
          default: // 'all'
            exportData = filteredPayments.map(payment => ({
              'Worker Name': payment.worker_name,
              'Job Card ID': payment.worker_job_card,
              'Project Name': payment.project_name,
              'Days Worked': payment.daysWorked,
              'Wage/Day': `₹${payment.wage_per_day.toFixed(2)}`,
              'Total Amount': `₹${payment.amount.toFixed(2)}`,
              'Project End Date': new Date(payment.project_end_date).toLocaleDateString(),
              'Payment Due Date': getPaymentDueDate(payment.project_end_date),
              'Status': payment.status,
            }));
            break;
        }
        
        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Payment Report');
        
        // Generate filename based on export type
        let filename;
        switch(type) {
          case 'pending':
            filename = `Pending_Payments_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
            break;
          case 'overdue':
            filename = `Overdue_Payments_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
            break;
          case 'by-project':
            filename = `Payments_By_Project_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
            break;
          default:
            filename = `All_Payments_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
            break;
        }
        
        // Export file
        XLSX.writeFile(wb, filename);
        
        alert(`${filename} exported successfully!`);
      });
    } catch (error) {
      setError('Failed to export Excel file');
      console.error('Excel export error:', error);
    }
  };

  // Handle export to PDF with different types
  const handleExportPdf = (type: 'payment-order' | 'muster-roll' | 'summary' | 'user-history') => {
    if (type === 'user-history') {
      // Export payment history for a specific user
      if (selectedPayment) {
        exportUserHistoryPdf(selectedPayment.worker_id);
      } else {
        alert('Please select a payment to export user history');
      }
    } else {
      exportPaymentsPdf(type);
    }
  };
  
  // Export to PDF - simplified version based on attendance page format
  const exportToPdf = () => {
    try {
      // @ts-ignore
      import('jspdf').then((jsPDF) => {
        const doc = new jsPDF.default();
        
        // Set document properties
        doc.setProperties({
          title: 'Payment Report',
          subject: 'Government of India - Payment Report',
          author: 'Ministry of Rural Development',
          keywords: 'payment, report, government, india',
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
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 139); // Dark blue
        doc.text('PAYMENT REPORT', 105, 35, { align: 'center' });
        
        // Add NREGA text
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('National Rural Employment Guarantee Act, 2005', 105, 42, { align: 'center' });
        
        // Add decorative line
        doc.setDrawColor(0, 0, 139);
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);
        
        // Report details section
        let currentY = 55;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYMENT SUMMARY REPORT', 20, currentY);
        
        currentY += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(`Date Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, currentY);
        currentY += 6;
        doc.text(`Total Records: ${filteredPayments.length}`, 20, currentY);
        
        currentY += 10;
        doc.text('Generated by Smart Rozgar Portal - MGNREGA Inspired System', 20, currentY);
        
        // Add decorative line
        currentY += 10;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(15, currentY, 195, currentY);
        
        // Payment table
        currentY += 10;
        doc.setFontSize(10);
        
        // Table header
        const headers = ['Sr.No', 'Worker Name', 'Job Card ID', 'Project', 'Days Worked', 'Wage/Day', 'Total Amount', 'Status'];
        const colWidths = [15, 35, 25, 40, 20, 20, 25, 20];
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
        
        filteredPayments.forEach((payment, index) => {
          // Check if we need a new page
          if (currentY > pageHeight - 60) {
            doc.addPage();
            currentY = 20;
            
            // Add headers to new page
            let headerStartX = 15;
            doc.setFillColor(22, 160, 133); // Teal color
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            
            for (let i = 0; i < headers.length; i++) {
              doc.rect(headerStartX, currentY, colWidths[i], 8, 'F');
              doc.text(headers[i], headerStartX + colWidths[i]/2, currentY + 5, { align: 'center' });
              headerStartX += colWidths[i];
            }
            
            currentY += 8;
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
          }
          
          const rowData = [
            rowNumber.toString(),
            payment.worker_name,
            payment.worker_job_card,
            payment.project_name,
            payment.daysWorked.toString(),
            `₹${payment.wage_per_day.toFixed(2)}`,
            `₹${payment.amount.toFixed(2)}`,
            payment.status
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
              if (displayText.length > 18) displayText = displayText.substring(0, 15) + '...';
            } else if (i === 3) { // Project name column
              if (displayText.length > 20) displayText = displayText.substring(0, 17) + '...';
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
        
        const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const paidCount = filteredPayments.filter(p => p.status === 'PAID').length;
        const pendingCount = filteredPayments.filter(p => p.status === 'PENDING').length;
        const approvedCount = filteredPayments.filter(p => p.status === 'APPROVED').length;
        const rejectedCount = filteredPayments.filter(p => p.status === 'REJECTED').length;
        
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Payments: ${filteredPayments.length}`, 20, currentY + 10);
        doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 20, currentY + 20);
        doc.text(`Paid: ${paidCount}`, 20, currentY + 30);
        doc.text(`Pending: ${pendingCount}`, 120, currentY + 10);
        doc.text(`Approved: ${approvedCount}`, 120, currentY + 20);
        doc.text(`Rejected: ${rejectedCount}`, 120, currentY + 30);
        
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
        const filename = `Payment_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        alert(`${filename} exported successfully!`);
      });
    } catch (error) {
      setError('Failed to export PDF file');
      console.error('PDF export error:', error);
    }
  };
  
  // Export user payment history as PDF
  const exportUserHistoryPdf = (userId: string) => {
    try {
      // @ts-ignore
      import('jspdf').then((jsPDF) => {
        const doc = new jsPDF.default();
        
        // Set document properties
        doc.setProperties({
          title: 'Payment History Report',
          subject: 'Payment History Report for Worker',
          author: 'Smart Rozgar Portal',
          keywords: 'payment, history, worker, report, government, india',
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
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 139); // Dark blue
        doc.text('PAYMENT HISTORY REPORT', 105, 35, { align: 'center' });
        
        // Add NREGA text
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('National Rural Employment Guarantee Act, 2005', 105, 42, { align: 'center' });
        
        // Add decorative line
        doc.setDrawColor(0, 0, 139);
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);
        
        // Get user details and payments
        const userPayments = payments.filter(payment => payment.worker_id === userId);
        const user = userPayments.length > 0 ? userPayments[0] : null;
        
        // Worker details section
        let currentY = 55;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('WORKER DETAILS', 20, currentY);
        
        currentY += 8;
        doc.setFont('helvetica', 'normal');
        if (user) {
          doc.text(`Name: ${user.worker_name}`, 20, currentY);
          currentY += 6;
          doc.text(`Job Card ID: ${user.worker_job_card}`, 20, currentY);
          currentY += 6;
          doc.text(`Aadhaar Number: ${user.worker_aadhaar}`, 20, currentY);
        }
        
        currentY += 10;
        doc.text('Generated by Smart Rozgar Portal - MGNREGA Inspired System', 20, currentY);
        
        // Add decorative line
        currentY += 10;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(15, currentY, 195, currentY);
        
        // Payment history table
        currentY += 10;
        doc.setFontSize(10);
        
        // Table header
        const headers = ['Sr.No', 'Project', 'Days Worked', 'Wage/Day', 'Total Amount', 'Project End Date', 'Status'];
        const colWidths = [15, 40, 25, 25, 25, 35, 25];
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
        
        userPayments.forEach((payment, index) => {
          // Check if we need a new page
          if (currentY > pageHeight - 60) {
            doc.addPage();
            currentY = 20;
            
            // Add headers to new page
            let headerStartX = 15;
            doc.setFillColor(22, 160, 133); // Teal color
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            
            for (let i = 0; i < headers.length; i++) {
              doc.rect(headerStartX, currentY, colWidths[i], 8, 'F');
              doc.text(headers[i], headerStartX + colWidths[i]/2, currentY + 5, { align: 'center' });
              headerStartX += colWidths[i];
            }
            
            currentY += 8;
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
          }
          
          const rowData = [
            rowNumber.toString(),
            payment.project_name,
            payment.daysWorked.toString(),
            `₹${payment.wage_per_day.toFixed(2)}`,
            `₹${payment.amount.toFixed(2)}`,
            new Date(payment.project_end_date).toLocaleDateString('en-IN'),
            payment.status
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
            if (i === 1) { // Project name column
              if (displayText.length > 18) displayText = displayText.substring(0, 15) + '...';
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
        
        const totalPayments = userPayments.length;
        const totalAmount = userPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const paidPayments = userPayments.filter(p => p.status === 'PAID').length;
        const pendingPayments = userPayments.filter(p => p.status === 'PENDING').length;
        
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Payments: ${totalPayments}`, 20, currentY + 10);
        doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 20, currentY + 20);
        doc.text(`Paid: ${paidPayments}`, 20, currentY + 30);
        doc.text(`Pending: ${pendingPayments}`, 20, currentY + 40);
        
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
        const filename = `Payment_History_${user?.worker_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        alert(`${filename} exported successfully!`);
      });
    } catch (error) {
      setError('Failed to export PDF file');
      console.error('PDF export error:', error);
    }
  };
  
  // Export payments as PDF based on type
  const exportPaymentsPdf = (type: 'payment-order' | 'muster-roll' | 'summary') => {
    try {
      // @ts-ignore
      import('jspdf').then((jsPDF) => {
        const doc = new jsPDF.default();
        
        // Set document properties
        doc.setProperties({
          title: 'Payment Report',
          subject: 'Government Payment Report',
          author: 'Smart Rozgar Portal',
          keywords: 'payment, report, government, india',
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
        
        // Add title based on type
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 139); // Dark blue
        let title;
        switch(type) {
          case 'payment-order':
            title = 'PAYMENT ORDER';
            break;
          case 'muster-roll':
            title = 'MUSTER ROLL SUMMARY';
            break;
          case 'summary':
            title = 'PAYMENT SUMMARY REPORT';
            break;
          default:
            title = 'PAYMENT REPORT';
        }
        doc.text(title, 105, 35, { align: 'center' });
        
        // Add NREGA text
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('National Rural Employment Guarantee Act, 2005', 105, 42, { align: 'center' });
        
        // Add decorative line
        doc.setDrawColor(0, 0, 139);
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);
        
        // Report details section
        let currentY = 55;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORT DETAILS', 20, currentY);
        
        currentY += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(`Report Type: ${title}`, 20, currentY);
        currentY += 6;
        doc.text(`Date Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, currentY);
        currentY += 6;
        doc.text(`Total Records: ${filteredPayments.length}`, 20, currentY);
        
        currentY += 10;
        doc.text('Generated by Smart Rozgar Portal - MGNREGA Inspired System', 20, currentY);
        
        // Add decorative line
        currentY += 10;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(15, currentY, 195, currentY);
        
        // Payment table
        currentY += 10;
        doc.setFontSize(10);
        
        // Define headers based on report type
        let headers, colWidths;
        if (type === 'muster-roll') {
          headers = ['Sr.No', 'Worker Name', 'Job Card ID', 'Project', 'Days Worked', 'Wage/Day', 'Total Amount', 'Status'];
          colWidths = [15, 35, 25, 35, 20, 20, 20, 20];
        } else if (type === 'payment-order') {
          headers = ['Sr.No', 'Worker Name', 'Job Card ID', 'Project', 'Total Amount', 'Due Date', 'Status'];
          colWidths = [15, 35, 25, 45, 25, 30, 20];
        } else { // summary
          headers = ['Sr.No', 'Worker Name', 'Job Card ID', 'Project', 'Days Worked', 'Total Amount', 'Status'];
          colWidths = [15, 35, 25, 40, 20, 25, 20];
        }
        
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
        
        filteredPayments.forEach((payment, index) => {
          // Check if we need a new page
          if (currentY > pageHeight - 60) {
            doc.addPage();
            currentY = 20;
            
            // Add headers to new page
            let headerStartX = 15;
            doc.setFillColor(22, 160, 133); // Teal color
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            
            for (let i = 0; i < headers.length; i++) {
              doc.rect(headerStartX, currentY, colWidths[i], 8, 'F');
              doc.text(headers[i], headerStartX + colWidths[i]/2, currentY + 5, { align: 'center' });
              headerStartX += colWidths[i];
            }
            
            currentY += 8;
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
          }
          
          // Prepare row data based on report type
          let rowData;
          if (type === 'muster-roll') {
            rowData = [
              rowNumber.toString(),
              payment.worker_name,
              payment.worker_job_card,
              payment.project_name,
              payment.daysWorked.toString(),
              `₹${payment.wage_per_day.toFixed(2)}`,
              `₹${payment.amount.toFixed(2)}`,
              payment.status
            ];
          } else if (type === 'payment-order') {
            rowData = [
              rowNumber.toString(),
              payment.worker_name,
              payment.worker_job_card,
              payment.project_name,
              `₹${payment.amount.toFixed(2)}`,
              getPaymentDueDate(payment.project_end_date),
              payment.status
            ];
          } else { // summary
            rowData = [
              rowNumber.toString(),
              payment.worker_name,
              payment.worker_job_card,
              payment.project_name,
              payment.daysWorked.toString(),
              `₹${payment.amount.toFixed(2)}`,
              payment.status
            ];
          }
          
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
              if (displayText.length > 18) displayText = displayText.substring(0, 15) + '...';
            } else if (i === 3) { // Project name column
              if (displayText.length > 20) displayText = displayText.substring(0, 17) + '...';
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
        
        const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const paidCount = filteredPayments.filter(p => p.status === 'PAID').length;
        const pendingCount = filteredPayments.filter(p => p.status === 'PENDING').length;
        const approvedCount = filteredPayments.filter(p => p.status === 'APPROVED').length;
        const rejectedCount = filteredPayments.filter(p => p.status === 'REJECTED').length;
        
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Payments: ${filteredPayments.length}`, 20, currentY + 10);
        doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 20, currentY + 20);
        doc.text(`Paid: ${paidCount}`, 20, currentY + 30);
        doc.text(`Pending: ${pendingCount}`, 120, currentY + 10);
        doc.text(`Approved: ${approvedCount}`, 120, currentY + 20);
        doc.text(`Rejected: ${rejectedCount}`, 120, currentY + 30);
        
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
        const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        alert(`${filename} exported successfully!`);
      });
    } catch (error) {
      setError('Failed to export PDF file');
      console.error('PDF export error:', error);
    }
  };
  
  // Handle export user payment history PDF
  const handleExportUserHistoryPdf = (userId: string) => {
    exportUserHistoryPdf(userId);
  };
  
  // Close bank details modal
  const closeBankDetailsModal = () => {
    setShowBankDetails(false);
    setSelectedPayment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('paymentManagement')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? t('hindi') : t('english')}
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('paymentManagement')}</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* Total Active Workers */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <span className="text-2xl">👷</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('totalActiveWorkers')}</p>
                <p className="text-3xl font-bold text-gray-800">{summaryStats.totalActiveWorkers}</p>
              </div>
            </div>
          </div>

          {/* Total Pending Payments */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('pendingPayments')}</p>
                <p className="text-3xl font-bold text-gray-800">{summaryStats.totalPendingPayments}</p>
              </div>
            </div>
          </div>

          {/* Total Amount Due */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                <span className="text-2xl">💸</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('totalAmountDue')}</p>
                <p className="text-3xl font-bold text-gray-800">₹{summaryStats.totalAmountDue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payments Due This Week */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600 mr-4">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('paymentsDueThisWeek')}</p>
                <p className="text-3xl font-bold text-gray-800">{summaryStats.paymentsDueThisWeek}</p>
              </div>
            </div>
          </div>

          {/* Overdue Payments */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('overduePayments')}</p>
                <p className="text-3xl font-bold text-gray-800">{summaryStats.overduePayments}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Project Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('project')}</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects</option>
              {uniqueProjects.map((project, index) => (
                <option key={index} value={project}>{project}</option>
              ))}
            </select>
          </div>
          
          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thismonth">This Month</option>
              <option value="lastmonth">Last Month</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          
          {/* Deadline Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <select
              value="all" // Using a temporary value
              onChange={(e) => {
                // For deadline approaching filter, we'll use the status filter as well
                if (e.target.value === 'approaching') {
                  setStatusFilter('PENDING');
                  // We'll handle this in the filter logic
                } else {
                  setStatusFilter('all');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Deadlines</option>
              <option value="approaching">Deadline Approaching (5 days)</option>
            </select>
          </div>
          
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search workers, projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Bulk Actions and Export Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                onChange={selectAllPayments}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{t('selectAll')}</span>
            </label>
            
            {selectedPayments.length > 0 && (
              <button
                onClick={handleMarkAsPaid}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {t('markSelectedAsPaid')} ({selectedPayments.length})
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExportExcel('all')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {t('exportExcel')}
            </button>
            <button
              onClick={exportToPdf}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              {t('exportPdf')}
            </button>
            <button
              onClick={() => {
                if (selectedPayment) {
                  handleExportUserHistoryPdf(selectedPayment.worker_id);
                } else {
                  alert('Please select a payment to export user history');
                }
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              {selectedPayment ? `Export ${selectedPayment.worker_name}'s History PDF` : 'Export User History PDF'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                        onChange={selectAllPayments}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('workerName')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('jobCardIdLabel')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('projectName')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('daysWorked')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wagePerDay')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('totalAmount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('projectEndDate')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentDueDate')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => {
                      const isSelectedForExport = selectedPayment && selectedPayment.id === payment.id;
                      return (
                        <tr 
                          key={payment.id} 
                          className={`hover:bg-gray-50 ${isSelectedForExport ? 'bg-purple-100 border-l-4 border-purple-600 font-medium' : ''}`}
                          onClick={(e) => {
                            // Only set selected payment for export if not clicking on interactive elements
                            const target = e.target as HTMLElement;
                            if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT') {
                              // Toggle selection - if same payment is clicked again, deselect it
                              if (selectedPayment && selectedPayment.id === payment.id) {
                                setSelectedPayment(null);
                              } else {
                                setSelectedPayment(payment);
                              }
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedPayments.includes(payment.id)}
                            onChange={() => togglePaymentSelection(payment.id)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.worker_name}</div>
                          <div className="text-sm text-gray-500">{payment.worker_aadhaar}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.worker_job_card}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.project_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.daysWorked}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{payment.wage_per_day.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          ₹{payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.project_end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getPaymentDueDate(payment.project_end_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status, payment.project_end_date)}`}>
                            {getStatusDisplay(payment.status, payment.project_end_date)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowBankDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {t('viewBankDetails')}
                          </button>
                          <button
                            onClick={() => {
                              // Toggle selection - if same payment is clicked again, deselect it
                              if (selectedPayment && selectedPayment.id === payment.id) {
                                setSelectedPayment(null);
                              } else {
                                setSelectedPayment(payment);
                              }
                            }}
                            className="text-purple-600 hover:text-purple-900 mr-4"
                          >
                            {isSelectedForExport ? 'Deselect Export' : 'Select for Export'}
                          </button>
                          {payment.status === 'PENDING' && (
                            <button
                              onClick={() => alert(`Marking payment ${payment.id} as paid`)}
                              className="text-green-600 hover:text-green-900"
                            >
                              {t('markPaid')}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-6 py-4 text-center text-sm text-gray-500">
                        {t('noPaymentsFound')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bank Details Modal */}
      {showBankDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{t('viewBankDetails')}</h3>
                <button 
                  onClick={closeBankDetailsModal}
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
                  <p className="font-medium">{selectedPayment.worker_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('bankName')}</p>
                  <p className="font-medium">{selectedPayment.bank_name || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('accountNumber')}</p>
                  <p className="font-medium">
                    {selectedPayment.account_number 
                      ? `XXXXXXX${selectedPayment.account_number.slice(-4)}` 
                      : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('ifscCode')}</p>
                  <p className="font-medium">{selectedPayment.ifsc_code || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('aadhaarLinked')}</p>
                  <p className="font-medium">
                    {selectedPayment.aadhaar_linked ? t('yes') : t('no')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t('lastPaymentDate')}</p>
                  <p className="font-medium">
                    {selectedPayment.last_payment_date 
                      ? new Date(selectedPayment.last_payment_date).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => alert(t('verifyIFSC'))}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {t('verifyIFSC')}
                  </button>
                  <button
                    onClick={() => {
                      if (selectedPayment) {
                        handleExportUserHistoryPdf(selectedPayment.worker_id);
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Export {selectedPayment?.worker_name || 'User'}'s History PDF
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeBankDetailsModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}