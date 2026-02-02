import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger, logError } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log info messages', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('Test message', { data: 'test' });
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain('TEST MESSAGE');
    consoleSpy.mockRestore();
  });

  it('should log error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('Test error');
    logger.error('Error occurred', testError);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log errors with logError helper', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('Test error');
    logError(testError);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle non-Error objects in logError', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logError({ message: 'Custom error' });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
