const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const StoreList = mongoose.model('StoreList');
const College = mongoose.model('College');
const User = mongoose.model('User');
require('date-utils');


const postStoreList = async (req, res) => {
    const { Stores, Title, Comment } = req.body;
    var newDate = new Date()
    var Time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
    var StoreInfo = [];
    var Review = [];
    for ( k=0; k<Stores.length; k++){
        StoreInfo.push(Stores[k].store);
        Review.push(Stores[k].comment);
    }
    console.log(StoreInfo);
    try {
        const storelist = 
            new StoreList({
              StoreList: StoreInfo, 
              Review, 
              Title, 
              Comment, 
              Time, 
              PostUser : req.params._id, 
              College:req.user.College
            });
        res.send(storelist);
        storelist.save();
    } catch (err) {
        res.status(422).send(err.message)
    }
}



module.exports = {
    postStoreList,
}