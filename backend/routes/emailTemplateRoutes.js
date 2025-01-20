const express = require("express");
const router = express.Router();
const emailTemplateController = require("../controllers/emailTemplateController");

router.get("/getEmailLayout", emailTemplateController.getEmailLayout);
router.post("/uploadEmailConfig", emailTemplateController.uploadEmailConfig);
router.get("/templates", emailTemplateController.getAllTemplates);
router.get("/template/:id", emailTemplateController.getTemplateById);
router.delete("/template/:id", emailTemplateController.deleteTemplate);
router.post("/template/:id/duplicate", emailTemplateController.duplicateTemplate);

module.exports = router;