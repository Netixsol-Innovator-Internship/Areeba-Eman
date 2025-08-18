import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Ecommerce API',
        description: 'In-memory CRUD API for Ecommerce',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter JWT token like: Bearer <token>',
        },
    },
    security: [{ BearerAuth: [] }],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
