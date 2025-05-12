// import request from 'supertest';
// import * as bcrypt from 'bcrypt';
import { request } from '../server.test';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';

describe('Auth Resend Email', () => {
    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    it('Resend Email success', async () => {
        const userData = {
            username: 'admin',
            email: 'admin@gmail.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'testtest',
            passwordConfirm: 'testtest',
            roles: ['Admin', 'User', 'Editor'],
        };
        const response = await request
            .post('/api/v1/auth/register')
            .send(userData);
        console.log(response.body);
        expect(response.body).toHaveProperty('success', true);
    });
});
