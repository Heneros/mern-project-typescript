import { Request, Response } from 'express';
import { receiverEmailFunction } from '@/utils/sendEmail';

const feedbackFormController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { name, subject, email, message } = req.body;

        if (!email) {
            res.status(400).json({
                message: 'You must enter your email address',
            });
            return;
        }

        if (!subject) {
            res.status(400).json({ message: 'You must enter subject field' });
            return;
        }

        if (!name) {
            res.status(400).json({ message: 'You must enter name field' });
            return;
        }

        if (!message) {
            res.status(400).json({ message: 'You must enter message field' });
            return;
        }

        const payload = {
            name,
            email,
            message,
            subject,
        };

        const receiverEmail: string | undefined = process.env.AUTHOR_APP;

        if (receiverEmail) {
            // res.status(404);

            await receiverEmailFunction(
                email,
                receiverEmail,
                'Email from user',
                payload,
                './emails/template/messageFromUser.handlebars',
            );
        }
        res.status(201).json({ success: true, message: 'Message was sent!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default feedbackFormController;
