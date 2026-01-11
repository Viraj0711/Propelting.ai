"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const meetings_1 = __importDefault(require("./routes/meetings"));
const actionItems_1 = __importDefault(require("./routes/actionItems"));
const security_1 = require("./middleware/security");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importStar(require("./lib/logger"));
dotenv_1.default.config();
// Validate environment variables on startup
(0, security_1.validateEnvironment)();
// Log startup
logger_1.default.info('Starting Momentum.ai API server...');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// Apply security middleware
(0, security_1.applySecurityMiddleware)(app);
// HTTP request logging with Morgan
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production'
    ? 'combined'
    : 'dev', { stream: logger_1.stream }));
// Custom request logging and performance monitoring
app.use(errorHandler_1.requestLogger);
app.use(errorHandler_1.performanceMonitor);
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Error handler for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        logger_1.default.error(`JSON Parse Error: ${err.message}`);
        return res.status(400).json({ message: 'Invalid JSON format' });
    }
    next(err);
});
// Routes
app.get('/', (req, res) => {
    res.json({
        name: 'Momentum.ai API',
        version: '1.0.0',
        status: 'running',
        environment: process.env.NODE_ENV || 'development'
    });
});
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.use('/api/v1/auth', security_1.authRateLimiter, auth_1.default);
app.use('/api/v1/meetings', meetings_1.default);
app.use('/api/v1/action-items', actionItems_1.default);
// 404 handler (must be after all routes)
app.use(errorHandler_1.notFoundHandler);
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    logger_1.default.info(`🚀 Server running on http://localhost:${PORT}`);
    logger_1.default.info(`📚 API Documentation: http://localhost:${PORT}/`);
    logger_1.default.info(`🏥 Health check: http://localhost:${PORT}/health`);
    logger_1.default.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map