declare class Logger {
    private level;
    private shouldLog;
    private formatMessage;
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, error?: unknown): void;
    private sendToErrorTracking;
}
export declare const logger: Logger;
export declare function logError(error: unknown): void;
export {};
//# sourceMappingURL=logger.d.ts.map