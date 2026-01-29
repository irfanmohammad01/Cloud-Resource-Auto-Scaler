import axiosInstance from '../api/axiosInstance';
import {
    Instance,
    InstanceRegistration,
    InstancesResponse,
    InstanceRegistrationResponse,
    MonitoringActionResponse,
    DeleteInstanceResponse,
} from '../types/instance.types';

export const getInstances = async (): Promise<Instance[]> => {
    try {
        const response = await axiosInstance.get<InstancesResponse>('/api/instances/');
        return response.data.instances;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch instances.';
        throw new Error(errorMessage);
    }
};

export const registerInstance = async (data: InstanceRegistration): Promise<Instance> => {
    try {
        const response = await axiosInstance.post<InstanceRegistrationResponse>('/api/instances/', data);
        return response.data.instance;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to register instance.';
        throw new Error(errorMessage);
    }
};

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

export const deleteInstance = async (instanceId: string): Promise<string> => {
    try {
        const response = await axiosInstance.delete<DeleteInstanceResponse>(
            `/api/instances/${instanceId}`
        );
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to delete instance.';
        throw new Error(errorMessage);
    }
};
