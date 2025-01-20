const path = require("path");
const fs = require("fs").promises;

const uploadController = {
    uploadImage: async (req, res) => {
        try {
            if (!req.file) {
                throw new Error("No file uploaded");
            }

            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            
            res.json({ 
                success: true,
                imageUrl: fileUrl,
                filename: req.file.filename
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({
                error: "Error uploading image",
                details: error.message
            });
        }
    },

    renderAndDownloadTemplate: async (req, res) => {
        const { html } = req.body;

        try {
            const outputDir = path.join(__dirname, "../output");
            await fs.mkdir(outputDir, { recursive: true });

            const filename = `email-template-${Date.now()}.html`;
            const filePath = path.join(outputDir, filename);
            
            await fs.writeFile(filePath, html, "utf8");

            res.download(filePath, filename, async (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    return res.status(500).json({
                        error: "Error downloading file",
                        details: err.message
                    });
                }
                
                try {
                    await fs.unlink(filePath);
                } catch (unlinkError) {
                    console.error("Error removing temporary file:", unlinkError);
                }
            });
        } catch (error) {
            console.error("Error rendering template:", error);
            res.status(500).json({
                error: "Error rendering template",
                details: error.message
            });
        }
    }
};

module.exports = uploadController;