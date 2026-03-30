const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyAnyToken } = require('../middleware/authMiddleware');

// Routes
router.get('/', verifyAnyToken, attendanceController.getAllAttendance);
router.get('/student/:studentId', verifyAnyToken, attendanceController.getAttendanceByStudentId);
router.get('/batch/:batchId', verifyAnyToken, attendanceController.getAttendanceByBatchId);
router.get('/:id', verifyAnyToken, attendanceController.getAttendanceById);
router.post('/', verifyAnyToken, attendanceController.createAttendance);
router.put('/:id', verifyAnyToken, attendanceController.updateAttendance);
router.delete('/:id', verifyAnyToken, attendanceController.deleteAttendance);

module.exports = router;
