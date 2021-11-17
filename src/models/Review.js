const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    PostUser : {
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
    }
});

mongoose.model('Review', reviewSchema);