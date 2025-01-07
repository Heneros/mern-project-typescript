import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const registerUserSwagger = {
    '/auth/register': {
        post: {
            tags: ['Authentication'],
            summary: 'Register user',
            description: 'Registration with confirmation in mail box',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'email',
                                'username',
                                'firstName',
                                'lastName',
                                'password',
                                'passwordConfirm',
                            ],
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'Users email should be unique',
                                    example: 'test4@gmail.com',
                                },
                                username: {
                                    type: 'string',
                                    description:
                                        'Username must be alphanumeric, without special characters. Hyphens and underscores allowed. Also, it should be unique.',
                                    example: 'james1ja',
                                },
                                firstName: {
                                    type: 'string',
                                    description: 'First Name',
                                    example: 'First Name',
                                },
                                lastName: {
                                    type: 'string',
                                    description: 'Last Name',
                                    example: 'Last Name',
                                },
                                password: {
                                    type: 'string',
                                    description: 'Users password',
                                    example: 'password',
                                },
                                passwordConfirm: {
                                    type: 'string',
                                    description: 'Confirm password',
                                    example: 'confirm password',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                201: {
                    description: 'User registered successfully',
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
                                        example:
                                            'Verification email sent. Please verify within 15 minutes.',
                                    },
                                    userId: {
                                        type: 'string',
                                        example: '64f9c7f3e8b2b724708b3456',
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
