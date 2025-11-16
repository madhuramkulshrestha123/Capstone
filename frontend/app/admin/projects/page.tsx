'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/useTranslation';
import { adminApi, setAuthToken } from '../../lib/api';

export default function ProjectsPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { t } = useTranslation(language);
  
  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  
  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Fetch all projects
        const response = await adminApi.getProjects();
        const allProjects = response.data || [];
        setProjects(allProjects);
        
        // Filter upcoming projects (projects that haven't started yet)
        const now = new Date();
        const upcoming = allProjects.filter((project: any) => {
          const startDate = new Date(project.start_date);
          return startDate > now;
        });
        setUpcomingProjects(upcoming);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Filter projects by type
  const getCurrentProjects = () => {
    const now = new Date();
    return projects.filter((project: any) => {
      const startDate = new Date(project.start_date);
      const endDate = new Date(project.end_date);
      // Project is current if it has started but not ended
      return startDate <= now && endDate >= now;
    });
  };
  
  const getPastProjects = () => {
    const now = new Date();
    return projects.filter((project: any) => {
      const endDate = new Date(project.end_date);
      // Project is past if it has ended
      return endDate < now;
    });
  };
  
  // Handle project creation
  const handleCreateProject = () => {
    window.location.href = '/admin/projects/create';
  };
  
  // Handle assign workers to project
  const handleAssignWorkers = (projectId: string) => {
    // Redirect to assign workers page
    window.location.href = `/admin/projects/${projectId}/assign`;
  };
  
  // Handle progress check
  const handleCheckProgress = (projectId: string) => {
    // Redirect to project progress page
    window.location.href = `/admin/projects/${projectId}/progress`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t('projects')}</h1>
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
        {/* Page Title and Create Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{t('projects')}</h2>
          <button
            onClick={handleCreateProject}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">+</span>
            {t('createProject')}
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Upcoming Projects Section */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('upcomingProjects')}</h3>
              {upcomingProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingProjects.map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-gray-800">{project.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{project.location}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-6">
                        <div>
                          <div className="font-medium">{t('startDate')}</div>
                          <div>{new Date(project.start_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">{t('endDate')}</div>
                          <div>{new Date(project.end_date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAssignWorkers(project.id)}
                          className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        >
                          {t('assignWorkers')}
                        </button>
                        <button
                          onClick={() => handleCheckProgress(project.id)}
                          className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                        >
                          {t('checkProgress')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-12 text-center">
                  <p className="text-gray-500">{t('noUpcomingProjects')}</p>
                </div>
              )}
            </section>
            
            {/* Current Projects Section */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('currentProjects')}</h3>
              {getCurrentProjects().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentProjects().map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-gray-800">{project.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{project.location}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-6">
                        <div>
                          <div className="font-medium">{t('startDate')}</div>
                          <div>{new Date(project.start_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">{t('endDate')}</div>
                          <div>{new Date(project.end_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">{t('workers')}</div>
                          <div>{project.assigned_workers || 0}/{project.worker_need}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        {project.assigned_workers < project.worker_need && (
                          <button
                            onClick={() => handleAssignWorkers(project.id)}
                            className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            {t('assignWorkers')}
                          </button>
                        )}
                        <button
                          onClick={() => handleCheckProgress(project.id)}
                          className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                        >
                          {t('checkProgress')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-12 text-center">
                  <p className="text-gray-500">{t('noCurrentProjects')}</p>
                </div>
              )}
            </section>
            
            {/* All Projects Section */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('allProjects')}</h3>
              {projects.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('projectName')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('location')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('startDate')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('endDate')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('workers')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{project.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{project.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(project.start_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(project.end_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                project.status === 'active' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.assigned_workers || 0}/{project.worker_need}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleAssignWorkers(project.id)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                {t('assign')}
                              </button>
                              <button
                                onClick={() => handleCheckProgress(project.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                {t('progress')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-12 text-center">
                  <p className="text-gray-500">{t('noProjectsFound')}</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}