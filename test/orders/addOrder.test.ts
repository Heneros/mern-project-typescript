import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import * as emailService from '@/backend/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import { app } from '@/backend/server';

import User from '@/backend/models/userModel';
import VerifyResetToken from '@/backend/models/verifyResetTokenModel';
import Property from '@/backend/models/propertiesModel';
import Order from '@/backend/models/orderModel';
import { IOrder } from '@/backend/types/IOrderItem';
import { IUser } from '@/backend/types/IUser';

jest.mock('@/backend/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Create My Order POST /api/v1/orders', () => {
    let userToken: string;
    let userTokenWrong: string;

    let adminData;
    let order: IOrder;
    let resUser: IUser;
    let property: any;

    const objData = {
        currentPassword: 'validPassword123!',
        password: 'newPassword',
        passwordConfirm: 'newPassword',
    };

    beforeAll(async () => {
        await connectTestDB();

        resUser = await registerTestUser({ isEmailVerified: true });

        // userToken = res;
        const token = 'abc123';
        await VerifyResetToken.create({
            _userId: resUser._id,
            token,
        });

        userToken = jwt.sign(
            { id: resUser._id, roles: resUser.roles },
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '31d' },
        );

        await User.updateOne(
            { _id: resUser._id },
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

        property = await Property.create({
            title: 'Test Property',
            price: 100000,
            preview: 'image.jpg',
            address: '123 Street',
        });

        await Order.create({
            user: resUser._id,
            paypalOrderId: 'PAYPAL12345456',
            orderItems: [
                {
                    title: 'Test Property1',
                    preview: 'image.jpg',
                    price: 100000,
                    property: property._id,
                },
            ],
            itemsPrice: 100000,
            taxPrice: 0,
            totalPrice: 100000,
            paymentMethod: 'PayPal',
            isPaid: true,
            paidAt: new Date(),
        });
    });

    afterEach(async () => {
        await Order.deleteMany({});
        await User.deleteMany({});
        await Property.deleteMany({});

        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('should Create order successfully', async () => {
            const res = await request(app)
                .post(`/api/v1/order`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    user: resUser._id,
                    paypalOrderId: `paypal_123456-${Date.now()}`,
                    orderItems: [
                        {
                            title: 'Test Property',
                            preview: 'image.jpg',
                            price: 100000,
                            property: property._id,
                        },
                    ],
                    itemsPrice: 100000,
                    taxPrice: 0,
                    totalPrice: 100000,
                    paymentMethod: 'PayPal',
                    isPaid: true,
                    paidAt: new Date(),
                })
                .expect(201);

            expect(res.body.orderItems).toBeDefined();
            expect(res.body.user).toBeDefined();
            expect(res.body.orderItems).toHaveLength(1);
            expect(res.body._id).toBeDefined();
            // expect(res.body.orderItems._id).toBe(order._id?.toString());
        });
    });

    describe('Failure Scenarios', () => {
        it('should not allow duplicate PayPal orders', async () => {
            await Order.create({
                user: resUser._id,
                paypalOrderId: 'PAYPAL123456',
                orderItems: [
                    {
                        title: 'Test Property',
                        preview: 'image.jpg',
                        price: 100000,
                        property: property._id,
                    },
                ],
                itemsPrice: 100000,
                taxPrice: 0,
                totalPrice: 100000,
                paymentMethod: 'PayPal',
                isPaid: true,
                paidAt: new Date(),
            });

            const res = await request(app)
                .post(`/api/v1/order`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    user: resUser._id,
                    orderItems: [
                        {
                            title: 'Test Property',
                            preview: 'image.jpg',
                            price: 100000,
                            property: property._id,
                        },
                    ],
                    itemsPrice: 100000,
                    taxPrice: 0,
                    totalPrice: 100000,
                    paymentMethod: 'PayPal',
                    paypalOrderId: 'PAYPAL123456',
                    isPaid: true,
                    paidAt: new Date(),
                });

            // console.log(res.body);
            expect(res.status).toBe(400);
            expect(res.body.message).toBe(
                'Order with this PayPal ID already exists',
            );
        });

        it('should fail if no order items are provided', async () => {
            const res = await request(app)
                .post('/api/v1/order')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    orderItems: [],
                    paymentMethod: 'PayPal',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('No order items');
        });

        it('should reject unauthenticated users', async () => {
            const res = await request(app)
                .post('/api/v1/order')
                .send({
                    orderItems: [
                        {
                            property: property._id.toString(),
                            name: 'Test Property',
                            image: 'test.jpg',
                            quantity: 1,
                        },
                    ],
                    paymentMethod: 'PayPal',
                    paypalOrderId: 'NEW123',
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Unauthorized');
        });
    });
});
