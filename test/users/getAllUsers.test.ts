import request from 'supertest';
import jwt from 'jsonwebtoken';
import * as emailService from '@/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import app from '@/server';
import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Get all users admin role ', () => {
    let userToken: string;
    let userTokenWrong: string;

    let adminData;
    beforeAll(async () => {
        await connectTestDB();

        const res = await registerTestUser({ isEmailVerified: true });

        // userToken = res;
        const token = 'abc123';
        await VerifyResetToken.create({
            _userId: res._id,
            token,
        });

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
        it('Should get all users', async () => {
            let arr = [];

            for (let i = 0; i < 4; i += 1) {
                arr.push(registerNotAdmin({ isEmailVerified: true }));
            }

            await Promise.all(arr);

            const response = await request(app)
                .get('/api/v1/user/all')
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .expect(200);

            // console.log(response.body);

            expect(Array.isArray(response.body.users)).toBe(true);
            expect(response.body.users.length).toBeGreaterThan(0);

            response.body.users.forEach((user: IUser) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        _id: expect.any(String),
                        email: expect.any(String),
                        username: expect.any(String),
                        firstName: expect.any(String),
                        lastName: expect.any(String),
                        isEmailVerified: expect.any(Boolean),
                        roles: expect.any(Array),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                );
            });
            // expect(emailService.sendEmail).toHaveBeenCalled();

            // const tokens = await VerifyResetToken.find({ _userId: user._id });
            // expect(tokens).toHaveLength(1);
        });
    });

    describe('Failure Scenarios', () => {
        it('Only admin can see. Forbidden  another user', async () => {
            const user = await registerNotAdmin({ isEmailVerified: true });

            userTokenWrong = jwt.sign(
                { id: user!._id, roles: user!.roles },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '1d' },
            );
            const response = await request(app)
                .get('/api/v1/user/all')
                .set('Authorization', `Bearer ${userTokenWrong}`);
            // .expect(200);

            // console.log(response.body.message);

            expect(response.body).toMatchObject({
                message: 'You are not authorized to perform this request',
                success: false,
            });
        });
        it('Only authorized user can see', async () => {
            // const user = await registerNotAdmin({ isEmailVerified: true });

            // userTokenWrong = jwt.sign(
            //     { id: user!._id, roles: user!.roles },
            //     process.env.JWT_ACCESS_SECRET_KEY!,
            //     { expiresIn: '1d' },
            // );
            const response = await request(app).get('/api/v1/user/all');
            // .set('Authorization', `Bearer ${userTokenWrong}`);

            // console.log(response.body);

            expect(response.body).toMatchObject({
                message: 'Unauthorized',
            });
        });
    });
});
