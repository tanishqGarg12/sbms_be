const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the 'uploads' folder dynamically if it does not exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    console.log(`[DEBUG] Creating 'uploads' directory at: ${uploadDir}`);
    fs.mkdirSync(uploadDir);
}

// Set up storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("in the");
        console.log(`[DEBUG] Setting destination for file: ${file.originalname}`);
        cb(null, uploadDir); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        console.log("in the");
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        console.log(`[DEBUG] Generated unique filename: ${uniqueName} for file: ${file.originalname}`);
        cb(null, uniqueName);
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    console.log(`[DEBUG] Checking file type for: ${file.originalname}, MIME type: ${file.mimetype}`);
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

// Export Multer instance directly
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;