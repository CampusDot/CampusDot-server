const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const StoreList = mongoose.model('StoreList');
const College = mongoose.model('College');
const User = mongoose.model('User');

const Category = {
    'Korean': '한식',
    'Chinese': '중식',
    'Japanese': '일식',
    'Western': '양식',
    'Cafe': '카페',
    'Snack': '분식'
}

const getStore = async (req, res) => {
    try {
        let storeLists;
        if(req.params.category == 'All') {
            storeLists = await Store.find({ 
                College: req.user.College
            }, {
                Information: 1
            }).limit(20).skip(20 * req.params.page)
        } else {
            storeLists = await Store.find({ 
                $and : [{ 
                    College: req.user.College 
                }, {
                    Category: Category[req.params.category]
                }]
            }, {
                Information: 1, Category: 1
            }).limit(20).skip(20 * req.params.page)
        }
        res.status(200).send(storeLists)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getStoreLists = async (req, res) => {
    try {
        let storeLists;
        if(req.params.sort === 'recent') {
            storeLists = await StoreList.find({
                $and: [
                    { College: req.user.College },
                    { SavedUser: { $nin: req.user._id } }
                ] 
            }, {
                StoreList: 1, SavedUser: 1, FinishedUser: 1, PostUser: 1, Time: 1, Title: 1, Comment: 1, StorePhoto: 1
            }).populate('StoreList', {
                Information: 1,
            }).populate('PostUser', {
                Name: 1, ProfileImage: 1, AllStamp: 1
            }).limit(20).skip(20 * req.params.page)
        } else {
            storeLists = await StoreList.aggregate([
                {
                    $match: {
                        College: req.user.College 
                    }
                },
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
                        SavedCount: { $size: "$SavedUser" },
                        'StoreList.Information': 1, 
                        'StoreList._id': 1, 
                        SavedUser: 1, 
                        FinishedUser: 1, 
                        'PostUser.Name': 1, 
                        'PostUser.ProfileImage': 1, 
                        'PostUser.AllStamp': 1, 
                        Time: 1, 
                        Title: 1, 
                        Comment: 1, 
                        StorePhoto: 1
                    }
                }, {
                    $sort: {
                        SavedCount: -1
                    }
                }
            ]).limit(20).skip(20 * req.params.page)
            Object.values(storeLists).forEach((storeList) => {
                storeList.PostUser = storeList.PostUser[0]
            })
            storeLists = storeLists.filter((storeList) => !JSON.stringify(storeList.SavedUser).includes(req.user._id))
        }
        res.status(200).send(storeLists)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getCollege = async (req, res) => {
    try {
        const colleges = await College.aggregate([
            { 
                $project: { 
                    StudentCount: { $size: "$Student" },
                    Name: 1
                },
            }, {
                $sort: {
                    StudentCount: -1
                }
            }
        ]).limit(10)
        res.status(200).send(colleges)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getMyCollegeRanking = async (req, res) => {
    try {
        const users = await User.find({
            College: req.user.College
        }, {
            Name: 1, ProfileImage: 1, AllStamp: 1
        }).sort({
            AllStamp: -1
        }).limit(10)
        const college = await College.findOne({
            _id: req.user.College
        }, {
            Name: 1
        })
        res.status(200).send([users, college])
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getOtherCollegeRanking = async (req, res) => {
    try {
        const colleges = await College.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'Student',
                    foreignField: '_id',
                    as: 'user',
                }
            }, {
                $project: {
                    Name: 1,
                    StampCount: { $sum: "$user.AllStamp" }
                }
            }, {
                $sort: {
                    StampCount: -1
                }
            }
        ]).limit(10)
        res.status(200).send(colleges)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    getStore,
    getStoreLists,
    getCollege,
    getMyCollegeRanking,
    getOtherCollegeRanking
}