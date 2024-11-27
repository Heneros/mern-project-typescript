import 'dotenv/config';
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
import User from '@/models/userModel';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN,
    },
});

const userSocketMap: UserSocketMap = {};

export function getReceiverSocketId(userId: string): string | undefined {
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log('A user cnnected', socket.id);

    const userId = socket.handshake.query.userId as string | undefined;

    // const userId = socket.handshake.query.userId;
    if (typeof userId === 'string') {
        userSocketMap[userId] = socket.id;
        console.log('userSocketMap[userId]', userSocketMap[userId]);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
        if (userId) delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});
