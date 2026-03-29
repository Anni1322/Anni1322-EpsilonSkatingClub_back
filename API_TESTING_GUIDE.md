# API Testing Guide

This guide provides curl examples for testing all API endpoints of the Epsilon Skating Club backend.

## Base URL
```
http://localhost:5000
```

## Common HTTP Status Codes
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## STUDENTS API

### 1. Create Student
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
    "Address": "123 Main St, City, State",
    "ContactNumber": "9876543210",
    "EmergencyContact": "9876543211",
    "RegistrationDate": "2024-01-15",
    "SkillLevel": "Beginner",
    "TermsAccepted": true
  }'
```

### 2. Get All Students
```bash
curl http://localhost:5000/api/students
```

### 3. Get Student by ID
```bash
curl http://localhost:5000/api/students/1
```

### 4. Update Student
```bash
curl -X PUT http://localhost:5000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName": "Johnny",
    "LastName": "Doe",
    "SkillLevel": "Intermediate"
  }'
```

### 5. Delete Student
```bash
curl -X DELETE http://localhost:5000/api/students/1
```

---

## TEACHERS API

### 1. Create Teacher
```bash
curl -X POST http://localhost:5000/api/teachers \
  -H "Content-Type: application/json" \
  -d '{
    "FirstName": "Sarah",
    "LastName": "Smith",
    "ContactNumber": "8765432109",
    "Specialization": "Figure Skating"
  }'
```

### 2. Get All Teachers
```bash
curl http://localhost:5000/api/teachers
```

### 3. Get Teacher by ID
```bash
curl http://localhost:5000/api/teachers/1
```

### 4. Update Teacher
```bash
curl -X PUT http://localhost:5000/api/teachers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Specialization": "Ice Dance"
  }'
```

### 5. Delete Teacher
```bash
curl -X DELETE http://localhost:5000/api/teachers/1
```

---

## PRODUCTS API

### 1. Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "ProductName": "Ice Skates - Size 4",
    "Category": "Skates",
    "Size": "4",
    "UnitPrice": 150.00,
    "StockQuantity": 10
  }'
```

### 2. Get All Products
```bash
curl http://localhost:5000/api/products
```

### 3. Get Product by ID
```bash
curl http://localhost:5000/api/products/1
```

### 4. Update Product
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "StockQuantity": 8
  }'
```

### 5. Delete Product
```bash
curl -X DELETE http://localhost:5000/api/products/1
```

---

## BATCHES API

### 1. Create Batch
```bash
curl -X POST http://localhost:5000/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "BatchName": "Batch A - Morning",
    "TeacherID": 1,
    "DaysOfWeek": "Monday, Wednesday, Friday",
    "StartTime": "09:00:00",
    "EndTime": "10:30:00",
    "MaxCapacity": 15
  }'
```

### 2. Get All Batches
```bash
curl http://localhost:5000/api/batches
```

### 3. Get Batch by ID
```bash
curl http://localhost:5000/api/batches/1
```

### 4. Update Batch
```bash
curl -X PUT http://localhost:5000/api/batches/1 \
  -H "Content-Type: application/json" \
  -d '{
    "MaxCapacity": 20
  }'
```

### 5. Delete Batch
```bash
curl -X DELETE http://localhost:5000/api/batches/1
```

---

## ENROLLMENTS API

### 1. Create Enrollment
```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "StudentID": 1,
    "BatchID": 1,
    "Status": "Active"
  }'
```

### 2. Get All Enrollments
```bash
curl http://localhost:5000/api/enrollments
```

### 3. Get Enrollment by ID
```bash
curl http://localhost:5000/api/enrollments/1
```

### 4. Get Enrollments for a Student
```bash
curl http://localhost:5000/api/enrollments/student/1
```

### 5. Update Enrollment Status
```bash
curl -X PUT http://localhost:5000/api/enrollments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Status": "Inactive"
  }'
```

### 6. Delete Enrollment
```bash
curl -X DELETE http://localhost:5000/api/enrollments/1
```

---

## ATTENDANCE API

### 1. Create Attendance Record
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "StudentID": 1,
    "BatchID": 1,
    "ClassDate": "2024-03-28",
    "Status": "Present"
  }'
```

### 2. Get All Attendance Records
```bash
curl http://localhost:5000/api/attendance
```

### 3. Get Attendance by ID
```bash
curl http://localhost:5000/api/attendance/1
```

### 4. Get Attendance by Student ID
```bash
curl http://localhost:5000/api/attendance/student/1
```

### 5. Get Attendance by Batch ID
```bash
curl http://localhost:5000/api/attendance/batch/1
```

### 6. Update Attendance Status
```bash
curl -X PUT http://localhost:5000/api/attendance/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Status": "Absent"
  }'
```

### 7. Delete Attendance Record
```bash
curl -X DELETE http://localhost:5000/api/attendance/1
```

---

## INVOICES API

### 1. Create Invoice
```bash
curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "StudentID": 1,
    "InvoiceDate": "2024-03-28",
    "TotalAmount": 500.00,
    "Status": "Pending"
  }'
```

### 2. Get All Invoices
```bash
curl http://localhost:5000/api/invoices
```

### 3. Get Invoice by ID
```bash
curl http://localhost:5000/api/invoices/1
```

### 4. Get Invoices by Student ID
```bash
curl http://localhost:5000/api/invoices/student/1
```

### 5. Update Invoice
```bash
curl -X PUT http://localhost:5000/api/invoices/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Status": "Paid"
  }'
```

### 6. Delete Invoice
```bash
curl -X DELETE http://localhost:5000/api/invoices/1
```

---

## INVOICE ITEMS API

### 1. Create Invoice Item
```bash
curl -X POST http://localhost:5000/api/invoice-items \
  -H "Content-Type: application/json" \
  -d '{
    "InvoiceID": 1,
    "ItemType": "Monthly Fee",
    "ProductID": null,
    "Quantity": 1,
    "Price": 300.00
  }'
```

### 2. Get All Invoice Items
```bash
curl http://localhost:5000/api/invoice-items
```

### 3. Get Invoice Item by ID
```bash
curl http://localhost:5000/api/invoice-items/1
```

### 4. Get Items for an Invoice
```bash
curl http://localhost:5000/api/invoice-items/invoice/1
```

### 5. Add Product to Invoice
```bash
curl -X POST http://localhost:5000/api/invoice-items \
  -H "Content-Type: application/json" \
  -d '{
    "InvoiceID": 1,
    "ItemType": "Store Product",
    "ProductID": 1,
    "Quantity": 1,
    "Price": 150.00
  }'
```

### 6. Update Invoice Item
```bash
curl -X PUT http://localhost:5000/api/invoice-items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Quantity": 2,
    "Price": 600.00
  }'
```

### 7. Delete Invoice Item
```bash
curl -X DELETE http://localhost:5000/api/invoice-items/1
```

---

## PAYMENTS API

### 1. Create Payment
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "InvoiceID": 1,
    "PaymentDate": "2024-03-28T14:30:00",
    "AmountPaid": 500.00,
    "PaymentMethod": "Credit Card"
  }'
```

### 2. Get All Payments
```bash
curl http://localhost:5000/api/payments
```

### 3. Get Payment by ID
```bash
curl http://localhost:5000/api/payments/1
```

### 4. Get Payments by Invoice ID
```bash
curl http://localhost:5000/api/payments/invoice/1
```

### 5. Update Payment
```bash
curl -X PUT http://localhost:5000/api/payments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "PaymentMethod": "Bank Transfer"
  }'
```

### 6. Delete Payment
```bash
curl -X DELETE http://localhost:5000/api/payments/1
```

---

## Sample Workflow

Here's a complete workflow example:

```bash
# 1. Create a teacher
TEACHER=$(curl -X POST http://localhost:5000/api/teachers \
  -H "Content-Type: application/json" \
  -d '{"FirstName":"Sarah","LastName":"Smith","ContactNumber":"8765432109","Specialization":"Figure Skating"}')
TEACHER_ID=$(echo $TEACHER | grep -o '"TeacherID":[0-9]*' | grep -o '[0-9]*')

# 2. Create a batch
BATCH=$(curl -X POST http://localhost:5000/api/batches \
  -H "Content-Type: application/json" \
  -d "{\"BatchName\":\"Morning Batch\",\"TeacherID\":$TEACHER_ID,\"DaysOfWeek\":\"Mon,Wed,Fri\",\"StartTime\":\"09:00:00\",\"EndTime\":\"10:30:00\",\"MaxCapacity\":15}")
BATCH_ID=$(echo $BATCH | grep -o '"BatchID":[0-9]*' | grep -o '[0-9]*')

# 3. Create a student
STUDENT=$(curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"FirstName":"John","LastName":"Doe","DOB":"2010-05-15","Gender":"M","ContactNumber":"9876543210","RegistrationDate":"2024-03-28"}')
STUDENT_ID=$(echo $STUDENT | grep -o '"StudentID":[0-9]*' | grep -o '[0-9]*')

# 4. Enroll student in batch
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -d "{\"StudentID\":$STUDENT_ID,\"BatchID\":$BATCH_ID,\"Status\":\"Active\"}"

# 5. Mark attendance
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -d "{\"StudentID\":$STUDENT_ID,\"BatchID\":$BATCH_ID,\"ClassDate\":\"2024-03-28\",\"Status\":\"Present\"}"

# 6. Create invoice
INVOICE=$(curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -d "{\"StudentID\":$STUDENT_ID,\"InvoiceDate\":\"2024-03-28\",\"TotalAmount\":300.00,\"Status\":\"Pending\"}")
INVOICE_ID=$(echo $INVOICE | grep -o '"InvoiceID":[0-9]*' | grep -o '[0-9]*')

# 7. Record payment
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d "{\"InvoiceID\":$INVOICE_ID,\"PaymentDate\":\"2024-03-28T14:30:00\",\"AmountPaid\":300.00,\"PaymentMethod\":\"Cash\"}"
```

---

## Health Check

Test if the server is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"message": "Server is running"}
```

---

## Notes

- All dates should be in `YYYY-MM-DD` format
- Times should be in `HH:MM:SS` format
- DateTime should be in ISO format: `YYYY-MM-DDTHH:MM:SS`
- All monetary values use DECIMAL format with 2 decimal places
- IDs are auto-incremented integers (generated by database)
- Use `curl -i` to see response headers including status codes
- For Windows PowerShell, you may need to escape quotes or use `@'...'@` syntax

---

**Last Updated**: March 28, 2026
