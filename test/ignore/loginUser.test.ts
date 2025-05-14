import request from 'supertest';
// import * as emailService from '../../backend/utils/sendEmail';
import { app } from '@/server';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import { registerTestUser } from '../helpers/registerTestUser';
import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';

// jest.mock('@/utils/sendEmail', () => ({
//     receiverEmailFunction: jest.fn().mockResolvedValue(true),
// }));

describe('Login user ', () => {
    beforeAll(async () => {
        await connectTestDB();
    }, 30000);

    afterEach(async () => {
        await User.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('Should Login user ', async () => {
            const user = await registerTestUser({ isEmailVerified: true });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: user.email,
                    password: 'validPassword123!',
                });

            // console.log(response.body);

            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.headers['set-cookie']).toBeDefined();

            // console.log(cookies);
            const raw = response.headers['set-cookie'];

            let cookies: string[];
            if (Array.isArray(raw)) {
                cookies = raw;
            } else {
                cookies = [];
            }
            expect(cookies.some((c) => c.startsWith('jwtVilla='))).toBe(true);
        });
    });

    describe('Failure Scenarios', () => {
        it('Should return Invalid credentials', async () => {
            const obj = {
                email: '',
                password: 'qwerty.',
            };
            const res = await request(app).post('/api/v1/auth/login').send(obj);
            //     console.log(res.body);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: 'Please provide an email and password',
            });
        });
        it('Should return user not found', async () => {
            const obj = {
                email: 'notExist@gmail.com',
                password: 'qwerty.',
            };
            const res = await request(app).post('/api/v1/auth/login').send(obj);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: 'Invalid credentials provided',
            });
        });
        it('should not send email if many requests', async () => {
            const user = await registerTestUser({ isEmailVerified: true });

            const feedbackReq = [];
            for (let i = 0; i < 9; i += 1) {
                feedbackReq.push(
                    request(app).post('/api/v1/auth/login').send({
                        email: user.email,
                        password: 'validPassword123!',
                    }),
                );
            }
            await Promise.all(feedbackReq);
            const blockedRes = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: user.email,
                    password: 'validPassword123!',
                });
            expect(blockedRes.status).toBe(429);
            expect(blockedRes.body).toEqual({
                message: 'Too many requests from this IP address',
            });
        });
    });
});
