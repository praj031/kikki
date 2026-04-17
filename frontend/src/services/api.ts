import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { User } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8064/api/v1';

// Custom error class for API errors
export class APIError extends Error {
  statusCode?: number;
  code?: string;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Transform errors into APIError instances
    if (error.response) {
      const message =
        (error.response.data as { message?: string })?.message ||
        `Error ${error.response.status}: Something went wrong`;
      throw new APIError(message, error.response.status);
    } else if (error.request) {
      throw new APIError('Network error. Please check your connection.');
    } else {
      throw new APIError(error.message || 'An unexpected error occurred');
    }
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<{ accessToken: string; user: User; expiresIn: number }>('/auth/login', {
      email,
      password
    }),

  signup: (email: string, password: string, firstName: string, lastName: string) =>
    api.post('/auth/signup', {
      email,
      password,
      firstName,
      lastName
    }),

  refreshToken: () =>
    api.post<{ accessToken: string; user: User }>('/auth/refresh', {}, { withCredentials: true }),

  getCurrentUser: () =>
    api.get<User>('/auth/me'),
};

// Chat API
export const chatAPI = {
  askAI: (question: string, conversationId?: string) =>
    api.post<string>('/askAI', {
      question,
      conversationId
    }),
};

// Health check
export const healthAPI = {
  check: () =>
    axios.get(`${API_BASE_URL}/health`, { timeout: 5000 }).catch(() => ({ data: { status: 'unavailable' } })),
};
