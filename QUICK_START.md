# Epsilon Skating Club Backend - Quick Start Guide

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- MySQL Server running
- npm or yarn

### 2. Installation Steps

```bash
# Navigate to the server directory
cd d:\aipro\Company\client\EpsilonSkatingClub\server

# Install dependencies
npm install
```

### 3. Database Setup

1. Open MySQL command line or MySQL Workbench
2. Run the SQL script to create the database:
   ```bash
   mysql -u root -p < DATABASE_SCHEMA.sql
   ```
   Or copy the entire SQL from `DATABASE_SCHEMA.sql` and run it in your MySQL client

3. Verify the database and tables are created:
   ```sql
   USE EpsilonSkatingClub;
   SHOW TABLES;
   ```

### 4. Configure Environment Variables

Edit the `.env` file and update your database credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=EpsilonSkatingClub
DB_PORT=3306
SERVER_PORT=5000
NODE_ENV=development
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see: `Server is running on port 5000`

### 6. Verify Server is Running

Open your browser or use curl/Postman to test:
```
GET http://localhost:5000/api/health
```

Expected response:
```json
{"message": "Server is running"}
```

## Project Structure

```
server/
├── config/
│   └── database.js              # MySQL connection pool
├── controllers/                 # API logic (8 files)
│   ├── studentController.js
│   ├── teacherController.js
│   ├── productController.js
│   ├── batchController.js
│   ├── enrollmentController.js
│   ├── attendanceController.js
│   ├── invoiceController.js
│   └── paymentController.js
├── routes/                      # API endpoints (8 files)
│   ├── students.js
│   ├── teachers.js
│   ├── products.js
│   ├── batches.js
│   ├── enrollments.js
│   ├── attendance.js
│   ├── invoices.js
│   └── payments.js
├── server.js                    # Main Express app
├── package.json                 # Dependencies
├── .env                         # Environment config
├── DATABASE_SCHEMA.sql          # SQL schema
├── README.md                    # Full documentation
├── QUICK_START.md              # This file
└── .gitignore                   # Git ignore rules
```

## API Summary

### Complete CRUD Coverage

All 8 entities have full CRUD (Create, Read, Update, Delete) support:

| Entity | Endpoints |
|--------|-----------|
| Students | GET /api/students, POST, PUT /:id, DELETE /:id |
| Teachers | GET /api/teachers, POST, PUT /:id, DELETE /:id |
| Products | GET /api/products, POST, PUT /:id, DELETE /:id |
| Batches | GET /api/batches, POST, PUT /:id, DELETE /:id |
| Enrollments | GET /api/enrollments, POST, PUT /:id, DELETE /:id + filters |
| Attendance | GET /api/attendance, POST, PUT /:id, DELETE /:id + filters |
| Invoices | GET /api/invoices, POST, PUT /:id, DELETE /:id + filters |
| Payments | GET /api/payments, POST, PUT /:id, DELETE /:id + filters |

## Testing with Postman/cURL

### Create a Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName": "John",
    "LastName": "Doe",
    "DOB": "2010-05-15",
    "Gender": "M",
    "FatherName": "James Doe",
    "MotherName": "Jane Doe",
    "SchoolName": "St. Mary School",
    "SchoolGrade": "5",
    "Address": "123 Main St",
    "ContactNumber": "9876543210",
    "EmergencyContact": "9876543211",
    "RegistrationDate": "2024-01-15",
    "SkillLevel": "Beginner",
    "TermsAccepted": true
  }'
```

### Get All Students
```bash
curl http://localhost:5000/api/students
```

### Get Student by ID
```bash
curl http://localhost:5000/api/students/1
```

### Update Student
```bash
curl -X PUT http://localhost:5000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName": "Johnny",
    "LastName": "Doe",
    "ContactNumber": "9876543210"
  }'
```

### Delete Student
```bash
curl -X DELETE http://localhost:5000/api/students/1
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify .env credentials match your MySQL setup
- Ensure database `EpsilonSkatingClub` exists

### Port Already in Use
- Change `SERVER_PORT` in .env file
- Or kill the process using port 5000

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### CORS Issues
- CORS is already enabled in the server
- Frontend can make requests from any origin

## Next Steps

1. **Frontend Integration**: Connect your React/Vue frontend to these APIs
2. **Authentication**: Add JWT authentication middleware (not included in basic setup)
3. **Validation**: Add request validation schema
4. **Logging**: Implement request/response logging
5. **Testing**: Add unit and integration tests
6. **Deployment**: Deploy to cloud (AWS, Heroku, etc.)

## Support

For help with:
- API endpoints: See README.md
- Database schema: See DATABASE_SCHEMA.sql
- Node.js/Express: Check server.js
- Controllers: Check individual controller files in `/controllers`

---

**Project**: Epsilon Skating Club Backend  
**Version**: 1.0.0  
**Created**: March 28, 2026
