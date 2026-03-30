const pool = require('../config/database');

const isTeacher = (user) => user?.role === 'teacher';
const isSameStudent = (user, studentId) => String(user?.studentId || '') === String(studentId || '');

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can view all attendance records' });
    }

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

    if (!isTeacher(req.user) && !isSameStudent(req.user, rows[0].StudentID)) {
      return res.status(403).json({ error: 'You can only view your own attendance' });
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

    if (!isTeacher(req.user) && !isSameStudent(req.user, studentId)) {
      return res.status(403).json({ error: 'You can only view your own attendance' });
    }

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
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can view attendance by batch' });
    }

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
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can create attendance records' });
    }

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
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can update attendance records' });
    }

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
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can delete attendance records' });
    }

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
