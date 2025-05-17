import request from 'supertest';
import jwt from 'jsonwebtoken';
import * as emailService from '@/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../../helpers/registerTestUser';
import { app } from '@/server';
import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Get user profile', () => {
    let userToken: string;
    let userTokenWrong: string;

    let adminData;
    beforeAll(async () => {
        await connectTestDB();

        const res = await registerTestUser({ isEmailVerified: true });

        userToken = jwt.sign(
            { id: res._id, roles: res.roles },
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '1d' },
        );

        await User.updateOne(
            { _id: res._id },
            { $set: { refreshToken: [userToken] } },
        );

        // console.log(res.roles);
    }, 30000);

    afterEach(async () => {
        await User.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('Should get profile users', async () => {
            const response = await request(app)
                .get('/api/v1/user/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.userProfile).toBeDefined();

            expect(response.body.userProfile).toEqual(
                expect.objectContaining({
                    _id: expect.any(String),
                    email: 'test@example.com',
                    username: 'testuser',
                    firstName: 'Test',
                    lastName: 'User',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            );
        });
    });

    describe('Failure Scenarios', () => {
        it('Only authorized user can see', async () => {
            const response = await request(app).get('/api/v1/user/profile');
            expect(response.body).toMatchObject({
                message: 'Unauthorized',
            });
        });
    });
});
