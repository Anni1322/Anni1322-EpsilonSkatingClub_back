// /**
//  * ==========================================
//  * SERVER-SIDE AUTHENTICATION TEST SUITE
//  * ==========================================
//  * 
//  * Tests for:
//  * 1. User Registration with auto-generated StudentID
//  * 2. Student Login
//  * 3. Teacher Login  
//  * 4. ID Generation (stu01, stu02, tech01, tech02, etc.)
//  * 5. Password Hashing & Verification
//  * 6. Token Generation & Verification
//  * 
//  * Run with: npm test or node server/tests/authTest.js
//  */

// const axios = require('axios');

// const API_URL = 'http://localhost:5000/api/auth';

// // Test users
// const testUsers = {
//   newStudent: {
//     email: `student_${Date.now()}@test.com`,
//     password: 'testpass123',
//     confirmPassword: 'testpass123'
//   },
//   newTeacher: {
//     email: `teacher_${Date.now()}@test.com`,
//     password: 'teacherpass123'
//   },
//   invalidUser: {
//     email: 'invalid@test.com',
//     password: 'wrongpassword'
//   }
// };

// let generatedStudentID = null;
// let generatedTeacherID = null;
// let studentToken = null;
// let teacherToken = null;

// /**
//  * Color logging
//  */
// const log = {
//   section: (msg) => console.log('\n\n═══════════════════════════════════════');console.log(`  ${msg}`);console.log('═══════════════════════════════════════\n'),
//   test: (msg) => console.log(`\n📝 TEST: ${msg}`),
//   pass: (msg) => console.log(`✅ PASS: ${msg}`),
//   fail: (msg) => console.log(`❌ FAIL: ${msg}`),
//   info: (msg) => console.log(`ℹ️  INFO: ${msg}`),
//   success: (msg) => console.log(`🎉 SUCCESS: ${msg}`),
//   error: (msg) => console.log(`🔴 ERROR: ${msg}`)
// };

// /**
//  * TEST 1: User Registration with Auto-Generated StudentID
//  */
// async function testUserRegistration() {
//   log.section('TEST 1: USER REGISTRATION WITH AUTO-GENERATED STUDENTID');
  
//   try {
//     log.test('Register new student user');
//     const response = await axios.post(`${API_URL}/user/register`, {
//       email: testUsers.newStudent.email,
//       password: testUsers.newStudent.password,
//       confirmPassword: testUsers.newStudent.confirmPassword
//     });
    
//     if (response.status === 201) {
//       log.pass('Registration endpoint responded with 201');
//     }
    
//     console.log('Response data:', JSON.stringify(response.data, null, 2));
    
//     // Check if StudentID was auto-generated
//     if (response.data.StudentID) {
//       generatedStudentID = response.data.StudentID;
//       log.pass(`StudentID auto-generated: ${generatedStudentID}`);
      
//       // Verify format (stu01, stu02, etc.)
//       if (/^stu\d{2}$/.test(generatedStudentID)) {
//         log.pass(`StudentID format is correct: ${generatedStudentID}`);
//       } else {
//         log.fail(`StudentID format is incorrect: ${generatedStudentID} (expected stuXX)`);
//       }
//     } else {
//       log.fail('StudentID was not returned');
//     }
    
//     // Check UserID
//     if (response.data.UserID) {
//       log.pass(`UserID generated: ${response.data.UserID}`);
//     }
    
//   } catch (error) {
//     if (error.response?.status === 400 && error.response?.data?.error?.includes('already registered')) {
//       log.info('Email already registered (probably from previous test run)');
//     } else {
//       log.error(`Registration failed: ${error.response?.data?.error || error.message}`);
//     }
//   }
// }

// /**
//  * TEST 2: Student Login
//  */
// async function testStudentLogin() {
//   log.section('TEST 2: STUDENT LOGIN');
  
//   try {
//     log.test('Login with registered student credentials');
//     const response = await axios.post(`${API_URL}/user/login`, {
//       email: testUsers.newStudent.email,
//       password: testUsers.newStudent.password
//     });
    
//     if (response.status === 200) {
//       log.pass('Login endpoint responded with 200');
//     }
    
//     console.log('Response data:', JSON.stringify(response.data, null, 2));
    
//     // Check token
//     if (response.data.token) {
//       studentToken = response.data.token;
//       log.pass(`Token received: ${studentToken.substring(0, 20)}...`);
//     } else {
//       log.fail('No token received');
//     }
    
//     // Check user data
//     if (response.data.user) {
//       const user = response.data.user;
//       log.pass(`User data returned:`);
//       console.log(`  - Email: ${user.Email}`);
//       console.log(`  - StudentID: ${user.StudentID}`);
//       console.log(`  - UserID: ${user.UserID}`);
//       console.log(`  - Role: ${user.Role}`);
//     }
    
//   } catch (error) {
//     log.error(`Login failed: ${error.response?.data?.error || error.message}`);
//   }
// }

// /**
//  * TEST 3: Invalid Credentials
//  */
// async function testInvalidLogin() {
//   log.section('TEST 3: INVALID LOGIN ATTEMPT');
  
//   try {
//     log.test('Login with invalid credentials');
//     const response = await axios.post(`${API_URL}/user/login`, {
//       email: testUsers.newStudent.email,
//       password: 'wrongpassword123'
//     });
    
//     log.fail('Server should have rejected invalid password');
//   } catch (error) {
//     if (error.response?.status === 401) {
//       log.pass(`Correctly rejected invalid credentials with 401: ${error.response?.data?.error}`);
//     } else {
//       log.fail(`Expected 401, got ${error.response?.status}`);
//     }
//   }
// }

// /**
//  * TEST 4: Registration Validation
//  */
// async function testRegistrationValidation() {
//   log.section('TEST 4: REGISTRATION VALIDATION');
  
//   // Test missing password
//   try {
//     log.test('Register without password');
//     await axios.post(`${API_URL}/user/register`, {
//       email: 'test@example.com',
//       password: '',
//       confirmPassword: ''
//     });
//     log.fail('Should have rejected missing password');
//   } catch (error) {
//     if (error.response?.status === 400) {
//       log.pass(`Correctly rejected: ${error.response?.data?.error}`);
//     }
//   }
  
//   // Test password mismatch
//   try {
//     log.test('Register with mismatched passwords');
//     await axios.post(`${API_URL}/user/register`, {
//       email: `test_${Date.now()}@example.com`,
//       password: 'password123',
//       confirmPassword: 'password456'
//     });
//     log.fail('Should have rejected mismatched passwords');
//   } catch (error) {
//     if (error.response?.status === 400) {
//       log.pass(`Correctly rejected: ${error.response?.data?.error}`);
//     }
//   }
  
//   // Test short password
//   try {
//     log.test('Register with password less than 6 characters');
//     await axios.post(`${API_URL}/user/register`, {
//       email: `test_${Date.now()}@example.com`,
//       password: '12345',
//       confirmPassword: '12345'
//     });
//     log.fail('Should have rejected short password');
//   } catch (error) {
//     if (error.response?.status === 400) {
//       log.pass(`Correctly rejected: ${error.response?.data?.error}`);
//     }
//   }
// }

// /**
//  * TEST 5: Get User Profile (Protected)
//  */
// async function testGetUserProfile() {
//   log.section('TEST 5: GET USER PROFILE (PROTECTED ROUTE)');
  
//   if (!studentToken) {
//     log.fail('No token available (login must succeed first)');
//     return;
//   }
  
//   try {
//     log.test('Get user profile with valid token');
//     const response = await axios.get(`${API_URL}/user/profile`, {
//       headers: {
//         'Authorization': `Bearer ${studentToken}`
//       }
//     });
    
//     if (response.status === 200) {
//       log.pass('Profile endpoint responded with 200');
//     }
    
//     console.log('User profile:', JSON.stringify(response.data, null, 2));
//     log.pass('Successfully retrieved protected profile');
    
//   } catch (error) {
//     log.error(`Failed to get profile: ${error.response?.data?.error || error.message}`);
//   }
// }

// /**
//  * TEST 6: Teacher Login (if teacher exists)
//  */
// async function testTeacherLogin() {
//   log.section('TEST 6: TEACHER LOGIN');
  
//   try {
//     log.test('Login as teacher with credentials');
    
//     // Try with a test teacher email (you may need to create this first)
//     const response = await axios.post(`${API_URL}/teacher/login`, {
//       email: 'admin@skatingclub.com',
//       password: 'admin123'
//     });
    
//     if (response.status === 200) {
//       log.pass('Teacher login endpoint responded with 200');
//     }
    
//     console.log('Response data:', JSON.stringify(response.data, null, 2));
    
//     if (response.data.token) {
//       teacherToken = response.data.token;
//       log.pass(`Teacher token received`);
//     }
    
//     if (response.data.user?.TeacherID) {
//       log.pass(`TeacherID: ${response.data.user.TeacherID}`);
//       if (/^tech\d{2}$/.test(response.data.user.TeacherID)) {
//         log.pass(`TeacherID format is correct`);
//       }
//     }
    
//   } catch (error) {
//     if (error.response?.status === 401) {
//       log.info('Teacher credentials not found (expected if no teacher created)');
//     } else {
//       log.error(`Teacher login failed: ${error.message}`);
//     }
//   }
// }

// /**
//  * TEST 7: ID Generation Uniqueness
//  */
// async function testIDGeneration() {
//   log.section('TEST 7: ID GENERATION AND UNIQUENESS');
  
//   const registrations = [];
  
//   try {
//     log.test('Register multiple users to verify unique ID generation');
    
//     for (let i = 0; i < 3; i++) {
//       const email = `multi_test_${Date.now()}_${i}@test.com`;
//       const response = await axios.post(`${API_URL}/user/register`, {
//         email: email,
//         password: 'testpass123',
//         confirmPassword: 'testpass123'
//       });
      
//       if (response.data.StudentID) {
//         registrations.push(response.data.StudentID);
//         console.log(`  Registration ${i + 1}: ${response.data.StudentID}`);
//       }
//     }
    
//     // Check for duplicates
//     const uniqueIDs = new Set(registrations);
//     if (uniqueIDs.size === registrations.length) {
//       log.pass(`All ${registrations.length} generated IDs are unique`);
//     } else {
//       log.fail(`Duplicate IDs detected: ${JSON.stringify(registrations)}`);
//     }
    
//     log.pass('Generated IDs (should be sequential):');
//     console.log('  ' + registrations.join(' → '));
    
//   } catch (error) {
//     log.error(`ID generation test failed: ${error.message}`);
//   }
// }

// /**
//  * Run all tests
//  */
// async function runAllTests() {
//   log.section('🧪 AUTHENTICATION MODULE TEST SUITE 🧪');
//   console.log('Testing registration, login, ID generation, and token verification\n');
  
//   try {
//     // Test 1: Registration
//     await testUserRegistration();
    
//     // Wait a moment
//     await new Promise(r => setTimeout(r, 500));
    
//     // Test 2: Student Login
//     await testStudentLogin();
    
//     // Test 3: Invalid Login
//     await testInvalidLogin();
    
//     // Test 4: Validation
//     await testRegistrationValidation();
    
//     // Test 5: Protected Route
//     await testGetUserProfile();
    
//     // Test 6: Teacher Login
//     await testTeacherLogin();
    
//     // Test 7: ID Generation
//     await testIDGeneration();
    
//     log.section('✨ TEST SUITE COMPLETE ✨');
//     console.log('\n✅ Summary:');
//     console.log(`  - Student Registration: ${generatedStudentID ? '✓' : '✗'}`);
//     console.log(`  - Student Login: ${studentToken ? '✓' : '✗'}`);
//     console.log(`  - ID Format (stu##): ${generatedStudentID && /^stu\d{2}$/.test(generatedStudentID) ? '✓' : '✗'}`);
//     console.log(`  - Token Generation: ${studentToken ? '✓' : '✗'}`);
    
//   } catch (error) {
//     log.error(`Unexpected error: ${error.message}`);
//   }
// }

// // Run tests
// runAllTests().catch(error => {
//   console.error('Fatal error:', error);
//   process.exit(1);
// });
