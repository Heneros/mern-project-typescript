import 'dotenv/config';
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
import User from '@/models/userModel';
import { UserSocketMap } from '@/types/UserSocketMap';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.DOMAINCORS,
    },
});

const userSocketMap: UserSocketMap = {};

export function getReceiverSocketId(userId: string): string | undefined {
    return userSocketMap[userId];
}

io.on('connection', async (socket) => {
    console.log('A user connected', socket.id);

    const userId = socket.handshake.query.userId as string | undefined;

    const updateUserStatus = async () => {
        const onlineUsers = Object.keys(userSocketMap);
        const allUsers = await User.find().select('_id username avatar');

        const usersWithStatus = allUsers.map((user) => ({
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            status: onlineUsers.includes(user._id.toString())
                ? 'online'
                : 'offline',
        }));
        console.log('getUsers', usersWithStatus);
        io.emit('getUsers', usersWithStatus);
    };
    socket.on('setOnlineUser', async (userId) => {
        // console.log('setOnlineUser', userId);

        if (typeof userId === 'string') {
            userSocketMap[userId] = socket.id;
            console.log(`User ${userId} is now online`);
        }
        await updateUserStatus();
    });

    socket.on('removeOnlineUser', (userId) => {
        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId];
            console.log(`${userId} manually removed`);

            io.emit('getOnlineUsers', Object.keys(userSocketMap));
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
