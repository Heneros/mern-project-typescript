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

describe('Update My account', () => {
    let userToken: string;
    let userTokenWrong: string;

    let adminData;

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
        it('Update password', async () => {
            const res = await request(app)
                .patch('/api/v1/user/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .send(objData)
                .expect(200);
            // console.log(res.body);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain(
                'your profile was successfully updated',
            );

            const updatedUser = await User.findById(
                res.body.updatedProfile._id,
            ).select('+password');

            const isMatch = await bcrypt.compare(
                objData.password,
                updatedUser!.password,
            );

            expect(isMatch).toBe(true);
        });

        it('Update name and username', async () => {
            const res = await request(app)
                .patch('/api/v1/user/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    currentPassword: objData.currentPassword,
                    username: 'James',
                });

            // console.log('  123  objData.password;', objData!.password);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            // expect(res.body.success).toBe(true);
            expect(res.body.message).toContain(
                'your profile was successfully updated',
            );
            expect(res.body.updatedProfile.username).toBe('James');
        });
    });

    describe('Failure Scenarios', () => {
        it('should fail if no token provided', async () => {
            const res = await request(app)
                .patch('/api/v1/user/profile')
                .send({});
            expect(res.status).toBe(401);
        });

        it('should fail if new password and confirmation do not match', async () => {
            const res = await request(app)
                .patch('/api/v1/user/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: 'originalPassword',
                    password: 'NewPassword123!',
                    passwordConfirm: 'MismatchPassword!',
                });
            console.log(res.body);
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Current password is incorrect');
        });
    });
});
