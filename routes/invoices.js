const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { verifyAnyToken } = require('../middleware/authMiddleware');

// Routes
router.get('/', verifyAnyToken, invoiceController.getAllInvoices);
router.get('/student/:studentId', verifyAnyToken, invoiceController.getInvoicesByStudentId);
router.get('/:id', verifyAnyToken, invoiceController.getInvoiceById);
router.post('/', verifyAnyToken, invoiceController.createInvoice);
router.put('/:id', verifyAnyToken, invoiceController.updateInvoice);
router.delete('/:id', verifyAnyToken, invoiceController.deleteInvoice);

module.exports = router;
