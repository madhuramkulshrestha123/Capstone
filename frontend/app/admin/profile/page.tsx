'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { userApi, setAuthToken } from '../../lib/api';

export default function AdminProfile() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // State for admin data
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // Track if we've already fetched the profile to prevent multiple requests
  const [hasFetched, setHasFetched] = useState(false);

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

  // Fetch admin profile data
  useEffect(() => {
    // Only fetch if we have a token
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth';
      return;
    }
    
    const fetchProfile = async () => {
      // Prevent multiple requests
      if (hasFetched) return;
      
      try {
        setLoading(true);
        const profileData = await userApi.getProfile();
        setAdminData(profileData);
        setFormData(profileData);
        setError('');
        setHasFetched(true);
      } catch (err: any) {
        // Handle 429 error specifically
        if (err.message && err.message.includes('429')) {
          setError(t('tooManyRequests') || 'Too many requests. Please wait a moment and try again.');
        } else {
          setError(t('failedToLoadProfileData') || 'Failed to load profile data');
        }
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t, hasFetched]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedProfile = await userApi.updateProfile(formData);
      setAdminData(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);
      alert(t('profileUpdatedSuccessfully'));
    } catch (err: any) {
      // Handle 429 error specifically
      if (err.message && err.message.includes('429')) {
        alert(t('tooManyRequests') || 'Too many requests. Please wait a moment and try again.');
      } else {
        alert(t('failedToUpdateProfile') || 'Failed to update profile');
      }
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(adminData);
    setIsEditing(false);
  };

  // Loading spinner
  if (loading && !adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => {
              setHasFetched(false);
              setError('');
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            {t('retry')}
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
            <h1 className="text-2xl font-bold">{t('adminProfile')}</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {language === 'en' ? t('hindi') : t('english')}
              </button>
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                {t('back')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white">{t('profileInformation')}</h2>
              <p className="text-blue-100 mt-2">{t('manageYourProfileDetails')}</p>
            </div>
            
            <div className="p-6">
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600">
                        {adminData?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{adminData?.name || 'Admin User'}</h3>
                      <p className="text-gray-600">{adminData?.role === 'admin' ? t('administrator') : adminData?.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('name')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.name || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('email')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.email || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('employmentId')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.government_id || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('phoneNumber')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.phone_number || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('aadhaarNumber')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.aadhaar_number || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('panchayat')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.panchayat_id || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('district')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.district || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('state')}
                      </label>
                      <p className="text-gray-800 font-medium">{adminData?.state || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {t('editProfile')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600">
                        {formData?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{formData?.name || 'Admin User'}</h3>
                      <p className="text-gray-600">{formData?.role === 'admin' ? t('administrator') : formData?.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData?.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData?.email || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="government_id" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('employmentId')}
                      </label>
                      <input
                        type="text"
                        id="government_id"
                        name="government_id"
                        value={formData?.government_id || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('phoneNumber')}
                      </label>
                      <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formData?.phone_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="aadhaar_number" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('aadhaarNumber')}
                      </label>
                      <input
                        type="text"
                        id="aadhaar_number"
                        name="aadhaar_number"
                        value={formData?.aadhaar_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="panchayat_id" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('panchayat')}
                      </label>
                      <input
                        type="text"
                        id="panchayat_id"
                        name="panchayat_id"
                        value={formData?.panchayat_id || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('district')}
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData?.district || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('state')}
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData?.state || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      disabled={loading}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      disabled={loading}
                    >
                      {loading ? t('saving') : t('saveChanges')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}