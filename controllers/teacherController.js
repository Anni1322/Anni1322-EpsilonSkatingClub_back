const pool = require('../config/database');

// Get current logged in teacher profile
exports.getCurrentTeacher = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT TeacherID, FirstName, LastName, Email, ContactNumber, Specialization, PhotoPath, IsAdmin, IsActive FROM Teachers WHERE TeacherID = ?',
      [teacherId]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    
    // Get file path if image was uploaded
    let PhotoPath = null;
    if (req.file) {
      PhotoPath = `/uploads/teachers/${req.file.filename}`;
    }
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Teachers (FirstName, LastName, ContactNumber, Specialization, PhotoPath) VALUES (?, ?, ?, ?, ?)',
      [FirstName, LastName, ContactNumber, Specialization, PhotoPath]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Teacher created successfully', 
      TeacherID: result.insertId,
      PhotoPath: PhotoPath
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher', details: error.message });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { FirstName, LastName, ContactNumber, Specialization } = req.body;
    
    // Get existing teacher to handle file replacement
    let connection = await pool.getConnection();
    const [existingTeacher] = await connection.query('SELECT PhotoPath FROM Teachers WHERE TeacherID = ?', [id]);
    connection.release();
    
    if (existingTeacher.length === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Use new file path if uploaded, otherwise keep existing
    let PhotoPath = existingTeacher[0].PhotoPath;
    if (req.file) {
      PhotoPath = `/uploads/teachers/${req.file.filename}`;
    }
    
    connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Teachers SET FirstName=?, LastName=?, ContactNumber=?, Specialization=?, PhotoPath=? WHERE TeacherID=?',
      [FirstName, LastName, ContactNumber, Specialization, PhotoPath, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher updated successfully', PhotoPath: PhotoPath });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher', details: error.message });
  }
};

// Update current logged in teacher profile
exports.updateCurrentTeacher = async (req, res) => {
  try {
    req.params.id = req.user?.id;
    return exports.updateTeacher(req, res);
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
