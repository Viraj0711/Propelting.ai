"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDatabaseError = exports.performanceMonitor = exports.requestLogger = exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../lib/logger"));
/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error
    logger_1.default.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // Set status code
    const statusCode = err.status || err.statusCode || 500;
    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: process.env.NODE_ENV === 'production' && statusCode === 500
                ? 'Internal server error'
                : err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};
exports.errorHandler = errorHandler;
/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    logger_1.default.warn(`404 - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.originalUrl} not found`,
        },
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Async handler wrapper
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - ${req.ip}`;
        if (res.statusCode >= 500) {
            logger_1.default.error(message);
        }
        else if (res.statusCode >= 400) {
            logger_1.default.warn(message);
        }
        else {
            logger_1.default.http(message);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
/**
 * Performance monitoring middleware
 */
const performanceMonitor = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        // Log slow requests (> 1 second)
        if (duration > 1000) {
            logger_1.default.warn(`Slow request detected: ${req.method} ${req.originalUrl} took ${duration}ms`);
        }
        // Log very slow requests (> 5 seconds)
        if (duration > 5000) {
            logger_1.default.error(`Very slow request: ${req.method} ${req.originalUrl} took ${duration}ms`);
        }
    });
    next();
};
exports.performanceMonitor = performanceMonitor;
/**
 * Database error handler
 */
const handleDatabaseError = (error) => {
    logger_1.default.error(`Database error: ${error.message}`);
    // Prisma errors
    if (error.code) {
        switch (error.code) {
            case 'P2002':
                const err = new Error('A record with this value already exists');
                err.status = 409;
                return err;
            case 'P2025':
                const notFoundErr = new Error('Record not found');
                notFoundErr.status = 404;
                return notFoundErr;
            default:
                const dbErr = new Error('Database operation failed');
                dbErr.status = 500;
                return dbErr;
        }
    }
    const genericErr = new Error('Database error occurred');
    genericErr.status = 500;
    return genericErr;
};
exports.handleDatabaseError = handleDatabaseError;
//# sourceMappingURL=errorHandler.js.map