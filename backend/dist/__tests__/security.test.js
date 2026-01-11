"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const security_1 = require("../middleware/security");
describe('Security Middleware', () => {
    const originalEnv = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    describe('validateEnvironment', () => {
        it('should pass with valid JWT_SECRET', () => {
            process.env.JWT_SECRET = 'this-is-a-valid-secret-key-with-more-than-32-characters';
            expect(() => (0, security_1.validateEnvironment)()).not.toThrow();
        });
        it('should throw error if JWT_SECRET is missing', () => {
            delete process.env.JWT_SECRET;
            expect(() => (0, security_1.validateEnvironment)()).toThrow('JWT_SECRET is not defined');
        });
        it('should throw error if JWT_SECRET is too short', () => {
            process.env.JWT_SECRET = 'short';
            expect(() => (0, security_1.validateEnvironment)()).toThrow('JWT_SECRET must be at least 32 characters');
        });
        it('should warn if DATABASE_URL is missing', () => {
            process.env.JWT_SECRET = 'this-is-a-valid-secret-key-with-more-than-32-characters';
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            delete process.env.DATABASE_URL;
            (0, security_1.validateEnvironment)();
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('DATABASE_URL'));
            consoleSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=security.test.js.map