# Puls Academy Backend - Comprehensive Summary

## Project Overview
Puls Academy Backend is a Node.js/Express API for an educational platform specializing in Pharmacy and Dentistry courses. The system provides user authentication, course management, payment processing, and notification services.

## Technologies Used
- **Node.js** with Express.js framework
- **SQLite** database for data storage
- **JWT** for authentication and authorization
- **bcrypt** for password hashing
- **MEGA.js** for file storage
- **Nodemailer** for email services
- **Multer** for file uploads
- **Google Drive** for video content

## Project Structure
```
puls-academy-backend/
├── config/           # Configuration files (database, authentication, storage)
├── controllers/      # Request handlers for each feature
├── middlewares/      # Authentication and validation middleware
├── models/           # Database models and business logic
├── routes/           # API route definitions
├── utils/            # Helper functions and utilities
├── scripts/          # Utility scripts
├── uploads/          # Temporary file storage
├── package.json      # Dependencies and scripts
└── server.js         # Main application entry point
```

## Core Features

### 1. User Management
- **Registration**: Users can register with name, email, password, college (pharmacy/dentistry), and gender
- **Authentication**: JWT-based login system with refresh tokens
- **Profile Management**: Users can update profile information and change passwords
- **Role-based Access**: Admin and student roles with different permissions
- **User Search**: Admins can search users by name or email

### 2. Course Management
- **Course Creation**: Admins can create courses with title, description, category, price, and preview video
- **Course Access Control**: Courses are restricted by college type (pharmacy/dentistry) and gender
- **Lesson Management**: Courses contain lessons with videos and thumbnails
- **Preview Lessons**: Free preview lessons available to all users
- **Course Search**: Users can search courses by title or description

### 3. Payment System
- **Payment Submission**: Students can submit payments with screenshots
- **Payment Review**: Admins can approve or reject payments
- **Enrollment Management**: Automatic enrollment upon payment approval
- **Payment Methods**: Support for Vodafone Cash and Instapay

### 4. Notification System
- **Automatic Notifications**: System-generated notifications for payment status changes
- **Notification Management**: Users can view, mark as read, and delete notifications
- **Admin Notifications**: Admins can create bulk notifications

### 5. Admin Dashboard
- **Statistics**: Dashboard with user, course, payment, and enrollment statistics
- **User Management**: View, search, and delete users
- **Course Management**: View and manage courses
- **Revenue Reports**: Financial reporting with daily/monthly views

## Database Schema

### Users Table
- `user_id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password_hash`: Hashed password
- `role`: 'student' or 'admin'
- `college`: 'pharmacy' or 'dentistry'
- `gender`: 'male' or 'female'
- `created_at`: Timestamp

### Courses Table
- `course_id`: Primary key
- `title`: Course title
- `description`: Course description
- `category`: 'pharmacy' or 'dentistry'
- `college_type`: 'male' or 'female'
- `price`: Course price
- `preview_url`: Preview video URL
- `created_at`: Timestamp

### Lessons Table
- `lesson_id`: Primary key
- `course_id`: Foreign key to Courses
- `title`: Lesson title
- `video_url`: Video URL (Google Drive)
- `thumbnail_url`: Lesson thumbnail
- `is_preview`: Boolean for free preview
- `order_index`: Lesson order

### Payments Table
- `payment_id`: Primary key
- `user_id`: Foreign key to Users
- `course_id`: Foreign key to Courses
- `amount`: Payment amount
- `method`: 'vodafone_cash' or 'instapay'
- `screenshot_path`: Payment screenshot URL
- `status`: 'pending', 'approved', or 'rejected'
- `created_at`: Timestamp

### Enrollments Table
- `enrollment_id`: Primary key
- `user_id`: Foreign key to Users
- `course_id`: Foreign key to Courses
- `payment_id`: Foreign key to Payments
- `status`: 'active' or 'inactive'
- `enrolled_at`: Timestamp

### Notifications Table
- `notification_id`: Primary key
- `user_id`: Foreign key to Users
- `message`: Notification content
- `is_read`: Boolean
- `created_at`: Timestamp

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register`: User registration
- `POST /login`: User login
- `POST /refresh-token`: Refresh JWT token
- `GET /profile`: Get user profile
- `PUT /profile`: Update user profile
- `PUT /change-password`: Change password
- `POST /logout`: User logout

### Course Routes (`/api/courses`)
- `GET /`: Get all courses with filters
- `GET /search`: Search courses
- `GET /stats`: Get course statistics
- `GET /top-selling`: Get top selling courses
- `GET /:courseId`: Get course by ID
- `GET /:courseId/preview`: Get course preview lesson
- `GET /available`: Get courses available to user
- `GET /:courseId/lessons`: Get course lessons
- `GET /:courseId/lessons/:lessonId`: Get specific lesson
- `POST /`: Create new course (admin only)
- `PUT /:courseId`: Update course (admin only)
- `DELETE /:courseId`: Delete course (admin only)
- `POST /:courseId/lessons`: Add lesson to course (admin only)

### Payment Routes (`/api/payments`)
- `GET /`: Get all payments (admin only)
- `GET /pending`: Get pending payments (admin only)
- `GET /stats`: Get payment statistics (admin only)
- `GET /:paymentId`: Get payment by ID (admin only)
- `PUT /:paymentId/approve`: Approve payment (admin only)
- `PUT /:paymentId/reject`: Reject payment (admin only)
- `DELETE /:paymentId`: Delete payment (admin only)
- `GET /my-payments`: Get user's payments
- `POST /`: Create new payment

### Admin Routes (`/api/admin`)
- `GET /dashboard`: Get dashboard statistics
- `GET /users`: Get all users
- `GET /users/search`: Search users
- `GET /users/:userId`: Get user details
- `DELETE /users/:userId`: Delete user
- `DELETE /users/bulk`: Bulk delete users
- `GET /courses`: Get all courses
- `GET /courses/top`: Get top courses
- `GET /courses/:courseId/enrollments`: Get course enrollments
- `GET /courses/:courseId/payments`: Get course payments
- `DELETE /courses/bulk`: Bulk delete courses
- `GET /students/top`: Get top students
- `GET /revenue/report`: Get revenue report

### Notification Routes (`/api/notifications`)
- `GET /`: Get user notifications
- `GET /unread-count`: Get unread notifications count
- `GET /stats`: Get notification statistics (admin only)
- `POST /`: Create notification (admin only)
- `POST /bulk`: Create bulk notifications (admin only)
- `PUT /:notificationId/read`: Mark notification as read
- `PUT /mark-all-read`: Mark all notifications as read
- `DELETE /:notificationId`: Delete notification
- `DELETE /all`: Delete all user notifications

## Security Features
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin/student permissions
- **File Validation**: Allowed file types and size limits
- **Input Sanitization**: Protection against XSS attacks
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing protection

## File Storage
- **MEGA Storage**: Used for storing payment screenshots and lesson thumbnails
- **Google Drive**: Used for hosting course videos
- **Temporary Storage**: Local storage for file uploads before MEGA upload

## Email Services
- **Welcome Emails**: Sent upon user registration
- **Payment Notifications**: Automatic emails for payment status changes
- **Gmail Integration**: Using nodemailer with Gmail SMTP

## Error Handling
- **Validation Errors**: Input validation with descriptive messages
- **Database Errors**: SQLite constraint and connection errors
- **File Upload Errors**: Size and type validation errors
- **Authentication Errors**: Token validation and authorization errors
- **General Errors**: 500 server errors with logging

## Environment Configuration
The application uses environment variables for configuration:
- Database path
- JWT secret and expiration
- MEGA account credentials
- Email service credentials
- Server port

## Middleware
- **Authentication Middleware**: Verifies JWT tokens
- **Admin Middleware**: Checks admin permissions
- **Upload Middleware**: Handles file uploads with validation
- **Validation Middleware**: Input validation (not fully implemented)
- **Error Handler**: Centralized error handling

## Utility Functions
- **Helper Functions**: Date formatting, price formatting, text utilities
- **File Utilities**: File validation, extension extraction, size formatting
- **Video Validation**: Google Drive video URL validation
- **Email Service**: Payment and welcome email templates

## Scripts
- **Clear Users**: Utility script to delete student accounts

## Testing
- **Jest**: Unit and integration testing framework
- **Supertest**: HTTP testing utilities

## Development Tools
- **Nodemon**: Auto-restart during development
- **ESLint**: Code linting and formatting
- **Coverage**: Test coverage reporting

## Deployment
- **Node.js**: Server-side JavaScript runtime
- **Cross-platform**: Compatible with Windows, macOS, and Linux
- **Lightweight**: SQLite database requires no separate server

## Key Business Logic
1. **Access Control**: Users can only access courses matching their college and gender
2. **Payment Workflow**: Submit payment → Admin review → Enrollment activation
3. **Content Access**: Free preview lessons vs. paid course content
4. **Notification System**: Automatic notifications for key events
5. **Admin Privileges**: Special routes for administrative functions

## Performance Considerations
- **Database Indexing**: Proper indexing for user, course, and payment queries
- **File Upload Optimization**: Stream-based uploads to MEGA
- **Caching**: Potential for caching frequently accessed data
- **Pagination**: Limit and offset for large result sets

## Future Enhancements
- **Video Progress Tracking**: Track user progress through course videos
- **Quiz System**: Add quizzes and assessments
- **Certificate Generation**: Automatic certificate generation upon course completion
- **Analytics Dashboard**: Enhanced analytics for course performance
- **Mobile API**: Dedicated endpoints for mobile applications