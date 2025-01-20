const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");

router.post("/uploadImage", upload.single("image"), uploadController.uploadImage);
router.post("/renderAndDownloadTemplate", uploadController.renderAndDownloadTemplate);

module.exports = router;