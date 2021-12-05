const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    PostUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Content: {
        type: String,
        required: true,
    },
    Time: {
        type: Date,
        required: true,
    },
    Photo: [{
        type: String,
    }],
    Rating: {
        type: Number,
    },
    Store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    StoreList: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreList'
    },
    Filters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filter'
    }],
    Up: {
        type: Number,
        default: 0,
    },
    Down: {
        type: Number,
        default: 0,
    },
});

mongoose.model('Review', reviewSchema);