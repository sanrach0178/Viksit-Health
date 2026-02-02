import { config } from '../config/env';
import { logError } from './logger';
export class ApiError extends Error {
    constructor(status, code, message, details) {
        super(message);
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: status
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: code
        });
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: details
        });
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
export async function apiCall(endpoint, options = {}) {
    const url = `${config.apiUrl}${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });
        if (!response.ok) {
            let errorData = {
                success: false,
                error: { code: 'UNKNOWN_ERROR', message: `HTTP ${response.status}` },
            };
            try {
                errorData = await response.json();
            }
            catch {
                // Response is not JSON
            }
            const error = new ApiError(response.status, errorData.error?.code || 'HTTP_ERROR', errorData.error?.message || `HTTP ${response.status}`, errorData.error?.details);
            logError(error);
            throw error;
        }
        const data = await response.json();
        if (!data.success) {
            const error = new ApiError(400, data.error?.code || 'REQUEST_FAILED', data.error?.message || 'Request failed', data.error?.details);
            logError(error);
            throw error;
        }
        return data.data;
    }
    catch (error) {
        if (error instanceof ApiError)
            throw error;
        const networkError = new ApiError(500, 'NETWORK_ERROR', 'Failed to connect to server', error);
        logError(networkError);
        throw networkError;
    }
}
//# sourceMappingURL=apiClient.js.map