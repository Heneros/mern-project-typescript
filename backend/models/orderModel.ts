import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                title: { type: String, required: true },
                qty: { type: Number, required: true },
                preview: { type: String, required: true },
                price: { type: Number, required: true },
                property: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Property',
                },
            },
        ],
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
