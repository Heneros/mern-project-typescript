import { NextFunction, Request, Response } from 'express';

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message,
        statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    res.status(404).json({
        success: false,
        message: error.message,
        statusCode: 404,
    });
    next(error);
};

export { notFound, errorHandler };
