import express from 'express';
import multer from 'multer';

import checkAuth from '@/backend/middleware/checkAuthMiddleware';
import getUsersForSidebar from '@/backend/controllers/message/getUsersForSidebar';
import getMessages from '@/backend/controllers/message/getMessages';
import sendMessage from '@/backend/controllers/message/sendMessage';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/users').get(checkAuth, getUsersForSidebar);
router.route('/:id').get(checkAuth, getMessages);
router.route('/send/:id').post(checkAuth, upload.single('image'), sendMessage);

export default router;
