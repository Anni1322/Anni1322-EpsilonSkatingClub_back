const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Routes
router.get('/', attendanceController.getAllAttendance);
router.get('/:id', attendanceController.getAttendanceById);
router.get('/student/:studentId', attendanceController.getAttendanceByStudentId);
router.get('/batch/:batchId', attendanceController.getAttendanceByBatchId);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
