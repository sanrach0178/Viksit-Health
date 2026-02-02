import { config } from '../config/env';
class Logger {
    constructor() {
        Object.defineProperty(this, "level", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config.logLevel
        });
    }
    shouldLog(level) {
        const levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };
        return levels[level] >= levels[this.level];
    }
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }
    debug(message, data) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message), data);
        }
    }
    info(message, data) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message), data);
        }
    }
    warn(message, data) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message), data);
        }
    }
    error(message, error) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message), error);
            if (config.isProduction && error instanceof Error) {
                this.sendToErrorTracking(error);
            }
        }
    }
    sendToErrorTracking(error) {
        try {
            const errorData = {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                environment: config.environment,
            };
            console.log('Error would be sent to tracking service:', errorData);
        }
        catch (err) {
            console.error('Failed to send error to tracking service', err);
        }
    }
}
export const logger = new Logger();
export function logError(error) {
    if (error instanceof Error) {
        logger.error(error.message, error);
    }
    else {
        logger.error('Unknown error occurred', error);
    }
}
//# sourceMappingURL=logger.js.map