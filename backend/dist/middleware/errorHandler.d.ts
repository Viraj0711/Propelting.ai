import { Request, Response, NextFunction } from 'express';
interface ErrorWithStatus extends Error {
    status?: number;
    statusCode?: number;
}
/**
 * Error handling middleware
 */
export declare const errorHandler: (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => void;
/**
 * 404 Not Found handler
 */
export declare const notFoundHandler: (req: Request, res: Response) => void;
/**
 * Async handler wrapper
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Request logging middleware
 */
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Performance monitoring middleware
 */
export declare const performanceMonitor: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Database error handler
 */
export declare const handleDatabaseError: (error: any) => ErrorWithStatus;
export {};
//# sourceMappingURL=errorHandler.d.ts.map