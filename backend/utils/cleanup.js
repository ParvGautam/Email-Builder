const fs = require("fs").promises;
const path = require("path");

const cleanup = async () => {
    try {
        const uploadDir = path.join(__dirname, "../uploads");
        const outputDir = path.join(__dirname, "../output");
        
        const cleanupDirectory = async (dir) => {
            const files = await fs.readdir(dir);
            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = await fs.stat(filePath);
                const fileAge = now - stats.mtime.getTime();

                if (fileAge > ONE_DAY) {
                    try {
                        await fs.unlink(filePath);
                        console.log(`Cleaned up old file: ${file}`);
                    } catch (error) {
                        console.error(`Error removing file ${file}:`, error);
                    }
                }
            }
        };

        await cleanupDirectory(uploadDir);
        await cleanupDirectory(outputDir);
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
};

module.exports = cleanup;