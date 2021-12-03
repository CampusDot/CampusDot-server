const mongoose = require('mongoose');
const User = mongoose.model('User');
const StoreList = mongoose.model('StoreList')
const Review = mongoose.model('Review')
const Notice = mongoose.model('Notice');
const College = mongoose.model('College');

const getInformation = async (req, res) => {
    try {
        const [challengeLists, storeLists, reviews, notices, college] = await Promise.all([
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
            }),
            Notice.find({
                NoticedUser: req.user._id
            }).sort({'Time': -1}).populate('NoticingUser', {
                Name: 1,
                ProfileImage: 1,
                Type: 1,
                Target: 1,
            }),
            College.findOne({_id: req.user.College})
            
        ])
        const information = {
            Id: req.user._id,
            Name: req.user.Name,
            ProfileImage: req.user.ProfileImage,
            College: req.user.College,
            CollegeName: college.Name,
            UsedStamp: req.user.UsedStamp,
            Approved: req.user.Approved,
            AllStamp: req.user.AllStamp,
            ChallengeLists: challengeLists,
            StoreLists: storeLists,
            Review: reviews,
            Notice: notices,
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
const updateCollege = async (req, res) => {
    try {
        const image = req.files.img
        const user = await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: { CollegePhoto: image[0].location }
        }, {
            new: true
        })
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

const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({
            NoticedUser: req.user._id
        }).sort({'Time': -1}).populate('NoticingUser', {
            Name: 1,
            ProfileImage: 1,
            Type: 1,
            Target: 1,
        })
        res.status(200).send(notices)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    getInformation,
    updateProfile,
    updateCollege,
    getChallengeLists,
    getStoreLists,
    getReviews,
    getNotices,
}