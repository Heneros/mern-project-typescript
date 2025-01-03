import asyncHandler from 'express-async-handler';
import User from '../../models/userModel';
import VerificationToken from '../../models/verifyResetTokenModel';
import { sendEmail } from '../../utils/sendEmail';

const domainURL = process.env.DOMAIN;

// $-title   Register User and send email verification link
// $-path    POST /api/v1/auth/register
// $-auth    Public

const registerUser = asyncHandler(async (req, res) => {
    try {
        const {
            email,
            username,
            firstName,
            lastName,
            avatar,
            password,
            passwordConfirm,
        } = req.body;

        const { randomBytes } = await import('crypto');
        if (!email) {
            res.status(400);
            throw new Error('An email address is required');
        }

        if (!username) {
            res.status(400);
            throw new Error('A username is required');
        }
        if (!firstName || !lastName) {
            res.status(400);
            throw new Error(
                'You must enter a full name with a first and last name',
            );
        }

        if (!password) {
            res.status(400);
            throw new Error('You must enter a password');
        }
        if (!passwordConfirm) {
            res.status(400);
            throw new Error('Confirm password field is required');
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error(
                "The email address you've entered is already associated with another account",
            );
        }

        const newUser = new User({
            email,
            username,
            firstName,
            lastName,
            password,
            passwordConfirm,
            avatar:
                avatar ||
                'https://res.cloudinary.com/dmk9uxtiu/image/upload/v1716984705/mernvilla/uploads/logo-1716984210799.jpg.jpg',
        });

        const registeredUser = await newUser.save();

        if (!registeredUser) {
            res.status(400);
            throw new Error('User could not be registered');
        }

        if (registeredUser) {
            const verificationToken = randomBytes(32).toString('hex');

            let emailVerificationToken = await new VerificationToken({
                _userId: registeredUser._id,
                token: verificationToken,
            }).save();

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
                    process.env.NODE_ENV === 'development'
                        ? registeredUser._id
                        : undefined,
                emailToken:
                    process.env.NODE_ENV === 'development'
                        ? emailVerificationToken.token
                        : undefined,
                message: `A new user ${registeredUser.firstName} has been registered! A Verification email has been sent to your account. Please verify within 15 minutes`,
            });
        }
    } catch (error: any) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default registerUser;
