import express from 'express';
import checkAuth from '@/middleware/checkAuthMiddleware';
import role from '@/middleware/roleMiddleware';
import addOrderItem from '@/controllers/order/addOrderItem';
import getMyOrders from '@/controllers/order/getMyOrders';
import getOrderById from '@/controllers/order/getOrderById';
import updateOrderToPaid from '@/controllers/order/updateOrderToPaid';

const router = express.Router();

router
    .route('/')
    .post(checkAuth, role.checkRole(role.ROLES.User), addOrderItem);

router.route('/').get(checkAuth, role.checkRole(role.ROLES.User), getMyOrders);

router
    .route('/:id')
    .get(checkAuth, role.checkRole(role.ROLES.User), getOrderById);
router
    .route('/:id/pay')
    .get(checkAuth, role.checkRole(role.ROLES.User), updateOrderToPaid);

export default router;
