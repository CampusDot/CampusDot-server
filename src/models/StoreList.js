const mongoose = require('mongoose');

const storeListSchema = new mongoose.Schema({
    StoreList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'      
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
    College: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    Comment: {
        type: String
    }
});

mongoose.model('StoreList', storeListSchema);