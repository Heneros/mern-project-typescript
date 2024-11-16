import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// if (!fs.existsSync('./uploads')) {
//     fs.mkdirSync('./uploads');
// }
interface MulterError extends Error {
    code?: string;
    field?: string;
}

const storage = multer.diskStorage({
    // destination(req, file, cb) {
    //     cb(null, './uploads');
    // },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
        );
        // cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkImageType(file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    );

    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }

    cb(
        new Error(
            'Unsupported file format. You can only upload jpeg, jpg, png or gif',
        ),
    );
}

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter(req, file, cb) {
        checkImageType(file, cb);
    },
}).single('logo');

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    message: 'File is too large. Maximum size is 2MB',
                });
            }
            res.status(400).json({
                message: err.message || 'Error uploading file',
            });
        } else if (err) {
            return res.status(400).json({
                message: err.message || 'Error uploading file',
            });
        }
        next();
    });
};

export default handleUpload;
