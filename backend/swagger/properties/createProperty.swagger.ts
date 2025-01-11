import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const createPropertySwagger = {
    '/property/create': {
        post: {
            tags: ['Properties'],
            summary: 'Create property',
            description: 'Only admin can perform this action',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['title', 'price'],
                            properties: {
                                title: {
                                    type: 'string',
                                    description:
                                        'ONLY UNIQUE CAN BE. The title of the property',
                                    example: 'Luxury Villa',
                                },
                                price: {
                                    type: 'number',
                                    description: 'The price of the property',
                                    example: 500000,
                                },
                                category: {
                                    type: 'string',
                                    description:
                                        ' The category of the property',
                                    example: 'Residential',
                                },
                                preview: {
                                    type: 'string',
                                    description:
                                        'URL of the property preview image',
                                    example: 'https://example.com/image.jpg',
                                },
                                description: {
                                    type: 'string',
                                    description:
                                        'The description of the property',
                                    example:
                                        'A beautiful villa with ocean view',
                                },
                                bedrooms: {
                                    type: 'number',
                                    description: 'Number of bedrooms',
                                    example: 5,
                                },
                                bathrooms: {
                                    type: 'number',
                                    description: 'Number of bathrooms',
                                    example: 4,
                                },
                                area: {
                                    type: 'number',
                                    description:
                                        ' Area of the property in square meters',
                                    example: 125,
                                },
                                floor: {
                                    type: 'number',
                                    description:
                                        'The floor on which the property is located',
                                    example: 12,
                                },
                                parking: {
                                    type: 'boolean',
                                    description:
                                        'Whether the property has parking',
                                    example: true,
                                },
                                questionsAndAnswers: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            question: {
                                                type: 'string',
                                                description:
                                                    'A question related to the property',
                                            },
                                            answer: {
                                                type: 'string',
                                                description:
                                                    'A answer related to the property',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                201: {
                    description: 'Property created successfully',
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
