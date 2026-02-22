'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import jsPDF from 'jspdf';

export default function TrackApplicationPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // Form state
  const [trackingId, setTrackingId] = useState('');
  const [applicationData, setApplicationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setApplicationData(null);

    try {
      const response = await fetch(`http://localhost:3001/api/v1/job-card-applications/track/${trackingId}`);
      
      if (response.ok) {
        const result = await response.json();
        setApplicationData(result.data);
      } else {
        const errorResult = await response.json();
        setError(errorResult.error?.message || 'Application not found');
      }
    } catch (err) {
      setError('An error occurred while fetching application status');
      console.error('Error fetching application status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('sentToAuthority');
      case 'approved':
        return t('identityVerified');
      case 'rejected':
        return t('rejected');
      default:
        return status;
    }
  };

  // Generate PDF
  const generatePDF = () => {
    if (!applicationData) return;

    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Job Card - ${applicationData.trackingId}`,
      subject: 'Government of India - MGNREGA Job Card',
      author: 'Ministry of Rural Development',
      keywords: 'job card, mgnrega, government, india',
      creator: 'Smart Rozgar Portal'
    });
    
    // Add header with government emblem (using text as placeholder)
    doc.setFillColor(0, 0, 139); // Dark blue
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255); // White text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('GOVERNMENT OF INDIA', 105, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.text('MINISTRY OF RURAL DEVELOPMENT', 105, 25, { align: 'center' });
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Add job card title
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 139); // Dark blue
    doc.text('JOB CARD', 105, 45, { align: 'center' });
    
    // Add NREGA text
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('National Rural Employment Guarantee Act, 2005', 105, 55, { align: 'center' });
    
    // Add decorative line
    doc.setDrawColor(0, 0, 139);
    doc.setLineWidth(1);
    doc.line(20, 60, 190, 60);
    
    // Add card details with proper formatting and image placement
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Calculate positions for image
    const imageX = 150; // Position image on the right side
    const labelX = 20; // X position for labels
    const valueX = 70; // X position for values
    const lineHeight = 10; // Consistent line height
    let currentY = 75; // Starting Y position
    
    // Tracking ID
    doc.setFont('helvetica', 'bold');
    doc.text('Tracking ID:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.trackingId, valueX, currentY);
    
    // Aadhaar Number
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Aadhaar Number:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.aadhaarNumber, valueX, currentY);
    
    // Head of Household Name
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.headOfHouseholdName, valueX, currentY);
    
    // Address Information
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.fullAddress || '', valueX, currentY);
    
    // Village
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Village:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.village || '', valueX, currentY);
    
    // Block
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Block:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.block || '', valueX, currentY);
    
    // District
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('District:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.district, valueX, currentY);
    
    // Pincode
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Pincode:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(applicationData.pincode || '', valueX, currentY);
    
    // User Image (placed on the right side)
    if (applicationData.imageUrl) {
      try {
        doc.addImage(applicationData.imageUrl, 'JPEG', imageX, 75, 30, 30);
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }
    
    // Job Card ID (if available)
    currentY += lineHeight;
    if (applicationData.jobCardId) {
      doc.setFont('helvetica', 'bold');
      doc.text('Job Card ID:', labelX, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(applicationData.jobCardId, valueX, currentY);
    }
    
    // Approved On (instead of submitted)
    currentY += lineHeight;
    doc.setFont('helvetica', 'bold');
    doc.text('Approved On:', labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(applicationData.updatedAt).toLocaleDateString(), valueX, currentY);
    
    // Family Members Information
    currentY += lineHeight * 2;
    
    if (applicationData.applicants && Array.isArray(applicationData.applicants) && applicationData.applicants.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Family Members:', labelX, currentY);
      
      // Add table header
      currentY += lineHeight;
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240); // Light gray
      doc.rect(labelX, currentY, 170, 10, 'F');
      doc.text('Name', labelX + 5, currentY + 7);
      doc.text('Date of Birth', labelX + 100, currentY + 7);
      
      // Add family members
      doc.setFont('helvetica', 'normal');
      applicationData.applicants.forEach((member: any, index: number) => {
        currentY += lineHeight;
        // Parse the applicant data if it's a JSON string
        let applicantData = member;
        if (typeof member === 'string') {
          try {
            applicantData = JSON.parse(member);
          } catch (e) {
            // If parsing fails, use the original string
          }
        }
        
        doc.text(applicantData.name || '', labelX + 5, currentY + 7);
        doc.text(applicantData.dateOfBirth || applicantData.dob || '', labelX + 100, currentY + 7);
      });
    }
    
    // Add signature placeholder with image
    currentY += lineHeight * 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Authorized Signature:', labelX, currentY);
    
    // Add signature image
    try {
      // Use actual signature image from public folder
      doc.addImage('/images/signature.png', 'PNG', valueX, currentY - 5, 40, 20);
    } catch (error) {
      console.error('Error adding signature image to PDF:', error);
      // Draw signature line if image fails to load
      doc.line(valueX, currentY + 5, valueX + 50, currentY + 5); // Signature line
    }
    
    // Add official stamp
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0); // Red color
    
    // Add stamp image
    try {
      // Use actual stamp image from public folder
      doc.addImage('/images/stamp.png', 'PNG', 150, currentY, 40, 40);
    } catch (error) {
      console.error('Error adding stamp image to PDF:', error);
      // Draw text stamp if image fails to load
      doc.text('OFFICIAL STAMP', 150, currentY + 15);
    }
    
    doc.setTextColor(0, 0, 0); // Reset to black
    
    // Add decorative border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(15, 35, 180, currentY + 30);
    
    // Save the PDF
    doc.save(`job-card-${applicationData.trackingId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">{t('trackApplicationTitle')}</h1>
              <div className="flex space-x-3">
                <a 
                  href="/" 
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
                >
                  {t('home')}
                </a>
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
                >
                  {language === 'en' ? t('hindi') : t('english')}
                </button>
              </div>
            </div>
            <p className="text-indigo-100 mt-2">
              {t('trackApplicationDescription')}
            </p>
          </div>

          {/* Tracking Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  {t('trackingId')} *
                </label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  placeholder={t('enterTrackingId')}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? t('checkingStatus') : t('trackApplication')}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Application Status */}
            {applicationData && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('applicationStatus')}</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{t('trackingId')}:</span>
                    <span className="text-gray-900">{applicationData.trackingId}</span>
                  </div>
                  
                  {/* Status Display - Different styles based on status */}
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{t('status')}:</span>
                    <span className={`text-lg font-bold ${applicationData.status === 'rejected' ? 'text-red-600' : applicationData.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {getStatusDisplayText(applicationData.status)}
                    </span>
                  </div>
                  
                  {/* Show rejection reason if application is rejected */}
                  {applicationData.status === 'rejected' && applicationData.rejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-semibold text-red-700">Reason for Rejection:</p>
                      <p className="text-red-600 mt-1">{applicationData.rejectionReason}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{t('aadhaarNumber')}:</span>
                    <span className="text-gray-900">{applicationData.aadhaarNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{t('headOfHouseholdName')}:</span>
                    <span className="text-gray-900">{applicationData.headOfHouseholdName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Full Address:</span>
                    <span className="text-gray-900">{applicationData.fullAddress}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Village:</span>
                    <span className="text-gray-900">{applicationData.village || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Block:</span>
                    <span className="text-gray-900">{applicationData.block || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Pincode:</span>
                    <span className="text-gray-900">{applicationData.pincode || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{t('district')}:</span>
                    <span className="text-gray-900">{applicationData.district}</span>
                  </div>
                  
                  {applicationData.jobCardId && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">{t('jobCardId')}:</span>
                      <span className="text-gray-900">{applicationData.jobCardId}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{t('submittedOn')}:</span>
                    <span className="text-gray-900">
                      {new Date(applicationData.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* User Image */}
                  {applicationData.imageUrl && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-700 mb-2">User Image:</h3>
                      <img 
                        src={applicationData.imageUrl} 
                        alt="User" 
                        className="w-32 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                  
                  {/* Family Members Information */}
                  {applicationData.applicants && Array.isArray(applicationData.applicants) && applicationData.applicants.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-700 mb-2">{t('familyMembers')}:</h3>
                      <div className="bg-white p-3 rounded border">
                        {applicationData.applicants.map((member: any, index: number) => {
                          // Parse the applicant data if it's a JSON string
                          let applicantData = member;
                          if (typeof member === 'string') {
                            try {
                              applicantData = JSON.parse(member);
                            } catch (e) {
                              // If parsing fails, use the original string
                            }
                          }
                          
                          return (
                            <div key={index} className="flex justify-between py-1 border-b last:border-b-0">
                              <span className="text-gray-900">{applicantData.name || 'N/A'}</span>
                              <span className="text-gray-600">
                                {applicantData.dateOfBirth || applicantData.dob || 'N/A'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {applicationData.status === 'approved' && applicationData.jobCardId && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800">{t('registrationSuccessful')}</h3>
                    <p className="text-blue-700 mt-1">
                      {t('youCanTrackJobCard')}
                    </p>
                    <button
                      onClick={generatePDF}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {t('downloadAsPDF')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}