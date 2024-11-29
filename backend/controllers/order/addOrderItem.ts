import { Request, Response } from 'express';
import Property from '@/models/propertiesModel';
import { Model } from 'mongoose';

interface OrderType {
    [_id: string]: string;
}

const addOrderItem = async (req: Request, res: Response) => {
    const { orderItems, paymentMethod } = req.body;
    if (orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
    }
    const itemsFromDB = await Property.find({
        _id: { $in: orderItems.map((x: OrderType) => x._id) },
    });

    const dbOrderItems = orderItems.map(
        (itemFromClient: Model<OrderDocument>) => {
            const matchingItemFromDB = itemsFromDB.find(
                (itemFromDB) =>
                    itemFromDB._id.toString() === itemFromClient._id,
            );
            return {
                ...itemFromClient,
                property: itemFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,
            };
        });

        const {itemsPrice, taxPrice, totalPrice} = 
};
