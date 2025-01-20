const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadDir = path.join(__dirname, "../uploads");
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: function (req, file, cb) {
        const uniqueId = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, `${uniqueId}${fileExtension}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    }
});

module.exports = upload;
