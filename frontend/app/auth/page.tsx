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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleUserType}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              userType === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            User
          </button>
          <button
            onClick={toggleUserType}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              userType === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Admin
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <>
                {userType === 'user' ? (
                  <div>
                    <label htmlFor="job-card-number" className="sr-only">
                      JOB CARD Number
                    </label>
                    <input
                      id="job-card-number"
                      name="job-card-number"
                      type="text"
                      required
                      value={jobCardNumber}
                      onChange={(e) => setJobCardNumber(e.target.value)}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="JOB CARD Number"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="employment-id" className="sr-only">
                      EMPLOYMENT ID
                    </label>
                    <input
                      id="employment-id"
                      name="employment-id"
                      type="text"
                      required
                      value={employmentId}
                      onChange={(e) => setEmploymentId(e.target.value)}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="EMPLOYMENT ID"
                    />
                  </div>
                )}
              </>
            )}

            {isLogin && (
              <>
                {userType === 'user' ? (
                  <div>
                    <label htmlFor="job-card-number-login" className="sr-only">
                      JOB CARD Number
                    </label>
                    <input
                      id="job-card-number-login"
                      name="job-card-number"
                      type="text"
                      required
                      value={jobCardNumber}
                      onChange={(e) => setJobCardNumber(e.target.value)}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="JOB CARD Number"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="employment-id-login" className="sr-only">
                      EMPLOYMENT ID
                    </label>
                    <input
                      id="employment-id-login"
                      name="employment-id"
                      type="text"
                      required
                      value={employmentId}
                      onChange={(e) => setEmploymentId(e.target.value)}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="EMPLOYMENT ID"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label htmlFor="password" className="sr-only">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="captcha" className="sr-only">
                CAPTCHA
              </label>
              <input
                id="captcha"
                name="captcha"
                type="text"
                required
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter CAPTCHA"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Sign in' : 'Register'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={toggleAuthMode}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}