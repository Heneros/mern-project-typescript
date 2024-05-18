import path from 'path';

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/auth.js';

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'Hello World' });
});

console.log('hello world');

const port = process.env.PORT || 4000;
const MONGO_URI = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongodb/mernvilla`;

const start = async () => {
    try {
        app.listen(port, console.log(`Working on ${port} port`));
        await connectDB(MONGO_URI);
    } catch (error) {
        console.log(`${error}error`);
    }
};
start();
