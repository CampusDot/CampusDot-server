const mongoose = require('mongoose');
const StoreList = mongoose.model('StoreList');
require('date-utils');

const postStoreList = async (req, res) => {
    const { Stores, Title, Comment } = req.body;
    const Time = new Date()
    let StoreInfo = [];
    let Review = [];
    for ( k=0; k<Stores.length; k++){
        StoreInfo.push(Stores[k].store);
        Review.push(Stores[k].comment);
    }
    try {
        const storelist = 
            new StoreList({
              StoreList: StoreInfo, 
              Review, 
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

const getSelectedStoreList = async (req, res) => {
    try {
        const storeList = await StoreList.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.params.id) }},
            {
                $lookup: {
                    from: 'stores',
                    localField: 'StoreList',
                    foreignField: '_id',
                    as: 'StoreList',
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'PostUser',
                    foreignField: '_id',
                    as: 'PostUser'
                }
            },
            {
                $project: {
                    Time: 1,
                    Title: 1,
                    Comment: 1,
                    SavedUser: 1,
                    'PostUser.Name': 1,
                    'PostUser.ProfileImage': 1,
                    'PostUser.AllStamp': 1,
                    'StoreList.Information.name': 1,
                    'StoreList.Information.photos': 1,
                    'StoreList.Information.vicinity': 1,
                }
            }
        ])
        res.status(200).send(storeList[0])
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const challengeStoreList = async (req, res) => {
    try {
        const { id } = req.body
        await StoreList.findOneAndUpdate({
            _id: id 
        }, {
            $push: {
                SavedUser: req.user._id
            }
        })
        res.status(200).send(id)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    postStoreList,
    getSelectedStoreList,
    challengeStoreList,
}