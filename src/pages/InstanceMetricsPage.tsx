/**
 * InstanceMetricsPage component
 * 
 * Displays metrics and scaling decisions for a specific instance
 * Shows:
 * - CPU usage chart over time
 * - Memory usage chart over time
 * - Scaling decisions table with timestamps, decisions, and reasons
 */

import React, { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as metricsService from '../services/metricsService';
import * as instanceService from '../services/instanceService';
import { Metric, ScalingDecision, SimulateMetricsRequest } from '../types/metrics.types';
import { transformMetricsForChart } from '../utils/chartHelpers';
import { formatDateTime } from '../utils/chartHelpers';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import MetricsChart from '../components/MetricsChart';
import UserProfileButton from '../components/UserProfileButton';

const InstanceMetricsPage: React.FC = () => {
    const { instanceId } = useParams<{ instanceId: string }>();
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Data state
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [decisions, setDecisions] = useState<ScalingDecision[]>([]);
    const [isMonitoring, setIsMonitoring] = useState<boolean | null>(null);

    // UI state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [metricsLimit, setMetricsLimit] = useState<number>(50);

    // Simulation form state
    const [simulationType, setSimulationType] = useState<'instant' | 'prolonged'>('instant');
    const [cpuUtilization, setCpuUtilization] = useState<string>('95');
    const [memoryUsage, setMemoryUsage] = useState<string>('70');
    const [durationMinutes, setDurationMinutes] = useState<string>('10');
    const [intervalSeconds, setIntervalSeconds] = useState<string>('30');
    const [simulateLoading, setSimulateLoading] = useState<boolean>(false);
    const [simulateError, setSimulateError] = useState<string | null>(null);
    const [simulateSuccess, setSimulateSuccess] = useState<string | null>(null);


    // Ref to store interval ID for cleanup
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Fetch instance monitoring status
     * Gets instance list and extracts monitoring status for current instance
     */
    const fetchInstanceStatus = useCallback(async () => {
        if (!instanceId) return;

        try {
            const instances = await instanceService.getInstances();
            const instance = instances.find(inst => inst.instance_id === instanceId);
            setIsMonitoring(instance?.is_monitoring ?? false);
        } catch (err: any) {
            // Silently fail - status is nice-to-have, not critical
            console.error('Failed to fetch instance status:', err);
        }
    }, [instanceId]);

    /**
     * Fetch metrics and scaling decisions from API
     * @param isBackgroundRefresh - If true, skip loading spinner (for polling)
     * 
     * Memoized with useCallback to prevent recreation on every render
     * Only recreates when instanceId changes
     */
    const fetchData = useCallback(async (isBackgroundRefresh: boolean = false) => {
        if (!instanceId) return;

        // Only show loading spinner on initial load, not during background polling
        if (!isBackgroundRefresh) {
            setLoading(true);
        }
        setError(null);

        try {
            // Fetch metrics, decisions, and status in parallel
            await Promise.all([
                (async () => {
                    const [metricsData, decisionsData] = await Promise.all([
                        metricsService.getMetrics(instanceId, metricsLimit),
                        metricsService.getScalingDecisions(instanceId, 50),
                    ]);
                    setMetrics(metricsData);
                    setDecisions(decisionsData);
                })(),
                fetchInstanceStatus(),
            ]);

            // Clear any previous errors on successful refresh
            setError(null);
        } catch (err: any) {
            // During background refresh, silently fail to avoid disrupting UX
            // Only update error state on initial load
            if (!isBackgroundRefresh) {
                setError(err.message);
            }
        } finally {
            if (!isBackgroundRefresh) {
                setLoading(false);
            }
        }
    }, [instanceId, metricsLimit, fetchInstanceStatus]); // Recreate when instanceId or metricsLimit changes

    /**
     * Fetch metrics and decisions on component mount
     * and set up auto-refresh polling
     */
    useEffect(() => {
        if (!instanceId) {
            setError('Instance ID is missing');
            setLoading(false);
            return;
        }

        // Initial fetch with loading state
        fetchData();

        // Set up polling to fetch data every 30 seconds (matches backend metric collection interval)
        pollingIntervalRef.current = setInterval(() => {
            fetchData(true); // Pass true to indicate background refresh (no loading spinner)
        }, 30000);

        // Cleanup: clear interval when component unmounts or instanceId changes
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [instanceId, fetchData]); // fetchData is now safe to include (memoized with useCallback)


    /**
     * Navigate back to instances list
     */
    const handleBackToInstances = () => {
        navigate('/instances');
    };

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    /**
     * Handle metrics simulation form submission
     */
    const handleSimulateMetrics = async (e: FormEvent) => {
        e.preventDefault();
        setSimulateLoading(true);
        setSimulateError(null);
        setSimulateSuccess(null);

        try {
            // Build request payload based on simulation type
            const payload: SimulateMetricsRequest = {
                instance_id: instanceId!,
                cpu_utilization: parseFloat(cpuUtilization),
                memory_usage: parseFloat(memoryUsage),
            };

            // Add prolonged-specific fields only if type is 'prolonged'
            if (simulationType === 'prolonged') {
                payload.duration_minutes = parseInt(durationMinutes);
                payload.interval_seconds = parseInt(intervalSeconds);
            }

            const message = await metricsService.simulateMetrics(payload);

            setSimulateSuccess(message);
            setTimeout(() => setSimulateSuccess(null), 3000);

            // Refresh metrics and decisions after successful simulation
            await fetchData(false);

        } catch (err: any) {
            setSimulateError(err.message);
        } finally {
            setSimulateLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // Transform metrics data for charts
    const cpuData = transformMetricsForChart(metrics, 'cpu_utilization');
    const memoryData = transformMetricsForChart(metrics, 'memory_usage');


    return (
        <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <button
                        onClick={handleBackToInstances}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#757575',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '15px',
                        }}
                    >
                        ← Back to Instances
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 style={{ margin: 0 }}>Instance Metrics: {instanceId}</h1>

                        {/* Monitoring Status Badge */}
                        {isMonitoring === null ? (
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '4px',
                                backgroundColor: '#f5f5f5',
                                color: '#999',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}>
                                Loading...
                            </span>
                        ) : isMonitoring ? (
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '4px',
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}>
                                Active
                            </span>
                        ) : (
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '4px',
                                backgroundColor: '#ffebee',
                                color: '#d32f2f',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}>
                                Inactive
                            </span>
                        )}
                    </div>
                </div>
                <UserProfileButton onLogout={handleLogout} />
            </div>

            <ErrorMessage error={error} />

            {/* Empty state */}
            {metrics.length === 0 && !error && (
                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>
                    No metrics available. Start monitoring this instance first.
                </p>
            )}

            {/* Metrics Charts */}
            {metrics.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Resource Usage Over Time</h2>

                        {/* Metrics Limit Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label htmlFor="metrics-limit" style={{ fontSize: '14px', color: '#666' }}>
                                Metrics limit:
                            </label>
                            <select
                                id="metrics-limit"
                                value={metricsLimit}
                                onChange={(e) => setMetricsLimit(Number(e.target.value))}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '14px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: 'white',
                                }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    {/* CPU Chart */}

                    <MetricsChart
                        data={cpuData}
                        title="CPU Usage (%)"
                        dataKey="value"
                        color="#1976d2"
                    />

                    {/* Memory Chart */}
                    <MetricsChart
                        data={memoryData}
                        title="Memory Usage (%)"
                        dataKey="value"
                        color="#d32f2f"
                    />
                </div>
            )}

            {/* Simulate Metrics Section */}
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '20px',
                marginBottom: '40px',
                backgroundColor: '#f9f9f9',
            }}>
                <h2 style={{ marginTop: 0 }}>Simulate Metrics</h2>

                {simulateError && <ErrorMessage error={simulateError} />}
                {simulateSuccess && (
                    <div style={{
                        padding: '10px',
                        marginBottom: '15px',
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        border: '1px solid #2e7d32',
                        borderRadius: '4px',
                    }}>
                        {simulateSuccess}
                    </div>
                )}

                <form onSubmit={handleSimulateMetrics}>
                    {/* Simulation Type */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Simulation Type:
                        </label>
                        <select
                            value={simulationType}
                            onChange={(e) => setSimulationType(e.target.value as 'instant' | 'prolonged')}
                            disabled={simulateLoading}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                            }}
                        >
                            <option value="instant">Instant</option>
                            <option value="prolonged">Prolonged</option>
                        </select>
                    </div>

                    {/* CPU Utilization */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            CPU Utilization (%):
                        </label>
                        <input
                            type="number"
                            value={cpuUtilization}
                            onChange={(e) => setCpuUtilization(e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                            disabled={simulateLoading}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    {/* Memory Usage */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Memory Usage (%):
                        </label>
                        <input
                            type="number"
                            value={memoryUsage}
                            onChange={(e) => setMemoryUsage(e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                            disabled={simulateLoading}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    {/* Prolonged-specific fields */}
                    {simulationType === 'prolonged' && (
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    Duration (minutes):
                                </label>
                                <input
                                    type="number"
                                    value={durationMinutes}
                                    onChange={(e) => setDurationMinutes(e.target.value)}
                                    min="1"
                                    disabled={simulateLoading}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        fontSize: '14px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    Interval (seconds):
                                </label>
                                <input
                                    type="number"
                                    value={intervalSeconds}
                                    onChange={(e) => setIntervalSeconds(e.target.value)}
                                    min="1"
                                    disabled={simulateLoading}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        fontSize: '14px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={simulateLoading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: simulateLoading ? '#ccc' : '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: simulateLoading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        {simulateLoading ? 'Running...' : 'Run Simulation'}
                    </button>
                </form>
            </div>

            {/* Scaling Decisions Table */}
            <div>
                <h2 style={{ marginBottom: '15px' }}>Scaling Decisions</h2>

                {decisions.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>
                        No scaling decisions yet. Decisions are generated based on metric analysis.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            border: '1px solid #ddd',
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                        Timestamp
                                    </th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                        Decision
                                    </th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                        CPU (%)
                                    </th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                        Memory (%)
                                    </th>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                        Reason
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {decisions.map((decision) => {
                                    return (
                                        <tr key={decision.id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '12px', fontSize: '14px' }}>
                                                {formatDateTime(decision.timestamp)}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    backgroundColor:
                                                        decision.decision === 'scale_up' ? '#ffebee' :
                                                            decision.decision === 'scale_down' ? '#e8f5e9' :
                                                                '#fff3e0',
                                                    color:
                                                        decision.decision === 'scale_up' ? '#d32f2f' :
                                                            decision.decision === 'scale_down' ? '#2e7d32' :
                                                                '#ef6c00',
                                                }}>
                                                    {decision.decision === 'scale_up' ? 'SCALE UP' :
                                                        decision.decision === 'scale_down' ? 'SCALE DOWN' :
                                                            'NO ACTION'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '14px' }}>
                                                {decision.cpu_utilization.toFixed(2)}%
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '14px' }}>
                                                {decision.memory_usage.toFixed(2)}%
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '14px', maxWidth: '400px' }}>
                                                {decision.reason}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default InstanceMetricsPage;
