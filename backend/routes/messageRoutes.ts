import express from 'express';
import multer from 'multer';

import checkAuth from '@/middleware/checkAuthMiddleware';
import getUsersForSidebar from '@/controllers/message/getUsersForSidebar';
import getMessages from '@/controllers/message/getMessages';
import sendMessage from '@/controllers/message/sendMessage';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
/**
 * @swagger
 * /messages/users:
 *   get:
 *    tags:
 *      - Message
 *    summary: Get users list
 *    description: Get users list for chat
 */

router.route('/users').get(checkAuth, getUsersForSidebar);
router.route('/:id').get(checkAuth, getMessages);
router.route('/send/:id').post(checkAuth, upload.single('image'), sendMessage);

export default router;
