import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '../../models/userModel';
import VerificationToken from '../../models/verifyResetTokenModel';
import { sendEmail } from '@/utils/sendEmail';

const domainURL = process.env.DOMAINVERIFY;

const resendEmailVerificationToken = async (req: any, res: any) => {
    const { email } = req.body;
    const { randomBytes } = await import('crypto');
    const user = await User.findOne({ email });

    if (!email) {
        res.status(400).json({ message: 'An email must be provided' });
        // throw new Error('An email must be provided');
    }

    if (!user) {
        return res.status(400).json({
            message: 'We were unable to find a user with that email address',
        });
        // throw new Error(
        //     'We were unable to find a user with that email address',
        // );
    }

    if (user.isEmailVerified) {
        return res.status(400).json({
            success: false,
            message: 'This account has already been verified. Please login',
        });
        // throw new Error('This account has already been verified. Please login');
    }

    let verificationToken = await VerificationToken.findOne({
        _userId: user._id,
    });

    if (verificationToken) {
        await verificationToken.deleteOne();
    }

    const resetToken = randomBytes(32).toString('hex');

    let emailToken = await new VerificationToken({
        _userId: user._id,
        token: resetToken,
    }).save();

    const emailLink = `${domainURL}/api/v1/auth/verify/${emailToken.token}/${user._id}`;

    const payload = {
        name: user.firstName,
        link: emailLink,
    };

    await sendEmail(
        user.email,
        'Account Verification',
        payload,
        './emails/template/accountVerification.handlebars',
    );

    res.status(200).json({
        success: true,
        message: `${user.firstName}, an email has been sent to your account, please verify within 15 minutes`,
    });
};

export default resendEmailVerificationToken;
