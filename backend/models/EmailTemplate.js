const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
    name: { type: String, default: 'Untitled Template' },
    design: Object,
    html: String,
    thumbnail: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    lastAutosave: { type: Date },
    isAutosaved: { type: Boolean, default: false }
});

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema);