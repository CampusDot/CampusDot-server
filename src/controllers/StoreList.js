const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const StoreList = mongoose.model('StoreList');
const College = mongoose.model('College');
const User = mongoose.model('User');
require('date-utils');


const postStoreList = async (req, res) => {
    const { Stores, Title, Comment } = req.body;
    const Time = new Date()
    let StoreInfo = [];
    let StoreComment = [];
    for ( k=0; k<Stores.length; k++){
        StoreInfo.push(Stores[k].store);
        StoreComment.push(Stores[k].comment);
    }
    try {
        const storelist = 
            new StoreList({
              StoreList: StoreInfo, 
              StoreComment, 
              Title, 
              Comment, 
              Time, 
              PostUser: req.user._id, 
              College: req.user.College
            }).save();
        res.send(storelist);
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    postStoreList,
}