'use client';

import { useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { authApi } from '../lib/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [jobCardNumber, setJobCardNumber] = useState('');
  const [employmentId, setEmploymentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panchayatId, setPanchayatId] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Add reCAPTCHA v3 hook
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  // Execute reCAPTCHA on form submission
  const handleReCaptchaVerify = async (action: string) => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return null;
    }
    
    try {
      const token = await executeRecaptcha(action);
      setCaptchaToken(token);
      return token;
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      return null;
    }
  };

  // Reset form states
  const resetForm = () => {
    setJobCardNumber('');
    setEmploymentId('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setName('');
    setPhoneNumber('');
    setAadhaarNumber('');
    setPanchayatId('');
    setState('');
    setDistrict('');
    setVillage('');
    setPincode('');
    setCaptcha('');
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
    setError('');
    setSuccess('');
    setCaptchaToken(null);
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // Toggle user type
  const toggleUserType = (type: 'user' | 'admin') => {
    setUserType(type);
    resetForm();
  };

  // Handle form submission for registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Execute reCAPTCHA for registration
      const recaptchaToken = await handleReCaptchaVerify('register');
      if (!recaptchaToken) {
        setError('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }

      // Step 1: Send OTP
      if (!otpSent) {
        try {
          const response = await authApi.sendRegistrationOtp(email);
          setOtpSent(true);
          setSuccess('OTP sent to your email');
        } catch (error: any) {
          setError(error.message || 'Failed to send OTP');
        }
        return;
      }

      // Step 2: Verify OTP
      if (otpSent && !otpVerified) {
        try {
          const response = await authApi.verifyRegistrationOtp(email, otp);
          setOtpVerified(true);
          setSuccess('OTP verified successfully');
        } catch (error: any) {
          setError(error.message || 'Failed to verify OTP');
        }
        return;
      }

      // Step 3: Complete registration
      if (otpVerified) {
        // Validate required fields before sending
        if (!email || !name || !phoneNumber || !aadhaarNumber || !panchayatId || 
            !employmentId || !password || !state || !district || !village || !pincode) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        // Validate field formats
        if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
          setError('Phone number must be exactly 10 digits');
          setLoading(false);
          return;
        }

        if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
          setError('Aadhaar number must be exactly 12 digits');
          setLoading(false);
          return;
        }

        if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
          setError('Pincode must be exactly 6 digits');
          setLoading(false);
          return;
        }

        // Validate password strength
        if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
          setError('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character');
          setLoading(false);
          return;
        }

        // Validate panchayat ID is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(panchayatId)) {
          setError('Panchayat ID must be a valid UUID');
          setLoading(false);
          return;
        }

        const registrationData = {
          email,
          name,
          phone_number: phoneNumber,
          aadhaar_number: aadhaarNumber,
          panchayat_id: panchayatId,
          government_id: employmentId,
          password,
          state,
          district,
          village_name: village,
          pincode,
          role: userType, // 'admin' or 'supervisor'
          captchaToken: recaptchaToken // Add reCAPTCHA token
        };

        try {
          const response = await authApi.completeRegistration(registrationData);
          setSuccess('Registration completed successfully! You can now login.');
          setTimeout(() => {
            setIsLogin(true);
            resetForm();
          }, 2000);
        } catch (error: any) {
          setError(error.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Execute reCAPTCHA for login
      const recaptchaToken = await handleReCaptchaVerify('login');
      if (!recaptchaToken) {
        setError('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }

      // Step 1: Send OTP for login
      if (!otpSent) {
        const identifier = userType === 'user' ? jobCardNumber : employmentId;
        
        // Validate identifier
        if (!identifier) {
          setError('Please enter your identifier');
          setLoading(false);
          return;
        }

        if (!password) {
          setError('Please enter your password');
          setLoading(false);
          return;
        }

        try {
          const response = await authApi.sendLoginOtp(identifier, password);
          setOtpSent(true);
          setSuccess('OTP sent to your email');
        } catch (error: any) {
          setError(error.message || 'Failed to send OTP');
        }
        return;
      }

      // Step 2: Verify OTP for login
      if (otpSent) {
        const identifier = userType === 'user' ? jobCardNumber : employmentId;
        
        try {
          const response = await authApi.verifyLoginOtp(identifier, otp);
          
          // Store token in localStorage and redirect
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          setSuccess('Login successful! Redirecting...');
          
          // Redirect based on user role
          setTimeout(() => {
            if (response.data.user.role === 'admin') {
              window.location.href = '/admin/dashboard';
            } else if (response.data.user.role === 'supervisor') {
              window.location.href = '/supervisor';
            } else {
              window.location.href = '/dashboard';
            }
          }, 1000);
        } catch (error: any) {
          setError(error.message || 'Failed to verify OTP');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwIDItMiAyLTQgMC0yLTItMi0yIDAtNHMyIDIgNCAyem0xMiA2YzAgMi0yIDIgMCAwIDIgMiAyIDIgMCAwem0tMjQgMGMwIDIgMiAyIDAgMCAyIDIgMiAyIDAgMHptMTIgNmMwIDIgMiAyIDAgMCAyIDIgMiAyIDAgMHptLTEyIDZjMCAyIDIgMiAwIDAgMiAyIDIgMiAwIDB6IiBzdHJva2U9IiNlMmU4ZjMiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      <div className="relative max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="px-8 py-10">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Get started with your account'}
            </p>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-lg p-1 bg-gray-100">
              <button
                onClick={() => toggleUserType('user')}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  userType === 'user'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User
              </button>
              <button
                onClick={() => toggleUserType('admin')}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  userType === 'admin'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={isLogin ? handleLogin : handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Registration Form */}
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number
                    </label>
                    <input
                      id="aadhaar"
                      name="aadhaar"
                      type="text"
                      required
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter 12-digit Aadhaar number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="panchayat" className="block text-sm font-medium text-gray-700 mb-1">
                      Panchayat ID
                    </label>
                    <input
                      id="panchayat"
                      name="panchayat"
                      type="text"
                      required
                      value={panchayatId}
                      onChange={(e) => setPanchayatId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter Panchayat ID"
                    />
                  </div>
                  
                  {userType === 'user' ? (
                    <div>
                      <label htmlFor="job-card-number" className="block text-sm font-medium text-gray-700 mb-1">
                        JOB CARD Number
                      </label>
                      <input
                        id="job-card-number"
                        name="job-card-number"
                        type="text"
                        required
                        value={jobCardNumber}
                        onChange={(e) => setJobCardNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                        placeholder="Enter JOB CARD Number"
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="employment-id" className="block text-sm font-medium text-gray-700 mb-1">
                        EMPLOYMENT ID
                      </label>
                      <input
                        id="employment-id"
                        name="employment-id"
                        type="text"
                        required
                        value={employmentId}
                        onChange={(e) => setEmploymentId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                        placeholder="Enter EMPLOYMENT ID"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      id="district"
                      name="district"
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter district"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
                      Village
                    </label>
                    <input
                      id="village"
                      name="village"
                      type="text"
                      required
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter village"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter 6-digit pincode"
                    />
                  </div>
                </>
              )}
              
              {/* Login Form */}
              {isLogin && (
                <>
                  {userType === 'user' ? (
                    <div>
                      <label htmlFor="job-card-number-login" className="block text-sm font-medium text-gray-700 mb-1">
                        JOB CARD Number
                      </label>
                      <input
                        id="job-card-number-login"
                        name="job-card-number"
                        type="text"
                        required
                        value={jobCardNumber}
                        onChange={(e) => setJobCardNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                        placeholder="Enter JOB CARD Number"
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="employment-id-login" className="block text-sm font-medium text-gray-700 mb-1">
                        EMPLOYMENT ID
                      </label>
                      <input
                        id="employment-id-login"
                        name="employment-id"
                        type="text"
                        required
                        value={employmentId}
                        onChange={(e) => setEmploymentId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                        placeholder="Enter EMPLOYMENT ID"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                      placeholder="Enter your password"
                    />
                  </div>
                </>
              )}
              
              {/* OTP Input - shown after OTP is sent */}
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
              )}
              
              {/* reCAPTCHA v3 is handled automatically */}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    {isLogin 
                      ? (otpSent ? 'Verify OTP & Login' : 'Send OTP') 
                      : (otpSent 
                          ? (otpVerified ? 'Complete Registration' : 'Verify OTP') 
                          : 'Send OTP')}
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={toggleAuthMode}
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}