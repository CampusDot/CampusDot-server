const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const storeSchema = new mongoose.Schema({
    Latitude: {
        type: Number,
        required:true,
    },
    Longtitude: {
        type: Number,
        required:true,
    },
    Review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'       
    }],
    Type: [{
        type: String,
    }],
    Name: {
        type: String,
        required:true,
    },
    Photo: {
        type: String,
    },
});

mongoose.model('Store', storeSchema);