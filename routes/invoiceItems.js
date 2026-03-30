const express = require('express');
const router = express.Router();
const invoiceItemController = require('../controllers/invoiceItemController');
const { verifyAnyToken } = require('../middleware/authMiddleware');

// Routes - Specific routes must come before generic /:id routes
router.get('/', verifyAnyToken, invoiceItemController.getAllInvoiceItems);
router.get('/invoice/:invoiceId', verifyAnyToken, invoiceItemController.getInvoiceItemsByInvoiceId);
router.get('/:id', verifyAnyToken, invoiceItemController.getInvoiceItemById);
router.post('/', verifyAnyToken, invoiceItemController.createInvoiceItem);
router.put('/:id', verifyAnyToken, invoiceItemController.updateInvoiceItem);
router.delete('/:id', verifyAnyToken, invoiceItemController.deleteInvoiceItem);

module.exports = router;
