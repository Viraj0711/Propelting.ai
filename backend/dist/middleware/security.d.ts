import express from 'express';
/**
 * Security Middleware Configuration
 * Implements comprehensive security best practices
 */
export declare const createRateLimiter: (windowMs?: number, max?: number) => import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
/**
 * Apply all security middleware to Express app
 */
export declare const applySecurityMiddleware: (app: express.Application) => void;
/**
 * Input validation helper
 */
export declare const sanitizeInput: (input: string) => string;
/**
 * Validate environment variables on startup
 */
export declare const validateEnvironment: () => void;
//# sourceMappingURL=security.d.ts.map