import { Request, Response } from 'express';
import Property from '@/models/propertiesModel';

const addOrderItem = async (req: Request, res: Response) => {
    const { orderItems, paymentMethod } = req.body;
    if (orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
    }
    const itemsFromDB = await Property.find({
        _id: { $in: orderItems.map((x: string) => x._id) },
    });
};
