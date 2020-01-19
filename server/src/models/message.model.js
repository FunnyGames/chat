const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);