import supertest from 'supertest';
import { request } from '../server.test';

export const registerTestUser = async () => {
    const defaultUser = {
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
        password: 'validPassword123!',
        passwordConfirm: 'validPassword123!',
        roles: ['User', 'Admin'],
    };

    const userData = { ...defaultUser };
    await request.post('/api/v1/auth/register').send(userData);
    return userData;
};
