const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyUserToken, verifyTeacherToken } = require('../middleware/authMiddleware');
const { studentUpload } = require('../config/multer');

 
// ==========================================
// USER (STUDENT) AUTHENTICATION ROUTES
// ==========================================

// Register new student user
router.post('/user/register', authController.registerUser);


// Login student user
router.post('/user/login', authController.loginUser);

// Get current user profile (Protected)
router.get('/user/profile', verifyUserToken, authController.getUserProfile);
router.put('/user/profile', verifyUserToken, studentUpload.single('PhotoPath'), authController.updateUserProfile);

// ==========================================
// TEACHER (ADMIN) AUTHENTICATION ROUTES
// ==========================================

// Teacher login
router.post('/teacher/register', authController.registerTeacher);

router.post('/teacher/login', authController.loginTeacher);

// Set teacher password (one-time setup for new teachers)
router.post('/teacher/set-password', authController.setTeacherPassword);

// Get current teacher profile (Protected)
router.get('/teacher/profile', verifyTeacherToken, authController.getTeacherProfile);

module.exports = router;
