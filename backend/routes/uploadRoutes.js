import express from 'express';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import upload from '../helpers/multer.js';

const router = express.Router();

router.route('/').patch(upload.single('logo'), async (req, res) => {
    const localFilePatch = req.file.path;

    const result = await cloudinaryUploader(localFilePatch);
    res.send(result.url);
});

export default router;
