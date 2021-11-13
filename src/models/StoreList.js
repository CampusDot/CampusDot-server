const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const storelistSchema = new mongoose.Schema({
    StoreList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreList'      
    }],
    SavedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'   
    }],
    FinishedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    }],
    PostUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    Time: {
        type: Date,
        required: true,
    },
    Title: {
        type: String,
        required: true,
    },

});

mongoose.model('StoreList', storelistSchema);