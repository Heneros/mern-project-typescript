import express from 'express';

import checkAuth from '@/middleware/checkAuthMiddleware';
import getUsersForSidebar from '@/controllers/message/getUsersForSidebar';
import getMessages from '@/controllers/message/getMessages';
import sendMessage from '@/controllers/message/sendMessage';

const router = express.Router();

router.route('/users').get(checkAuth, getUsersForSidebar);
router.route('/:id').get(checkAuth, getMessages);
router.route('/send/:id').post(checkAuth, sendMessage);

export default router;
