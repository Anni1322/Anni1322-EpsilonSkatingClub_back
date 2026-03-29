const pool = require('../config/database');

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

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
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
    const { FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, RegistrationDate, SkillLevel, TermsAccepted } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Students (FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, RegistrationDate, SkillLevel, TermsAccepted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, RegistrationDate, SkillLevel, TermsAccepted]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Student created successfully', 
      StudentID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, SkillLevel, TermsAccepted } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Students SET FirstName=?, LastName=?, DOB=?, Gender=?, FatherName=?, MotherName=?, SchoolName=?, SchoolGrade=?, Address=?, ContactNumber=?, EmergencyContact=?, PhotoPath=?, SkillLevel=?, TermsAccepted=? WHERE StudentID=?',
      [FirstName, LastName, DOB, Gender, FatherName, MotherName, SchoolName, SchoolGrade, Address, ContactNumber, EmergencyContact, PhotoPath, SkillLevel, TermsAccepted, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
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
