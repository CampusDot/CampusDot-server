const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
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
    Rating: {
        type: Number,
        default: 0,
    },
    ReviewCount: {
        type: Number,
        default: 0,        
    },
});

mongoose.model('Store', storeSchema);