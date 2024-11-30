import asyncHandler from 'express-async-handler';
import User from '@/models/userModel';
import Message from '@/models/chatModel';

import { RequestWithUser } from '@/types/RequestWithUser';

const sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    let imageUrl;
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(400).json({ message: 'Not found Request' });
    }
    const myId = userReq.user._id;
});

export default sendMessage;
