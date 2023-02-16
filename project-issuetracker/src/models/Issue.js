const mongoose = require("mongoose");

let IssueSchema = new mongoose.Schema({
    project: {
        type: String,
        required: true
    },
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
        default: ""
    },
    status_text: {
        type: String,
        default: ""
    },
    open: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);