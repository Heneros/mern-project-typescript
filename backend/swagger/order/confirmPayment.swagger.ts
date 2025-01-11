import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const confirmPaymentSwagger = {
    '/order/confirm-payment': {
        post: {
            tags: ['Order'],
            summary:
                'Create Payment Intent order. Only for authenticated users',
            description: 'Create Payment Intent order. Functionality Stripe. ',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['paymentIntentId'],
                            properties: {
                                paymentIntentId: {
                                    type: 'string',
                                    example:
                                        'pi_3Qf4bXIDfKx1lWo40JRMJAfx_secret_8k2YYHndfkufRLKiiIbRma3t2',
                                    description:
                                        'Unique identificator for Stripe',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Payment confirmed successfully ',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true,
                                    },
                                },
                            },
                        },
                    },
                },
                ...internalServerErrorResponse,
            },
        },
    },
};
