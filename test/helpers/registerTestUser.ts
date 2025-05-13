import request from 'supertest';
import { app } from '@/server';
import User from '@/models/userModel';


export const registerTestUser = async (overrides = {}) => {
    const defaultUser = {
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
        password: 'validPassword123!',
        passwordConfirm: 'validPassword123!',
        roles: ['User', 'Admin'],
        ...overrides,
    };

    const userData = { ...defaultUser, ...overrides };
    // await request.post('/api/v1/auth/register').send(userData);

    await request(app).post('/api/v1/auth/register').send(userData);

    const user = await User.findOne({ email: userData.email });

    if (!user) {
        throw new Error('User registration failed');
    }

    if (userData.isEmailVerified !== user.isEmailVerified) {
        user.isEmailVerified = userData.isEmailVerified;
        await user.save();
    }

    return user.toObject();
};
