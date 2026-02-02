export declare class ApiError extends Error {
    status: number;
    code: string;
    details?: unknown | undefined;
    constructor(status: number, code: string, message: string, details?: unknown | undefined);
}
export declare function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T>;
//# sourceMappingURL=apiClient.d.ts.map