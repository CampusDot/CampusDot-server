const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const StoreList = mongoose.model('StoreList')
require('date-utils');

const postReview = async (req, res) => {
    const { Content, Rating, Store } = req.body;
    const Time = new Date();
    try {
        const review = new Review({
            Content,
            Rating,
            Store,
            Time,
            PostUser: req.user._id
        }).save();
        res.send(review);
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
                'Information.vicinity': 1
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
        const reviewLists = await Review.find({
            Store: req.params.id
        }, {
            PostUser: 1, Content: 1, Photo: 1, Rating: 1
        }).populate('PostUser', {
            Name: 1, ProfileImage: 1, AllStamp: 1
        })
        res.status(200).send(reviewLists)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    postReview,
    getReviewStore,
    getSelectedReview
}