const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Routes
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.get('/student/:studentId', invoiceController.getInvoicesByStudentId);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
