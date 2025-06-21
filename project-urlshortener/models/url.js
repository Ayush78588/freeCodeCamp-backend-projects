const mongoose = require("mongoose");
const urlSchema = mongoose.Schema({
    original_url: String,
    short_url: {
        type: Number,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('url', urlSchema);