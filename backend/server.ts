import 'dotenv/config';
import 'module-alias/register';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';
import morgan from 'morgan';
import session from 'express-session';


import { errorHandler, notFound } from './middleware/errorMiddleware';
import { morganMiddleware, systemLogs } from './utils/Logger';

import connectDB from './config/connectDB';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import uploadRoutes from './routes/uploadRoutes';
import propertyRoutes from './routes/propertyRoutes';

import oauthPassport from './config/passportSetup';

const app = express();

// const __dirname = path.resolve();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV !== 'development' },
    }),
);

app.use(passport.initialize());
oauthPassport();

app.use(cookieParser());
app.use(
    cors({
        origin: process.env.DOMAIN,
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

app.use(mongoSanitize());
app.use(morganMiddleware);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/property', propertyRoutes);

const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '..', '..', 'dist', 'frontend');
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('<h1>Dev version running!</h1>');
    });
}
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    try {
        app.listen(port, () => console.log(`Working on ${port} port`));
        if (MONGO_URI) {
            await connectDB(MONGO_URI);
        }
        systemLogs.info(
            `Server on ${port} running. NodeENV: ${process.env.NODE_ENV}  `,
        );
    } catch (error) {
        console.log(`error ${error}`);
        systemLogs.error(`Error happened ${error}  `);
    }
};
startServer();
