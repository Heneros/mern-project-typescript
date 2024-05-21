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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'Hello World' });
});
app.use('/api/v1/auth', authRoutes);

console.log('hello world123');

const port = process.env.PORT || 4000;
// local
const MONGO_URITest = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongodb/mernvilla`;
const MONGO_URI = process.env.MONGO_URI;

// PORT=1997

// MONGO_ROOT_USERNAME=3bb8894935d74893907b0e552f50cb9597c6f410fab9b099b69ce3acea89
// MONGO_ROOT_PASSWORD=ce0f697c7ab3a331a185

// MONGO_URI=mongodb+srv://punk60826:5RDsLg75YdWpnV6X@cluster0.7jjv1y5.mongodb.net/mernVilla?retryWrites=true&w=majority

// DOMAIN=http://localhost:8080

// JWT_ACCESS_SECRET_KEY=4f5b4a0c2db99e7f304ab1238f28234759836a359d5708d10c8095fd9030
// JWT_REFRESH_SECRET_KEY=bd1ba2c8956bbc89322d639b0a123173c7ef9e14c1e9acc29c2666cdfc57

const start = async () => {
    try {
        app.listen(port, console.log(`Working on ${port} port`));
        await connectDB(MONGO_URI);
    } catch (error) {
        console.log(`${error}error`);
    }
};
start();
