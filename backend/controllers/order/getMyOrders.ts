import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '@/models/orderModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;
    if (!userReq.user) {
        res.status(404).json({ message: 'Not user found Request' });
        //   return;
    }

    const userId = userReq.user._id;
    const orders = await Order.find({ user: userId }).exec();
    res.status(200).json({ orders });
});

export default getMyOrders;
