const mongoose = require('mongoose');
const Store = mongoose.model('Store')
const StoreList = mongoose.model('StoreList')

const getStore = async (req, res) => {
    try {
        const storeLists = await Store.find({ 
            College: req.user.College
        }, {
            Information: 1
        }).limit(20).skip(20 * req.params.page)
        res.status(200).send(storeLists)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getStoreLists = async (req, res) => {
    try {
        const storeLists = await StoreList.find({ 
            College: req.user.College
        }, {
            StoreList: 1, SavedUser: 1, FinishedUser: 1, PostUser: 1, Time: 1, Title: 1
        }).populate('StoreList', {
            Information: 1
        }).populate('PostUser', {
            Name: 1, ProfileImage: 1
        }).limit(20).skip(20 * req.params.page)
        res.status(200).send(storeLists)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    getStore,
    getStoreLists
}