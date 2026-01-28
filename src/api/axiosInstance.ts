/**
 * Axios instance configuration with JWT token interceptors
 * 
 * This centralized HTTP client:
 * 1. Sets the base URL from environment variables
 * 2. Automatically attaches JWT tokens to all requests
 * 3. Handles 401 errors by logging out and redirecting to login
 * 4. Provides consistent error handling across the app
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '../utils/storage';

// Create Axios instance with base URL from environment
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor: Attach JWT token to all requests
 * 
 * Reads token from localStorage and adds it to Authorization header
 */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();

        // If token exists, attach it to the Authorization header
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor: Handle 401 errors globally
 * 
 * On 401 Unauthorized:
 * - Clear the token from localStorage
 * - Redirect to login page
 * 
 * This ensures expired/invalid tokens are handled consistently
 */
axiosInstance.interceptors.response.use(
    (response) => {
        // Pass through successful responses
        return response;
    },
    (error: AxiosError) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Clear invalid token
            removeToken();

            // Redirect to login (only if not already on login page)
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Pass error to caller for specific handling
        return Promise.reject(error);
    }
);

export default axiosInstance;
