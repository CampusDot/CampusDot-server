const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const noticeSchema = new mongoose.Schema({
    Type: {
        type: String,
        required: true,
    },
    NoticingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    NoticedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Content: {
        type: String,
        required: true,
    },
    Target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreList'
    },
});

mongoose.model('Notice', noticeSchema);