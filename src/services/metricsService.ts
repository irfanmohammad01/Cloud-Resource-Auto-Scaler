import axiosInstance from '../api/axiosInstance';
import {
    Metric,
    ScalingDecision,
    MetricsResponse,
    ScalingDecisionsResponse,
    SimulateMetricsRequest,
    SimulateMetricsInstantResponse,
    SimulateMetricsProlongedResponse,
} from '../types/metrics.types';

export const getMetrics = async (instanceId: string, limit: number = 100): Promise<Metric[]> => {
    try {
        const response = await axiosInstance.get<MetricsResponse>(
            `/api/metrics/${instanceId}`,
            { params: { limit } }
        );
        return response.data.metrics;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch metrics.';
        throw new Error(errorMessage);
    }
};

export const getScalingDecisions = async (instanceId: string, limit: number = 50): Promise<ScalingDecision[]> => {
    try {
        const response = await axiosInstance.get<ScalingDecisionsResponse>(
            `/api/metrics/decisions/${instanceId}`,
            { params: { limit } }
        );
        return response.data.decisions;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch scaling decisions.';
        throw new Error(errorMessage);
    }
};

export const simulateMetrics = async (
    payload: SimulateMetricsRequest
): Promise<string> => {
    try {
        const response = await axiosInstance.post<
            SimulateMetricsInstantResponse | SimulateMetricsProlongedResponse
        >('/api/metrics/simulate', payload);
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to simulate metrics.';
        throw new Error(errorMessage);
    }
};
