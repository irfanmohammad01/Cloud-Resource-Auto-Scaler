/**
 * Authentication-related TypeScript types
 * Maps to OpenAPI schema definitions for User and auth responses
 */

// User credentials for login/register
export interface User {
    email: string;
    password: string;
}

// Response from POST /api/auth/login
export interface LoginResponse {
    message: string;
    token: string;
    user_id: string;
}

// Response from POST /api/auth/register
export interface RegisterResponse {
    message: string;
    user_id: string;
}

// Response from GET /api/auth/me
export interface UserProfile {
    user_id: string;
    email: string;
    created_at: string; // ISO 8601 date-time
    instance_count: number;
    monitoring_count: number;
}

// Error response structure
export interface ErrorResponse {
    error: string;
}
