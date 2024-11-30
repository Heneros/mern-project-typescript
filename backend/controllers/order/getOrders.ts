import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '@/models/orderModel';

const getOrders = asyncHandler(async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id username')
            .exec();
        res.json(orders);
    } catch (error) {
        console.error(error);
    }
});

export default getOrders;
