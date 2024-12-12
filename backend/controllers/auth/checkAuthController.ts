import { Request, Response } from 'express';

const checkAuthController = (req: Request, res: Response) => {
    try {
        res.status(200).json(req.user);
    } catch (error: any) {
        console.log('Error in checkAuth controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default checkAuthController;
