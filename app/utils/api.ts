// utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // jika pakai cookie/session
  timeout: 30000, // 30 second timeout
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses (unauthorized) and other auth-related errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message?.toLowerCase() || '';
    const errorDetail = error.response?.data?.error?.toLowerCase() || '';
    
    // Check for database connection errors (Supabase pooler issues)
    const isDbConnectionError = 
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      errorMessage.includes('database') ||
      errorMessage.includes('prisma') ||
      errorMessage.includes('can\'t reach') ||
      errorDetail.includes('database server');
    
    // Retry logic for database connection errors (max 2 retries)
    if (isDbConnectionError && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount <= 2) {
        console.log(`🔄 Retrying request (attempt ${originalRequest._retryCount}/2) due to database connection error...`);
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(originalRequest);
      }
    }
    
    // Check for authentication/authorization errors
    const isAuthError = 
      status === 401 || 
      status === 403 ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('invalid token') ||
      errorMessage.includes('token expired') ||
      errorMessage.includes('not authenticated') ||
      errorMessage.includes('user not found');
    
    if (isAuthError) {
      console.log('🔐 Authentication error detected:', {
        status,
        message: errorMessage,
        detail: errorDetail,
      });
      
      // Token expired, invalid, or user no longer exists
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes("/login")) {
          console.log('↪️ Redirecting to login...');
          window.location.href = "/login";
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
