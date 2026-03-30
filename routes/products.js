const express = require('express');
const router = express.Router();
const { productUpload } = require('../config/multer');
const productController = require('../controllers/productController');
const { verifyAnyToken, verifyUserToken } = require('../middleware/authMiddleware');

// Routes
router.get('/', productController.getAllProducts);
router.get('/purchases/me', verifyUserToken, productController.getMyPurchases);
router.post('/purchase', verifyUserToken, productController.purchaseProduct);
router.get('/:id', productController.getProductById);
router.post('/', verifyAnyToken, productUpload.single('ImagePath'), productController.createProduct);
router.put('/:id', verifyAnyToken, productUpload.single('ImagePath'), productController.updateProduct);
router.delete('/:id', verifyAnyToken, productController.deleteProduct);

module.exports = router;
