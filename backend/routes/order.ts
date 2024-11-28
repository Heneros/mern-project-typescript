import express from 'express';

import createOrder from '@/controllers/payment/createOrder';

const router = express.Router();

router.route('/create-order').post(createOrder);

export default router;
