const pool = require('../config/database');

const isTeacher = (user) => user?.role === 'teacher';
const isSameStudent = (user, studentId) => String(user?.studentId || '') === String(studentId || '');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Students');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current logged in student profile
exports.getCurrentStudent = async (req, res) => {
  try {
    const studentId = req.user?.studentId;

    if (!studentId) {
      return res.status(400).json({ error: 'Student profile not available' });
    }

    const connection = await pool.getConnection();
    const [students] = await connection.query('SELECT * FROM Students WHERE StudentID = ?', [studentId]);
    const [users] = await connection.query('SELECT Email, IsActive FROM Users WHERE StudentID = ?', [studentId]);
    connection.release();

    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      ...students[0],
      Email: users[0]?.Email || '',
      IsActive: users[0]?.IsActive ?? true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isTeacher(req.user) && !isSameStudent(req.user, id)) {
      return res.status(403).json({ error: 'You can only view your own student profile' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Students WHERE StudentID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const { FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, RegistrationDate, SkillLevel, TermsAccepted } = req.body;
    
    console.log('=== Student Create Request ===');
    console.log('Body fields:', { FirstName, LastName, DOB, TermsAccepted });
    console.log('File received:', req.file ? { 
      filename: req.file.filename, 
      fieldname: req.file.fieldname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path 
    } : 'No file');
    
    // Get file path if image was uploaded
    let PhotoPath = null;
    if (req.file) {
      PhotoPath = `/uploads/students/${req.file.filename}`;
      console.log('✓ PhotoPath set to:', PhotoPath);
    } else {
      console.log('ℹ No file uploaded');
    }
    
    // Convert FormData string boolean to integer (0 or 1)
    const termsAcceptedValue = TermsAccepted === 'true' || TermsAccepted === true ? 1 : 0;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Students (FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, RegistrationDate, SkillLevel, TermsAccepted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, RegistrationDate, SkillLevel, termsAcceptedValue]
    );
    connection.release();
    
    console.log('✓ Student created with ID:', result.insertId);
    
    res.status(201).json({ 
      message: 'Student created successfully', 
      StudentID: result.insertId,
      PhotoPath: PhotoPath
    });
  } catch (error) {
    console.error('❌ Error creating student:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ error: 'Failed to create student', details: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can update students' });
    }

    const { FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, SkillLevel, TermsAccepted } = req.body;
    
    // Get existing student to handle file replacement
    let connection = await pool.getConnection();
    const [existingStudent] = await connection.query('SELECT PhotoPath FROM Students WHERE StudentID = ?', [id]);
    connection.release();
    
    if (existingStudent.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Use new file path if uploaded, otherwise keep existing
    let PhotoPath = existingStudent[0].PhotoPath;
    if (req.file) {
      PhotoPath = `/uploads/students/${req.file.filename}`;
    }
    
    // Convert FormData string boolean to integer (0 or 1)
    const termsAcceptedValue = TermsAccepted === 'true' || TermsAccepted === true ? 1 : 0;
    
    connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Students SET FirstName=?, LastName=?, DOB=?, Gender=?, FatherName=?, MotherName=?, SchoolName=?, SchoolGrade=?, Address=?, ContactNumber=?, EmergencyContact=?, PhotoPath=?, SkillLevel=?, TermsAccepted=? WHERE StudentID=?',
      [FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, SkillLevel, termsAcceptedValue, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', PhotoPath: PhotoPath });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student', details: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can delete students' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Students WHERE StudentID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
