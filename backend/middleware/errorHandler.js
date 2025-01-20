const multer = require("multer");

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: "File too large",
                details: "Maximum file size is 5MB"
            });
        }
        return res.status(400).json({
            error: "File upload error",
            details: err.message
        });
    }

    res.status(500).json({
        error: "Internal server error",
        details: err.message,
        timestamp: new Date().toISOString()
    });
};

module.exports = errorHandler;