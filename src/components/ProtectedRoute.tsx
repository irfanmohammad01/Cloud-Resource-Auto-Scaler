/**
 * ProtectedRoute component
 * 
 * Wrapper for React Router routes that require authentication
 * Redirects to login page if user is not authenticated
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

/**
 * Route guard component
 * 
 * Renders children if authenticated, otherwise redirects to login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    // Render the protected component
    return children;
};

export default ProtectedRoute;
