import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const resendEmailTokenSwagger = {
    '/auth/resend_email_token': {
        post: {
            tags: ['Authentication'],
            summary: 'resend email token to user',
            description:
                'Resend an email verification token to the user if the email is not yet verified  ',
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
                                            'USERNAME,  an email has been sent to your account, please verify within 15 minutes',
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
