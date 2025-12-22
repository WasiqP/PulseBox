# Raviro Backend API

Backend server for Raviro - AI Teacher Personal Assistant application.

## Project Structure

```
backend/
├── config/           # Configuration files
│   ├── index.js      # Main config
│   └── database.js   # Database connection
├── controllers/      # Request handlers (business logic)
│   ├── authController.js
│   ├── userController.js
│   ├── classController.js
│   ├── taskController.js
│   ├── responseController.js
│   ├── attendanceController.js
│   ├── studentController.js
│   ├── homeworkController.js
│   ├── scheduleController.js
│   └── analyticsController.js
├── middleware/       # Express middleware
│   ├── auth.js       # Authentication
│   ├── validate.js   # Input validation
│   ├── errorHandler.js
│   ├── notFound.js
│   └── logger.js
├── models/           # Data models/schemas
│   ├── User.js
│   ├── Class.js
│   ├── Student.js
│   ├── Task.js
│   ├── Response.js
│   ├── Attendance.js
│   ├── Homework.js
│   └── Schedule.js
├── routes/           # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── classRoutes.js
│   ├── taskRoutes.js
│   ├── responseRoutes.js
│   ├── attendanceRoutes.js
│   ├── studentRoutes.js
│   ├── homeworkRoutes.js
│   ├── scheduleRoutes.js
│   └── analyticsRoutes.js
├── services/         # Business logic services
│   ├── emailService.js
│   ├── reportService.js
│   └── analyticsService.js
├── utils/            # Utility functions
│   ├── generateId.js
│   ├── hashPassword.js
│   ├── comparePassword.js
│   ├── generateToken.js
│   └── sendEmail.js
├── validators/       # Input validation schemas
│   ├── authValidator.js
│   ├── classValidator.js
│   ├── taskValidator.js
│   └── responseValidator.js
├── .env.example      # Environment variables template
├── .gitignore
├── index.js          # Entry point
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `POST /api/classes/:id/students` - Add student to class
- `DELETE /api/classes/:id/students/:studentId` - Remove student from class

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/publish` - Publish task
- `GET /api/tasks/:id/questions` - Get task questions
- `PUT /api/tasks/:id/questions` - Update task questions

### Responses
- `GET /api/responses` - Get all responses (with filters)
- `GET /api/responses/task/:taskId` - Get responses by task
- `GET /api/responses/:id` - Get response by ID
- `POST /api/responses` - Submit response (public)
- `PUT /api/responses/:id/grade` - Grade response
- `DELETE /api/responses/:id` - Delete response
- `GET /api/responses/task/:taskId/statistics` - Get task statistics

### Attendance
- `GET /api/attendance/class/:classId` - Get attendance by class
- `GET /api/attendance/class/:classId/date/:date` - Get attendance by class and date
- `GET /api/attendance/student/:studentId` - Get student attendance
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

### Students
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/:id/performance` - Get student performance
- `GET /api/students/:id/report` - Get student report

### Homework
- `GET /api/homework/class/:classId` - Get homework by class
- `POST /api/homework` - Create homework
- `PUT /api/homework/:id` - Update homework
- `DELETE /api/homework/:id` - Delete homework

### Schedule
- `GET /api/schedule` - Get all schedules
- `POST /api/schedule` - Create schedule
- `PUT /api/schedule/:id` - Update schedule
- `DELETE /api/schedule/:id` - Delete schedule

### Analytics
- `GET /api/analytics/overview` - Get overview analytics
- `GET /api/analytics/class-performance` - Get class performance

## Next Steps

1. Choose and set up database (MongoDB, PostgreSQL, etc.)
2. Install database driver (mongoose, pg, etc.)
3. Install additional dependencies:
   - `bcryptjs` - Password hashing
   - `jsonwebtoken` - JWT tokens
   - `dotenv` - Environment variables
   - `nodemailer` - Email sending
   - `joi` or `express-validator` - Input validation
   - `cors` - CORS handling
   - `nodemon` - Development auto-reload

4. Implement database models with your chosen ORM/ODM
5. Implement authentication middleware
6. Implement validation middleware
7. Complete controller logic
8. Add error handling and logging

