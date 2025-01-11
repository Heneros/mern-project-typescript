import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const createCheckoutSwagger = {
    '/order/create-checkout-session': {
        post: {
            tags: ['Order'],
            summary: 'Create session for order . Only for authenticated users',
            description:
                'Create session for order.. Only for authenticated users',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['items', '_id'],
                            properties: {
                                items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        required: ['title', 'preview', 'price'],
                                        properties: {
                                            title: {
                                                type: 'string',
                                                example: 'titleP',
                                                description:
                                                    'The title of the item.',
                                            },
                                            preview: {
                                                type: 'string',
                                                // format: 'uri',
                                                example: 'preview_string',
                                                description:
                                                    'URL of the item image.',
                                            },
                                            price: {
                                                type: 'number',
                                                example: 213,
                                                description:
                                                    'Price of the item in USD.',
                                            },
                                        },
                                    },
                                    minItems: 1,
                                },
                                _id: {
                                    type: 'string',
                                    example: '677ebf33531dfb2af7e034c0',
                                    description:
                                        'The unique identifier of the order.',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Checkout session was created successfully!',
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
