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
    const token = getToken();
    if (!token) return false;
    return isTokenValid(token);
};

/**
 * Lightweight JWT validation (frontend-only).
 *
 * - Ensures the token can be decoded
 * - If an `exp` claim exists, ensures it is not expired
 *
 * NOTE: This does NOT prove the token signature is valid (requires server).
 * It prevents obvious UX issues like using an expired token.
 */
export const isTokenValid = (token: string): boolean => {
    const payload = decodeJwtPayload(token);
    if (!payload) return false;

    // If exp is missing, treat token as "present" (can't validate expiry).
    if (typeof payload.exp !== 'number') return true;

    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowSeconds;
};

type JwtPayload = {
    exp?: number;
    [key: string]: unknown;
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // JWT payload is base64url encoded JSON.
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // Add required padding.
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

        const json = atob(padded);
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
};
