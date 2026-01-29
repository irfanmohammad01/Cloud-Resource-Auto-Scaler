/**
 * PublicRoute component
 *
 * Wrapper for routes that should NOT be accessible when authenticated
 * (e.g. /login, /register).
 *
 * Redirects authenticated users to /instances.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
    children: React.ReactElement;
    redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/instances' }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        // User already has a valid token; keep UX simple by redirecting.
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PublicRoute;

