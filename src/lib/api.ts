import { env } from '@/env';
import axios, { type AxiosError, type AxiosResponse } from 'axios';

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful responses as-is
    return response;
  },
  async (error: AxiosError) => {
    // Handle specific error status codes
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized errors (token expired or invalid)
      if (status === 401) {
        // Clear token and user data from localStorage
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // Redirect to login page if not already there
        // if (window.location.pathname !== '/login') {
        //   window.location.href = '/login';
        // }
      }

      // Handle 403 Forbidden errors
      if (status === 403) {
        console.error('Permission denied:', error.response.data);
      }

      // Handle 404 Not Found errors
      if (status === 404) {
        console.error('Resource not found:', error.response.data);
      }

      // Handle 500 Server errors
      if (status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }

    // Pass the error down to the calling function
    return Promise.reject(error);
  }
);

// Helper functions for common API operations

/**
 * Handles API errors and returns a formatted error message
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Handle Axios errors
    const { response } = error;

    if (response?.data?.message) {
      return response.data.message;
    }

    if (response?.status === 401) {
      return 'Authentication required. Please log in again.';
    }

    if (response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (response?.status === 404) {
      return 'The requested resource was not found.';
    }

    // if (response?.status >= 500) {
    //   return 'A server error occurred. Please try again later.';
    // }

    return error.message || 'An error occurred with the API request.';
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
};

/**
 * Sets the authentication token for API requests
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Clears the authentication token
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Checks if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export default api;
