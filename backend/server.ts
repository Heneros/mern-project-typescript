import 'module-alias/register';

import 'dotenv/config';

import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import swaggerUi from 'swagger-ui-express';

import { errorHandler, notFound } from './middleware/errorMiddleware';
import { morganMiddleware, systemLogs } from './utils/Logger';

import connectDB from './config/connectDB';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import uploadRoutes from './routes/uploadRoutes';
import propertyRoutes from './routes/propertyRoutes';
import orderRoutes from './routes/orderRoutes';
import messageRoutes from './routes/messageRoutes';

import oauthPassport from './config/passportSetup';

import { app, server } from './socket/socket';
import { swaggerSpec } from './swagger';

console.log('Server file started in', process.env.NODE_ENV);
// export const app = express();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production'
                ? process.env.DOMAIN!
                : process.env.DOMAINCORS!,
        methods: 'GET,POST,PUT,PATCH, DELETE',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
);
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 14 * 24 * 60 * 60,
        }),
        cookie: { secure: process.env.NODE_ENV !== 'development' },
    }),
);

app.use(passport.initialize());
oauthPassport();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

app.use(mongoSanitize());
app.use(morganMiddleware);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/property', propertyRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/order', orderRoutes);

app.get('/api/v1/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    }),
);

const port = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '..', 'dist', 'frontend');
    ///  console.log('frontendPath', frontendPath);
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('<h1>Dev version running 1!</h1>');
    });
}

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    const startServer = async () => {
        try {
            server.listen(port, () =>
                console.log(
                    `Server on ${port} running. NodeENV: ${process.env.NODE_ENV} `,
                ),
            );
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
}
export { app };
