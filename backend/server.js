import path from 'path';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { morganMiddleware, systemLogs } from './utils/Logger.js';

import connectDB from './config/connectDB.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import uploadRoutes from './routes/uploadRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

import googleAuth from './config/passportSetup.js';

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

const __dirname = path.resolve();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
googleAuth();

app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    }),
);

app.use(mongoSanitize());
app.use(morganMiddleware);

app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'Hello World 3123' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/property', propertyRoutes);

console.log('hello world6666 123');

const port = process.env.PORT;
// local
// const MONGO_URI = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongodb/mernvilla`;
const MONGO_URI = process.env.MONGO_URI;

app.use(notFound);
app.use(errorHandler);

const start = async () => {
    try {
        app.listen(port, console.log(`Working on ${port} port`));
        await connectDB(MONGO_URI);
    } catch (error) {
        console.log(`${error}error`);
    }
};
start();
