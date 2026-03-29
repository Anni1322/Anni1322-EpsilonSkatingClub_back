const pool = require('../config/database');

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Attendance');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Attendance WHERE AttendanceID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance by student ID
exports.getAttendanceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Attendance WHERE StudentID = ?', [studentId]);
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance by batch ID
exports.getAttendanceByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Attendance WHERE BatchID = ?', [batchId]);
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { StudentID, BatchID, ClassDate, Status } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Attendance (StudentID, BatchID, ClassDate, Status) VALUES (?, ?, ?, ?)',
      [StudentID, BatchID, ClassDate, Status]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Attendance record created successfully', 
      AttendanceID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Attendance SET Status=? WHERE AttendanceID=?',
      [Status, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Attendance WHERE AttendanceID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
