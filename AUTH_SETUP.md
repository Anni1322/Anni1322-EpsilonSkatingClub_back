# Authentication Setup Guide

## Installation

Install required packages:
```bash
npm install jsonwebtoken bcryptjs
```

## Authentication Flow

### User (Student) Authentication
1. Student registers/logs in via Student Login page
2. Credentials validated against Users table
3. JWT token generated on successful login
4. Token stored in localStorage on frontend
5. Token sent in Authorization header for protected routes

### Teacher (Admin) Authentication
1. Teacher logs in via Teacher Login page
2. Credentials validated against Teachers table with admin flag
3. JWT token generated with admin role
4. Token stored in localStorage on frontend
5. Admin-only routes validated with role check

## Database Tables

### Users Table (for Student Login)
```sql
CREATE TABLE IF NOT EXISTS Users (
  UserID INT PRIMARY KEY AUTO_INCREMENT,
  Email VARCHAR(255) UNIQUE NOT NULL,
  PasswordHash VARCHAR(255) NOT NULL,
  StudentID INT,
  IsActive BOOLEAN DEFAULT TRUE,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);
```

### Teachers Table Update (for Teacher Login)
```sql
ALTER TABLE Teachers ADD COLUMN Email VARCHAR(255) UNIQUE NOT NULL;
ALTER TABLE Teachers ADD COLUMN PasswordHash VARCHAR(255) NOT NULL;
ALTER TABLE Teachers ADD COLUMN IsAdmin BOOLEAN DEFAULT FALSE;
ALTER TABLE Teachers ADD COLUMN IsActive BOOLEAN DEFAULT TRUE;
```

## API Endpoints

### User (Student) Authentication
- POST `/api/auth/user/register` - Register new student user
- POST `/api/auth/user/login` - Login student user
- POST `/api/auth/user/logout` - Logout user
- GET `/api/auth/user/profile` - Get current user profile (Protected)

### Teacher (Admin) Authentication
- POST `/api/auth/teacher/login` - Login teacher
- POST `/api/auth/teacher/logout` - Logout teacher
- GET `/api/auth/teacher/profile` - Get current teacher profile (Protected)

## Frontend Setup

### Login Pages
- `/auth/login` - Student login page
- `/auth/teacher-login` - Teacher login page

### Protected Routes
All pages now require authentication with appropriate role.

## JWT Token Structure

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "student" or "teacher",
  "isAdmin": false or true,
  "iat": 1711767890,
  "exp": 1711854290
}
```

## Next Steps
1. Run SQL schema updates
2. Install npm packages
3. Create auth controllers
4. Create auth middleware
5. Create frontend login components
