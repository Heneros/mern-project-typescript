import express, { Response, Request } from 'express';
import fs from 'fs';

import cloudinaryUploader from '../config/cloudinaryConfig';
import upload from '../helpers/multer';

const router = express.Router();

router
    .route('/')
    .patch(
        upload.single('logo'),
        async (req: Request, res: Response): Promise<void> => {
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
                const result = (await cloudinaryUploader(
                    fileBuffer,
                    originalName,
                )) as { url: string } | undefined;

                if (!result) {
                    res.status(500).json({ message: 'Upload failed' });
                    return;
                }

                if (result.url) {
                    res.send(result.url);
                    return;
                }
                res.status(500).json({
                    message: 'Upload failed, no URL returned',
                });
            } catch (error) {
                console.error('Upload error:', error);
                res.status(500).send({ message: 'Upload failed' });
            }
        },
    );

export default router;
