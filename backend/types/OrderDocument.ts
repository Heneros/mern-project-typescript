import { Document, ObjectId } from 'mongoose';

export interface OrderDocument extends Document {
    paymentResult: {
        id: string;
        status: string;
        email_address: string;
        update_time: string;
    };
    [key: string]: any;
    _id: ObjectId;
}
