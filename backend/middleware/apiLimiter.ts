import rateLimit from 'express-rate-limit';
import { systemLogs } from '../utils/Logger';

export const apiLimiter = rateLimit({
    windowMs: 17 * 600 * 1000,
    max: 5,
    message: {
        message: 'Too many requests from this IP address',
    },
    handler: (req, res, next, options) => {
        systemLogs.error(
            `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        );
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 17 * 600 * 1000,
    max: 10,
    message: {
        message: 'Too many requests from this IP address',
    },
    handler: (req, res, next, options) => {
        systemLogs.error(
            `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        );
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});
