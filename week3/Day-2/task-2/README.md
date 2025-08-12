# Task Manager API v2.0

A production-ready Task Manager API built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **JWT Authentication** - Secure user registration and login
- **MongoDB Integration** - Persistent data storage with Mongoose
- **Complete CRUD Operations** - Full task management functionality
- **Input Validation** - Comprehensive validation using express-validator
- **Swagger Documentation** - Interactive API documentation
- **User Isolation** - Users can only access their own tasks
- **Advanced Filtering** - Filter tasks by status, priority, and more
- **Pagination** - Efficient data loading with pagination
- **Task Statistics** - Analytics and insights for your tasks

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd task-manager-api
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Create a `.env` file in the root directory:
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   \`\`\`

4. **Start the server**
   \`\`\`bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in requests:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Getting Started:
1. Register: `POST /api/users/register`
2. Login: `POST /api/users/login`
3. Use the returned token for authenticated requests

## 📖 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering & pagination)
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔍 Query Parameters

### GET /api/tasks
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (createdAt, title, dueDate, etc.)
- `sortOrder` - Sort direction (asc, desc)

Example:
\`\`\`
GET /api/tasks?status=pending&priority=high&page=1&limit=20&sortBy=dueDate&sortOrder=asc
\`\`\`

## 📊 Task Statistics

Get insights about your tasks:
\`\`\`
GET /api/tasks/stats
\`\`\`

Returns:
- Total tasks count
- Overdue tasks count
- Status breakdown (pending, in-progress, completed)
- Priority breakdown (low, medium, high)

## 🧪 Testing with Postman

### 1. Register a User
\`\`\`json
POST /api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
\`\`\`

### 2. Login
\`\`\`json
POST /api/users/login
{
  "email": "john@example.com",
  "password": "Password123"
}
\`\`\`

### 3. Create a Task (with token)
\`\`\`json
POST /api/tasks
Authorization: Bearer <your-token>
{
  "title": "Complete API documentation",
  "description": "Write comprehensive docs",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
\`\`\`

## 🚀 Deployment to Vercel

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Deploy**
   \`\`\`bash
   vercel
   \`\`\`

3. **Set Environment Variables**
   In Vercel dashboard, add:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token expiration (7 days)
- Input validation and sanitization
- User data isolation
- CORS protection
- Rate limiting ready (can be added)

## 📁 Project Structure

\`\`\`
src/
├── controllers/          # Business logic
│   ├── authController.js
│   └── taskController.js
├── models/              # Database models
│   ├── User.js
│   └── Task.js
├── routes/              # API routes
│   ├── authRoutes.js
│   └── taskRoutes.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── validateRequest.js
├── docs/               # Documentation
│   └── swagger.js
├── config/             # Configuration
│   └── db.js
└── server.js           # Entry point
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@taskmanager.com or create an issue in the repository.
