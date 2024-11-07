import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    id: string;
    password: string;
    passwordConfirm?: string;
    email: string;
    firstName: string;
    username: string;
    lastName: string;
    refreshToken: string[];
    active: boolean;
    isEmailVerified: boolean;
    // automatedMessagesEnabled: boolean;
    phoneNumber: string;
    provider: string;
    githubId?: string;
    googleID?: string;
    passwordChangedAt?: Date;
    avatar?: string;
    roles: string[];
    matchPassword(enteredPassword: string): Promise<boolean>;
}
