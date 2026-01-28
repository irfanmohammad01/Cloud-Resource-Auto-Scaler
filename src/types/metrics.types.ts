/**
 * Metrics and Scaling Decision TypeScript types
 * Maps to OpenAPI schema definitions for Metric and ScalingDecision
 */

// Metric object - time-series data collected every 30 seconds
export interface Metric {
    id: string; // UUID
    timestamp: string; // ISO 8601 date-time
    cpu_utilization: number; // 0-100%
    memory_usage: number; // 0-100%
    network_in: number; // bytes
    network_out: number; // bytes
    is_outlier: boolean;
    outlier_type: 'scale_up' | 'scale_down' | null;
}

// Scaling decision object
export interface ScalingDecision {
    id: string; // UUID
    timestamp: string; // ISO 8601 date-time
    cpu_utilization: number;
    memory_usage: number;
    network_in: number;
    network_out: number;
    decision: 'scale_up' | 'scale_down' | 'no_action';
    reason: string;
}

// Response from GET /api/metrics/{instance_id}
export interface MetricsResponse {
    instance_id: string;
    metrics: Metric[];
}

// Response from GET /api/metrics/decisions/{instance_id}
export interface ScalingDecisionsResponse {
    instance_id: string;
    decisions: ScalingDecision[];
}

// Chart data point interface for visualization
export interface ChartDataPoint {
    timestamp: string;
    value: number;
}
