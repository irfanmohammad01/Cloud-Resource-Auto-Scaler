/**
 * UserProfileButton component
 * 
 * Displays a user profile button that shows user information when clicked
 * Fetches user data from GET /api/auth/me and displays:
 * - Email
 * - Instance count
 * - Monitoring count
 */

import React, { useState, useEffect, useRef } from 'react';
import * as authService from '../services/authService';
import { UserProfile } from '../types/auth.types';

interface UserProfileButtonProps {
    onLogout: () => void;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({ onLogout }) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /**
     * Fetch user profile when dropdown is opened
     */
    useEffect(() => {
        if (showDropdown && !userProfile) {
            fetchUserProfile();
        }
    }, [showDropdown]);

    /**
     * Close dropdown when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    /**
     * Fetch user profile from API
     */
    const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const profile = await authService.getUserProfile();
            setUserProfile(profile);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh user profile data
     */
    const handleRefresh = () => {
        setUserProfile(null);
        fetchUserProfile();
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        minWidth: '280px',
                        zIndex: 1000,
                    }}
                >
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <div>Loading...</div>
                        </div>
                    ) : error ? (
                        <div style={{ padding: '20px' }}>
                            <div style={{ color: '#d32f2f', marginBottom: '10px', fontSize: '14px' }}>
                                {error}
                            </div>
                            <button
                                onClick={handleRefresh}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    width: '100%',
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : userProfile ? (
                        <div>
                            {/* Profile Header */}
                            <div
                                style={{
                                    padding: '16px',
                                    borderBottom: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                                    User Profile
                                </div>
                                <div style={{ fontSize: '14px', color: '#666', wordBreak: 'break-all' }}>
                                    {userProfile.email}
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{ padding: '16px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px',
                                        fontSize: '14px',
                                    }}
                                >
                                    <span style={{ color: '#666' }}>Total Instances:</span>
                                    <span style={{ fontWeight: 600, color: '#1976d2' }}>
                                        {userProfile.instance_count}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px',
                                        fontSize: '14px',
                                    }}
                                >
                                    <span style={{ color: '#666' }}>Monitoring Active:</span>
                                    <span style={{ fontWeight: 600, color: '#2e7d32' }}>
                                        {userProfile.monitoring_count}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        paddingTop: '8px',
                                        borderTop: '1px solid #e0e0e0',
                                    }}
                                >
                                    <span style={{ color: '#999' }}>Member since:</span>
                                    <span style={{ color: '#666' }}>
                                        {new Date(userProfile.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div
                                style={{
                                    padding: '12px 16px',
                                    borderTop: '1px solid #e0e0e0',
                                    display: 'flex',
                                    gap: '8px',
                                }}
                            >
                                <button
                                    onClick={handleRefresh}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        backgroundColor: '#f5f5f5',
                                        color: '#333',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    Refresh
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        onLogout();
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        backgroundColor: '#d32f2f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default UserProfileButton;
