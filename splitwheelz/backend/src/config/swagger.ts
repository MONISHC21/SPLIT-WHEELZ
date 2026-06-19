import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SplitWheelz API',
      version: '1.0.0',
      description: 'Production-ready API for SplitWheelz vehicle co-ownership platform',
      contact: {
        name: 'SplitWheelz Team',
        email: 'api@splitwheelz.com',
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.splitwheelz.com',
        description: 'Production server',
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
      schemas: {
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            registrationNumber: { type: 'string' },
            totalSlots: { type: 'integer', minimum: 2, maximum: 4 },
            pricePerSlot: { type: 'number' },
            monthlyMaintenanceCost: { type: 'number' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            vehicleId: { type: 'string' },
            userId: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
