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
    Store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    Filters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filter'
    }],
    Up: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    }],
    Down: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    }],
});

mongoose.model('Review', reviewSchema);