import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiCall, ApiError } from '../apiClient';
describe('apiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });
    it('should successfully call API and return data', async () => {
        const mockData = { id: 1, name: 'Test' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: mockData }),
        });
        const result = await apiCall('/test', { method: 'GET' });
        expect(result).toEqual(mockData);
    });
    it('should throw ApiError on non-ok response', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Resource not found' },
            }),
        });
        await expect(apiCall('/test')).rejects.toThrow(ApiError);
    });
    it('should throw ApiError on network failure', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));
        await expect(apiCall('/test')).rejects.toThrow(ApiError);
    });
    it('should include custom headers in request', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: {} }),
        });
        await apiCall('/test', {
            headers: { 'Authorization': 'Bearer token' },
        });
        expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            headers: expect.objectContaining({
                'Authorization': 'Bearer token',
                'Content-Type': 'application/json',
            }),
        }));
    });
});
//# sourceMappingURL=apiClient.test.js.map