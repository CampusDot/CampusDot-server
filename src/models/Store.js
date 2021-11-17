const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    Review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'       
    }],
    College: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'       
    },
    Information: {
        type: Object,
    },
    Category:{
        type: String,
    },
});

mongoose.model('Store', storeSchema);