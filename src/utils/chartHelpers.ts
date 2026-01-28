/**
 * Chart data transformation utilities
 * 
 * Helpers to transform API metric data into chart-friendly format
 */

import { Metric, ChartDataPoint } from '../types/metrics.types';

/**
 * Transform metric array into chart data for a specific metric key
 * 
 * @param metrics - Array of metric objects from API
 * @param key - Which metric to extract (cpu_utilization or memory_usage)
 * @returns Array of chart data points with formatted timestamps
 */
export const transformMetricsForChart = (
    metrics: Metric[],
    key: 'cpu_utilization' | 'memory_usage'
): ChartDataPoint[] => {
    return metrics
        .map((metric) => ({
            timestamp: formatTimestamp(metric.timestamp),
            value: metric[key],
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

/**
 * Format ISO 8601 timestamp for display in charts
 * Converts to HH:MM:SS format for readability
 * 
 * @param isoString - ISO 8601 formatted timestamp
 * @returns Formatted time string (HH:MM:SS)
 */
export const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

/**
 * Format ISO 8601 timestamp for display in tables
 * 
 * @param isoString - ISO 8601 formatted timestamp
 * @returns Formatted date and time string
 */
export const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};
