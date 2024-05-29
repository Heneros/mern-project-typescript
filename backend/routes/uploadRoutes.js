import express from 'express';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import upload from '../helpers/multer.js';

const router = express.Router();

router.route('/').patch(upload.single('logo'), async (req, res) => {
    try {
        const localFilePath = req.file.path;
        const result = await cloudinaryUploader(localFilePath);
        res.send(result.url);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send({ message: 'Upload failed' });
    }
});

export default router;
