import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const idPropertySwagger = {
    '/property/{id}': {
        get: {
            tags: ['Properties'],
            summary: 'Get id property',
            description: 'Only admin can perform this action',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'The id number to retrieve.',
                    required: true,
                    schema: {
                        type: 'string',
                        default: '666720f01ed8af0105a0d444',
                    },
                },
            ],

            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Property get successfully!',
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
        delete: {
            tags: ['Properties'],
            summary: 'Delete by id property',
            description: 'Only admin can perform this action',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'The id number to retrieve.',
                    required: true,
                    schema: {
                        type: 'string',
                        default: '666720f01ed8af0105a0d444',
                    },
                },
            ],

            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Property deleted successfully!',
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
        patch: {
            tags: ['Properties'],
            summary: 'Update property',
            description: 'Only admin can perform this action',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'The id number to retrieve.',
                    required: true,
                    schema: {
                        type: 'string',
                        default: '6782917365f332892541fa0a',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    description:
                                        'The updated title of the property',
                                    example: 'Updated Luxury Villa',
                                },
                                price: {
                                    type: 'number',
                                    description:
                                        'The updated price of the property',
                                    example: 550000,
                                },
                                category: {
                                    type: 'string',
                                    description:
                                        'The updated category of the property',
                                    example: 'Commercial',
                                },
                                preview: {
                                    type: 'string',
                                    description:
                                        'The updated URL of the property preview image',
                                    example:
                                        'https://example.com/updated-image.jpg',
                                },
                                description: {
                                    type: 'string',
                                    description:
                                        'The updated description of the property',
                                    example:
                                        'A newly renovated villa with ocean view',
                                },
                                bedrooms: {
                                    type: 'number',
                                    description:
                                        'The updated number of bedrooms',
                                    example: 6,
                                },
                                bathrooms: {
                                    type: 'number',
                                    description:
                                        'The updated number of bathrooms',
                                    example: 5,
                                },
                                area: {
                                    type: 'number',
                                    description:
                                        'The updated area of the property in square meters',
                                    example: 150,
                                },
                                floor: {
                                    type: 'number',
                                    description:
                                        'The updated floor on which the property is located',
                                    example: 3,
                                },
                                parking: {
                                    type: 'boolean',
                                    description:
                                        'The updated parking availability',
                                    example: false,
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
                                                example:
                                                    'Does the property have a garage?',
                                            },
                                            answer: {
                                                type: 'string',
                                                description:
                                                    'The answer to the question',
                                                example:
                                                    'Yes, it has a garage.',
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
                200: {
                    description: 'Property deleted successfully!',
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
