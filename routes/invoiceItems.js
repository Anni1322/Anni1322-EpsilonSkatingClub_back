const express = require('express');
const router = express.Router();
const invoiceItemController = require('../controllers/invoiceItemController');

// Routes - Specific routes must come before generic /:id routes
router.get('/', invoiceItemController.getAllInvoiceItems);
router.get('/invoice/:invoiceId', invoiceItemController.getInvoiceItemsByInvoiceId);
router.get('/:id', invoiceItemController.getInvoiceItemById);
router.post('/', invoiceItemController.createInvoiceItem);
router.put('/:id', invoiceItemController.updateInvoiceItem);
router.delete('/:id', invoiceItemController.deleteInvoiceItem);

module.exports = router;
