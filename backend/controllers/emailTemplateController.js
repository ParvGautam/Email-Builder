const EmailTemplate = require("../models/EmailTemplate");

const emailTemplateController = {
    getEmailLayout: async (req, res) => {
        try {
            const template = await EmailTemplate.findOne().sort({ updatedAt: -1 });
            
            if (!template) {
                return res.json({ 
                    design: {}, 
                    html: "",
                    message: "No template found. Starting with a blank canvas." 
                });
            }
            
            res.json(template);
        } catch (error) {
            console.error("Error retrieving email layout:", error);
            res.status(500).json({
                error: "Error retrieving email layout",
                details: error.message
            });
        }
    },

    uploadEmailConfig: async (req, res) => {
        const { design, html, name, _id, isAutosave = false } = req.body;

        try {
            let template;
            
            if (_id) {
                template = await EmailTemplate.findById(_id);
                
                if (!template) {
                    return res.status(404).json({
                        error: "Template not found"
                    });
                }

                template.design = design;
                template.html = html;
                template.updatedAt = new Date();
                
                if (!isAutosave) {
                    template.version += 1;
                    if (name) template.name = name;
                    template.isAutosaved = false;
                } else {
                    template.lastAutosave = new Date();
                    template.isAutosaved = true;
                }
            } else {
                template = new EmailTemplate({
                    design,
                    html,
                    name: name || 'Untitled Template',
                    updatedAt: new Date(),
                    isAutosaved: isAutosave,
                    lastAutosave: isAutosave ? new Date() : null
                });
            }

            await template.save();

            res.json({
                message: isAutosave ? "Template auto-saved successfully!" : "Template saved successfully!",
                template: {
                    _id: template._id,
                    name: template.name,
                    version: template.version,
                    updatedAt: template.updatedAt,
                    isAutosaved: template.isAutosaved,
                    lastAutosave: template.lastAutosave
                }
            });
        } catch (error) {
            console.error("Error saving email template:", error);
            res.status(500).json({
                error: "Error saving email template",
                details: error.message
            });
        }
    },

    getAllTemplates: async (req, res) => {
        try {
            const templates = await EmailTemplate.find()
                .select('name updatedAt version isAutosaved lastAutosave')
                .sort({ updatedAt: -1 });
            
            res.json(templates);
        } catch (error) {
            console.error("Error retrieving templates:", error);
            res.status(500).json({
                error: "Error retrieving templates",
                details: error.message
            });
        }
    },

    getTemplateById: async (req, res) => {
        try {
            const template = await EmailTemplate.findById(req.params.id);
            if (!template) {
                return res.status(404).json({
                    error: "Template not found"
                });
            }

            if (template.isAutosaved) {
                template.isAutosaved = false;
                await template.save();
            }

            res.json(template);
        } catch (error) {
            console.error("Error retrieving template:", error);
            res.status(500).json({
                error: "Error retrieving template",
                details: error.message
            });
        }
    },

    deleteTemplate: async (req, res) => {
        try {
            const template = await EmailTemplate.findByIdAndDelete(req.params.id);
            if (!template) {
                return res.status(404).json({
                    error: "Template not found"
                });
            }
            res.json({
                message: "Template deleted successfully",
                templateId: template._id
            });
        } catch (error) {
            console.error("Error deleting template:", error);
            res.status(500).json({
                error: "Error deleting template",
                details: error.message
            });
        }
    },

    duplicateTemplate: async (req, res) => {
        try {
            const template = await EmailTemplate.findById(req.params.id);
            if (!template) {
                return res.status(404).json({
                    error: "Template not found"
                });
            }

            const newTemplate = new EmailTemplate({
                name: `${template.name} (Copy)`,
                design: template.design,
                html: template.html,
                version: 1
            });

            await newTemplate.save();

            res.json({
                message: "Template duplicated successfully",
                templateId: newTemplate._id
            });
        } catch (error) {
            console.error("Error duplicating template:", error);
            res.status(500).json({
                error: "Error duplicating template",
                details: error.message
            });
        }
    }
};

module.exports = emailTemplateController;