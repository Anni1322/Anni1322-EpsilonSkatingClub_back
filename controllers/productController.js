const pool = require('../config/database');

const isTeacher = (user) => user?.role === 'teacher';

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
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can create products' });
    }

    const { ProductName, Category, Size, UnitPrice, StockQuantity } = req.body;
    
    // Get file path if image was uploaded
    let ImagePath = null;
    if (req.file) {
      ImagePath = `/uploads/products/${req.file.filename}`;
    }
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Products (ProductName, Category, Size, UnitPrice, StockQuantity, ImagePath) VALUES (?, ?, ?, ?, ?, ?)',
      [ProductName, Category, Size, UnitPrice, StockQuantity || 0, ImagePath]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Product created successfully', 
      ProductID: result.insertId,
      ImagePath: ImagePath
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can update products' });
    }

    const { id } = req.params;
    const { ProductName, Category, Size, UnitPrice, StockQuantity } = req.body;
    
    const connection = await pool.getConnection();
    
    // Get existing ImagePath if no new file is uploaded
    let ImagePath = null;
    if (req.file) {
      ImagePath = `/uploads/products/${req.file.filename}`;
    } else {
      // Retrieve existing ImagePath from database
      const [existing] = await connection.query('SELECT ImagePath FROM Products WHERE ProductID = ?', [id]);
      if (existing.length > 0) {
        ImagePath = existing[0].ImagePath;
      }
    }
    
    const [result] = await connection.query(
      'UPDATE Products SET ProductName=?, Category=?, Size=?, UnitPrice=?, StockQuantity=?, ImagePath=? WHERE ProductID=?',
      [ProductName, Category, Size, UnitPrice, StockQuantity, ImagePath, id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ 
      message: 'Product updated successfully',
      ImagePath: ImagePath
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    if (!isTeacher(req.user)) {
      return res.status(403).json({ error: 'Only teachers can delete products' });
    }

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

// Student purchase flow
exports.purchaseProduct = async (req, res) => {
  let connection;

  try {
    const studentId = req.user?.studentId;
    const { ProductID, Quantity } = req.body;
    const quantity = Number(Quantity || 1);

    if (!studentId) {
      return res.status(400).json({ error: 'Student account required for purchase' });
    }

    if (!ProductID || Number.isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Valid product and quantity are required' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [students] = await connection.query('SELECT StudentID FROM Students WHERE StudentID = ?', [studentId]);
    if (students.length === 0) {
      await connection.query(
        'INSERT INTO Students (StudentID, RegistrationDate, SkillLevel, TermsAccepted) VALUES (?, CURDATE(), ?, ?)',
        [studentId, 'Beginner', false]
      );
    }

    const [products] = await connection.query('SELECT * FROM Products WHERE ProductID = ?', [ProductID]);
    if (products.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];
    if (Number(product.StockQuantity || 0) < quantity) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const totalAmount = Number(product.UnitPrice) * quantity;
    const [invoiceResult] = await connection.query(
      'INSERT INTO Invoices (StudentID, InvoiceDate, TotalAmount, Status) VALUES (?, CURDATE(), ?, ?)',
      [studentId, totalAmount, 'Pending']
    );

    await connection.query(
      'INSERT INTO Invoice_Items (InvoiceID, ItemType, ProductID, Quantity, Price) VALUES (?, ?, ?, ?, ?)',
      [invoiceResult.insertId, 'Store Product', ProductID, quantity, product.UnitPrice]
    );

    await connection.query(
      'UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?',
      [quantity, ProductID]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Product purchased successfully',
      InvoiceID: invoiceResult.insertId
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error purchasing product:', error);
    res.status(500).json({ error: 'Failed to purchase product', details: error.message });
  }
};

// Get current student's product purchases
exports.getMyPurchases = async (req, res) => {
  try {
    const studentId = req.user?.studentId;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT ii.LineItemID AS PurchaseID, ii.InvoiceID, ii.ProductID, ii.Quantity, ii.Price,
              i.InvoiceDate AS PurchaseDate, i.Status AS InvoiceStatus,
              p.ProductName, p.Category, p.Size, p.ImagePath
       FROM Invoice_Items ii
       INNER JOIN Invoices i ON i.InvoiceID = ii.InvoiceID
       LEFT JOIN Products p ON p.ProductID = ii.ProductID
       WHERE i.StudentID = ? AND ii.ItemType = 'Store Product'
       ORDER BY i.InvoiceDate DESC, ii.LineItemID DESC`,
      [studentId]
    );
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
