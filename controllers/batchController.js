const pool = require('../config/database');

// Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Batches');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get batch by ID
exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Batches WHERE BatchID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create batch
exports.createBatch = async (req, res) => {
  try {
    const { BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity } = req.body;
    
    // Get file path if image was uploaded
    let ImagePath = null;
    if (req.file) {
      ImagePath = `/uploads/batches/${req.file.filename}`;
    }
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Batches (BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity, ImagePath) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity, ImagePath]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Batch created successfully', 
      BatchID: result.insertId,
      ImagePath: ImagePath
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ error: 'Failed to create batch', details: error.message });
  }
};

// Update batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity } = req.body;
    
    const connection = await pool.getConnection();
    
    // Get existing ImagePath if no new file is uploaded
    let ImagePath = null;
    if (req.file) {
      ImagePath = `/uploads/batches/${req.file.filename}`;
    } else {
      // Retrieve existing ImagePath from database
      const [existing] = await connection.query('SELECT ImagePath FROM Batches WHERE BatchID = ?', [id]);
      if (existing.length > 0) {
        ImagePath = existing[0].ImagePath;
      }
    }
    
    const [result] = await connection.query(
      'UPDATE Batches SET BatchName=?, TeacherID=?, DaysOfWeek=?, StartTime=?, EndTime=?, MaxCapacity=?, ImagePath=? WHERE BatchID=?',
      [BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity, ImagePath, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ 
      message: 'Batch updated successfully',
      ImagePath: ImagePath
    });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ error: 'Failed to update batch', details: error.message });
  }
};

// Delete batch
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Batches WHERE BatchID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
