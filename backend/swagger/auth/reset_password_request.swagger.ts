import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const resetPasswordRequestSwagger = {
    '/auth/reset_password_request': {
        post: {
            tags: ['Authentication'],
            summary: 'Resend email token to user',
            description:
                'Reset Password request should send an email to user to reset password.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email'],
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'Users email should be unique',
                                    example: 'test4@gmail.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                200: {
                    description:
                        'Successfully sent a new email verification link to your email.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    accessToken: {
                                        type: 'string',
                                        description: 'Access token',
                                        example:
                                            '"USERNAME, an email has been sent to your account with the password reset link',
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
