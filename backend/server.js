import path from 'path';

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/auth.js';

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

const __dirname = path.resolve();
///
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors());

app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'Hello World' });
});
app.use('/api/v1/auth', authRoutes);

console.log('hello world123');

const port = process.env.PORT || 4000;
// local
const MONGO_URI = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongodb/mernvilla`;
// const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
    try {
        app.listen(port, console.log(`Working on ${port} port`));
        await connectDB(MONGO_URI);
    } catch (error) {
        console.log(`${error}error`);
    }
};
start();
