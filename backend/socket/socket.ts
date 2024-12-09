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

    // const userId = socket.handshake.query.userId;
    // if (typeof userId === 'string') {
    //     userSocketMap[userId] = socket.id;
    //     console.log(`userSocketMap[userId]`, userSocketMap[userId]);
    // }

    socket.on('setOnlineUser', async (userId) => {
        console.log('setOnlineUser', userId);

        if (typeof userId === 'string') {
            userSocketMap[userId] = socket.id;
            console.log(`User ${userId} is now online`);
        }
        const onlineUsers = Object.keys(userSocketMap);

        const usersWithStatus = await User.find({
            _id: { $in: onlineUsers },
        }).select('_id username avatar');

        const filteredUsers = usersWithStatus?.filter(
            (user) => user._id.toString() !== userId,
        );

        // console.log('Filtered online users for', userId, filteredUsers);

        const socketId = userSocketMap[userId];

        if (socketId) {
            io.to(socketId).emit(
                'getOnlineUsers',
                filteredUsers?.map((user) => ({
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    status: 'online',
                })),
            );
        } else {
            console.log(`Socket ID for user ${userId} not found.`);
        }
        // console.log('onlineUsers', userId);
        // io.to(userId).emit(
        //     'getOnlineUsers',
        //     filteredUsers?.map((user) => ({
        //         _id: user._id,
        //         username: user.username,
        //         avatar: user.avatar,
        //         status: 'online',
        //     })),
        // );
        // userSocketMap[userId] = socket.id;
        // console.log('setOnlineUser', usersWithStatus);
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
