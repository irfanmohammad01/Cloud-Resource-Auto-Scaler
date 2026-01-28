/**
 * LocalStorage utility functions for JWT token management
 * 
 * Provides a centralized interface for storing and retrieving authentication tokens.
 * In production, consider migrating to httpOnly cookies for enhanced security.
 */

const TOKEN_KEY = 'auth_token';

/**
 * Save JWT token to localStorage
 */
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve JWT token from localStorage
 * Returns null if no token is found
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage
 * Used during logout or when token is invalid
 */
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated (token exists)
 */
export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};
