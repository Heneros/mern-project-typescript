import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const resetPasswordSwagger = {
    '/auth/reset_password': {
        post: {
            tags: ['Authentication'],
            summary: 'Reset Password',
            description: 'Allows a user to reset their password using a token.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'password',
                                'passwordConfirm',
                                'userId',
                                'emailToken',
                            ],
                            properties: {
                                password: {
                                    type: 'string',
                                    format: 'password',
                                    example: 'StrongPass123!',
                                    description:
                                        'The new password for the user.',
                                },
                                passwordConfirm: {
                                    type: 'string',
                                    format: 'password',
                                    example: 'StrongPass123!',
                                    description:
                                        'Confirmation of the new password.',
                                },
                                token: {
                                    type: 'string',
                                    example: '64f50a60f89d874e12345678',
                                    description:
                                        'The unique ID of the user requesting the reset.',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Password reset was successfully!',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: {
                                        type: 'string',
                                        example:
                                            'Hey User, Your password reset was successful. An email has been sent to confirm the same',
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
