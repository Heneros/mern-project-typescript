import request from 'supertest';

import * as emailService from '../../backend/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import { registerTestUser } from '../helpers/registerTestUser';
import { app } from '@/backend/server';
import User from '@/backend/models/userModel';
import VerifyResetToken from '@/backend/models/verifyResetTokenModel';

jest.mock('@/backend/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('verify Email ', () => {
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
        it('Should verify email', async () => {
            const user = await registerTestUser({ isEmailVerified: false });

            const token = 'abc123';
            await VerifyResetToken.create({
                _userId: user._id,
                token,
            });

            const response = await request(app).get(
                `/api/v1/auth/verify/${token}/${user._id}`,
            );

            expect(response.header.location).toBe('/auth/verify');

            const updatedUser = await User.findById(user._id);
            expect(updatedUser?.isEmailVerified).toBe(true);

            expect(emailService.sendEmail).toHaveBeenCalledWith(
                user.email,
                'Welcome - Account Verified',
                expect.anything(),
                './emails/template/welcome.handlebars',
            );

            const tokenInDb = await VerifyResetToken.findOne({
                _userId: user._id,
                token,
            });
            expect(tokenInDb).toBeNull();
        });
    });

    describe('Failure Scenarios', () => {
        it('should block resend if already verified', async () => {
            const user = await registerTestUser({ isEmailVerified: true });
            const token = 'abc123';

            const res = await request(app).get(
                `/api/v1/auth/verify/${token}/${user._id}`,
            );

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                // success: false,
                message: 'This user has already been verified. Please login',
            });
        });
    });
});
