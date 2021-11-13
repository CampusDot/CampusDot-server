const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const stampSchema = new mongoose.Schema({

    Type: {
        type: String,
        required: true,
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    TargetStore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    TargetStoreList: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreList'
    },
            
});

mongoose.model('Stamp', stampSchema);