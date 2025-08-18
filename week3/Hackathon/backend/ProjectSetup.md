- folder struture

task-manager-api-v2/
├─ package.json
├─ .env.example
├─ server.js
├─ config/
│  └─ db.js
├─ models/
│  ├─ User.js
│  └─ Task.js
├─ controllers/
│  ├─ authController.js
│  └─ taskController.js
├─ routes/
│  ├─ users.js
│  └─ tasks.js
├─ middleware/
│  ├─ auth.js
│  └─ validators.js
├─ swagger.js
└─ README.md

npm init -y

npm install express nodemon swagger-ui-express swagger-jsdoc swagger-autogen mongoose bcryptjs jsonwebtoken dotenv express-validator cors

- express – Create the Node.js web server and handle HTTP routes
- nodemon – Automatically restart the server when file changes are detected (dev use only)
- swagger-ui-express – Serve Swagger API documentation in a web UI
- swagger-jsdoc – Generate Swagger docs from JSDoc comments in your code
- swagger-autogen – Automatically generate Swagger docs from your routes without writing YAML/JSON manually
- mongoose – Connect to and interact with MongoDB using models and schemas
- bcryptjs – Hash and verify passwords securely
- jsonwebtoken – Create and verify JWT tokens for authentication
- dotenv – Load environment variables from a .env file
- express-validator – Validate and sanitize incoming request data