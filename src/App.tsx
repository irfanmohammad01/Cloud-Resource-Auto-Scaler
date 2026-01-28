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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InstancesListPage from './pages/InstancesListPage';
import InstanceMetricsPage from './pages/InstanceMetricsPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes */}
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

                    {/* Default redirect to instances */}
                    <Route path="/" element={<Navigate to="/instances" replace />} />

                    {/* Catch-all redirect to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
