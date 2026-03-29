const pool = require('../config/database');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Payments');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Payments WHERE PaymentID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payments by invoice ID
exports.getPaymentsByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Payments WHERE InvoiceID = ?', [invoiceId]);
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { InvoiceID, PaymentDate, AmountPaid, PaymentMethod } = req.body;
    
    // Convert datetime-local format to MySQL DATETIME format
    const formattedDate = PaymentDate ? new Date(PaymentDate).toISOString().replace('Z', '').replace('T', ' ').slice(0, 19) : new Date().toISOString().replace('Z', '').replace('T', ' ').slice(0, 19);
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Payments (InvoiceID, PaymentDate, AmountPaid, PaymentMethod) VALUES (?, ?, ?, ?)',
      [InvoiceID, formattedDate, AmountPaid, PaymentMethod]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Payment created successfully', 
      PaymentID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { InvoiceID, PaymentDate, AmountPaid, PaymentMethod } = req.body;
    
    // Convert datetime-local format to MySQL DATETIME format
    const formattedDate = PaymentDate ? new Date(PaymentDate).toISOString().replace('Z', '').replace('T', ' ').slice(0, 19) : new Date().toISOString().replace('Z', '').replace('T', ' ').slice(0, 19);
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Payments SET InvoiceID=?, PaymentDate=?, AmountPaid=?, PaymentMethod=? WHERE PaymentID=?',
      [InvoiceID, formattedDate, AmountPaid, PaymentMethod, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Payments WHERE PaymentID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
