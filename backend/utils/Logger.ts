import { Request, Response } from 'express';
import morgan from 'morgan';
import { createLogger, format, transports } from 'winston';
import TransportStream from 'winston-transport';

const { combine, timestamp, prettyPrint, json } = format;
const isProd = process.env.NODE_ENV === 'production';

const loggerTransports: TransportStream[] = [
    new transports.Console({
        level: isProd ? 'info' : 'http',
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            isProd ? json() : prettyPrint(),
        ),
    }),
];

if (process.env.NODE_ENV === 'development') {
    const { DailyRotateFile } = require('winston-daily-rotate-file');

    loggerTransports.push(
        new DailyRotateFile({
            level: 'http',
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            zippedArchive: true,
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                json(),
            ),
        }),
        new transports.File({
            level: 'error',
            filename: 'logs/error.log',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                json(),
            ),
        }),
    );
}

export const systemLogs = createLogger({
    level: isProd ? 'info' : 'http',
    transports: loggerTransports,
    ...(!isProd && {
        exceptionHandlers: [
            new transports.File({ filename: 'logs/exception.log' }),
        ],
        rejectionHandlers: [
            new transports.File({ filename: 'logs/rejections.log' }),
        ],
    }),
});

export const morganMiddleware = morgan(
    (tokens, req: Request, res: Response) =>
        JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number(tokens.status(req, res)),
            content_length: tokens.res(req, res, 'content-length'),
            response_time: tokens['response-time'](req, res),
        }),
    {
        stream: {
            write: (message: string) => {
                try {
                    const data = JSON.parse(message);
                    systemLogs.http('incoming-request', data);
                } catch {}
            },
        },
    },
);
