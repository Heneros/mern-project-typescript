import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const feedbackSwagger = {
    '/auth/feedback': {
        post: {
            tags: ['Authentication'],
            summary: 'Send feedback form',
            description: 'Send feedback  data form to admin',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'email', 'subject', 'message'],
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'user@example.com',
                                    description:
                                        'The email address of the user.',
                                },
                                subject: {
                                    type: 'string',
                                    example: 'TestSubject',
                                    description:
                                        'Subject to send in header in mail',
                                },
                                message: {
                                    type: 'string',
                                    example: 'Message',
                                    description: 'Message to send in mail body',
                                },
                                name: {
                                    type: 'string',
                                    example: 'Name',
                                    description: 'Name of user',
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
                        'Successfully sent message from feedback form!',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Message was sent!',
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
