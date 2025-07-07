import request from 'supertest';
import { faker } from '@faker-js/faker';

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

    const updateUser = await User.findByIdAndUpdate(
        user._id,
        { $set: { roles: ['User', 'Admin'] } },
        { new: true },
    );

    return updateUser!.toObject();
};

export const registerNotAdmin = async (overrides = {}) => {
    // const cleaned = n.replace(/[.\-_,]/g, '');

    const username = faker.internet.username().replace(/[.\-_,]/g, '');
    const firstName = faker.internet.displayName().replace(/[.\-_,]/g, '');
    const defaultUser = {
        username,
        email: faker.internet.email(),
        firstName,
        lastName: 'User',
        isEmailVerified: false,
        password: 'validPassword123!',
        passwordConfirm: 'validPassword123!',
        roles: ['User'],
        ...overrides,
    };

    const userData = { ...defaultUser, ...overrides };
    // await request.post('/api/v1/auth/register').send(userData);

    try {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(userData);

        const user = await User.findOne({ email: userData.email });

        if (response.status !== 201) {
            console.error('Registration failed:', {
                status: response.status,
                body: response.body,
            });
            throw new Error('User registration failed');
        }

        if (!user) {
            console.error(
                'User not found in DB after successful response:',
                userData,
            );
            throw new Error('User not found after registration');
        }

        if (userData.isEmailVerified !== user.isEmailVerified) {
            user.isEmailVerified = userData.isEmailVerified;
            await user.save();
        }

        return user.toObject();
    } catch (error) {
        console.error('User not found after registration:', userData);
        console.error('Response:', error);
    }
};
