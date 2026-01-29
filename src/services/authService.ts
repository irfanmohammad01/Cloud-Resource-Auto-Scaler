import axiosInstance from '../api/axiosInstance';
import { User, LoginResponse, RegisterResponse, UserProfile } from '../types/auth.types';
import { isPasswordValid } from '../utils/passwordValidation';

export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const response = await axiosInstance.get<UserProfile>('/api/auth/me');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch user profile.';
        throw new Error(errorMessage);
    }
};


export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const payload = { email, password };
        const response = await axiosInstance.post<LoginResponse>('/api/auth/login', payload);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
        throw new Error(errorMessage);
    }
};


export const register = async (email: string, password: string): Promise<RegisterResponse> => {
    try {
        const payload = { email, password };
        const response = await axiosInstance.post<RegisterResponse>('/api/auth/register', payload);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
        throw new Error(errorMessage);
    }
};


export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    return isPasswordValid(password);
};