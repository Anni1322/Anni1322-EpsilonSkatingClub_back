const express = require('express');
const router = express.Router();
const { teacherUpload } = require('../config/multer');
const teacherController = require('../controllers/teacherController');
const { verifyTeacherToken } = require('../middleware/authMiddleware');

// Routes
router.get('/me', verifyTeacherToken, teacherController.getCurrentTeacher);
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.post('/', teacherUpload.single('PhotoPath'), teacherController.createTeacher);
router.put('/me', verifyTeacherToken, teacherUpload.single('PhotoPath'), teacherController.updateCurrentTeacher);
router.put('/:id', teacherUpload.single('PhotoPath'), teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
