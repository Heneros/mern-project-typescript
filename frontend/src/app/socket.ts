import { io, Socket } from 'socket.io-client';
import { BASE_URL } from 'shared/consts/urls';

const socket = io(BASE_URL, {
    auth: {
        token: localStorage.getItem('user'),
    },
    reconnection: true,
    reconnectionAttempts: 5,
    // // reconnectionDelay: 1000,
    // transports: ['websocket'],
});

// socket.on('connection', () => {
//     console.log('Socket connected');
// });

// socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error);
// });
export default socket;
