// Store token in memory (in a real app, you'd use localStorage or a more secure method)
let authToken: string | null = null;

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Simple in-memory cache
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// Request debouncing to prevent rapid successive requests
const pendingRequests = new Map<string, Promise<any>>();

// Check if cached data is still valid
const isCacheValid = (key: string): boolean => {
  const cached = apiCache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < cached.ttl;
};

// Get cached data
const getCachedData = (key: string): any => {
  if (isCacheValid(key)) {
    return apiCache.get(key)?.data;
  }
  return null;
};

// Set cached data
const setCachedData = (key: string, data: any, ttl: number = CACHE_TTL): void => {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// Clear cache for a specific key
const clearCache = (key: string): void => {
  apiCache.delete(key);
};

// Clear all cache
const clearAllCache = (): void => {
  apiCache.clear();
};

// Get or create a debounced request
const getDebouncedRequest = (key: string, requestFn: () => Promise<any>): Promise<any> => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
};

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

// Admin Dashboard API functions
export const adminApi = {
  // Fetch dashboard statistics
  getDashboardStats: async () => {
    try {
      const cacheKey = 'dashboard-stats';
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      return await getDebouncedRequest(cacheKey, async () => {
        // Fetch real data from the backend APIs
        const [projectsRes, jobCardApplicationsRes, usersRes, paymentsRes] = await Promise.all([
          apiFetch('/projects'),
          apiFetch('/job-card-applications/applications'),
          apiFetch('/users'),
          apiFetch('/payments')
        ]);

        // Calculate statistics from real data
        const totalProjects = projectsRes.meta?.total || 0;
        const totalJobCardApplications = jobCardApplicationsRes.meta?.total || 0;
        const totalActiveWorkers = usersRes.meta?.total || 0;
        const pendingPayments = paymentsRes.data?.filter((p: any) => p.status === 'PENDING').length || 0;
        
        // For upcoming deadlines and managed employees, we'll need to implement specific endpoints
        // For now, we'll use placeholder values
        const upcomingDeadlines = 0; // This would require a specific endpoint to calculate
        const managedEmployees = usersRes.data?.filter((u: any) => u.role === 'admin').length || 0;
        
        const stats = {
          totalProjects,
          totalJobCardApplications,
          totalActiveWorkers,
          pendingPayments,
          upcomingDeadlines,
          managedEmployees
        };
        
        setCachedData(cacheKey, stats);
        return stats;
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Fetch panchayat information
  getPanchayatInfo: async () => {
    try {
      // Fetch from user profile endpoint
      const response = await apiFetch('/users/profile');
      return {
        name: response.data.panchayat_id || 'Unknown Panchayat',
        district: response.data.district || 'Unknown District',
        state: response.data.state || 'Unknown State',
        id: response.data.panchayat_id || 'Unknown ID'
      };
    } catch (error) {
      console.error('Error fetching panchayat info:', error);
      // Return default values if fetch fails
      return {
        name: 'ग्राम पंचायत',
        district: 'Unknown District',
        state: 'Unknown State',
        id: 'GP-XX-XXXX-XXX'
      };
    }
  },

  // Fetch recent job card applications
  getRecentActivities: async () => {
    try {
      // Fetch recent job card applications from the backend
      const response = await apiFetch('/job-card-applications/applications?limit=5&sort=created_at:desc');
      // Ensure each application has a unique id and consistent field names
      const applications = response.data || [];
      return applications.map((app: any, index: number) => ({
        ...app,
        id: app.id || app.applicationId || app.trackingId || `app-${index}`, // Use existing id, or applicationId, or trackingId, or generate one
        name: app.name || app.headOfHouseholdName, // Use name or headOfHouseholdName
        applicationId: app.applicationId || app.trackingId, // Use applicationId or trackingId
        panchayatId: app.panchayat || app.panchayatId || 'N/A', // Include panchayat ID
        district: app.district || 'N/A' // Include district
      }));
    } catch (error) {
      console.error('Error fetching recent job card applications:', error);
      throw error;
    }
  },

  // Fetch pending job card applications
  getPendingJobCardApplications: async () => {
    try {
      // Fetch pending job card applications from the backend
      const response = await apiFetch('/job-card-applications/applications/status/pending');
      // Ensure each application has a unique id and consistent field names
      const applications = response.data || [];
      return applications.map((app: any, index: number) => ({
        ...app,
        id: app.id || app.applicationId || app.trackingId || `app-${index}`, // Use existing id, or applicationId, or trackingId, or generate one
        name: app.name || app.headOfHouseholdName, // Use name or headOfHouseholdName
        applicationId: app.applicationId || app.trackingId, // Use applicationId or trackingId
        panchayatId: app.panchayat || app.panchayatId || 'N/A', // Include panchayat ID
        district: app.district || 'N/A' // Include district
      }));
    } catch (error) {
      console.error('Error fetching pending job card applications:', error);
      throw error;
    }
  },
  
  // Fetch all projects
  getProjects: async () => {
    try {
      const cacheKey = 'projects';
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      return await getDebouncedRequest(cacheKey, async () => {
        const response = await apiFetch('/projects');
        setCachedData(cacheKey, response);
        return response;
      });
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
      const cacheKey = 'workers-details';
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      return await getDebouncedRequest(cacheKey, async () => {
        const response = await apiFetch('/users/workers/details');
        setCachedData(cacheKey, response);
        return response;
      });
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
  demandWork: async (jobCardId: string) => {
    try {
      const response = await apiFetch('/users/demand-work', {
        method: 'POST',
        body: JSON.stringify({
          jobCardId
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
  },

  // Generic GET request
  get: async (endpoint: string) => {
    try {
      const response = await apiFetch(endpoint);
      return response;
    } catch (error) {
      console.error('Error making GET request:', error);
      throw error;
    }
  },

  // Generic PATCH request
  patch: async (endpoint: string, data: any) => {
    try {
      const response = await apiFetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error('Error making PATCH request:', error);
      throw error;
    }
  },
  
  // Generic POST request
  post: async (endpoint: string, data: any) => {
    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error('Error making POST request:', error);
      throw error;
    }
  },
  
  // Get my attendance records
  getMyAttendance: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await apiFetch(`/attendance/my/attendances?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }
  },

  // Cache management
  clearProjectsCache: () => clearCache('projects'),
  clearWorkersCache: () => clearCache('workers-details'),
  clearDashboardStatsCache: () => clearCache('dashboard-stats'),
  clearAllCache: () => clearAllCache()
};
