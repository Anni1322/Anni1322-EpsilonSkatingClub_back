# Epsilon Skating Club - Backend API

A Node.js Express backend API for managing the Epsilon Skating Club with complete CRUD operations.

## Project Structure

```
server/
├── config/
│   └── database.js           # Database connection configuration
├── controllers/              # Business logic controllers
│   ├── studentController.js
│   ├── teacherController.js
│   ├── productController.js
│   ├── batchController.js
│   ├── enrollmentController.js
│   ├── attendanceController.js
│   ├── invoiceController.js
│   └── paymentController.js
├── routes/                   # API route handlers
│   ├── students.js
│   ├── teachers.js
│   ├── products.js
│   ├── batches.js
│   ├── enrollments.js
│   ├── attendance.js
│   ├── invoices.js
│   └── payments.js
├── server.js                 # Main Express server file
├── package.json             # Dependencies
└── .env                      # Environment configuration
```

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Update `.env` file with your MySQL database credentials
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=EpsilonSkatingClub
   DB_PORT=3306
   SERVER_PORT=5000
   NODE_ENV=development
   ```

3. **Create the database**
   - Run the SQL schema provided in the schema file to create the database and tables

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Batches
- `GET /api/batches` - Get all batches
- `GET /api/batches/:id` - Get batch by ID
- `POST /api/batches` - Create new batch
- `PUT /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch

### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `GET /api/enrollments/:id` - Get enrollment by ID
- `GET /api/enrollments/student/:studentId` - Get enrollments for a student
- `POST /api/enrollments` - Create new enrollment
- `PUT /api/enrollments/:id` - Update enrollment
- `DELETE /api/enrollments/:id` - Delete enrollment

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `GET /api/attendance/student/:studentId` - Get attendance for a student
- `GET /api/attendance/batch/:batchId` - Get attendance for a batch
- `POST /api/attendance` - Create new attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/student/:studentId` - Get invoices for a student
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Invoice Items
- `GET /api/invoice-items` - Get all invoice items
- `GET /api/invoice-items/:id` - Get invoice item by ID
- `GET /api/invoice-items/invoice/:invoiceId` - Get items for an invoice
- `POST /api/invoice-items` - Create new invoice item
- `PUT /api/invoice-items/:id` - Update invoice item
- `DELETE /api/invoice-items/:id` - Delete invoice item

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/invoice/:invoiceId` - Get payments for an invoice
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000` (or the port specified in .env)

## Health Check

Check if the server is running:
```bash
GET /api/health
```

## Database Schema

The backend uses the following tables:
- **Students** - Student information and registration
- **Teachers** - Teacher/Instructor details
- **Products** - Store products (skates, gear, etc.)
- **Batches** - Class batches with schedule
- **Enrollments** - Student enrollment in batches
- **Attendance** - Class attendance tracking
- **Invoices** - Billing invoices
- **Invoice_Items** - Line items in invoices
- **Payments** - Payment records

## Dependencies

- **express** - Web framework
- **mysql2** - MySQL database driver
- **dotenv** - Environment variable management
- **body-parser** - Request body parsing
- **cors** - Cross-Origin Resource Sharing

## Development Dependencies

- **nodemon** - Auto-restart development server

## Error Handling

All endpoints include error handling with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Notes

- All API responses return JSON
- Dates should be in `YYYY-MM-DD` format
- Times should be in `HH:MM:SS` format
- IDs are auto-incremented in the database
# Anni1322-EpsilonSkatingClub_back
