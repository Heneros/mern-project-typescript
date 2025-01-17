import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import User from '../../models/userModel';
import VerificationToken from '../../models/verifyResetTokenModel';
import { sendEmail } from '../../utils/sendEmail';

const domainURL = process.env.DOMAIN;

// $-title   Register User and send email verification link
// $-path    POST /api/v1/auth/register
// $-auth    Public

const registerUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const {
            email,
            username,
            firstName,
            lastName,
            avatar,
            password,
            passwordConfirm,
        } = req.body;

        if (
            !email ||
            !username ||
            !firstName ||
            !lastName ||
            !password ||
            !passwordConfirm
        ) {
            res.status(400).json({
                message:
                    'All fields are required: email, username, firstName, lastName, password, and passwordConfirm',
            });
            return;
        }

        if (!email) {
            res.status(400).json({ message: 'An email address is required' });
            return;
        }

        if (!username) {
            res.status(400).json({ message: 'A username is required' });
            return;
        }

        if (!firstName || !lastName) {
            res.status(400).json({
                message:
                    'You must enter a full name with a first and last name',
            });
            return;
        }

        if (!password) {
            res.status(400).json({ message: 'You must enter a password' });
            return;
        }

        if (!passwordConfirm) {
            res.status(400).json({
                message: 'Confirm password field is required',
            });
            return;
        }

        if (password !== passwordConfirm) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({
                message:
                    "The email address you've entered is already associated with another account",
            });
            return;
        }

        // Create new user
        const newUser = new User({
            email,
            username,
            firstName,
            lastName,
            password,
            avatar:
                avatar ||
                'https://res.cloudinary.com/dmk9uxtiu/image/upload/v1716984705/mernvilla/uploads/logo-1716984210799.jpg.jpg',
        });

        try {
            const registeredUser = await newUser.save();

          
            const verificationToken = randomBytes(32).toString('hex');
            const emailVerificationToken = new VerificationToken({
                _userId: registeredUser._id,
                token: verificationToken,
            });

            await emailVerificationToken.save();

 
            const emailLink = `${domainURL}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;

            const payload = {
                name: registeredUser.firstName,
                link: emailLink,
            };


            await sendEmail(
                registeredUser.email,
                'Account Verification',
                payload,
                './emails/template/accountVerification.handlebars',
            );

            res.status(201).json({
                success: true,
                userId:
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === 'test'
                        ? registeredUser._id
                        : undefined,
                emailToken:
                    process.env.NODE_ENV === 'development' ||
                    process.env.NODE_ENV === 'test'
                        ? emailVerificationToken.token
                        : undefined,
                message: `A new user ${registeredUser.firstName} has been registered! A verification email has been sent to your account. Please verify within 15 minutes.`,
            });
        } catch (error: any) {
            console.error('Error during registration:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
);

export default registerUser;
