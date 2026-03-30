const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { verifyAnyToken } = require('../middleware/authMiddleware');

// Routes
router.get('/', verifyAnyToken, enrollmentController.getAllEnrollments);
router.get('/student/:studentId', verifyAnyToken, enrollmentController.getEnrollmentsByStudentId);
router.get('/:id', verifyAnyToken, enrollmentController.getEnrollmentById);
router.post('/', verifyAnyToken, enrollmentController.createEnrollment);
router.put('/:id', verifyAnyToken, enrollmentController.updateEnrollment);
router.delete('/:id', verifyAnyToken, enrollmentController.deleteEnrollment);

module.exports = router;
