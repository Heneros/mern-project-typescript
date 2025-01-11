import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const orderPaySwagger = {
    '/order/{id}/pay': {
        put: {
            tags: ['Order'],
            summary: 'Pay order. Only for authenticated users',
            description: 'Pay order of user.. Only for authenticated users',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    description: 'The id of order.',
                    required: true,
                    schema: {
                        type: 'string',
                        example: '677ebf33531dfb2af7e034c0',
                    },
                },
            ],
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Order paid successfully !',
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
