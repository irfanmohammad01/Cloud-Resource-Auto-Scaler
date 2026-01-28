/**
 * InstancesListPage component
 * 
 * Displays all registered instances for the authenticated user
 * Allows users to:
 * - View instance details
 * - Register new instances
 * - Start/stop monitoring
 * - Navigate to instance metrics
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as instanceService from '../services/instanceService';
import { Instance, InstanceRegistration } from '../types/instance.types';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import UserProfileButton from '../components/UserProfileButton';

const InstancesListPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Instance list state
    const [instances, setInstances] = useState<Instance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Registration form state
    const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
    const [instanceId, setInstanceId] = useState<string>('');
    const [instanceType, setInstanceType] = useState<string>('');
    const [region, setRegion] = useState<string>('');
    const [isMock, setIsMock] = useState<boolean>(false);
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<string | null>(null);

    // Action state (for start/stop monitoring)
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    /**
     * Fetch instances on component mount
     */
    useEffect(() => {
        fetchInstances();
    }, []);

    /**
     * Fetch all instances from API
     */
    const fetchInstances = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await instanceService.getInstances();
            setInstances(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle instance registration form submission
     */
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setRegisterError(null);

        // Validation
        if (!instanceId || !region) {
            setRegisterError('Instance ID and Region are required');
            return;
        }

        setRegisterLoading(true);

        try {
            const payload: InstanceRegistration = {
                instance_id: instanceId,
                region,
                ...(instanceType && { instance_type: instanceType }),
                ...(isMock && { is_mock: isMock }),
            };

            await instanceService.registerInstance(payload);

            // Reset form
            setInstanceId('');
            setInstanceType('');
            setRegion('');
            setIsMock(false);
            setShowRegisterForm(false);

            // Refresh instance list
            fetchInstances();

            setSuccessMessage('Instance registered successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setRegisterError(err.message);
        } finally {
            setRegisterLoading(false);
        }
    };

    /**
     * Start monitoring an instance
     */
    const handleStartMonitoring = async (instance: Instance) => {
        setActionLoading(instance.instance_id);
        setError(null);

        try {
            await instanceService.startMonitoring(instance.instance_id);

            // Update local state
            setInstances((prev) =>
                prev.map((inst) =>
                    inst.instance_id === instance.instance_id
                        ? { ...inst, is_monitoring: true }
                        : inst
                )
            );

            setSuccessMessage('Monitoring started successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Stop monitoring an instance
     */
    const handleStopMonitoring = async (instance: Instance) => {
        setActionLoading(instance.instance_id);
        setError(null);

        try {
            await instanceService.stopMonitoring(instance.instance_id);

            // Update local state
            setInstances((prev) =>
                prev.map((inst) =>
                    inst.instance_id === instance.instance_id
                        ? { ...inst, is_monitoring: false }
                        : inst
                )
            );

            setSuccessMessage('Monitoring stopped successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Navigate to instance metrics page
     */
    const handleViewMetrics = (instance: Instance) => {
        navigate(`/instances/${instance.instance_id}/metrics`);
    };

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Instances</h1>
                <UserProfileButton onLogout={handleLogout} />
            </div>

            {/* Success message */}
            {successMessage && (
                <div style={{
                    color: '#2e7d32',
                    padding: '10px',
                    marginBottom: '15px',
                    border: '1px solid #2e7d32',
                    borderRadius: '4px',
                    backgroundColor: '#e8f5e9',
                }}>
                    {successMessage}
                </div>
            )}

            <ErrorMessage error={error} />

            {/* Register instance button */}
            <button
                onClick={() => setShowRegisterForm(!showRegisterForm)}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                {showRegisterForm ? 'Cancel' : 'Register New Instance'}
            </button>

            {/* Registration form */}
            {showRegisterForm && (
                <div style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '20px',
                    marginBottom: '20px',
                    backgroundColor: '#f5f5f5',
                }}>
                    <h3 style={{ marginTop: 0 }}>Register New Instance</h3>

                    <ErrorMessage error={registerError} />

                    <form onSubmit={handleRegister}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                Instance ID * (e.g., i-1234567890abcdef0):
                            </label>
                            <input
                                type="text"
                                value={instanceId}
                                onChange={(e) => setInstanceId(e.target.value)}
                                disabled={registerLoading}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    fontSize: '14px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                placeholder="i-1234567890abcdef0"
                            />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                Instance Type (e.g., t2.micro):
                            </label>
                            <input
                                type="text"
                                value={instanceType}
                                onChange={(e) => setInstanceType(e.target.value)}
                                disabled={registerLoading}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    fontSize: '14px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                placeholder="t2.micro"
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                Region * (e.g., us-east-1):
                            </label>
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                disabled={registerLoading}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    fontSize: '14px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                placeholder="us-east-1"
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isMock}
                                    onChange={(e) => setIsMock(e.target.checked)}
                                    disabled={registerLoading}
                                    style={{
                                        marginRight: '8px',
                                        width: '16px',
                                        height: '16px',
                                        cursor: registerLoading ? 'not-allowed' : 'pointer',
                                    }}
                                />
                                <span>Mock Instance</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={registerLoading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: registerLoading ? '#ccc' : '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: registerLoading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {registerLoading ? 'Registering...' : 'Register Instance'}
                        </button>
                    </form>
                </div>
            )}

            {/* Instances table */}
            {instances.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                    No instances registered yet. Click "Register New Instance" to add one.
                </p>
            ) : (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #ddd',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                Instance ID
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                Type
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                Region
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                Monitoring
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {instances.map((instance) => (
                            <tr key={instance.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{instance.instance_id}</td>
                                <td style={{ padding: '12px' }}>{instance.instance_type || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>{instance.region}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: instance.is_monitoring ? '#e8f5e9' : '#ffebee',
                                        color: instance.is_monitoring ? '#2e7d32' : '#d32f2f',
                                        fontSize: '12px',
                                    }}>
                                        {instance.is_monitoring ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {instance.is_monitoring ? (
                                        <button
                                            onClick={() => handleStopMonitoring(instance)}
                                            disabled={actionLoading === instance.instance_id}
                                            style={{
                                                padding: '6px 12px',
                                                marginRight: '8px',
                                                backgroundColor: actionLoading === instance.instance_id ? '#ccc' : '#d32f2f',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: actionLoading === instance.instance_id ? 'not-allowed' : 'pointer',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {actionLoading === instance.instance_id ? 'Stopping...' : 'Stop Monitoring'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStartMonitoring(instance)}
                                            disabled={actionLoading === instance.instance_id}
                                            style={{
                                                padding: '6px 12px',
                                                marginRight: '8px',
                                                backgroundColor: actionLoading === instance.instance_id ? '#ccc' : '#2e7d32',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: actionLoading === instance.instance_id ? 'not-allowed' : 'pointer',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {actionLoading === instance.instance_id ? 'Starting...' : 'Start Monitoring'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleViewMetrics(instance)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                        }}
                                    >
                                        View Metrics
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InstancesListPage;
