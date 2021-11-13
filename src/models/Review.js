const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
});

mongoose.model('Review', reviewSchema);