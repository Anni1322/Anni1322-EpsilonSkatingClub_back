const pool = require('../config/database');

const isTeacher = (user) => user?.role === 'teacher';
const isSameStudent = (user, studentId) => String(user?.studentId || '') === String(studentId || '');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can view all invoices' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Invoices');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Invoices WHERE InvoiceID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (!isTeacher(req.user) && !isSameStudent(req.user, rows[0].StudentID)) {
      return res.status(403).json({ error: 'You can only view your own invoices' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoices by student ID
exports.getInvoicesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!isTeacher(req.user) && !isSameStudent(req.user, studentId)) {
      return res.status(403).json({ error: 'You can only view your own invoices' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Invoices WHERE StudentID = ?', [studentId]);
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can create invoices' });
    }

    const { StudentID, InvoiceDate, TotalAmount, Status } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Invoices (StudentID, InvoiceDate, TotalAmount, Status) VALUES (?, ?, ?, ?)',
      [StudentID, InvoiceDate, TotalAmount, Status || 'Pending']
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Invoice created successfully', 
      InvoiceID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can update invoices' });
    }

    const { id } = req.params;
    const { StudentID, InvoiceDate, TotalAmount, Status } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Invoices SET StudentID=?, InvoiceDate=?, TotalAmount=?, Status=? WHERE InvoiceID=?',
      [StudentID, InvoiceDate, TotalAmount, Status, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can delete invoices' });
    }

    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Invoices WHERE InvoiceID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
