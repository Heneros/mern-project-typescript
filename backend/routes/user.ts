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
 * /user/profile:
 *   get:
 *     tags:
 *        - User
 *     summary: Retrieve a profile user
 *     description: Only authenticated users can see their profile.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *          example: test1323
 *        description: Access token bearer to request
 *     responses:
 *       200:
 *         description: Profile  success.
 *         content:
 *             application/json:
 *                schema: 
 *                  type: object
 *                  properties:
 *                    id:
 *                     type: string
 *                     description: User ID.
 *                     example: "64bfc36f2f84e2c5c98e4cda"
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
