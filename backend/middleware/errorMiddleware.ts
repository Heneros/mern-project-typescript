import { NextFunction,   Request, Response } from 'express';

const errorHandler = (err: Error, req: Request, res: Response) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

     res.status(statusCode).json({
        success: false,
        message: err.message,
        statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFound = (err: Error, req: Request, res: Response, next: NextFunction) => {
   const statusCode = res.statusCode ? res.statusCode : 500;
    const error = new Error(`Route ${req.originalUrl} not found`);

    res.status(statusCode).json({
       success: false,
       message: err.message,
       statusCode,
       stack: process.env.NODE_ENV === 'production' ? null : err.stack,
   });
     next(error);
};
export { notFound, errorHandler };
