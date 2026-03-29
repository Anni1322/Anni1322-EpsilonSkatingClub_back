const pool = require('../config/database');

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
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
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get enrollments by student ID
exports.getEnrollmentsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
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
    const { StudentID, BatchID, Status } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Enrollments (StudentID, BatchID, Status) VALUES (?, ?, ?)',
      [StudentID, BatchID, Status || 'Active']
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
