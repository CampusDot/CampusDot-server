const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const collegeSchema = new mongoose.Schema({
    Name: {
        type: String,
        required:true,
        unique: true,
    },
    Student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    Latitude: {
        type: Number,
        required:true,
    },
    Longtitude: {
        type: Number,
        required:true,
    },
});

mongoose.model('College', collegeSchema);