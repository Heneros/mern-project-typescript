export const badRequestResponse = {
    400: {
        description: 'Invalid request.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        messages: {
                            type: 'string',
                            example: 'Invalid request parameter(s).',
                        },
                    },
                },
            },
        },
    },
};

export const internalServerErrorResponse = {
    500: {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Internal server error.',
                        },
                    },
                },
            },
        },
    },
};
