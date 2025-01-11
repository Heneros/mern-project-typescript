import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const createIntentSwagger = {
    '/order/create-payment-intent': {
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
                            required: ['amount', 'orderId'],
                            properties: {
                                amount: {
                                    type: 'number',
                                    example: 1,
                                    description: 'Amount of properties',
                                },
                                orderId: {
                                    type: 'number',
                                    example: '666720f01ed8af0105a0d444',
                                    description:
                                        'The ID of the property being intent.',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Intent create successfully ',
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
