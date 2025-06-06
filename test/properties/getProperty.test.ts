import request from 'supertest';
import jwt from 'jsonwebtoken';

import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import { app } from '@/backend/server';
import User from '@/backend/models/userModel';
import VerifyResetToken from '@/backend/models/verifyResetTokenModel';
import { IUser } from '@/backend/types/IUser';
import Property from '@/backend/models/propertiesModel';

jest.mock('@/backend/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Get Property GET /api/v1/property/:id', () => {
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
        await Property.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('should get a property successfully', async () => {
            const property = await Property.create({
                title: 'Old Title',
                price: 100000,
                description: 'Test description',
                category: 'apartment',
                preview: 'qwertyrerwe',
            });

            const res = await request(app)
                .get(`/api/v1/property/${property._id}`)
                .expect(200);

            // console.log(res.body);
            // console.log(res.body.updatedProperty.questionsAndAnswers);

            expect(res.body.success).toBe(true);

            expect(res.body).toHaveProperty('success', true);
            expect(res.body.propertyPage).toMatchObject({
                _id: res.body.propertyPage._id,
                title: 'Old Title',
                price: 100000,
                description: 'Test description',
                category: 'apartment',
                preview: 'qwertyrerwe',
            });
            // expect(res.body.updatedProperty.title).toBe('Updated Title');
            // expect(res.body.updatedProperty.price).toBe(200000);
            // expect(res.body.updatedProperty.questionsAndAnswers).toEqual([
            //     expect.objectContaining({
            //         _id: expect.any(String),
            //         question: 'New question',
            //         answer: 'New Answer',
            //     }),
            // ]);
        });
    });

    describe('Failure Scenarios', () => {
        it('should return 404 not found', async () => {
            const res = await request(app)
                .patch(`/api/v1/property/507f1f77bcf86cd799439011`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'Updated Title',
                    price: 200000,
                    preview: 'qwerty123',
                })
                .expect(404);

            expect(res.body.message).toMatch(/Property not found/i);
        });
    });
});
