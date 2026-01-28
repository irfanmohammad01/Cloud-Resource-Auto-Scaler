/**
 * InstanceMetricsPage component
 * 
 * Displays metrics and scaling decisions for a specific instance
 * Shows:
 * - CPU usage chart over time
 * - Memory usage chart over time
 * - Scaling decisions table with timestamps, decisions, and reasons
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as metricsService from '../services/metricsService';
import { Metric, ScalingDecision } from '../types/metrics.types';
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

    // UI state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // Ref to store interval ID for cleanup
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
            // Fetch both metrics and decisions in parallel
            const [metricsData, decisionsData] = await Promise.all([
                metricsService.getMetrics(instanceId, 100),
                metricsService.getScalingDecisions(instanceId, 50),
            ]);

            setMetrics(metricsData);
            setDecisions(decisionsData);

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
    }, [instanceId]); // Only recreate when instanceId changes

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
        navigate('/login');
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

                    <h1>Instance Metrics: {instanceId}</h1>
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
                    <h2 style={{ marginBottom: '20px' }}>Resource Usage Over Time</h2>

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
                                    console.log('Formatted timestamp:', formatDateTime(decision.timestamp), 'Raw timestamp:', decision.timestamp);
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

            {/* Refresh button */}
            <div style={{ marginTop: '30px' }}>
                <button
                    onClick={() => fetchData()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    Refresh Data
                </button>
            </div>
        </div>
    );
};

export default InstanceMetricsPage;
