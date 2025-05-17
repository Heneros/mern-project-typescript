import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

describe('Delete My account', () => {
    let userToken: string;
    let userTokenWrong: string;

    let userId: string;

    const objData = {
        currentPassword: 'validPassword123!',
        password: 'newPassword',
        passwordConfirm: 'newPassword',
    };

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
            { expiresIn: '31d' },
        );

        await User.updateOne(
            { _id: res._id },
            { $set: { refreshToken: [userToken] } },
        );
    }, 30000);

    beforeEach(async () => {
        // await User.deleteMany({});
        // await VerifyResetToken.deleteMany({});

        const res = await registerTestUser({ isEmailVerified: true });

        userId = res._id.toString();
        // userToken = res;
        const token = 'abc123';
        await VerifyResetToken.create({
            _userId: res._id,
            token,
        });

        userToken = jwt.sign(
            { id: res._id, roles: res.roles },
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '31d' },
        );

        await User.updateOne(
            { _id: res._id },
            { $set: { refreshToken: [userToken] } },
        );
    });

    afterEach(async () => {
        await User.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('Delete my account', async () => {
            const res = await request(app)
                .delete('/api/v1/user/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json');
            //     .send();
            // console.log(res.body);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Your user account has been deleted');

            const deletedUser = await User.findById(userId);
            expect(deletedUser).toBeNull();
        });
    });

    describe('Failure Scenarios', () => {
        it('should fail if no token provided', async () => {
            const res = await request(app)
                .delete('/api/v1/user/profile')
                .send({});
            expect(res.status).toBe(401);
        });
    });
});
