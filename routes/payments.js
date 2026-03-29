const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Routes
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.get('/invoice/:invoiceId', paymentController.getPaymentsByInvoiceId);
router.post('/', paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
