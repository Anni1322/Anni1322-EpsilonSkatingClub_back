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
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Batches (BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity) VALUES (?, ?, ?, ?, ?, ?)',
      [BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Batch created successfully', 
      BatchID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Batches SET BatchName=?, TeacherID=?, DaysOfWeek=?, StartTime=?, EndTime=?, MaxCapacity=? WHERE BatchID=?',
      [BatchName, TeacherID, DaysOfWeek, StartTime, EndTime, MaxCapacity, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
