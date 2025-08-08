import 'dotenv/config';
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import User from '@/models/userModel';
import { UserSocketMap } from '@/types/UserSocketMap';
import Message from '@/models/chatModel';

const app = express();

const server = http.createServer(app);

const domain = process.env.DOMAIN;

const io = new Server(server, {
    cors: {
        origin:
            process.env.NODE_ENV === 'production'
                ? domain
                : process.env.DOMAINCORS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT'],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
});

const userSocketMap: UserSocketMap = {};

export function getReceiverSocketId(userId: string): string | undefined {
    return userSocketMap[userId];
}

io.on('connection', async (socket) => {
    console.log('A user connected', socket.id);

    //   const userId = socket.handshake.query.userId as string | undefined;
    const userId =
        (socket.handshake.auth && socket.handshake.auth.userId) ||
        (socket.handshake.query && socket.handshake.query.userId);

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('newMessage', (data, id) => {
        socket.broadcast.emit('newMessage', data);
    });

    const updateUserStatus = async (userId: string) => {
        const onlineUsers = Object.keys(userSocketMap);
        const allUsers = await User.find({ _id: { $ne: userId } }).select(
            '_id username avatar',
        );

        const filteredUsers = allUsers?.filter(
            (item) => item._id.toString() !== userId,
        );

        const usersWithStatus = filteredUsers.map((user) => ({
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            status: onlineUsers.includes(user._id.toString())
                ? 'online'
                : 'offline',
        }));
        /// console.log('getUsers', usersWithStatus);
        //  io.to()emit('getUsers', usersWithStatus);
        io.emit('getUsers', usersWithStatus);
    };
    socket.on('setOnlineUser', async (userId) => {
        // console.log('setOnlineUser', userId);

        if (typeof userId === 'string') {
            userSocketMap[userId] = socket.id;
            console.log(`User ${userId} is now online`);
            await updateUserStatus(userId);
        }
    });

    socket.on('join_room', async (roomId) => {
        if (roomId) {
            socket.join(roomId);
        } else {
            console.log(' error join_room');
        }
    });

    socket.on('sendMessage', async (formData) => {
        try {
            const { id: chatId, senderId, receiverId, text, image } = formData;

            console.log('Received message in backend:', formData);

            const newMessage = await Message.create({
                chatId,
                senderId,
                receiverId,
                text,
                image,
            });

            io.to(chatId).emit('receiveMessage', newMessage);

            console.log('Message emitted successfully');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }

        console.log('A user disconnected', socket.id);

        // if (userId) delete userSocketMap[userId];
    });
});

export { io, app, server };
