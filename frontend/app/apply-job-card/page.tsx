'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../lib/useTranslation';
import { Language } from '../lib/translations';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useRouter } from 'next/navigation';

// Define types for our location data
type VillageData = {
  villages: string[];
  panchayats: string[];
  pincode: string;
};

type DistrictData = {
  [key: string]: VillageData;
};

type StateData = {
  [key: string]: DistrictData;
};

// Mock data for states, districts, villages, and panchayats
const locationData: StateData = {
  'Uttar Pradesh': {
    'Lucknow': {
      villages: ['Gomti Nagar', 'Alambagh', 'Hazratganj', 'Aminabad'],
      panchayats: ['Lucknow Nagar', 'Gomti Panchayat', 'Alambagh Panchayat'],
      pincode: '226001'
    },
    'Kanpur': {
      villages: ['Nawabganj', 'Kakadeo', 'Swaroop Nagar'],
      panchayats: ['Kanpur Nagar', 'Nawabganj Panchayat'],
      pincode: '208001'
    }
  },
  'Bihar': {
    'Patna': {
      villages: ['Danapur', 'Phulwari Sharif', 'Bihta'],
      panchayats: ['Patna Nagar', 'Danapur Panchayat'],
      pincode: '800001'
    },
    'Gaya': {
      villages: ['Bodh Gaya', 'Imamganj', 'Tikari'],
      panchayats: ['Gaya Nagar', 'Bodh Gaya Panchayat'],
      pincode: '823001'
    }
  }
};

// Categories for the job card application
const categories = [
  'General',
  'OBC',
  'SC',
  'ST'
];

export default function JobCardApplication() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslation(language);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  // Add reCAPTCHA v3 hook
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Execute reCAPTCHA
  const handleReCaptchaVerify = async (action: string) => {
    console.log('Executing reCAPTCHA for action:', action);
    console.log('executeRecaptcha available:', !!executeRecaptcha);
    
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available - this is common during initial load');
      // Don't return null immediately, wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!executeRecaptcha) {
        console.log('Execute recaptcha still not available after waiting');
        return null;
      }
    }
    
    try {
      const token = await executeRecaptcha(action);
      console.log('Recaptcha token received:', token);
      setCaptchaToken(token);
      return token;
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      return null;
    }
  };

  // Form state
  const [formState, setFormState] = useState({
    aadhaarNumber: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    jobCardDetails: {
      familyId: '',
      headOfHouseholdName: '',
      fatherHusbandName: '',
      category: '',
      dateOfRegistration: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      address: '', // Add missing address field
      state: '',
      district: '',
      village: '',
      pincode: '',
      panchayat: '',
      block: '', // Add missing block field
      isBPL: false, // Add missing isBPL field
      epicNo: '', // Add missing epicNo field
      applicants: [
        {
          name: '',
          fatherHusbandName: '',
          relationship: 'Father',
          dateOfBirth: '',
          age: '',
          gender: 'Male',
          aadhaarNumber: '',
          bankName: '', // Changed from bankDetails to specific bank fields
          accountNumber: '', // Added account number field
          ifscCode: '' // Added IFSC code field
        }
      ]
    }
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested state updates
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormState(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle job card details changes
  const handleJobCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested state updates for jobCardDetails
    if (name.startsWith('jobCardDetails.')) {
      const fieldName = name.split('.')[1];
      setFormState(prev => ({
        ...prev,
        jobCardDetails: {
          ...prev.jobCardDetails,
          [fieldName]: value
        }
      })); // Fixed: Added missing closing parenthesis
      
      // Clear error when user starts typing
      if (errors[fieldName]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      setFormState(prev => ({
        ...prev,
        jobCardDetails: {
          ...prev.jobCardDetails,
          [name]: value
        }
      })); // Fixed: Added missing closing parenthesis
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Handle applicant changes
  const handleApplicantChange = (index: number, field: string, value: string) => {
    setFormState(prev => {
      const updatedApplicants = [...prev.jobCardDetails.applicants];
      updatedApplicants[index] = {
        ...updatedApplicants[index],
        [field]: value
      };
      
      return {
        ...prev,
        jobCardDetails: {
          ...prev.jobCardDetails,
          applicants: updatedApplicants
        }
      };
    });
    
    // Clear error when user starts typing
    const errorKey = `applicant-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add new applicant
  const addApplicant = () => {
    setFormState(prev => ({
      ...prev,
      jobCardDetails: {
        ...prev.jobCardDetails,
        applicants: [
          ...prev.jobCardDetails.applicants,
          {
            name: '',
            fatherHusbandName: '',
            relationship: 'Father',
            dateOfBirth: '',
            age: '',
            gender: 'Male',
            aadhaarNumber: '',
            bankName: '', // Changed from bankDetails to specific bank fields
            accountNumber: '', // Added account number field
            ifscCode: '' // Added IFSC code field
          }
        ]
      }
    }));
  };

  // Remove applicant
  const removeApplicant = (index: number) => {
    if (formState.jobCardDetails.applicants.length > 1) {
      const updatedApplicants = [...formState.jobCardDetails.applicants];
      updatedApplicants.splice(index, 1);
      setFormState({
        ...formState,
        jobCardDetails: {
          ...formState.jobCardDetails,
          applicants: updatedApplicants
        }
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    console.log('Starting form validation');
    const newErrors: {[key: string]: string} = {};
    
    // Validate personal details
    if (!formState.aadhaarNumber) {
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(formState.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Aadhaar number must be 12 digits';
    }
    
    if (!formState.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formState.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    
    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formState.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character';
    }
    
    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate job card details
    if (!formState.jobCardDetails.familyId) {
      newErrors.familyId = 'Family ID is required';
    }
    
    if (!formState.jobCardDetails.headOfHouseholdName) {
      newErrors.headOfHouseholdName = 'Head of household name is required';
    }
    
    if (!formState.jobCardDetails.fatherHusbandName) {
      newErrors.fatherHusbandName = 'Father/Husband name is required';
    }
    
    if (!formState.jobCardDetails.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formState.jobCardDetails.state) {
      newErrors.state = 'State is required';
    }
    
    if (!formState.jobCardDetails.district) {
      newErrors.district = 'District is required';
    }
    
    if (!formState.jobCardDetails.village) {
      newErrors.village = 'Village is required';
    }
    
    // Validate address
    if (!formState.jobCardDetails.address) {
      newErrors.address = 'Address is required';
    }
    
    // Validate block
    if (!formState.jobCardDetails.block) {
      newErrors.block = 'Block is required';
    }
    
    // Pincode is auto-populated, so only validate format if present
    if (formState.jobCardDetails.pincode && !/^\d{6}$/.test(formState.jobCardDetails.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    if (!formState.jobCardDetails.panchayat) {
      newErrors.panchayat = 'Panchayat is required';
    }
    
    // Validate applicants
    formState.jobCardDetails.applicants.forEach((applicant, index) => {
      if (!applicant.name) {
        newErrors[`applicant-${index}-name`] = 'Name is required';
      }
      
      if (!applicant.fatherHusbandName) {
        newErrors[`applicant-${index}-fatherHusbandName`] = 'Father/Husband name is required';
      }
      
      // Validate DOB and calculate age
      if (!applicant.dateOfBirth) {
        newErrors[`applicant-${index}-dateOfBirth`] = 'Date of birth is required';
      } else {
        // Calculate age from DOB
        const dob = new Date(applicant.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        
        // Check if age is below 18
        if (age < 18) {
          newErrors[`applicant-${index}-dateOfBirth`] = 'Applicant must be at least 18 years old';
        }
      }
      
      if (!applicant.aadhaarNumber) {
        newErrors[`applicant-${index}-aadhaarNumber`] = 'Aadhaar number is required';
      } else if (!/^\d{12}$/.test(applicant.aadhaarNumber)) {
        newErrors[`applicant-${index}-aadhaarNumber`] = 'Aadhaar number must be 12 digits';
      }
      
      // Validate bank details
      if (!applicant.bankName) {
        newErrors[`applicant-${index}-bankName`] = 'Bank name is required';
      }
      
      if (!applicant.accountNumber) {
        newErrors[`applicant-${index}-accountNumber`] = 'Account number is required';
      }
      
      if (!applicant.ifscCode) {
        newErrors[`applicant-${index}-ifscCode`] = 'IFSC code is required';
      } else if (!/^[A-Z]{4}[0-9]{1}[A-Z0-9]{6}$/.test(applicant.ifscCode.toUpperCase())) {
        newErrors[`applicant-${index}-ifscCode`] = 'Invalid IFSC code format (should be 11 characters: AAAA0XXXXXX)';
      }
    });
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    
    // If there are errors, scroll to the first error
    if (Object.keys(newErrors).length > 0) {
      console.log('Form has validation errors, submission prevented');
      // Find the first error element and scroll to it
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(`[name*="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus();
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current form state:', formState);
    
    // Validate form
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    console.log('Form validation passed');
    
    try {
      // For local development, we can bypass reCAPTCHA
      // In production, you would want to properly implement reCAPTCHA
      const isDevelopment = process.env.NODE_ENV === 'development';
      let recaptchaToken = null;
      
      if (!isDevelopment) {
        // Execute reCAPTCHA for job card application
        recaptchaToken = await handleReCaptchaVerify('apply_job_card');
        console.log('Recaptcha token:', recaptchaToken);
        
        if (!recaptchaToken) {
          alert('reCAPTCHA verification failed. Please try again.');
          return;
        }
      } else {
        // In development, use a dummy token
        recaptchaToken = 'dummy-development-token';
        console.log('Using dummy token for development');
      }
      
      // Prepare job card application data to match backend validation schema
      const applicationData = {
        aadhaarNumber: formState.aadhaarNumber,
        phoneNumber: formState.phoneNumber,
        captchaToken: recaptchaToken,
        password: formState.password,
        jobCardDetails: {
          familyId: formState.jobCardDetails.familyId,
          headOfHouseholdName: formState.jobCardDetails.headOfHouseholdName,
          fatherHusbandName: formState.jobCardDetails.fatherHusbandName,
          category: formState.jobCardDetails.category,
          dateOfRegistration: formState.jobCardDetails.dateOfRegistration,
          address: formState.jobCardDetails.address,
          state: formState.jobCardDetails.state,
          district: formState.jobCardDetails.district,
          village: formState.jobCardDetails.village,
          pincode: formState.jobCardDetails.pincode,
          panchayat: formState.jobCardDetails.panchayat,
          block: formState.jobCardDetails.block,
          isBPL: formState.jobCardDetails.isBPL,
          epicNo: formState.jobCardDetails.epicNo || null,
          applicants: formState.jobCardDetails.applicants.map(applicant => {
            let age = 0;
            if (applicant.dateOfBirth) {
              const dob = new Date(applicant.dateOfBirth);
              const today = new Date();
              age = today.getFullYear() - dob.getFullYear();
              const monthDiff = today.getMonth() - dob.getMonth();
              
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
              }
            }
            
            const bankDetails = `${applicant.bankName}|${applicant.accountNumber}|${applicant.ifscCode}`;
            
            return {
              name: applicant.name,
              fatherHusbandName: applicant.fatherHusbandName,
              relationship: applicant.relationship,
              dateOfBirth: applicant.dateOfBirth,
              age: age,
              gender: applicant.gender,
              aadhaarNumber: applicant.aadhaarNumber,
              bankDetails: bankDetails
            };
          })
        }
      };

      console.log('Sending application data:', applicationData);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('applicationData', JSON.stringify(applicationData));
      
      // Append image file if available
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Submit the application
      const response = await fetch('http://localhost:3001/api/v1/job-card-applications/submit', {
        method: 'POST',
        // Don't set Content-Type header, let browser set it with boundary
        body: formData,
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        // Redirect to success page with tracking ID
        console.log('Response is OK, result:', result);
        console.log('Result data:', result.data);
        
        // Check if trackingId exists in the response
        if (result.data && result.data.trackingId) {
          console.log('Redirecting to success page with tracking ID:', result.data.trackingId);
          router.push(`/jobcardregistrationsuccess?trackingId=${result.data.trackingId}`);
        } else {
          console.error('Tracking ID not found in response:', result);
          alert('Application submitted successfully, but tracking ID not found. Please check the console for details.');
        }
      } else {
        console.error('Server returned error:', result);
        alert(result.error?.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred while submitting the application. Please try again.');
    }
  };

  // Update districts when state changes
  const districts = formState.jobCardDetails.state 
    ? Object.keys(locationData[formState.jobCardDetails.state] || {}) 
    : [];

  // Log form state for debugging
  useEffect(() => {
    console.log('Form State:', formState);
  }, [formState]);

  // Update villages and panchayats when district changes
  const villageData = formState.jobCardDetails.state && formState.jobCardDetails.district 
    ? locationData[formState.jobCardDetails.state]?.[formState.jobCardDetails.district] 
    : null;

  // Update pincode when village/panchayat changes
  useEffect(() => {
    if (villageData?.pincode) {
      setFormState(prev => ({
        ...prev,
        jobCardDetails: {
          ...prev.jobCardDetails,
          pincode: villageData.pincode
        }
      }));
    }
  }, [formState.jobCardDetails.district, villageData?.pincode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">{t('applyJobCardTitle')}</h1>
              <div className="flex space-x-3">
                <a 
                  href="/" 
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
                >
                  {t('home')}
                </a>
                <button 
                  onClick={() => handleLanguageChange(language === 'en' ? 'hi' : 'en')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
                >
                  {language === 'en' ? t('hindi') : t('english')}
                </button>
              </div>
            </div>
            <p className="text-indigo-100 mt-2">
              {t('applyJobCardDescription')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('personalInformation')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('aadhaarNumber')} *
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formState.aadhaarNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterAadhaar')}
                    required
                  />
                  {errors.aadhaarNumber && <p className="mt-1 text-xs text-red-500">{errors.aadhaarNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formState.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterPhone')}
                    required
                  />
                  {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('password')} *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('createPassword')}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                  </p>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('confirmPassword')} *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formState.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('confirmPassword')}
                    required
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Job Card Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('jobCardDetails')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('familyId')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.familyId"
                    value={formState.jobCardDetails.familyId}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterFamilyId')}
                    required
                  />
                  {errors.familyId && <p className="mt-1 text-xs text-red-500">{errors.familyId}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('headOfHouseholdName')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.headOfHouseholdName"
                    value={formState.jobCardDetails.headOfHouseholdName}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterFullName')}
                    required
                  />
                  {errors.headOfHouseholdName && <p className="mt-1 text-xs text-red-500">{errors.headOfHouseholdName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('fatherHusbandName')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.fatherHusbandName"
                    value={formState.jobCardDetails.fatherHusbandName}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterFatherHusbandName')}
                    required
                  />
                  {errors.fatherHusbandName && <p className="mt-1 text-xs text-red-500">{errors.fatherHusbandName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('category')} *
                  </label>
                  <select
                    name="jobCardDetails.category"
                    value={formState.jobCardDetails.category}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                  >
                    <option value="">{t('selectCategory')}</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('state')} *
                  </label>
                  <select
                    name="jobCardDetails.state"
                    value={formState.jobCardDetails.state}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                  >
                    <option value="">{t('selectState')}</option>
                    {Object.keys(locationData).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('district')} *
                  </label>
                  <select
                    name="jobCardDetails.district"
                    value={formState.jobCardDetails.district}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                    disabled={!formState.jobCardDetails.state}
                  >
                    <option value="">{t('selectDistrict')}</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('village')} *
                  </label>
                  <select
                    name="jobCardDetails.village"
                    value={formState.jobCardDetails.village}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                    disabled={!formState.jobCardDetails.district}
                  >
                    <option value="">{t('selectVillage')}</option>
                    {villageData?.villages?.map((village: string) => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                  {errors.village && <p className="mt-1 text-xs text-red-500">{errors.village}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('panchayat')} *
                  </label>
                  <select
                    name="jobCardDetails.panchayat"
                    value={formState.jobCardDetails.panchayat}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                    disabled={!formState.jobCardDetails.district}
                  >
                    <option value="">{t('selectPanchayat')}</option>
                    {villageData?.panchayats?.map((panchayat: string) => (
                      <option key={panchayat} value={panchayat}>{panchayat}</option>
                    ))}
                  </select>
                  {errors.panchayat && <p className="mt-1 text-xs text-red-500">{errors.panchayat}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('pincode')}
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.pincode"
                    value={formState.jobCardDetails.pincode}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-800"
                  />
                  {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
                </div>
                
                {/* Add missing address field */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('address')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.address"
                    value={formState.jobCardDetails.address}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder="Enter complete address"
                    required
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>
                
                {/* Add missing block field */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('block')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.block"
                    value={formState.jobCardDetails.block}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder="Enter block name"
                    required
                  />
                  {errors.block && <p className="mt-1 text-xs text-red-500">{errors.block}</p>}
                </div>
                
                {/* Add missing isBPL field */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('isBPL')} *
                  </label>
                  <select
                    name="jobCardDetails.isBPL"
                    value={formState.jobCardDetails.isBPL ? 'true' : 'false'}
                    onChange={(e) => {
                      // Create a proper event-like object
                      const event = {
                        target: {
                          name: 'jobCardDetails.isBPL',
                          value: e.target.value === 'true'
                        }
                      } as unknown as React.ChangeEvent<HTMLSelectElement>;
                      handleJobCardDetailsChange(event);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                  >
                    <option value="false">{t('no')}</option>
                    <option value="true">{t('yes')}</option>
                  </select>
                  {errors.isBPL && <p className="mt-1 text-xs text-red-500">{errors.isBPL}</p>}
                </div>
                
                {/* Add missing epicNo field */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('epicNo')}
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.epicNo"
                    value={formState.jobCardDetails.epicNo}
                    onChange={handleJobCardDetailsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder="Enter EPIC number"
                  />
                  {errors.epicNo && <p className="mt-1 text-xs text-red-500">{errors.epicNo}</p>}
                </div>
              </div>
            </div>

            {/* Applicants Information Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{t('applicantsInformation')}</h2>
                <button
                  type="button"
                  onClick={addApplicant}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                >
                  {t('addApplicant')}
                </button>
              </div>
              
              {formState.jobCardDetails.applicants.map((applicant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 relative">
                  {formState.jobCardDetails.applicants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeApplicant(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      {t('remove')}
                    </button>
                  )}
                  
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{t('applicant')} {index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('fullName')} *
                      </label>
                      <input
                        type="text"
                        name={`applicants.${index}.name`}
                        value={applicant.name}
                        onChange={(e) => handleApplicantChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        placeholder={t('enterFullName')}
                        required
                      />
                      {errors[`applicant-${index}-name`] && <p className="mt-1 text-xs text-red-500">{errors[`applicant-${index}-name`]}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('fatherHusbandName')} *
                      </label>
                      <input
                        type="text"
                        name={`applicants.${index}.fatherHusbandName`}
                        value={applicant.fatherHusbandName}
                        onChange={(e) => handleApplicantChange(index, 'fatherHusbandName', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        placeholder={t('enterFatherHusbandName')}
                        required
                      />
                      {errors[`applicant-${index}-fatherHusbandName`] && <p className="mt-1 text-xs text-red-500">{errors[`applicant-${index}-fatherHusbandName`]}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('relationship')} *
                      </label>
                      <select
                        name={`applicants.${index}.relationship`}
                        value={applicant.relationship}
                        onChange={(e) => handleApplicantChange(index, 'relationship', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        required
                      >
                        <option value="Self">{t('self')}</option>
                        <option value="Father">{t('father')}</option>
                        <option value="Husband">{t('husband')}</option>
                        <option value="Mother">{t('mother')}</option>
                        <option value="Wife">{t('wife')}</option>
                        <option value="Son">{t('son')}</option>
                        <option value="Daughter">{t('daughter')}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('dateOfBirth')} *
                      </label>
                      <input
                        type="date"
                        name={`applicants.${index}.dateOfBirth`}
                        value={applicant.dateOfBirth}
                        onChange={(e) => handleApplicantChange(index, 'dateOfBirth', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        required
                      />
                      {errors[`applicant-${index}-dateOfBirth`] && <p className="mt-1 text-xs text-red-500">{errors[`applicant-${index}-dateOfBirth`]}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('gender')} *
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`applicants.${index}.gender`}
                            value="Male"
                            checked={applicant.gender === 'Male'}
                            onChange={(e) => handleApplicantChange(index, 'gender', e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-gray-800">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`applicants.${index}.gender`}
                            value="Female"
                            checked={applicant.gender === 'Female'}
                            onChange={(e) => handleApplicantChange(index, 'gender', e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-gray-800">Female</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`applicants.${index}.gender`}
                            value="Other"
                            checked={applicant.gender === 'Other'}
                            onChange={(e) => handleApplicantChange(index, 'gender', e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-gray-800">Other</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('aadhaarNumber')} *
                      </label>
                      <input
                        type="text"
                        name={`applicants.${index}.aadhaarNumber`}
                        value={applicant.aadhaarNumber}
                        onChange={(e) => handleApplicantChange(index, 'aadhaarNumber', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        placeholder={t('enterAadhaar')}
                        required
                      />
                      {errors[`applicant-${index}-aadhaarNumber`] && <p className="mt-1 text-xs text-red-500">{errors[`applicant-${index}-aadhaarNumber`]}</p>}
                    </div>
                    
                    {/* Replace the existing bankDetails field with separate bank fields */}
                    <div className="col-span-1 md:col-span-2">
                      <h4 className="text-md font-semibold text-gray-800 mb-3">{t('bankDetails')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            {t('bankName')} *
                          </label>
                          <input
                            type="text"
                            name={`applicants.${index}.bankName`}
                            value={applicant.bankName}
                            onChange={(e) => handleApplicantChange(index, 'bankName', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            placeholder={t('enterBankName')}
                            required
                          />
                          {errors[`applicant-${index}-bankName`] && <p className="mt-1 text-xs text-red-500">{errors[`applicant-${index}-bankName`]}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            {t('accountNumber')} *
                          </label>
                          <input
                            type="text"
                            name={`applicants.${index}.accountNumber`}
                            value={applicant.accountNumber}
                            onChange={(e) => handleApplicantChange(index, 'accountNumber', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            placeholder={t('enterAccountNumber')}
                            required
                          />
                          {errors[`applicant-${index}-accountNumber`] && <p className="mt-1 text-xs text-red-500">{errors[`applicant-${index}-accountNumber`]}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-800 mb-1">
                            {t('ifscCode')} *
                          </label>
                          <input
                            type="text"
                            name={`applicants.${index}.ifscCode`}
                            value={applicant.ifscCode}
                            onChange={(e) => handleApplicantChange(index, 'ifscCode', e.target.value.toUpperCase())}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            placeholder="AAAA0XXXXXX"
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            11-character code (e.g., SBIN0002499)
                          </p>
                          {errors[`applicant-${index}-ifscCode`] && <p className="mt-1 text-xs text-red-500">{errors[`applicant-${index}-ifscCode`]}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Upload Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('uploadImage')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('selectImage')}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  />
                </div>
                
                {imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      {t('imagePreview')}
                    </label>
                    <div className="border border-gray-300 rounded-lg p-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-40 w-auto mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              {/* Test button for debugging - remove in production */}
              <button
                type="button"
                onClick={async () => {
                  console.log('Test submission clicked');
                  // Fill form with test data for debugging
                  setFormState({
                    aadhaarNumber: '123456789012',
                    phoneNumber: '9876543210',
                    password: 'TestPass123!',
                    confirmPassword: 'TestPass123!',
                    jobCardDetails: {
                      familyId: 'TEST001',
                      headOfHouseholdName: 'Test User',
                      fatherHusbandName: 'Test Father',
                      category: 'General',
                      dateOfRegistration: new Date().toISOString().split('T')[0],
                      address: 'Test Address',
                      state: 'Uttar Pradesh',
                      district: 'Lucknow',
                      village: 'Test Village',
                      pincode: '226001',
                      panchayat: 'Test Panchayat',
                      block: 'Test Block',
                      isBPL: false,
                      epicNo: 'TEST001',
                      applicants: [
                        {
                          name: 'Test Applicant',
                          fatherHusbandName: 'Test Father',
                          relationship: 'Father',
                          dateOfBirth: '1990-01-01',
                          age: '35',
                          gender: 'Male',
                          aadhaarNumber: '123456789012',
                          bankName: 'Test Bank',
                          accountNumber: '1234567890',
                          ifscCode: 'TEST0000001'
                        }
                      ]
                    }
                  });
                  console.log('Form state updated with test data');
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium rounded-lg shadow-md hover:from-yellow-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
              >
                Fill Test Data
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {t('submitApplication')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
