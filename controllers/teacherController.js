const pool = require('../config/database');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Teachers');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Teachers WHERE TeacherID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const { FirstName, LastName, ContactNumber, Specialization } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Teachers (FirstName, LastName, ContactNumber, Specialization) VALUES (?, ?, ?, ?)',
      [FirstName, LastName, ContactNumber, Specialization]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Teacher created successfully', 
      TeacherID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { FirstName, LastName, ContactNumber, Specialization } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Teachers SET FirstName=?, LastName=?, ContactNumber=?, Specialization=? WHERE TeacherID=?',
      [FirstName, LastName, ContactNumber, Specialization, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Teachers WHERE TeacherID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
