/**
 * useAuth custom hook
 * 
 * Provides convenient access to AuthContext
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook to access authentication state and actions
 * 
 * @returns AuthContext value with isAuthenticated, login, logout
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
