import { confirmPaymentSwagger } from './order/confirmPayment.swagger';
import { createCheckoutSwagger } from './order/createCheckoutSession.swagger';
import { createIntentSwagger } from './order/createPaymentIntent.swagger';
import { getAndAddMyOrdersSwagger } from './order/getAndAddMyOrders.swagger';
import { getIdOrderByIdSwagger } from './order/getIdOrderById.swagger';
import { orderPaySwagger } from './order/orderPay.swagger';

export const ordersSwagger = {
    ...getAndAddMyOrdersSwagger,
    ...getIdOrderByIdSwagger,
    ...orderPaySwagger,
    ...createIntentSwagger,
    ...confirmPaymentSwagger,
    ...createCheckoutSwagger,
};
