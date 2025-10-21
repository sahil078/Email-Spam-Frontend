import axios from 'axios';

const API_BASE_URL = "https://email-span-backend.onrender.com/api";

// Create axios instance with centralized settings
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for uniform error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('[API] Connection refused: Is backend running?');
      return Promise.reject(new Error('Cannot connect to server. Please ensure the backend is running.'));
    }
    if (error.response) {
      console.error('[API] Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('[API] No response:', error.request);
    } else {
      console.error('[API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Test-related API functions
export const testApi = {
  createTest: (userEmail: string) =>
    api.post('/tests/create', { userEmail }),

  getTest: (testCode: string) =>
    api.get(`/tests/${testCode}`),

  processTest: (testCode: string) =>
    api.post('/tests/process', { testCode }),

  sendTestEmail: (payload: {
    testCode?: string;
    fromName?: string;
    subject?: string;
    body?: string;
    html?: string;
    recipients?: string[];
  }) => {
    const to = Array.isArray(payload.recipients) ? payload.recipients.filter(Boolean)[0] : undefined;
    if (!to) {
      return Promise.reject(new Error('Recipient email is required'));
    }
    return api.post('/tests/send-email', {
      to,
      subject: payload.subject,
      text: payload.body,
      html: payload.html,
      testCode: payload.testCode,
      fromName: payload.fromName,
    });
  },
};

// Auth-related API functions
export const authApi = {
  identify: (email: string) =>
    api.post('/auth/identify', { email }),
};

// Health check utility
export const checkConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('[API] Health check failed:', error);
    return false;
  }
};
