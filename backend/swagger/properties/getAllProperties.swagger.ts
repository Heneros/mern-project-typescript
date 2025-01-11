import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const getAllPropertiesSwagger = {
    '/property': {
        get: {
            tags: ['Properties'],
            summary: 'Get all properties',
            description: 'Only admin can perform this action',
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'The page number to retrieve.',
                    required: false,
                    schema: {
                        type: 'integer',
                        default: 1,
                        example: 1,
                    },
                },
            ],

            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Properties get all successfully',
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
