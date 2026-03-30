const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to create module-specific upload instances
const createModuleUpload = (moduleName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../uploads/${moduleName}`);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      console.log(`Uploading file to: ${uploadPath}`);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename: moduleName_timestamp_originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${moduleName}_${uniqueSuffix}${path.extname(file.originalname)}`;
      console.log(`Generated filename: ${filename}`);
      cb(null, filename);
    }
  });

  // File filter - only allow images
  const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      console.log(`File accepted: ${file.originalname} (${file.mimetype})`);
      cb(null, true);
    } else {
      const error = new Error(`Only image files are allowed. Received: ${file.mimetype}`);
      console.error(`File rejected: ${file.originalname}`);
      cb(error, false);
    }
  };

  // Create multer upload instance
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit per file
    }
  });

  return upload;
};

// Export module-specific upload instances
module.exports = {
  studentUpload: createModuleUpload('students'),
  teacherUpload: createModuleUpload('teachers'),
  productUpload: createModuleUpload('products'),
  batchUpload: createModuleUpload('batches')
};
