import axiosInstance from '../api/axiosInstance';
import {
    Metric,
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

export const getScalingDecisions = async (
    instanceId: string,
    page: number = 1,
    pageSize: number = 20
): Promise<ScalingDecisionsResponse> => {
    try {
        const response = await axiosInstance.get<ScalingDecisionsResponse>(
            `/api/metrics/decisions/${instanceId}`,
            { params: { page, page_size: pageSize } }
        );
        return response.data;
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
