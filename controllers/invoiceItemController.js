const pool = require('../config/database');

// Get all invoice items
exports.getAllInvoiceItems = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Invoice_Items');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoice item by ID
exports.getInvoiceItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Invoice_Items WHERE LineItemID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Invoice item not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoice items by invoice ID
exports.getInvoiceItemsByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Invoice_Items WHERE InvoiceID = ?', [invoiceId]);
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create invoice item
exports.createInvoiceItem = async (req, res) => {
  try {
    const { InvoiceID, ItemType, ProductID, Quantity, Price } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Invoice_Items (InvoiceID, ItemType, ProductID, Quantity, Price) VALUES (?, ?, ?, ?, ?)',
      [InvoiceID, ItemType, ProductID, Quantity || 1, Price]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Invoice item created successfully', 
      LineItemID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update invoice item
exports.updateInvoiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { ItemType, ProductID, Quantity, Price } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Invoice_Items SET ItemType=?, ProductID=?, Quantity=?, Price=? WHERE LineItemID=?',
      [ItemType, ProductID, Quantity, Price, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice item not found' });
    }
    res.status(200).json({ message: 'Invoice item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete invoice item
exports.deleteInvoiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Invoice_Items WHERE LineItemID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice item not found' });
    }
    res.status(200).json({ message: 'Invoice item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
