import mongoose, { Model } from 'mongoose';
import { Document } from 'mongoose';

export interface IVerifyResetToken extends Document {
    _userId: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
}
const { Schema } = mongoose;

const verifyResetTokenSchema = new Schema<IVerifyResetToken>({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: { type: String, required: true },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 900,
    },
});




const VerifyResetToken: Model<IVerifyResetToken> =
    mongoose.models.VerifyResetToken ||
    mongoose.model<IVerifyResetToken>(
        'VerifyResetToken',
        verifyResetTokenSchema,
    );

export default VerifyResetToken;
