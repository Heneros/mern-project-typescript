import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const profileSwagger = {
    '/user/profile': {
        get: {
            tags: ['User'],
            summary: 'Retrieve a profile user ',
            description: 'Only authenticated users can see their profile.',
            // parameters: [
            //     {
            //         in: 'header',
            //         name: 'Authorization',
            //         schema: {
            //             type: 'string',
            //             example: 'ree32wew12re4534....',
            //         },
            //         description: 'Access token bearer to request',
            //     },
            // ],

            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Profile retrieve successfully!',
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
                                },
                            },
                        },
                    },
                },
                ...internalServerErrorResponse,
            },
        },
        patch: {
            tags: ['User'],
            summary: 'Update profile',
            description:
                'Before you update. You should enter current password and confirm. ',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['currentPassword'],
                            properties: {
                                currentPassword: {
                                    type: 'string',
                                    description: 'Current password of the user',
                                    example: 'currentPassword123',
                                },
                                password: {
                                    type: 'string',
                                    example: 'currentPassword123',
                                },
                                passwordConfirm: {
                                    type: 'string',
                                    description:
                                        'Confirmation of the new password',
                                    example: 'newPassword123',
                                },
                                email: {
                                    type: 'string',
                                    description: 'Email of the user',
                                    example: 'jonh@gmail.com',
                                },
                                firstName: {
                                    type: 'string',
                                    description: 'First name of the user',
                                    example: 'John',
                                },
                                lastName: {
                                    type: 'string',
                                    description: 'Last name of the user',
                                    example: 'Doe',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'Profile was updated',
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
                                        example:
                                            'User , your profile was successfully updated',
                                    },
                                },
                            },
                        },
                    },
                },
                ...internalServerErrorResponse,
            },
        },
        delete: {
            tags: ['User'],
            summary: 'User can delete own profile ',
            description: 'Only authenticated users can delete their profile.',

            responses: {
                ...badRequestResponse,
                200: {
                    description:
                        'Your profile deleted has been deleted successfully!',
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
                                            'Account was successfully deleted',
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
