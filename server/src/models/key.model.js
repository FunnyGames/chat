const mongoose = require('mongoose');

const userUserSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Key', userUserSchema);