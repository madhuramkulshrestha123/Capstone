'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [jobCardNumber, setJobCardNumber] = useState('');
  const [employmentId, setEmploymentId] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission based on isLogin and userType
    console.log({
      isLogin,
      userType,
      jobCardNumber,
      employmentId,
      password,
      captcha
    });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const toggleUserType = () => {
    setUserType(userType === 'user' ? 'admin' : 'user');
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
                onClick={() => setUserType('user')}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  userType === 'user'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User
              </button>
              <button
                onClick={() => setUserType('admin')}
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
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <>
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
                </>
              )}

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
                </>
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
              
              <div>
                <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                  CAPTCHA
                </label>
                <div className="flex space-x-3">
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    required
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200 bg-white/50"
                    placeholder="Enter CAPTCHA"
                  />
                  <div className="px-4 py-3 rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-800 font-mono font-bold flex items-center">
                    A3B2
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isLogin ? 'Sign in' : 'Register'}
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