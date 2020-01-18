const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 5,
        maxlength: 120,
        lowercase: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 120,
        required: true
    },
    online: {
        type: String,
        default: 'N',
        enum: ['Y', 'N']
    },
    socketId: {
        type: String,
        index: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);