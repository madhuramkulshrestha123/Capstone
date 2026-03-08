import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get API base URL from environment or use default
const API_BASE_URL = process.env.API_BASE_URL || 'https://capstone-backend-8k6x.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const workerLoginWithJobCard = async (jobCardNumber: string, aadhaarNumber: string) => {
  const response = await api.post('/users/worker-login', { 
    jobCardNumber, 
    aadhaarNumber 
  });
  if (response.data) {
    // Store worker data without token (worker login doesn't return token)
    await AsyncStorage.setItem('workerData', JSON.stringify(response.data));
    await AsyncStorage.setItem('isWorker', 'true');
  }
  return response.data;
};

export const sendLoginOtp = async (phone: string) => {
  const response = await api.post('/users/login/send-otp', { phone });
  return response.data;
};

export const verifyLoginOtp = async (phone: string, otp: string) => {
  const response = await api.post('/users/login/verify-otp', { phone, otp });
  if (response.data.token) {
    await AsyncStorage.setItem('userToken', response.data.token);
  }
  return response.data;
};

export const workerLogin = async (phone: string, password: string) => {
  const response = await api.post('/users/worker-login', { phone, password });
  if (response.data.token) {
    await AsyncStorage.setItem('userToken', response.data.token);
  }
  return response.data;
};

// Profile endpoints
export const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const updateProfile = async (formData: any) => {
  const response = await api.put('/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Attendance endpoints
export const getMyAttendances = async (page = 1, limit = 10, workerId?: string) => {
  // For workers without token, pass worker_id in query params
  const params: any = { page, limit };
  
  if (workerId) {
    params.worker_id = workerId;
  }
  
  console.log('Making attendance request with params:', params);
  
  const response = await api.get('/attendances/my/attendances', { params });
  return response.data;
};

export const markAttendance = async (data: {
  project_id: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
}) => {
  const response = await api.post('/attendance/mark', data);
  return response.data;
};

// Work Demand Request endpoints
export const getMyRequests = async (page = 1, limit = 10) => {
  const response = await api.get('/work-demand/my/requests', {
    params: { page, limit },
  });
  return response.data;
};

export const createWorkDemandRequest = async (data: {
  project_id: string;
  demand_date: string;
  worker_ids: string[];
  remarks?: string;
}) => {
  const response = await api.post('/work-demand', data);
  return response.data;
};

export const verifyWorker = async (aadhaarNumber: string, jobId: string) => {
  const response = await api.post('/users/verify-worker', {
    aadhaarNumber,
    jobId,
  });
  return response.data;
};

export const demandWork = async (jobId: string) => {
  const response = await api.post('/work-demand/demand', {
    jobId,
  });
  return response.data;
};

// Job Card Application endpoints
export const submitJobCardApplication = async (formData: any) => {
  const response = await api.post('/job-card-application/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const trackApplication = async (trackingId: string) => {
  const response = await api.get(`/job-card-application/track/${trackingId}`);
  return response.data;
};

// Logout
export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
};

export default api;
