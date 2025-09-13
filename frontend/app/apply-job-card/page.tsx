'use client';

import { useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import { Language } from '../lib/translations';

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
const categories = ['SC', 'ST', 'OBC', 'General'];

// Define types for our form data
type BankDetails = {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
};

type Applicant = {
  name: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  bankDetails: BankDetails;
};

type JobCardDetails = {
  familyId: string;
  headOfHouseholdName: string;
  fatherHusbandName: string;
  category: string;
  dateOfRegistration: string;
  state: string;
  district: string;
  village: string;
  panchayat: string;
  block: string;
  address: string;
  isBPL: boolean;
  epicNo: string;
  applicants: Applicant[];
};

type FormData = {
  aadhaarNumber: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string;
  age: number;
  jobCardDetails: JobCardDetails;
};

export default function ApplyJobCardPage() {
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslation(language);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    aadhaarNumber: '',
    phoneNumber: '',
    password: '',
    dateOfBirth: '',
    age: 0,
    jobCardDetails: {
      familyId: '',
      headOfHouseholdName: '',
      fatherHusbandName: '',
      category: '',
      dateOfRegistration: new Date().toISOString().split('T')[0],
      state: '',
      district: '',
      village: '',
      panchayat: '',
      block: '',
      address: '',
      isBPL: false,
      epicNo: '',
      applicants: [
        {
          name: '',
          gender: 'Male',
          dateOfBirth: '',
          age: 0,
          bankDetails: {
            bankName: '',
            accountNumber: '',
            ifscCode: ''
          }
        }
      ]
    }
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (name.startsWith('jobCardDetails.')) {
      const key = name.split('.')[1] as keyof JobCardDetails;
      setFormData({
        ...formData,
        jobCardDetails: {
          ...formData.jobCardDetails,
          [key]: type === 'checkbox' ? checked : value
        }
      });
    } else if (name.startsWith('applicants.')) {
      const [_, index, field] = name.split('.');
      const applicantIndex = parseInt(index);
      
      if (field === 'gender' || field === 'dateOfBirth' || field === 'name') {
        const updatedApplicants = [...formData.jobCardDetails.applicants];
        updatedApplicants[applicantIndex] = {
          ...updatedApplicants[applicantIndex],
          [field]: type === 'checkbox' ? checked : value
        };
        
        // Calculate age when date of birth changes
        if (field === 'dateOfBirth') {
          const dob = new Date(value);
          const today = new Date();
          const age = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
          updatedApplicants[applicantIndex].age = age;
        }
        
        setFormData({
          ...formData,
          jobCardDetails: {
            ...formData.jobCardDetails,
            applicants: updatedApplicants
          }
        });
      } else if (field.startsWith('bankDetails.')) {
        const bankField = field.split('.')[1];
        const updatedApplicants = [...formData.jobCardDetails.applicants];
        updatedApplicants[applicantIndex] = {
          ...updatedApplicants[applicantIndex],
          bankDetails: {
            ...updatedApplicants[applicantIndex].bankDetails,
            [bankField]: value
          }
        };
        
        setFormData({
          ...formData,
          jobCardDetails: {
            ...formData.jobCardDetails,
            applicants: updatedApplicants
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle textarea change specifically
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'jobCardDetails.address') {
      setFormData({
        ...formData,
        jobCardDetails: {
          ...formData.jobCardDetails,
          address: value
        }
      });
    }
  };

  // Calculate age when date of birth changes for head of household
  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      dateOfBirth: value
    });
    
    if (value) {
      const dob = new Date(value);
      const today = new Date();
      const age = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      setFormData(prev => ({
        ...prev,
        age: age
      }));
    }
  };

  // Add a new applicant
  const addApplicant = () => {
    setFormData({
      ...formData,
      jobCardDetails: {
        ...formData.jobCardDetails,
        applicants: [
          ...formData.jobCardDetails.applicants,
          {
            name: '',
            gender: 'Male',
            dateOfBirth: '',
            age: 0,
            bankDetails: {
              bankName: '',
              accountNumber: '',
              ifscCode: ''
            }
          }
        ]
      }
    });
  };

  // Remove an applicant
  const removeApplicant = (index: number) => {
    if (formData.jobCardDetails.applicants.length > 1) {
      const updatedApplicants = [...formData.jobCardDetails.applicants];
      updatedApplicants.splice(index, 1);
      setFormData({
        ...formData,
        jobCardDetails: {
          ...formData.jobCardDetails,
          applicants: updatedApplicants
        }
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Job card application submitted successfully!');
  };

  // Get states from location data
  const states = Object.keys(locationData);
  
  // Get districts based on selected state
  const districts = formData.jobCardDetails.state 
    ? Object.keys(locationData[formData.jobCardDetails.state] || {})
    : [];
  
  // Get villages and panchayats based on selected district
  const districtData = formData.jobCardDetails.state && formData.jobCardDetails.district
    ? locationData[formData.jobCardDetails.state]?.[formData.jobCardDetails.district]
    : null;
  
  const villages = districtData ? districtData.villages || [] : [];
  const panchayats = districtData ? districtData.panchayats || [] : [];
  const pincode = districtData ? districtData.pincode || '' : '';

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
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
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
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterAadhaar')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterPhone')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('password')} *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('createPassword')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('dateOfBirth')} *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleDOBChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('age')}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-800"
                  />
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
                    value={formData.jobCardDetails.familyId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterFamilyId')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('headOfHouseholdName')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.headOfHouseholdName"
                    value={formData.jobCardDetails.headOfHouseholdName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterFullName')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('fatherHusbandName')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.fatherHusbandName"
                    value={formData.jobCardDetails.fatherHusbandName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterFatherHusbandName')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('category')} *
                  </label>
                  <select
                    name="jobCardDetails.category"
                    value={formData.jobCardDetails.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                  >
                    <option value="">{t('selectCategory')}</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('epicNo')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.epicNo"
                    value={formData.jobCardDetails.epicNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterEpicNo')}
                    required
                  />
                </div>
                
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    name="jobCardDetails.isBPL"
                    checked={formData.jobCardDetails.isBPL}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-800">
                    {t('isBPL')}
                  </label>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('addressInformation')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('state')} *
                  </label>
                  <select
                    name="jobCardDetails.state"
                    value={formData.jobCardDetails.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                  >
                    <option value="">{t('selectState')}</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('district')} *
                  </label>
                  <select
                    name="jobCardDetails.district"
                    value={formData.jobCardDetails.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                    disabled={!formData.jobCardDetails.state}
                  >
                    <option value="">{t('selectDistrict')}</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('village')} *
                  </label>
                  <select
                    name="jobCardDetails.village"
                    value={formData.jobCardDetails.village}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                    disabled={!formData.jobCardDetails.district}
                  >
                    <option value="">{t('selectVillage')}</option>
                    {villages.map((village: string) => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('panchayat')} *
                  </label>
                  <select
                    name="jobCardDetails.panchayat"
                    value={formData.jobCardDetails.panchayat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    required
                    disabled={!formData.jobCardDetails.district}
                  >
                    <option value="">{t('selectPanchayat')}</option>
                    {panchayats.map((panchayat: string) => (
                      <option key={panchayat} value={panchayat}>{panchayat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('block')} *
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.block"
                    value={formData.jobCardDetails.block}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterBlockName')}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('pincode')}
                  </label>
                  <input
                    type="text"
                    name="jobCardDetails.pincode"
                    value={pincode}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-800"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {t('fullAddress')} *
                  </label>
                  <textarea
                    name="jobCardDetails.address"
                    value={formData.jobCardDetails.address}
                    onChange={handleTextareaChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder={t('enterCompleteAddress')}
                    required
                  />
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
              
              {formData.jobCardDetails.applicants.map((applicant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 relative">
                  {formData.jobCardDetails.applicants.length > 1 && (
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
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        placeholder={t('enterFullName')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('dateOfBirth')} *
                      </label>
                      <input
                        type="date"
                        name={`applicants.${index}.dateOfBirth`}
                        value={applicant.dateOfBirth}
                        onChange={(e) => {
                          const { value } = e.target;
                          const updatedApplicants = [...formData.jobCardDetails.applicants];
                          updatedApplicants[index] = {
                            ...updatedApplicants[index],
                            dateOfBirth: value
                          };
                          
                          // Calculate age when date of birth changes
                          if (value) {
                            const dob = new Date(value);
                            const today = new Date();
                            const age = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
                            updatedApplicants[index].age = age;
                          }
                          
                          setFormData({
                            ...formData,
                            jobCardDetails: {
                              ...formData.jobCardDetails,
                              applicants: updatedApplicants
                            }
                          });
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('age')}
                      </label>
                      <input
                        type="number"
                        name={`applicants.${index}.age`}
                        value={applicant.age}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-800"
                      />
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-gray-800">Other</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('bankName')} *
                      </label>
                      <input
                        type="text"
                        name={`applicants.${index}.bankDetails.bankName`}
                        value={applicant.bankDetails.bankName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        placeholder={t('enterBankName')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('accountNumber')} *
                      </label>
                      <input
                        type="text"
                        name={`applicants.${index}.bankDetails.accountNumber`}
                        value={applicant.bankDetails.accountNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        placeholder={t('enterAccountNumber')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {t('ifscCode')} *
                      </label>
                      <input
                        type="text"
                        name={`applicants.${index}.bankDetails.ifscCode`}
                        value={applicant.bankDetails.ifscCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        placeholder={t('enterIfscCode')}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
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