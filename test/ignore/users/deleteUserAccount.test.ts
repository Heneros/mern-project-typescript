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

describe('Delete User account /api/v1/user/:id', () => {
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
    });

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
        it('Delete user account', async () => {
            const responseS = await registerNotAdmin({ isEmailVerified: true });

            const res = await request(app)
                .delete(`/api/v1/user/${responseS!._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json');
            //     .send();
            // console.log(res.body);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(
                `User ${responseS!.firstName} deleted successfully`,
            );

            const deletedUser = await User.findById(responseS?._id);
            expect(deletedUser).toBeNull();
        });
    });

    describe('Failure Scenarios', () => {
        it('should return 404 if user not found', async () => {
            // const responseS = await registerNotAdmin({ isEmailVerified: true });
            // const fakeId = '507f1f77bcf86cd799439011';

            const res = await request(app)
                .delete(`/api/v1/user/507f1f77bcf86cd799439011`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/user not found/i);
        });

        it('should return 403 only admin', async () => {
            const responseS = await registerNotAdmin({ isEmailVerified: true });
            // const fakeId = '507f1f77bcf86cd799439011';

            userTokenWrong = jwt.sign(
                { id: responseS!._id, roles: ['User'] },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '1d' },
            );
            const res = await request(app)
                .delete(`/api/v1/user/507f1f77bcf86cd799439011`)
                .set('Authorization', `Bearer ${userTokenWrong}`)
                .set('Content-Type', 'application/json');

            // console.log(res.body);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(
                /You are not authorized to perform this request/i,
            );
        });
    });
});
