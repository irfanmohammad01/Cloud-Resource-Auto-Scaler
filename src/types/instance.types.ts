/**
 * Instance-related TypeScript types
 * Maps to OpenAPI schema definitions for Instance and InstanceRegistration
 */

// Instance object returned from API
export interface Instance {
    id: string; // UUID
    instance_id: string; // AWS instance ID (e.g., i-1234567890abcdef0)
    instance_type: string; // e.g., t2.micro
    region: string; // AWS region (e.g., us-east-1)
    is_monitoring: boolean;
    created_at: string; // ISO 8601 date-time
}

// Request body for POST /api/instances/
export interface InstanceRegistration {
    instance_id: string;
    instance_type?: string; // Optional
    region: string;
    is_mock?: boolean; // Optional - indicates if this is a mock instance
}

// Response from GET /api/instances/
export interface InstancesResponse {
    instances: Instance[];
}

// Response from POST /api/instances/
export interface InstanceRegistrationResponse {
    message: string;
    instance: Instance;
}

// Response from start/stop monitoring
export interface MonitoringActionResponse {
    message: string;
}

// Response from DELETE /api/instances/{instance_id}
export interface DeleteInstanceResponse {
    message: string;
}
