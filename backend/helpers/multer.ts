import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads');
    },
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
});
export default upload;
