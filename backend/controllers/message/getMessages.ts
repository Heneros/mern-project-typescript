import asyncHandler from 'express-async-handler';
import User from '@/models/userModel';
import Message from '@/models/chatModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const getMessages = asyncHandler(async (req, res) => {
    const { id: userToChatId } = req.params;
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(400).json({ message: 'Not found Request' });
    }
    const myId = userReq.user._id;
    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
        ],
    });
    res.status(200).json(messages);
});

export default getMessages;
