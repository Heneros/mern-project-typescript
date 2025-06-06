import express, { Response, Request } from 'express';
import fs from 'fs';

import cloudinaryUploader from '@/backend/config/cloudinaryConfig';
// import upload from '../helpers/multer';
import handleUpload from '@/backend/helpers/multer';

const router = express.Router();

router.route('/').patch(handleUpload, async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({
                message: 'Error during upload file',
            });
            return;
        }

        const localFilePath = req.file.path;
        const originalName = req.file.originalname;
        const fileBuffer = fs.readFileSync(localFilePath);

        //   const result = await cloudinaryUploader(localFilePath);
        const result = await cloudinaryUploader(fileBuffer, originalName);

        fs.unlinkSync(localFilePath);

        if (result) {
            res.json({ image: result.url });
        } else {
            res.status(500).send('Failed to upload image.');
        }
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send({ message: 'Upload failed' });
    }
});

export default router;
