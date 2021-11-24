const mongoose = require('mongoose');
const User = mongoose.model('User');
const StoreList = mongoose.model('StoreList')
const Review = mongoose.model('Review')

const getInformation = async (req, res) => {
    try {
        const [challengeLists, storeLists, reviews] = await Promise.all([
            StoreList.find({ 
                SavedUser: { $in: req.user._id }
            }, {
                StoreList: 1, Time: 1, Title: 1, PostUser: 1
            }).populate('StoreList', {
                Information: 1
            }).populate('PostUser', {
                Name: 1, ProfileImage: 1, AllStamp: 1,
            }),
            StoreList.find({ 
                PostUser: req.user._id
            }, {
                StoreList: 1, Time: 1, Title: 1, PostUser: 1
            }).populate('StoreList', {
                Information: 1
            }),
            Review.find({
                PostUser: req.user._id
            }).populate('Store', {
                Information: 1
            })
        ])
        const information = {
            Id: req.user._id,
            Name: req.user.Name,
            ProfileImage: req.user.ProfileImage,
            College: req.user.College,
            UsedStamp: req.user.UsedStamp,
            Approved: req.user.Approved,
            AllStamp: req.user.AllStamp,
            ChallengeLists: challengeLists,
            StoreLists: storeLists,
            Review: reviews,
        }
        res.status(200).send(information)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { Name: name }, {new: true})
        res.status(200).send(user)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getChallengeLists = async (req, res) => {
    try {
        const challengeLists = await StoreList.find({ 
            SavedUser: { $in: req.user._id }
        }, {
            StoreList: 1, Time: 1, Title: 1, PostUser: 1
        }).populate('StoreList', {
            Information: 1
        })
        res.status(200).send(challengeLists)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getStoreLists = async (req, res) => {
    try {
        const storeLists = await StoreList.find({ 
            PostUser: req.user._id
        }, {
            StoreList: 1, Time: 1, Title: 1, PostUser: 1
        }).populate('StoreList', {
            Information: 1
        })
        res.status(200).send(storeLists)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            PostUser: req.user._id
        }).populate('Store', {
            Information: 1
        })
        res.status(200).send(reviews)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    getInformation,
    updateProfile,
    getChallengeLists,
    getStoreLists,
    getReviews
}