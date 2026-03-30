const express = require('express');
const router = express.Router();
const { batchUpload } = require('../config/multer');
const batchController = require('../controllers/batchController');
const { verifyTeacherToken } = require('../middleware/authMiddleware');

// Routes
router.get('/', batchController.getAllBatches);
router.get('/:id', batchController.getBatchById);
router.post('/', verifyTeacherToken, batchUpload.single('ImagePath'), batchController.createBatch);
router.put('/:id', verifyTeacherToken, batchUpload.single('ImagePath'), batchController.updateBatch);
router.delete('/:id', verifyTeacherToken, batchController.deleteBatch);

module.exports = router;
