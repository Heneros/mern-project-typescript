import fs from 'fs';
import multer from 'multer';
import path from 'path';

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads');
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
        // cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },

});

function checkImageType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } cb('Unsupported file format. You can only upload jpeg, jpg and png');
}

const upload = multer({
    storage,
 	limits: { fileSize: 1024 * 1024 },
    fileFilter(req, file, cb) {
        checkImageType(file, cb);
    },
});
export default upload;
