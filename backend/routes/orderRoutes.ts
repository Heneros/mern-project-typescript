import express from 'express';
import checkAuth from '@/middleware/checkAuthMiddleware';
import role from '@/middleware/roleMiddleware';
import addOrderItem from '@/controllers/order/addOrderItem';
import getMyOrders from '@/controllers/order/getMyOrders';
import getOrderById from '@/controllers/order/getOrderById';
import updateOrderToPaid from '@/controllers/order/updateOrderToPaid';
import {
    confirmPayment,
    createCheckoutSession,
    createIntent,
} from '@/utils/stripe';

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
    .put(checkAuth, role.checkRole(role.ROLES.User), updateOrderToPaid);

router
    .route('/create-payment-intent')
    .post(checkAuth, role.checkRole(role.ROLES.User), createIntent);

router
    .route('/confirm-payment')
    .post(checkAuth, role.checkRole(role.ROLES.User), confirmPayment);

router
    .route('/create-checkout-session')
    .post(checkAuth, role.checkRole(role.ROLES.User), createCheckoutSession);
export default router;
