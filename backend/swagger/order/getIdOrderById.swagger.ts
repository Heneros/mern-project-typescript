import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const getIdOrderByIdSwagger = {
    '/order/{id}': {
        get: {
            tags: ['Order'],
            summary: 'Get id order. Only for authenticated users',
            description: 'Receive order of user.. Only for authenticated users',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    description: 'The id of order.',
                    required: true,
                    schema: {
                        type: 'string',
                        example: '666720f01ed8af0105a0d444',
                    },
                },
            ],
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Received Order by id successfully',
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
