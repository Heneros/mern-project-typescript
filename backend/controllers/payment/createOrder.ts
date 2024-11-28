import axios from 'axios';
import { Request, Response } from 'express';
import { systemLogs } from '@/utils/Logger';
import generateAccessToken from './generateToken';

const createOrder = async (req: Request, res: Response) => {
    try {
        const accessToken = await generateAccessToken();
        const response = await axios.post(
            'https://api.sandbox.paypal.com/v2/checkout/orders',
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: req.body.amount,
                        },
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        res.json(response.data);
    } catch (error: any) {
        systemLogs.error('createOrder', error);
        res.status(500).json({ error: error.message });
    }
};

export default createOrder;
