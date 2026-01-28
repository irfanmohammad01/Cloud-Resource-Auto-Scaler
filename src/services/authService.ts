/**
 * Authentication Service
 * 
 * Handles user registration and login via the API
 * All functions strictly follow the OpenAPI specification
 */

import axiosInstance from '../api/axiosInstance';
import { User, LoginResponse, RegisterResponse, UserProfile } from '../types/auth.types';

/**
 * Get authenticated user profile
 * 
 * @returns UserProfile with user information and stats
 * @throws Error on unauthorized or network failure
 */
export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const response = await axiosInstance.get<UserProfile>('/api/auth/me');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch user profile.';
        throw new Error(errorMessage);
    }
};


/**
 * Login user with email and password
 * 
 * @param email - User email
 * @param password - User password
 * @returns LoginResponse with JWT token and user_id
 * @throws Error on invalid credentials or network failure
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const payload: User = { email, password };
        const response = await axiosInstance.post<LoginResponse>('/api/auth/login', payload);
        return response.data;
    } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
        throw new Error(errorMessage);
    }
};

/**
 * Register a new user
 * 
 * @param email - User email
 * @param password - User password
 * @returns RegisterResponse with user_id
 * @throws Error if user already exists or validation fails
 */
export const register = async (email: string, password: string): Promise<RegisterResponse> => {
    try {
        const payload: User = { email, password };
        const response = await axiosInstance.post<RegisterResponse>('/api/auth/register', payload);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
        throw new Error(errorMessage);
    }
};
