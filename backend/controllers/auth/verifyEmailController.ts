import asyncHandler from 'express-async-handler';

import User from '@/backend/models/userModel';
import VerifyResetToken from '@/backend/models/verifyResetTokenModel';
import { sendEmail } from '@/backend/utils/sendEmail';
import { systemLogs } from '@/backend/utils/Logger';

const domainURL = process.env.DOMAIN;

const verifyUserEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId }).select(
        '-passwordConfirm',
    );

    try {
        if (!user) {
            res.status(400);
            throw new Error('We were unable to find a user for this token');
        }
        if (user.isEmailVerified) {
            res.status(400).json({
                message: 'This user has already been verified. Please login',
            });
            return;
        }

        const userToken = await VerifyResetToken.findOne({
            _userId: user._id,
            token: req.params.emailToken,
        });

        if (!userToken) {
            res.status(400);
            throw new Error('Token invalid! Your token may have expired');
        }

        user.isEmailVerified = true;
        await user.save();

        if (user.isEmailVerified) {
            const emailLink = `${domainURL}/login`;

            const payload = {
                name: user.firstName,
                link: emailLink,
            };
            await VerifyResetToken.deleteOne({
                _userId: user._id,
                token: req.params.emailToken,
            });

            await sendEmail(
                user.email,
                'Welcome - Account Verified',
                payload,
                './emails/template/welcome.handlebars',
            );

            res.redirect('/auth/verify');
        }
    } catch (error) {
        console.error(error);
        systemLogs.error(error);
    }
});

export default verifyUserEmail;
