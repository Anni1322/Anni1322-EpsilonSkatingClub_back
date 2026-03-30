const pool = require('../config/database');

/**
 * Generate next StudentID in format: stu01, stu02, stu03, etc.
 */
exports.generateStudentID = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Get all StudentIDs and extract numbers
    const [result] = await connection.query(
      'SELECT StudentID FROM Students ORDER BY StudentID DESC LIMIT 1'
    );
    connection.release();
    
    let nextNumber = 1;
    
    if (result.length > 0) {
      const lastStudentID = result[0].StudentID;
      // Extract number from stu01, stu02, etc.
      const match = lastStudentID.match(/stu(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    
    // Format as stu01, stu02, etc. (zero-padded to 2 digits)
    const studentID = `stu${String(nextNumber).padStart(2, '0')}`;
    
    console.log(`✓ Generated StudentID: ${studentID}`);
    return studentID;
  } catch (error) {
    console.error('❌ Error generating StudentID:', error.message);
    throw new Error('Failed to generate StudentID');
  }
};

/**
 * Generate next TeacherID in format: tech01, tech02, tech03, etc.
 */
exports.generateTeacherID = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Get the maximum TeacherID (as integer or parse from string)
    const [result] = await connection.query(
      'SELECT TeacherID FROM Teachers ORDER BY TeacherID DESC LIMIT 1'
    );
    connection.release();
    
    let nextNumber = 1;
    
    if (result.length > 0) {
      const lastTeacherID = result[0].TeacherID;
      // Extract number from tech01, tech02, etc.
      const match = lastTeacherID.match(/tech(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    
    // Format as tech01, tech02, etc. (zero-padded to 2 digits)
    const teacherID = `tech${String(nextNumber).padStart(2, '0')}`;
    
    console.log(`✓ Generated TeacherID: ${teacherID}`);
    return teacherID;
  } catch (error) {
    console.error('❌ Error generating TeacherID:', error.message);
    throw new Error('Failed to generate TeacherID');
  }
};

/**
 * Parse StudentID number from formatted ID (e.g., "stu01" -> 1)
 */
exports.parseStudentID = (formattedID) => {
  const match = formattedID.match(/stu(\d+)/);
  return match ? parseInt(match[1]) : null;
};

/**
 * Parse TeacherID number from formatted ID (e.g., "tech01" -> 1)
 */
exports.parseTeacherID = (formattedID) => {
  const match = formattedID.match(/tech(\d+)/);
  return match ? parseInt(match[1]) : null;
};
