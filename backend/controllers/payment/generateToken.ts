import axios from 'axios';
import { Request, Response } from 'express';
import { systemLogs } from '@/utils/Logger';

const generateAccessToken = async (res: Response, req: Request) => {
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

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
        res.status(500).json({ error: err.message });
    }
};

export default generateAccessToken;
