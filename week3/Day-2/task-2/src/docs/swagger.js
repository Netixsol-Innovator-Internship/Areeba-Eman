const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Task Manager API",
    version: "2.0.0",
    description: `
      A comprehensive Task Manager API with JWT authentication, MongoDB integration, and full CRUD operations.
      
      ## Features
      - 🔐 JWT-based authentication
      - 📝 Complete task management (CRUD)
      - 🔍 Advanced filtering and pagination
      - 📊 Task statistics and analytics
      - ✅ Input validation on all endpoints
      - 🛡️ Secure user isolation (users can only access their own tasks)
      
      ## Getting Started
      1. Register a new account using \`POST /api/users/register\`
      2. Login to get your JWT token using \`POST /api/users/login\`
      3. Use the token in the Authorization header: \`Bearer <your-token>\`
      4. Start managing your tasks!
      
      ## Authentication
      This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
    `,
    contact: {
      name: "API Support",
      email: "support@taskmanager.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === "production" ? `https://${process.env.VERCEL_URL}` : "https://task-2-areeba-eman4-areeba-emans-projects-8cfadb20.vercel.app",
      description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "User ID",
            example: "507f1f77bcf86cd799439011",
          },
          name: {
            type: "string",
            description: "User's full name",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            description: "User's email address",
            example: "john@example.com",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Account creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Task ID",
            example: "507f1f77bcf86cd799439012",
          },
          title: {
            type: "string",
            description: "Task title",
            example: "Complete project documentation",
            maxLength: 100,
          },
          description: {
            type: "string",
            description: "Task description",
            example: "Write comprehensive API documentation with examples",
            maxLength: 500,
          },
          status: {
            type: "string",
            enum: ["pending", "in-progress", "completed"],
            description: "Current task status",
            example: "pending",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Task priority level",
            example: "high",
          },
          dueDate: {
            type: "string",
            format: "date-time",
            description: "Task due date",
            example: "2024-12-31T23:59:59.000Z",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Task creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
          },
          message: {
            type: "string",
            example: "Login successful",
          },
          data: {
            type: "object",
            properties: {
              user: {
                $ref: "#/components/schemas/User",
              },
              token: {
                type: "string",
                description: "JWT authentication token",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
      },
      TaskResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
          },
          message: {
            type: "string",
            example: "Task created successfully",
          },
          data: {
            type: "object",
            properties: {
              task: {
                $ref: "#/components/schemas/Task",
              },
            },
          },
        },
      },
      TaskListResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
          },
          data: {
            type: "object",
            properties: {
              tasks: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Task",
                },
              },
              pagination: {
                type: "object",
                properties: {
                  currentPage: {
                    type: "integer",
                    example: 1,
                  },
                  totalPages: {
                    type: "integer",
                    example: 5,
                  },
                  totalTasks: {
                    type: "integer",
                    example: 47,
                  },
                  hasNextPage: {
                    type: "boolean",
                    example: true,
                  },
                  hasPrevPage: {
                    type: "boolean",
                    example: false,
                  },
                },
              },
            },
          },
        },
      },
      TaskStats: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
          },
          data: {
            type: "object",
            properties: {
              totalTasks: {
                type: "integer",
                description: "Total number of tasks",
                example: 25,
              },
              overdueTasks: {
                type: "integer",
                description: "Number of overdue tasks",
                example: 3,
              },
              statusBreakdown: {
                type: "object",
                properties: {
                  pending: {
                    type: "integer",
                    example: 10,
                  },
                  "in-progress": {
                    type: "integer",
                    example: 8,
                  },
                  completed: {
                    type: "integer",
                    example: 7,
                  },
                },
              },
              priorityBreakdown: {
                type: "object",
                properties: {
                  low: {
                    type: "integer",
                    example: 5,
                  },
                  medium: {
                    type: "integer",
                    example: 12,
                  },
                  high: {
                    type: "integer",
                    example: 8,
                  },
                },
              },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error",
          },
          message: {
            type: "string",
            example: "Validation failed",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  example: "email",
                },
                message: {
                  type: "string",
                  example: "Please provide a valid email address",
                },
                value: {
                  type: "string",
                  example: "invalid-email",
                },
              },
            },
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Authentication required",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: "Access denied. No token provided.",
                },
              },
            },
          },
        },
      },
      ValidationError: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: "Task not found",
                },
              },
            },
          },
        },
      },
      ServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: "Internal server error",
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication and account management",
    },
    {
      name: "Tasks",
      description: "Task management operations",
    },
  ],
}

// Options for swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/routes/*.js", // Path to the API route files
    "./src/controllers/*.js", // Path to controller files
  ],
}

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options)

// Swagger UI options
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6 }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
  `,
  customSiteTitle: "Task Manager API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "none",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
}

// Setup function to configure Swagger with Express app
const setupSwagger = (app) => {
  // Serve swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions))

  // Serve swagger.json
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(specs)
  })

  console.log(`📚 Swagger documentation available at: /api-docs`)
  console.log(`📄 Swagger JSON available at: /swagger.json`)
}

module.exports = setupSwagger
