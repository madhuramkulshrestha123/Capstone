// Store token in memory (in a real app, you'd use localStorage or a more secure method)
let authToken: string | null = null;

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Set authentication token
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Generic fetch function with error handling
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
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
      throw new Error(`HTTP error! status: ${response.status}`);
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
      const managedEmployees = usersRes.data?.filter((u: any) => u.role === 'supervisor').length || 0;
      
      return {
        totalProjects,
        totalJobCardApplications,
        totalActiveWorkers,
        pendingPayments,
        upcomingDeadlines,
        managedEmployees
      };
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
  }
};
