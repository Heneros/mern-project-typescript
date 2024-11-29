import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { systemLogs } from '@/utils/Logger';
import { OrderDocument } from '@/types/OrderDocument';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } = process.env;

const generateAccessToken = async () => {
    const auth = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
    ).toString('base64');

    try {
        const response = await axios.post(
            'https://api.sandbox.paypal.com/v1/oauth2/token',
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        return response.data.access_token;
    } catch (error) {
        const err = error as Error;
        systemLogs.error('Failed to generate PayPal access token', err);
        throw new Error('Failed to generate PayPal access token');
        // res.status(500).json({ error: err.message });
    }
};

const checkIfNewTransaction = async (
    res: Response,
    req: Request,
    orderModel: Model<OrderDocument>,
    paypalTransactionId: string,
): Promise<boolean | void> => {
    try {
        const orders = await orderModel.find({
            'paymentResult.id': paypalTransactionId,
        });
        return orders.length === 0;
    } catch (error) {
        const err = error as Error;
        systemLogs.error('checkIfNewTransaction', err);
        res.status(500).json({ error: err.message });
    }
};
const verifyPayPalPayment = async (paypalTransactionId: string) => {
    try {
        const accessToken = await generateAccessToken();
        const paypalResponse: AxiosResponse = await axios.get(
            `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        if (paypalResponse.status !== 200) {
            throw new Error('Failed to verify payment');
        }
        // const paypalData = await paypalResponse.json();
        const paypalData = await paypalResponse.data;

        return {
            verified: paypalData.status === 'COMPLETED',
            value: paypalData.purchase_units[0].amount.value,
        };
    } catch (error) {
        const err = error as Error;
        systemLogs.error('verifyPayPalPayment', err);
    }
};

export { generateAccessToken, checkIfNewTransaction, verifyPayPalPayment };
