import {
    badRequestResponse,
    internalServerErrorResponse,
} from '../swagger.components';

export const getAllUserAccountsSwagger = {
    '/user/all': {
        get: {
            tags: ['User'],
            summary: 'Get all user accounts',
            description:
                'Retrieve a paginated list of user accounts excluding the currently logged-in user. Only admin can do this action.',
            parameters: [
                {
                    name: 'pageNumber',
                    in: 'query',
                    description: 'The page number to retrieve.',
                    required: false,
                    schema: {
                        type: 'integer',
                        default: 1,
                        example: 1,
                    },
                },
            ],
            responses: {
                ...badRequestResponse,
                200: {
                    description: 'A list of user accounts',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                    },
                },
                ...internalServerErrorResponse,
            },
        },
    },
};
