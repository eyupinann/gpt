const request = require('supertest');
const app = require('../index');

describe('Auth Service Test', () => {
    it('should login a chat', async (done) => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Login successful');
        expect(res.body.token).toBeDefined();

        done();
    });
});
