import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const deleteUserAccountSwagger = {
    '/user/{id}': {
        delete: {
            tags: ['User'],

            summary: 'Delete user user account',
            description: 'Delete user user account. Only admin can do this.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    description: 'The id of user.',
                    required: true,
                    schema: {
                        type: 'string',
                        example: '672e0b0d6b8a1d1375c020b2',
                    },
                },
            ],
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'User deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example:
                                            'User John deleted successfully',
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
