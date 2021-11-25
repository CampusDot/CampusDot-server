const mongoose = require('mongoose');
const StoreList = mongoose.model('StoreList');
const Review = mongoose.model('Review');
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
                    'StoreList._id': 1,
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

const getChallengeLists = async (req, res) => {
    try {
        let reviewLists = []
        let result = []
        const challengeLists = await StoreList.find({ 
            SavedUser: { $in: req.user._id }
        }, {
            StoreList: 1, Title: 1
        }).populate('StoreList', {
            _id: 1,
            'Information.name': 1,
            'Information.photos': 1,
            'Information.vicinity': 1
        })
        const reviews = await Review.find({
            PostUser: req.user._id
        }, {
            Store: 1
        })
        Object.values(reviews).forEach((review) => reviewLists.push(String(review.Store)))
        Object.values(challengeLists).forEach((challenge) => {
            const store = { 
                _id: challenge._id, 
                photo: challenge.StoreList[0].Information.photos,
                title: challenge.Title
            }
            const AllNum = challenge.StoreList.length
            let completeNum = 0
            Object.values(challenge.StoreList).forEach((store) => {
                if (reviewLists.includes(String(store._id))) {
                    completeNum += 1
                }
            })
            result.push({
                storeInfo: store,
                storeCount: AllNum,
                completeCount: completeNum
            })
        })
        res.status(200).send(result)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    postStoreList,
    getSelectedStoreList,
    challengeStoreList,
    getChallengeLists
}