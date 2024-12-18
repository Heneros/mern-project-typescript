import mongoose, { Document } from 'mongoose';
import { IOrder } from '@/types/IOrderItem';

const orderSchema = new mongoose.Schema<IOrder>(
    {
        orderItems: [
            {
                title: { type: String, required: true },
   
                preview: { type: String, required: true },
                price: { type: Number, required: true },
                property: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Property',
                },
            },
        ],

        user: {
            type: mongoose.Schema.Types.ObjectId,

            required: true,
            ref: 'User',
        },
        paymentMethod: { type: String },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
