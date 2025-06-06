import express from 'express';
import checkAuth from '@/backend/middleware/checkAuthMiddleware';
import role from '@/backend/middleware/roleMiddleware';
import addOrderItem from '@/backend/controllers/order/addOrderItem';
import getMyOrders from '@/backend/controllers/order/getMyOrders';
import getOrderById from '@/backend/controllers/order/getOrderById';
import updateOrderToPaid from '@/backend/controllers/order/updateOrderToPaid';
import {
    confirmPayment,
    createCheckoutSession,
    createIntent,
} from '@/backend/utils/stripe';

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
