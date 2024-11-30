import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '@/models/orderModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'username email')
        .exec();

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    res.status(200).json({ order });
});

export default getOrderById;
