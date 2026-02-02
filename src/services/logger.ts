import { config } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel = config.logLevel;

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), data);
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), data);
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), data);
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error);
      if (config.isProduction && error instanceof Error) {
        this.sendToErrorTracking(error);
      }
    }
  }

  private sendToErrorTracking(error: Error): void {
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        environment: config.environment,
      };
      console.log('Error would be sent to tracking service:', errorData);
    } catch (err) {
      console.error('Failed to send error to tracking service', err);
    }
  }
}

export const logger = new Logger();

export function logError(error: unknown): void {
  if (error instanceof Error) {
    logger.error(error.message, error);
  } else {
    logger.error('Unknown error occurred', error);
  }
}
