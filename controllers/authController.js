const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../middleware/authMiddleware');
const { generateStudentID, generateTeacherID } = require('../utils/idGenerator');

const buildStudentUserPayload = (user, student = {}) => ({
  UserID: user.UserID,
  Email: user.Email,
  StudentID: user.StudentID,
  FirstName: student.FirstName || '',
  LastName: student.LastName || '',
  PhotoPath: student.PhotoPath || '',
  SkillLevel: student.SkillLevel || 'Beginner',
  Role: 'student'
});

const buildTeacherUserPayload = (teacher = {}) => ({
  TeacherID: teacher.TeacherID,
  Email: teacher.Email,
  FirstName: teacher.FirstName || '',
  LastName: teacher.LastName || '',
  ContactNumber: teacher.ContactNumber || '',
  Specialization: teacher.Specialization || '',
  PhotoPath: teacher.PhotoPath || '',
  IsAdmin: teacher.IsAdmin,
  Role: 'teacher'
});

// ==========================================
// USER (STUDENT) AUTHENTICATION
// ==========================================

// Register new student user
exports.registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
    console.log('=== User Registration ===');
    console.log('Email:', email);
    
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Email, password, and confirmation required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const connection = await pool.getConnection();
    
    // Check if email already exists
    const [existingUser] = await connection.query('SELECT UserID FROM Users WHERE Email = ?', [email]);
    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Generate StudentID automatically
    const StudentID = await generateStudentID();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // First create student record in Students table
    try {
      await connection.query(
        'INSERT INTO Students (StudentID, RegistrationDate, SkillLevel, TermsAccepted) VALUES (?, CURDATE(), ?, ?)',
        [StudentID, 'Beginner', false]
      );
      console.log('✓ Student record created with StudentID:', StudentID);
    } catch (studentErr) {
      console.error('❌ Error creating student record:', studentErr.message);
      connection.release();
      return res.status(500).json({ error: 'Failed to create student record', details: studentErr.message });
    }
    
    // Then create user in Users table
    const [result] = await connection.query(
      'INSERT INTO Users (Email, PasswordHash, StudentID, IsActive) VALUES (?, ?, ?, ?)',
      [email, passwordHash, StudentID, true]
    );
    connection.release();
    
    console.log('✓ User registered with StudentID:', StudentID);
    
    const token = generateToken({
      id: result.insertId,
      email,
      studentId: StudentID,
      role: 'student'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      needsProfileCompletion: true,
      user: {
        UserID: result.insertId,
        Email: email,
        StudentID,
        FirstName: '',
        LastName: '',
        PhotoPath: '',
        SkillLevel: 'Beginner',
        Role: 'student'
      }
    });
  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};




// Login student user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=== User Login ===');
    console.log('Email:', email);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const connection = await pool.getConnection();
    
    // Find user by email
    const [users] = await connection.query('SELECT * FROM Users WHERE Email = ? AND IsActive = ?', [email, true]);
    
    if (users.length === 0) {
      connection.release();
      console.log('❌ User not found or inactive:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatch) {
      connection.release();
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Get student details for profile
    const [students] = await connection.query('SELECT * FROM Students WHERE StudentID = ?', [user.StudentID]);
    connection.release();
    
    // Generate token
    const token = generateToken({
      id: user.UserID,
      email: email,
      studentId: user.StudentID,
      role: 'student'
    });
    
    console.log('✓ User logged in:', email);
    
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: buildStudentUserPayload(user, students[0]),
      needsProfileCompletion: !students[0]?.FirstName || !students[0]?.ContactNumber
    });
  } catch (error) {
    console.error('❌ Error logging in user:', error.message);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT UserID, Email, StudentID, IsActive FROM Users WHERE UserID = ?', [userId]);
    
    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    
    // Get student details
    const [students] = await connection.query('SELECT * FROM Students WHERE StudentID = ?', [user.StudentID]);
    connection.release();
    
    res.status(200).json({
      user: {
        ...buildStudentUserPayload(user, students[0]),
        IsActive: user.IsActive,
        ...students[0]
      }
    });
  } catch (error) {
    console.error('❌ Error getting user profile:', error.message);
    res.status(500).json({ error: 'Failed to get profile', details: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = req.user.studentId;
    const {
      Email,
      FirstName,
      LastName,
      DOB,
      Gender,
      FatherName,
      MotherName,
      SchoolName,
      SchoolGrade,
      Address,
      ContactNumber,
      EmergencyContact,
      RegistrationDate,
      SkillLevel,
      TermsAccepted
    } = req.body;

    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT UserID, Email, StudentID, IsActive FROM Users WHERE UserID = ?', [userId]);

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    if (Email && Email !== users[0].Email) {
      const [existingEmail] = await connection.query('SELECT UserID FROM Users WHERE Email = ? AND UserID <> ?', [Email, userId]);
      if (existingEmail.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    const [students] = await connection.query('SELECT PhotoPath FROM Students WHERE StudentID = ?', [studentId]);
    const photoPath = req.file ? `/uploads/students/${req.file.filename}` : students[0]?.PhotoPath || null;
    const termsAcceptedValue = TermsAccepted === 'true' || TermsAccepted === true ? 1 : 0;

    await connection.query(
      `UPDATE Students
       SET FirstName=?, LastName=?, DOB=?, Gender=?, FatherName=?, MotherName=?, SchoolName=?, SchoolGrade=?, Address=?, ContactNumber=?, EmergencyContact=?, PhotoPath=?, RegistrationDate=?, SkillLevel=?, TermsAccepted=?
       WHERE StudentID=?`,
      [
        FirstName || null,
        LastName || null,
        DOB || null,
        Gender || null,
        FatherName || null,
        MotherName || null,
        SchoolName || null,
        SchoolGrade || null,
        Address || null,
        ContactNumber || null,
        EmergencyContact || null,
        photoPath,
        RegistrationDate || null,
        SkillLevel || 'Beginner',
        termsAcceptedValue,
        studentId
      ]
    );

    if (Email) {
      await connection.query('UPDATE Users SET Email = ? WHERE UserID = ?', [Email, userId]);
    }

    const [updatedUsers] = await connection.query('SELECT UserID, Email, StudentID, IsActive FROM Users WHERE UserID = ?', [userId]);
    const [updatedStudents] = await connection.query('SELECT * FROM Students WHERE StudentID = ?', [studentId]);
    connection.release();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...buildStudentUserPayload(updatedUsers[0], updatedStudents[0]),
        IsActive: updatedUsers[0].IsActive,
        ...updatedStudents[0]
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

// ==========================================
// TEACHER (ADMIN) AUTHENTICATION
// ==========================================


// Register new Teacher
exports.registerTeacher = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Email, password, and confirmation required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const connection = await pool.getConnection();

    // 1. Check if email exists in Teachers table
    const [existing] = await connection.query('SELECT TeacherID FROM Teachers WHERE Email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Teacher email already registered' });
    }

    // 2. Generate TeacherID
    const TeacherID = await generateTeacherID();

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Insert into Teachers table
    // Note: We set IsActive to true and IsAdmin based on your needs (default false)
    await connection.query(
      'INSERT INTO Teachers (TeacherID, FirstName, LastName, Email, PasswordHash, IsActive, IsAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [TeacherID, '', '', email, passwordHash, true, false]
    );

    connection.release();

    const token = generateToken({
      id: TeacherID,
      email,
      role: 'teacher',
      isAdmin: false
    });

    res.status(201).json({
      message: 'Teacher registered successfully',
      token,
      needsProfileCompletion: true,
      user: {
        TeacherID,
        Email: email,
        FirstName: '',
        LastName: '',
        ContactNumber: '',
        Specialization: '',
        PhotoPath: '',
        IsAdmin: false,
        Role: 'teacher'
      }
    });
  } catch (error) {
    console.error('❌ Teacher Reg Error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Teacher login
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=== Teacher Login ===');
    console.log('email:', email);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const connection = await pool.getConnection();
    
    // Find teacher by email
    const [teachers] = await connection.query(
      'SELECT * FROM Teachers WHERE Email = ? AND IsActive = ?',
      [email, true]
    );
    
    if (teachers.length === 0) {
      connection.release();
      console.log('❌ Teacher not found or inactive:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const teacher = teachers[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, teacher.PasswordHash);
    if (!passwordMatch) {
      connection.release();
      console.log('❌ Password mismatch for teacher:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    connection.release();
    
    // Generate token with admin flag
    const token = generateToken({
      id: teacher.TeacherID,
      email: email,
      role: 'teacher',
      isAdmin: teacher.IsAdmin
    });
    
    console.log('✓ Teacher logged in:', email, '(Admin:', teacher.IsAdmin, ')');
    
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: buildTeacherUserPayload(teacher),
      needsProfileCompletion: !teacher.FirstName || !teacher.LastName
    });
  } catch (error) {
    console.error('❌ Error logging in teacher:', error.message);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Set teacher password (one-time setup)
exports.setTeacherPassword = async (req, res) => {
  try {
    const { teacherID, email, password, confirmPassword } = req.body;
    
    console.log('=== Teacher Password Setup ===');
    console.log('TeacherID:', teacherID, 'Email:', email);
    
    if (!password || !confirmPassword) {
      return res.status(400).json({ error: 'Password and confirmation required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const connection = await pool.getConnection();
    
    // Check if teacher exists
    const [teachers] = await connection.query('SELECT TeacherID FROM Teachers WHERE TeacherID = ?', [teacherID]);
    if (teachers.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Update teacher with email and password
    await connection.query(
      'UPDATE Teachers SET Email = ?, PasswordHash = ? WHERE TeacherID = ?',
      [email, passwordHash, teacherID]
    );
    connection.release();
    
    console.log('✓ Teacher password set for ID:', teacherID);
    
    res.status(200).json({
      message: 'Password set successfully. You can now login.'
    });
  } catch (error) {
    console.error('❌ Error setting teacher password:', error.message);
    res.status(500).json({ error: 'Failed to set password', details: error.message });
  }
};

// Get teacher profile
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    const connection = await pool.getConnection();
    const [teachers] = await connection.query(
      'SELECT TeacherID, FirstName, LastName, Email, ContactNumber, Specialization, PhotoPath, IsAdmin, IsActive FROM Teachers WHERE TeacherID = ?',
      [teacherId]
    );
    connection.release();
    
    if (teachers.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    res.status(200).json({ teacher: teachers[0] });
  } catch (error) {
    console.error('❌ Error getting teacher profile:', error.message);
    res.status(500).json({ error: 'Failed to get profile', details: error.message });
  }
};
