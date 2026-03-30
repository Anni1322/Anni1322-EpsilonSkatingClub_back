const express = require('express');
const router = express.Router();
const { studentUpload } = require('../config/multer');
const studentController = require('../controllers/studentController');
const { verifyAnyToken, verifyTeacherToken, verifyUserToken } = require('../middleware/authMiddleware');

// Routes
router.get('/', verifyTeacherToken, studentController.getAllStudents);
router.get('/me', verifyUserToken, studentController.getCurrentStudent);
router.get('/:id', verifyAnyToken, studentController.getStudentById);
router.post('/', verifyTeacherToken, studentUpload.single('PhotoPath'), studentController.createStudent);
router.put('/:id', verifyTeacherToken, studentUpload.single('PhotoPath'), studentController.updateStudent);
router.delete('/:id', verifyTeacherToken, studentController.deleteStudent);

module.exports = router;
