import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { validateConfig } from './config/env';
import { logger } from './services/logger';

// Validate configuration before app starts
try {
  validateConfig();
  logger.info('Application initialized', {
    environment: import.meta.env.MODE,
  });
} catch (error) {
  logger.error('Configuration validation failed', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui; padding: 20px; background: #f9fafb;">
      <div style="max-width: 500px; text-align: center;">
        <h1 style="color: #dc2626; margin-bottom: 10px;">Configuration Error</h1>
        <p style="color: #666; margin-bottom: 20px;">Please check your environment variables and try again.</p>
        <details style="text-align: left; background: #fee2e2; padding: 15px; border-radius: 6px; border: 1px solid #fecaca;">
          <summary style="cursor: pointer; color: #991b1b; font-weight: 600;">Error Details</summary>
          <pre style="color: #7c2d12; margin-top: 10px; overflow: auto; font-size: 12px;">
${error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
      </div>
    </div>
  `;
  throw error;
}

// Render app with error boundary
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

