import swaggerJSDoc from 'swagger-jsdoc';
import { authSwagger } from './swagger/auth.swagger';

const domain = process.env.DOMAIN;

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'MERN villa API',
        version: '1.0.0',
        description: 'REST API app made with Express. ',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
    },
    servers: [
        {
            url: `${domain}/api/v1`,
            description: 'Development server',
        },
    ],
    paths: {
        ...authSwagger,
    },
    tags: [
        {
            name: 'Authentication',
            description:
                'Endpoints for authentication(login, logout, register...)',
        },
        {
            name: 'User',
            description:
                'Endpoints for user(profile, updateAccount, deleteAccount, deactivate...)',
        },
        {
            name: 'Properties',
            description: 'Endpoints for user(CRUD operations)',
        },
        {
            name: 'Order',
            description: 'Endpoints for order(CRUD operations)',
        },
        {
            name: 'Message',
            description:
                'For socket.io communication(Send message, get specific chat or chats)',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./backend/routes/*.ts', './backend/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
