import asyncHandler from 'express-async-handler';
import Message from '@/backend/models/chatModel';
import { RequestWithUser } from '@/backend/types/RequestWithUser';

/// $-title Get all chats
/// $-path GET /api/v1/messages/user
/// $-auth Private

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
