import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const verifyEmailSwagger = {
    '/auth/verify/{emailToken}/{userId}': {
        post: {
            tags: ['Authentication'],
            summary: 'Verify user email',
            description: 'Registration with confirmation in mail box',
            parameters: [
                {
                    in: 'path',
                    name: 'emailToken',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Email verification token.',
                },
                {
                    in: 'path',
                    name: 'userId',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID.',
                },
            ],
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Email verified successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true,
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Email verified successfully.',
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
