const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
    Type: {
        type: String
    }
});

mongoose.model('Filter', filterSchema);