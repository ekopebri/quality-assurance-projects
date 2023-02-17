const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    comments: {
        type: Array,
        of: String
    }
}, {timestamps: true});

module.exports = mongoose.model("Book", BookSchema);
