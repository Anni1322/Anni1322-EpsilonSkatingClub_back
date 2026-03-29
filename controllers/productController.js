const pool = require('../config/database');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Products');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Products WHERE ProductID = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { ProductName, Category, Size, UnitPrice, StockQuantity } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Products (ProductName, Category, Size, UnitPrice, StockQuantity) VALUES (?, ?, ?, ?, ?)',
      [ProductName, Category, Size, UnitPrice, StockQuantity || 0]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Product created successfully', 
      ProductID: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { ProductName, Category, Size, UnitPrice, StockQuantity } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Products SET ProductName=?, Category=?, Size=?, UnitPrice=?, StockQuantity=? WHERE ProductID=?',
      [ProductName, Category, Size, UnitPrice, StockQuantity, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Products WHERE ProductID = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
