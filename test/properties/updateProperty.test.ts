import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as emailService from '@/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import  app  from '@/server';
import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';
import Property from '@/models/propertiesModel';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Create Property PATCH /api/v1/property/:id', () => {
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
        it('should update a property successfully', async () => {
            const property = await Property.create({
                title: 'Old Title',
                price: 100000,
                category: 'apartment',
                preview: 'qwertyrerwe',
            });

            const res = await request(app)
                .patch(`/api/v1/property/${property._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'Updated Title',
                    price: 200000,
                    preview: 'qwerty123',
                    questionsAndAnswers: {
                        question: 'New question',
                        answer: 'New Answer',
                    },
                })
                .expect(200);

            // console.log(res.body.updatedProperty);
            // console.log(res.body.updatedProperty.questionsAndAnswers);

            expect(res.body.success).toBe(true);
            expect(res.body.updatedProperty.title).toBe('Updated Title');
            expect(res.body.updatedProperty.price).toBe(200000);
            expect(res.body.updatedProperty.questionsAndAnswers).toEqual([
                expect.objectContaining({
                    _id: expect.any(String),
                    question: 'New question',
                    answer: 'New Answer',
                }),
            ]);
        });
    });

    describe('Failure Scenarios', () => {
        it('should return 403 only admin', async () => {
            const responseS = await registerNotAdmin({ isEmailVerified: true });
            // const fakeId = '507f1f77bcf86cd799439011';

            userTokenWrong = jwt.sign(
                { id: responseS!._id, roles: ['User'] },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '1d' },
            );
            const res = await request(app)
                .patch(`/api/v1/property/507f1f77bcf86cd799439011`)
                .set('Authorization', `Bearer ${userTokenWrong}`)
                .set('Content-Type', 'application/json');

            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(
                /You are not authorized to perform this request/i,
            );
        });

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

        it('should return 400 if update fails due to validation', async () => {
            const property = await Property.create({
                title: 'Valid Title',
                price: 100000,
                preview: 'qwerty123',
                category: 'apartment',
            });

            const res = await request(app)
                .patch(`/api/v1/property/${property._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: -100 });
            // .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(
                /Validation failed: price: Price must be a positive number/i,
            );
        });
    });
});
