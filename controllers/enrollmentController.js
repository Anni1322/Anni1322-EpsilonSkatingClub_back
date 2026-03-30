const pool = require('../config/database');

const isTeacher = (user) => user?.role === 'teacher';
const isSameStudent = (user, studentId) => String(user?.studentId || '') === String(studentId || '');

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can view all enrollments' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Enrollments');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Enrollments WHERE EnrollmentID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (!isTeacher(req.user) && !isSameStudent(req.user, rows[0].StudentID)) {
      return res.status(403).json({ error: 'You can only view your own enrollments' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments by student ID
exports.getEnrollmentsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!isTeacher(req.user) && !isSameStudent(req.user, studentId)) {
      return res.status(403).json({ error: 'You can only view your own enrollments' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Enrollments WHERE StudentID = ?', [studentId]);
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const requestedStudentId = req.body.StudentID;
    const studentId = isTeacher(req.user) ? requestedStudentId : req.user?.studentId;
    const { BatchID, Status } = req.body;

    if (!studentId || !BatchID) {
      return res.status(400).json({ error: 'StudentID and BatchID are required' });
    }
    
    const connection = await pool.getConnection();
    const [studentRows] = await connection.query('SELECT StudentID FROM Students WHERE StudentID = ?', [studentId]);
    if (studentRows.length === 0) {
      await connection.query(
        'INSERT INTO Students (StudentID, RegistrationDate, SkillLevel, TermsAccepted) VALUES (?, CURDATE(), ?, ?)',
        [studentId, 'Beginner', false]
      );
    }

    const [existingEnrollment] = await connection.query(
      'SELECT EnrollmentID FROM Enrollments WHERE StudentID = ? AND BatchID = ?',
      [studentId, BatchID]
    );

    if (existingEnrollment.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Student is already enrolled in this batch' });
    }

    const [result] = await connection.query(
      'INSERT INTO Enrollments (StudentID, BatchID, Status) VALUES (?, ?, ?)',
      [studentId, BatchID, Status || 'Active']
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Enrollment created successfully', 
      EnrollmentID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update enrollment
exports.updateEnrollment = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can update enrollments' });
    }

    const { id } = req.params;
    const { Status } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Enrollments SET Status=? WHERE EnrollmentID=?',
      [Status, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(200).json({ message: 'Enrollment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can delete enrollments' });
    }

    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Enrollments WHERE EnrollmentID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
