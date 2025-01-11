import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const getAndAddMyOrdersSwagger = {
    '/order': {
        get: {
            tags: ['Order'],
            summary: 'Get users orders. Only for authenticated users',
            description: 'Receive users orders.. Only for authenticated users',
            // requestBody: {
            //     required: true,
            //     content: {
            //         'application/json': {
            //             schema: {
            //                 type: 'object',
            //                 properties: {},
            //             },
            //         },
            //     },
            // },
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Received Orders successfully',
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
        post: {
            tags: ['Order'],
            summary: 'Add item to order. Only for authenticated users',
            description: 'Add villas to order. Only for authenticated users',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['orderItems', 'paymentMethod'],
                            properties: {
                                orderItems: {
                                    type: 'array',
                                    description: 'List of items in the order.',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            title: {
                                                type: 'string',
                                                example:
                                                    '666720f01ed8af0105a0d444',
                                                description:
                                                    'The ID of the property being ordered.',
                                            },
                                            preview: {
                                                type: 'string',
                                                example: 'titleString',
                                                description: 'Property title',
                                            },
                                            property: {
                                                type: 'string',
                                                example:
                                                    '666720f01ed8af0105a0d444',
                                                description:
                                                    'The ID of the property being ordered.',
                                            },
                                            // _id:{

                                            // }
                                            price: {
                                                type: 'number',
                                                example: 212,
                                                description:
                                                    'The ID of the property being ordered.',
                                            },
                                        },
                                    },
                                },
                                paymentMethod: {
                                    type: 'string',
                                    description:
                                        'Payment method used for the order.',
                                    example: 'PayPal',
                                },
                                paypalOrderId: {
                                    type: 'string',
                                    description:
                                        'PayPal order ID for the transaction.',
                                    example: 'PAYID-1234567890',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                201: {
                    description: 'Order created successfully',
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
