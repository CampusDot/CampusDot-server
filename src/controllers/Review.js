const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const StoreList = mongoose.model('StoreList')
const User = mongoose.model('User')
const Store = mongoose.model('Store')
require('date-utils');

const postReview = async (req, res) => {
    const { Content, Rating, Store } = req.body;
    const Time = new Date();
    try {
        const review = await new Review({
            Content,
            Rating,
            Store,
            Time,
            PostUser: req.user._id
        }).save();
        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $inc: {
                AllStamp: 1,
            }
        })
        res.status(200).send(review._id);
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getReviewStore = async (req, res) => {
    try {
        let reviewStoreLists = []
        let result = []
        const [storeList, reviews] = await Promise.all([
            StoreList.find({
                SavedUser: {
                    $in: req.user._id
                }
            }, {
                StoreList: 1,
            }).populate('StoreList', {
                'Information.name': 1,
                'Information.photos': 1,
                'Information.vicinity': 1,
                Review: 1,
                Rating: 1,

            }),
            Review.find({
                PostUser: req.user._id
            }, {
                Store: 1
            })
        ])
        Object.values(reviews).forEach((review) => reviewStoreLists.push(String(review.Store)))
        Object.values(storeList).forEach((stores) => {
            Object.values(stores.StoreList).forEach((store) => {
                if (!reviewStoreLists.includes(String(store._id))) {
                    result.push(store)
                }
            })
        })
        res.status(200).send(result)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getSelectedReview = async (req, res) => {
    try {
        const [reviewLists, store] = await Promise.all([
            Review.find({
                Store: req.params.id
            }, {
                PostUser: 1, Content: 1, Photo: 1, Rating: 1
            }).populate('PostUser', {
                Name: 1, ProfileImage: 1, AllStamp: 1
            }),
            Store.find({
                _id: req.params.id
            }, {
                Information: 1, Rating: 1,
            }),
        ]);
        res.status(200).send([reviewLists, store])
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const uploadImage = async (req, res) => {
    try {
        const { reviewId } = req.body
        const imageLists = req.files.img
        let photoLists = []
        Object.values(imageLists).forEach((image) => {
            photoLists.push(image.location)
        })
        const review = await Review.findOneAndUpdate({
            _id: reviewId
        }, {
            $set: { Photo: photoLists }
        }, {
            new: true
        })
        res.status(200).send(review)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    postReview,
    getReviewStore,
    getSelectedReview,
    uploadImage
}