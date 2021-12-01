const mongoose = require('mongoose');
const StoreList = mongoose.model('StoreList');
const Review = mongoose.model('Review');
const Notice = mongoose.model('Notice');
const Stamp = mongoose.model('Stamp')
const User = mongoose.model('User')
require('date-utils');

const postStoreList = async (req, res) => {
    const { Stores, Title, Comment, StoreComment, PhotoLists } = req.body;
    const Time = new Date()
    try {
        const storelist = await new StoreList({
            StoreList: Stores, 
            StoreComment, 
            Title, 
            Comment, 
            Time, 
            PostUser: req.user._id, 
            College: req.user.College,
            StorePhoto: PhotoLists
        }).save();
        res.send(storelist._id);
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getSelectedStoreList = async (req, res) => {
    try {
        let reviewStoreId = []
        let reviewResult = {}
        const reviews = await Review.find({
            $and: [{
                PostUser: req.user._id
            }, {
                StoreList: req.params.id
            }]
        }, {
            Store: 1
        })
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
                    StoreComment: 1,
                    StorePhoto: 1,
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
        Object.values(reviews).forEach((review) => reviewStoreId.push(String(review.Store)))
        Object.values(storeList[0].StoreList).forEach((store) => {
            reviewResult[store._id] = reviewStoreId.includes(String(store._id))
        })
        res.status(200).send([storeList[0], reviewResult])
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const challengeStoreList = async (req, res) => {
    try {
        const { id } = req.body
        const Time = new Date()
        const storelist = await StoreList.findOneAndUpdate({
            _id: id 
        }, {
            $push: {
                SavedUser: req.user._id
            }
        })
        res.status(200).send(id)
        new Notice({
            Type: 'Challenge',
            NoticingUser: req.user._id, 
            NoticedUser: storelist.PostUser,
            Target: id,
            Time, 
        }).save()
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
            StoreList: 1, Title: 1, StorePhoto: 1
        }).populate('StoreList', {
            _id: 1,
            'Information.name': 1,
            'Information.photos': 1,
            'Information.vicinity': 1
        })
        const reviews = await Review.find({
            PostUser: req.user._id
        }, {
            Store: 1, StoreList: 1
        })
        Object.values(reviews).forEach((review) => reviewLists.push({
            storeList: String(review.StoreList),
            store: String(review.Store)
        }))
        Object.values(challengeLists).forEach((challenge) => {
            const storePhoto = challenge.StoreList[0].Information.photos ? challenge.StoreList[0].Information.photos[0].photo_reference : ''
            const photo = challenge.StorePhoto[String(challenge.StoreList[0]._id)] ? 
            challenge.StorePhoto[String(challenge.StoreList[0]._id)] : storePhoto
            const store = { 
                _id: challenge._id, 
                photo: photo,
                title: challenge.Title
            }
            const AllNum = challenge.StoreList.length
            let completeNum = 0
            Object.values(challenge.StoreList).forEach((store) => {
                completeNum += reviewLists.filter(review => review.store === String(store._id) && review.storeList === String(challenge._id)).length
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

const completeStoreList = async (req, res) => {
    try {
        const { id } = req.body
        const [storeList] = await Promise.all([
            StoreList.findOneAndUpdate({
                _id: id
            }, {
                $push: {
                    FinishedUser: mongoose.Types.ObjectId(req.user._id)
                },
                $pull: {
                    SavedUser: mongoose.Types.ObjectId(req.user._id)
                }
            }),
            User.findOneAndUpdate({
                _id: req.user._id
            }, {
                $inc: {
                    AllStamp: 1,
                }
            }, {
                new: true
            })
        ])
        await new Stamp({
            Type: 'StoreList',
            Owner: req.user._id,
            TargetStoreList: id
        }).save()
        res.status(200).send(storeList)
    } catch (err) {
        res.status(422).send(err.message)   
    }
}

const uploadImage = async (req, res) => {
    try {
        const { storeListId } = req.body
        const imageLists = req.files.img
        let photoLists = {}
        const storeList = await StoreList.findOne({
            _id: storeListId
        }, {
            StorePhoto: 1
        })
        Object.values(imageLists).forEach((image) => {
            photoLists[storeList.StorePhoto[image.originalname]] = image.location            
        })
        const newStoreList = await StoreList.findOneAndUpdate({
            _id: storeListId
        }, {
            $set: { StorePhoto: photoLists }
        }, {
            new: true
        })
        res.status(200).send(newStoreList)
    } catch (err) {
        res.status(422).send(err.message)  
    } 
}

module.exports = {
    postStoreList,
    getSelectedStoreList,
    challengeStoreList,
    getChallengeLists,
    completeStoreList,
    uploadImage
}