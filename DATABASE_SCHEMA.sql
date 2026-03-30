-- ==========================================
-- EPSILON SKATING CLUB - DATABASE SCHEMA v2
-- (Updated to match physical registration form)
-- ==========================================

CREATE DATABASE IF NOT EXISTS EpsilonSkatingClub;
USE EpsilonSkatingClub;

-- ==========================================
-- 1. CORE ENTITIES (Users & Inventory)
-- ==========================================

CREATE TABLE IF NOT EXISTS Students (
    StudentID VARCHAR(10) PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DOB DATE,
    Gender ENUM('M', 'F', 'Other'),             -- Added from Form
    FatherName VARCHAR(100),                    -- Added from Form
    MotherName VARCHAR(100),                    -- Added from Form
    SchoolName VARCHAR(150),                    -- Added from Form
    SchoolGrade VARCHAR(50),                    -- Added from Form (Listed as 'CLASS')
    Address TEXT,                               -- Added from Form
    ContactNumber VARCHAR(15),                  -- Listed as 'MOBILE NO.'
    EmergencyContact VARCHAR(15), 
    PhotoPath VARCHAR(500),                     -- Added for [PHOTO Box]
    RegistrationDate DATE,                      -- Listed as 'JOINING DATE'
    SkillLevel VARCHAR(20) DEFAULT 'Beginner',
    TermsAccepted BOOLEAN DEFAULT FALSE         -- Represents the Parent/Coach signatures
);

CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    StudentID VARCHAR(10),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Teachers (
    TeacherID VARCHAR(10) PRIMARY KEY,
    FirstName VARCHAR(50) DEFAULT '',
    LastName VARCHAR(50) DEFAULT '',
    ContactNumber VARCHAR(15),
    Specialization VARCHAR(50),
    PhotoPath VARCHAR(500),
    Email VARCHAR(255) UNIQUE,
    PasswordHash VARCHAR(255),
    IsAdmin BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50),
    Size VARCHAR(20),
    UnitPrice DECIMAL(10,2) NOT NULL,
    StockQuantity INT DEFAULT 0,
    ImagePath VARCHAR(500)
);

-- ==========================================
-- 2. SCHEDULING & ATTENDANCE
-- ==========================================

CREATE TABLE IF NOT EXISTS Batches (
    BatchID INT AUTO_INCREMENT PRIMARY KEY,
    BatchName VARCHAR(50) NOT NULL,
    TeacherID VARCHAR(10),
    DaysOfWeek VARCHAR(50),
    StartTime TIME,
    EndTime TIME,
    MaxCapacity INT,
    FOREIGN KEY (TeacherID) REFERENCES Teachers(TeacherID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Enrollments (
    EnrollmentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID VARCHAR(10),
    BatchID INT,
    Status VARCHAR(20) DEFAULT 'Active',
    UNIQUE KEY uq_enrollment_student_batch (StudentID, BatchID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (BatchID) REFERENCES Batches(BatchID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID VARCHAR(10),
    BatchID INT,
    ClassDate DATE,
    Status VARCHAR(10),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (BatchID) REFERENCES Batches(BatchID) ON DELETE CASCADE
);

-- ==========================================
-- 3. BILLING & FINANCIALS
-- ==========================================

CREATE TABLE IF NOT EXISTS Invoices (
    InvoiceID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID VARCHAR(10), 
    InvoiceDate DATE,
    TotalAmount DECIMAL(10,2),
    Status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Invoice_Items (
    LineItemID INT AUTO_INCREMENT PRIMARY KEY,
    InvoiceID INT,
    ItemType VARCHAR(50), -- e.g., 'Registration Fee', 'Monthly Fee', 'Store Product'
    ProductID INT, 
    Quantity INT DEFAULT 1,
    Price DECIMAL(10,2),
    FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    InvoiceID INT,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    AmountPaid DECIMAL(10,2),
    PaymentMethod VARCHAR(30),
    FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID) ON DELETE CASCADE
);
