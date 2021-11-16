const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const storeSchema = new mongoose.Schema({

    Review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'       
    }],
    College: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'       
    }],
    Information: {},
    Category:{
        type:String,
    },

});

mongoose.model('Store', storeSchema);