import asyncHandler from 'express-async-handler';
import { receiverEmailFunction } from '../../utils/sendEmail';

const feedbackFormController = asyncHandler(async (req, res) => {
    const {
        name, subject, email, message,
    } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'You must enter your email address' });
    }

    if (!subject) {
        return res.status(400).json({ message: 'You must enter subject field' });
    }

    if (!name) {
        return res.status(400).json({ message: 'You must enter name field' });
    }

    if (!message) {
        return res.status(400).json({ message: 'You must enter message field' });
    }

    const payload = {
        name,
        email,
        message,
        subject,
    };

    const receiverEmail = process.env.AUTHOR_APP;

    await receiverEmailFunction(
        email,
        receiverEmail,
        'Email from user',
        payload,
        './emails/template/messageFromUser.handlebars',
    );

    return res.status(201).json({ success: true, message: 'Message  was sent!' });
});

export default feedbackFormController;
