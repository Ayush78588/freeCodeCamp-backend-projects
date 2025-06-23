const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    count: Number,
    log: [{
        duration: Number,
        description: String,
        date: String,
    }]
});

module.exports = mongoose.model('user', userSchema);