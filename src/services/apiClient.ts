import { config } from '../config/env';
import { logError } from './logger';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
      let errorData: ApiResponse<unknown> = {
        success: false,
        error: { code: 'UNKNOWN_ERROR', message: `HTTP ${response.status}` },
      };

      try {
        errorData = await response.json();
      } catch {
        // Response is not JSON
      }

      const error = new ApiError(
        response.status,
        errorData.error?.code || 'HTTP_ERROR',
        errorData.error?.message || `HTTP ${response.status}`,
        errorData.error?.details
      );
      logError(error);
      throw error;
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      const error = new ApiError(
        400,
        data.error?.code || 'REQUEST_FAILED',
        data.error?.message || 'Request failed',
        data.error?.details
      );
      logError(error);
      throw error;
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    const networkError = new ApiError(
      500,
      'NETWORK_ERROR',
      'Failed to connect to server',
      error
    );
    logError(networkError);
    throw networkError;
  }
}
