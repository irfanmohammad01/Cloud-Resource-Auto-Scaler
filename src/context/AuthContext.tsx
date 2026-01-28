/**
 * Authentication Context
 * 
 * Provides global authentication state using React Context
 * Manages user login status and token storage
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { setToken as saveToken, removeToken, getToken, isAuthenticated as checkAuth } from '../utils/storage';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
});

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider component
 * 
 * Wraps the app to provide authentication state to all components
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());

    // Check for existing token on mount
    useEffect(() => {
        const token = getToken();
        setIsAuthenticated(!!token);
    }, []);

    /**
     * Login: save token and update auth state
     */
    const login = (token: string) => {
        saveToken(token);
        setIsAuthenticated(true);
    };

    /**
     * Logout: clear token and update auth state
     */
    const logout = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
