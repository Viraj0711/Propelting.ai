"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../routes/auth"));
describe('Auth Routes', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/v1/auth', auth_1.default);
    });
    describe('POST /api/v1/auth/register', () => {
        it('should return 400 if email is missing', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({
                password: 'Test1234!',
                name: 'Test User',
            });
            expect(response.status).toBe(400);
        });
        it('should return 400 if password is too short', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({
                email: 'test@example.com',
                password: '123',
                name: 'Test User',
            });
            expect(response.status).toBe(400);
        });
        it('should validate email format', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({
                email: 'invalid-email',
                password: 'Test1234!',
                name: 'Test User',
            });
            expect(response.status).toBe(400);
        });
    });
    describe('POST /api/v1/auth/login', () => {
        it('should return 400 if credentials are missing', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send({});
            expect(response.status).toBe(400);
        });
        it('should return 401 for invalid credentials', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'WrongPassword123!',
            });
            expect(response.status).toBe(401);
        });
    });
});
//# sourceMappingURL=auth.test.js.map