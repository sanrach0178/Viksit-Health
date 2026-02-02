export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  logLevel: (import.meta.env.VITE_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
};

export function validateConfig(): void {
  if (!config.apiUrl) {
    throw new Error('VITE_API_URL is not set');
  }
}
