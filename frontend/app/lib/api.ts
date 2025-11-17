// Store token in memory (in a real app, you'd use localStorage or a more secure method)
let authToken: string | null = null;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Set authentication token
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Generic fetch function with error handling
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
};

// User API functions
export const userApi = {
  // Fetch user profile
  getProfile: async () => {
    try {
      const response = await apiFetch('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Auth API functions
export const authApi = {
  // Send OTP for registration
  sendRegistrationOtp: async (email: string) => {
    try {
      const response = await apiFetch('/users/register/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      console.error('Error sending registration OTP:', error);
      throw error;
    }
  },
  
  // Verify OTP for registration
  verifyRegistrationOtp: async (email: string, otp: string) => {
    try {
      const response = await apiFetch('/users/register/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      return response;
    } catch (error) {
      console.error('Error verifying registration OTP:', error);
      throw error;
    }
  },
  
  // Complete registration
  completeRegistration: async (registrationData: any) => {
    try {
      const response = await apiFetch('/users/register/complete', {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
      return response;
    } catch (error) {
      console.error('Error completing registration:', error);
      throw error;
    }
  },
  
  // Send OTP for login
  sendLoginOtp: async (identifier: string, password: string) => {
    try {
      const response = await apiFetch('/users/login/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email: identifier, password }),
      });
      return response;
    } catch (error) {
      console.error('Error sending login OTP:', error);
      throw error;
    }
  },
  
  // Verify OTP for login
  verifyLoginOtp: async (identifier: string, otp: string) => {
    try {
      const response = await apiFetch('/users/login/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: identifier, otp }),
      });
      return response;
    } catch (error) {
      console.error('Error verifying login OTP:', error);
      throw error;
    }
  }
};

// Admin Dashboard API functions
export const adminApi = {
  // Fetch dashboard statistics
  getDashboardStats: async () => {
    try {
      // Fetch real data from the new admin dashboard endpoint
      const response = await apiFetch('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values on error
      return {
        totalProjects: 0,
        totalJobCardApplications: 0,
        totalActiveWorkers: 0,
        pendingPayments: 0,
        upcomingDeadlines: 0,
        managedEmployees: 0
      };
    }
  },

  // Fetch panchayat information
  getPanchayatInfo: async () => {
    try {
      // Fetch from user profile endpoint
      const response = await apiFetch('/users/profile');
      return {
        name: response.data.panchayat_id || '',
        district: response.data.district || '',
        state: response.data.state || '',
        id: response.data.panchayat_id || ''
      };
    } catch (error) {
      console.error('Error fetching panchayat info:', error);
      // Return empty values if fetch fails
      return {
        name: '',
        district: '',
        state: '',
        id: ''
      };
    }
  },

  // Fetch recent job card applications
  getRecentActivities: async () => {
    try {
      // Fetch recent activities from the new admin dashboard endpoint
      const response = await apiFetch('/admin/dashboard/recent-activities');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Return empty array on error
      return [];
    }
  },

  // Fetch pending job card applications
  getPendingJobCardApplications: async () => {
    try {
      // Fetch pending job card applications from the new admin dashboard endpoint
      const response = await apiFetch('/admin/dashboard/pending-applications');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching pending job card applications:', error);
      // Return empty array on error
      return [];
    }
  },
  
  // Fetch all projects
  getProjects: async () => {
    try {
      const response = await apiFetch('/projects');
      return response;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  // Fetch project by ID
  getProjectById: async (id: string) => {
    try {
      const response = await apiFetch(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },
  
  // Create a new project
  createProject: async (projectData: any) => {
    try {
      const response = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  // Get available workers for a project
  getAvailableWorkers: async () => {
    try {
      const response = await apiFetch('/projects/workers/available');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching available workers:', error);
      throw error;
    }
  },
  
  // Get assigned workers for a project
  getAssignedWorkersByProjectId: async (projectId: string) => {
    try {
      const response = await apiFetch(`/projects/${projectId}/assigned-workers`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching assigned workers:', error);
      throw error;
    }
  },
  
  // Assign workers to a project
  assignWorkersToProject: async (projectId: string, workerIds: string[]) => {
    try {
      const response = await apiFetch(`/projects/${projectId}/assign-workers`, {
        method: 'POST',
        body: JSON.stringify({ workerIds }),
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning workers to project:', error);
      throw error;
    }
  },
  
  // Get workers with details
  getWorkersWithDetails: async () => {
    try {
      const response = await apiFetch('/users/workers/details');
      return response;
    } catch (error) {
      console.error('Error fetching workers with details:', error);
      throw error;
    }
  },
  
  // Verify worker by Aadhaar number and Job Card ID
  verifyWorker: async (aadhaarNumber: string, jobCardId: string) => {
    try {
      const response = await apiFetch('/users/verify-worker', {
        method: 'POST',
        body: JSON.stringify({
          aadhaarNumber,
          jobCardId
        }),
      });
      return response;
    } catch (error) {
      console.error('Error verifying worker:', error);
      throw error;
    }
  },
  
  // Demand work for a worker
  demandWork: async (jobCardId: string, captchaToken: string) => {
    try {
      const response = await apiFetch('/users/demand-work', {
        method: 'POST',
        body: JSON.stringify({
          jobCardId,
          captchaToken
        }),
      });
      return response;
    } catch (error) {
      console.error('Error demanding work:', error);
      throw error;
    }
  },
  
  // Get work demand requests
  getWorkDemandRequests: async (status?: string) => {
    try {
      let url = '/work-requests';
      if (status && status !== 'all') {
        url += `?status=${status}`;
      }
      const response = await apiFetch(url);
      return response;
    } catch (error) {
      console.error('Error fetching work demand requests:', error);
      throw error;
    }
  },
  
  // Approve work demand request
  approveWorkDemandRequest: async (requestId: string, projectId?: string) => {
    try {
      const response = await apiFetch(`/work-requests/${requestId}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({
          projectId
        }),
      });
      return response;
    } catch (error) {
      console.error('Error approving work demand request:', error);
      throw error;
    }
  },
  
  // Reject work demand request
  rejectWorkDemandRequest: async (requestId: string) => {
    try {
      const response = await apiFetch(`/work-requests/${requestId}/reject`, {
        method: 'PATCH',
      });
      return response;
    } catch (error) {
      console.error('Error rejecting work demand request:', error);
      throw error;
    }
  }
};

// Supervisor Dashboard API functions
export const supervisorApi = {
  // Fetch dashboard statistics for supervisor
  getDashboardStats: async () => {
    try {
      // Since there's no specific supervisor dashboard endpoint, we'll need to fetch
      // data from various endpoints that supervisors have access to
      
      // Fetch supervisor's profile to get their information
      const profileResponse = await apiFetch('/users/profile');
      const profile = profileResponse.data;
      
      // Fetch projects (supervisors can view all projects)
      const projectsResponse = await apiFetch('/projects');
      const projects = projectsResponse.data?.projects || [];
      
      // For now, we'll return a simplified set of statistics that are relevant to supervisors
      return {
        totalProjects: projects.length,
        totalJobCardApplications: 0,
        totalActiveWorkers: 0,
        pendingPayments: 0,
        upcomingDeadlines: 0,
        managedEmployees: 0
      };
    } catch (error) {
      console.error('Error fetching supervisor dashboard stats:', error);
      // Return default values on error
      return {
        totalProjects: 0,
        totalJobCardApplications: 0,
        totalActiveWorkers: 0,
        pendingPayments: 0,
        upcomingDeadlines: 0,
        managedEmployees: 0
      };
    }
  },

  // Fetch recent activities for supervisor
  getRecentActivities: async () => {
    try {
      // For now, we'll return an empty array since there's no direct endpoint
      // for supervisors to get recent activities
      return [];
    } catch (error) {
      console.error('Error fetching supervisor recent activities:', error);
      // Return empty array on error
      return [];
    }
  }
};
