import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const loginUserSwagger = {
    '/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'Login user',
            description:
                'Log in a user and return access and refresh tokens.  ',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'Users email should be unique',
                                    example: 'test4@gmail.com',
                                },
                                password: {
                                    type: 'string',
                                    description: 'Users password',
                                    example: 'password',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Successful login',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    accessToken: {
                                        type: 'string',
                                        description: 'Access token',
                                        example:
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                    },
                                    refreshToken: {
                                        type: 'string',
                                        example: ' Refresh token.',
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
