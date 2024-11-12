import express from 'express';
import getUserProfile from '../controllers/user/getUserProfile';
import checkAuth from '../middleware/checkAuthMiddleware';
import updateUserProfile from '../controllers/user/updateUserProfile';
import deleteMyAccount from '../controllers/user/deleteMyAccount';
import getAllUserAccounts from '../controllers/user/getAllUserAccounts';
import deleteUserAccount from '../controllers/user/deleteUserAccount';
import deactivateUser from '../controllers/user/deactivateUser';
import role from '../middleware/roleMiddleware';

const router = express.Router();

router
    .route('/profile')
    .patch(checkAuth, updateUserProfile)
    .delete(checkAuth, deleteMyAccount);
    
router.get('/profile', checkAuth, getUserProfile);

router
    .route('/all')
    .get(checkAuth, role.checkRole(role.ROLES.Admin), getAllUserAccounts);

router
    .route('/:id')
    .delete(checkAuth, role.checkRole(role.ROLES.Admin), deleteUserAccount);

router
    .route('/:id/deactivate')
    .get(checkAuth, role.checkRole(role.ROLES.Admin), deactivateUser);

export default router;
