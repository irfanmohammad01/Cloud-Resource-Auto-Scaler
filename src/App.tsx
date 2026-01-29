/**
 * App.tsx - Main application component
 * 
 * Sets up routing with React Router and Authentication Context
 * Defines all application routes with authentication protection
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InstancesListPage from './pages/InstancesListPage';
import InstanceMetricsPage from './pages/InstanceMetricsPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public landing page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Public routes - redirect to instances if already authenticated */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        }
                    />

                    {/* Protected routes - redirect to login if not authenticated */}
                    <Route
                        path="/instances"
                        element={
                            <ProtectedRoute>
                                <InstancesListPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/instances/:instanceId/metrics"
                        element={
                            <ProtectedRoute>
                                <InstanceMetricsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all redirect to landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
