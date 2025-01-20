const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const emailTemplateRoutes = require("./routes/emailTemplateRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const errorHandler = require("./middleware/errorHandler");
const cleanup = require("./utils/cleanup");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", emailTemplateRoutes);
app.use("/", uploadRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use(errorHandler);

// Cleanup schedule
setInterval(cleanup, 6 * 60 * 60 * 1000); // Run every 6 hours

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app