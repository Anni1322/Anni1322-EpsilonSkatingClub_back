# Image Upload System Guide

## Overview
The Epsilon Skating Club application now uses a file-based image storage system instead of Base64 encoding. Images are stored on the server filesystem and referenced via database paths.

## Architecture

### Backend
- **Storage Location**: `server/uploads/{module}/` directories
  - `uploads/students/` - Student photos
  - `uploads/teachers/` - Teacher photos
  - `uploads/products/` - Product images
  - `uploads/batches/` - Batch images

- **File Configuration**: `server/config/multer.js`
  - Max file size: 5MB
  - Supported formats: JPEG, PNG, GIF, WebP
  - Filename: Unique timestamped names to prevent overwrites

- **Server Configuration**: `server/server.js`
  - Static file serving at `/uploads` endpoint
  - Body parser limits increased to 50MB for FormData handling
  - CORS enabled for cross-origin requests

### Database Schema
All image fields use `VARCHAR(500)` to store file paths:
- `Students.PhotoPath` - Student photo path
- `Teachers.PhotoPath` - Teacher photo path
- `Products.ImagePath` - Product image path
- `Batches.ImagePath` - Batch image path

Example path format: `/uploads/students/filename-1701234567890.jpg`

### Frontend
- **Form Handling**: FormData API instead of Base64 encoding
- **API Service**: `client/src/services/api.js`
  - Request interceptor for FormData detection
  - Helper function `getImageUrl()` to convert paths to full URLs
  - Automatic Content-Type header management

## Upload Workflow

### 1. File Selection
```javascript
// User selects file in form
<input type="file" name="PhotoPath" onChange={handleInputChange} accept="image/*" />
```

### 2. File Handling
```javascript
// Store File object (not Base64)
const handleInputChange = (e) => {
  if (e.target.type === 'file') {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.files[0]
    }));
  }
};
```

### 3. FormData Creation
```javascript
// Create FormData for submission
const data = new FormData();
Object.keys(formData).forEach(key => {
  if (key === 'PhotoPath' && formData[key] instanceof File) {
    data.append(key, formData[key]);
  } else {
    data.append(key, formData[key]);
  }
});
```

### 4. API Request
```javascript
// Send with proper headers (automatic)
api.post('/students', data);
// Content-Type: multipart/form-data (auto-set by browser)
```

### 5. Backend Processing
```javascript
// Multer middleware extracts file
router.post('/', upload.single('PhotoPath'), createStudent);

// Controller accesses file
if (req.file) {
  PhotoPath = `/uploads/students/${req.file.filename}`;
}
```

### 6. Database Storage
- Path stored in database (e.g., `/uploads/students/photo-1701234567890.jpg`)
- Actual file stored on filesystem at `server/uploads/students/photo-1701234567890.jpg`

### 7. Image Display
```javascript
// Convert path to full URL
import { getImageUrl } from '../services/api';

const imageUrl = getImageUrl(photoPath);
// Result: http://localhost:5000/uploads/students/photo-1701234567890.jpg

<img src={imageUrl} alt="Student" />
```

## File Management

### Creating Required Directories
The application automatically serves `/uploads` directory. Ensure these folders exist:
```
server/uploads/
  ├── students/
  ├── teachers/
  ├── products/
  └── batches/
```

### Cleanup (Optional)
To remove old uploaded files:
```bash
# Remove all uploads
rm -rf server/uploads/*

# Or specific directory
rm -rf server/uploads/students/*
```

## Size Limits

- **Individual File**: 5MB (configured in multer.js)
- **Form Submission**: 50MB total (configured in server.js)

To change limits:
1. **File size**: Edit `server/config/multer.js` - `fileSize` property
2. **Request body**: Edit `server/server.js` - `bodyParser` configuration

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

Other formats will be rejected at upload time with appropriate error message.

## Error Handling

### Common Issues

**Error: "PayloadTooLargeError"**
- Cause: File or form data exceeds size limit
- Solution: Increase limits in server.js if needed, or reduce file size

**Error: "File type not supported"**
- Cause: Attempting to upload unsupported file format
- Solution: Convert file to supported format (JPEG, PNG, GIF, WebP)

**Error: "File not found when viewing"**
- Cause: Path issues or missing file
- Solution: Check server is running, uploads directory exists, file path is correct

### Debug Mode
Enable detailed logging by adding to controller:
```javascript
console.log('File received:', req.file);
console.log('Form data:', req.body);
```

## Migration from Base64

If upgrading from Base64 storage:

1. **Backend**: Already migrated in photo/image field controllers
2. **Frontend**: All pages (StudentsPage, TeachersPage, ProductsPage, BatchesPage) updated
3. **Database**: Schema updated with VARCHAR(500) for paths
4. **Existing Data**: Old Base64 strings won't work with new system
   - Manual migration needed for existing images
   - Or re-upload images through new interface

## Best Practices

1. **Always validate** file type and size on frontend before upload
2. **Use unique filenames** to prevent collisions (timestamps included)
3. **Store paths** in database, not full file paths
4. **Serve static files** through Express static middleware
5. **Backup uploads** folder regularly in production
6. **Monitor disk space** as uploads grow over time
7. **Implement file cleanup** for deleted records

## Production Considerations

For production deployment:
- Use cloud storage (AWS S3, Azure Blob, etc.) instead of filesystem
- Implement CDN for image delivery
- Add image compression and resizing
- Enable image caching headers
- Monitor and log all upload failures
- Set up automated backups

## API Endpoints

All CRUD operations support image uploads:

**Create with image:**
```
POST /api/students
Content-Type: multipart/form-data
Body: FormData with PhotoPath file + other fields
```

**Update with image:**
```
PUT /api/students/:id
Content-Type: multipart/form-data
Body: FormData with optional PhotoPath file + other fields
```

**Retrieve image:**
```
GET /uploads/students/{filename}
Response: Image file
```

## Troubleshooting Checklist

- [ ] Server running on port 5000
- [ ] Uploads directories exist
- [ ] Multer config present in `server/config/multer.js`
- [ ] Routes have `upload.single()` middleware
- [ ] Frontend using FormData, not JSON
- [ ] getImageUrl() used for displaying database paths
- [ ] File size under 5MB
- [ ] File format is supported (JPEG, PNG, GIF, WebP)
- [ ] CORS enabled in server.js
- [ ] Body parser limits set to 50MB
