import express from 'express';
import getUserProfile from '../controllers/user/getUserProfile';
import checkAuth from '../middleware/checkAuthMiddleware';
import updateUserProfile from '../controllers/user/updateUserProfile';
import deleteMyAccount from '../controllers/user/deleteMyAccount';
import getAllUserAccounts from '../controllers/user/getAllUserAccounts';
import deleteUserAccount from '../controllers/user/deleteUserAccount';
import deactivateUser from '../controllers/user/deactivateUser';
import role from '../middleware/roleMiddleware';
import getAllUserChats from '@/controllers/user/getAllPublicChat';

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Retrieve a profile user
 *     description: Only authenticated users can see their profile.
 *     responses:
 *       200:
 *         description: Profile  success.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not found
 * */
router.get('/profile', checkAuth, getUserProfile);
router.patch('/profile', checkAuth, updateUserProfile);
router.route('/profile').delete(checkAuth, deleteMyAccount);

router
    .route('/all')
    .get(checkAuth, role.checkRole(role.ROLES.Admin), getAllUserAccounts);

// router.route('/getAllChat').get(checkAuth, getAllUserChats);

router
    .route('/:id')
    .delete(checkAuth, role.checkRole(role.ROLES.Admin), deleteUserAccount);

router
    .route('/:id/deactivate')
    .patch(checkAuth, role.checkRole(role.ROLES.Admin), deactivateUser);

export default router;
