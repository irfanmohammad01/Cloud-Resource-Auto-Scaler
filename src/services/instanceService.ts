/**
 * Instance Service
 * 
 * Handles AWS EC2 instance management:
 * - Fetching user's registered instances
 * - Registering new instances
 * - Starting/stopping monitoring
 * 
 * All functions strictly follow the OpenAPI specification
 */

import axiosInstance from '../api/axiosInstance';
import {
    Instance,
    InstanceRegistration,
    InstancesResponse,
    InstanceRegistrationResponse,
    MonitoringActionResponse,
} from '../types/instance.types';

/**
 * Fetch all instances for the authenticated user
 * 
 * @returns Array of Instance objects
 * @throws Error on unauthorized or network failure
 */
export const getInstances = async (): Promise<Instance[]> => {
    try {
        const response = await axiosInstance.get<InstancesResponse>('/api/instances/');
        return response.data.instances;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch instances.';
        throw new Error(errorMessage);
    }
};

/**
 * Register a new AWS EC2 instance for monitoring
 * 
 * @param data - Instance registration data (instance_id, region, optional instance_type)
 * @returns Registered Instance object
 * @throws Error if instance already exists or validation fails
 */
export const registerInstance = async (data: InstanceRegistration): Promise<Instance> => {
    try {
        const response = await axiosInstance.post<InstanceRegistrationResponse>('/api/instances/', data);
        return response.data.instance;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to register instance.';
        throw new Error(errorMessage);
    }
};

/**
 * Start monitoring an instance
 * Metrics will be collected every 30 seconds
 * 
 * @param instanceId - AWS instance ID (e.g., i-1234567890abcdef0)
 * @returns Success message
 * @throws Error if instance not found or already monitoring
 */
export const startMonitoring = async (instanceId: string): Promise<string> => {
    try {
        const response = await axiosInstance.patch<MonitoringActionResponse>(
            `/api/instances/${instanceId}/monitor/start`
        );
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to start monitoring.';
        throw new Error(errorMessage);
    }
};

/**
 * Stop monitoring an instance
 * 
 * @param instanceId - AWS instance ID
 * @returns Success message
 * @throws Error if instance not found or not currently monitoring
 */
export const stopMonitoring = async (instanceId: string): Promise<string> => {
    try {
        const response = await axiosInstance.patch<MonitoringActionResponse>(
            `/api/instances/${instanceId}/monitor/stop`
        );
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to stop monitoring.';
        throw new Error(errorMessage);
    }
};
