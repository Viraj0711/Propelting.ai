"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mock environment variables for tests
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-minimum-32-characters-long';
process.env.NODE_ENV = 'test';
// Setup global test utilities
global.console = {
    ...console,
    // Uncomment to suppress console output during tests
    // log: jest.fn(),
    // error: jest.fn(),
    // warn: jest.fn(),
};
// Global teardown
afterAll(async () => {
    // Close database connections if needed
});
//# sourceMappingURL=setup.js.map