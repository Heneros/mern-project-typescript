import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import fs from 'fs';

import User from '@/models/userModel';
import Message from '@/models/chatModel';

import { RequestWithUser } from '@/types/RequestWithUser';
import cloudinaryUploader from '@/config/cloudinaryConfig';
import { getReceiverSocketId, io } from '@/socket/socket';

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    let imageUrl = null;
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(400).json({ message: 'Not found Request' });
    }
    const senderId = userReq.user._id;
    if (req.file) {
        const fileBuffer = req.file.buffer;
        const originalName = req.file.originalname;

        try {
            const uploadResponse = await cloudinaryUploader(
                fileBuffer,
                originalName,
            );
            imageUrl = uploadResponse?.url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            res.status(500).json({ message: 'File upload failed' });
            return;
        }
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverId).emit('newMessage', newMessage);
    }
    res.status(201).json(newMessage);
});

export default sendMessage;
