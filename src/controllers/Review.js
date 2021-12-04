const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const StoreList = mongoose.model('StoreList')
const User = mongoose.model('User')
const Stores = mongoose.model('Store')
const Stamp = mongoose.model('Stamp')
require('date-utils');

const postReview = async (req, res) => {
    const { Content, Rating, Store, StoreList } = req.body;
    const Time = new Date();
    try {
        const review = await new Review({
            Content,
            Rating,
            Store,
            Time,
            StoreList,
            PostUser: req.user._id
        }).save();
        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $inc: {
                AllStamp: 1,
            }
        })
        await Stores.findOneAndUpdate({
            _id: Store
        }, {
            $inc: {
                Rating: Rating,
                ReviewCount: 1,
            }
        })
        await new Stamp({
            Type: 'Store',
            Owner: req.user._id,
            TargetStore: Store
        }).save()
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
                StoreList: 1, StorePhoto: 1
            }).populate('StoreList', {
                'Information.name': 1,
                'Information.photos': 1,
                'Information.vicinity': 1,
                ReviewCount: 1,
                Rating: 1,
            }),
            Review.find({
                PostUser: req.user._id
            }, {
                Store: 1, StoreList: 1
            })
        ])
        Object.values(reviews).forEach((review) => reviewStoreLists.push({
            storeList: String(review.StoreList),
            store: String(review.Store)
        }))
        Object.values(storeList).forEach((stores) => {
            Object.values(stores.StoreList).forEach((store) => {
                const Information = {
                    name: store.Information.name,
                    vicinity: store.Information.vicinity,
                    photo: store.Information.photos ? store.Information.photos[0].photo_reference : '' 
                }
                const storeData = {
                    Rating: store.Rating,
                    Review: store.ReviewCount,
                    _id: store._id,
                    Information: {},
                    storeListId: stores._id
                }
                let reviewCheck = true
                if (stores.StorePhoto[String(store._id)]) {
                    Information.photo = stores.StorePhoto[String(store._id)]
                } 
                Object.values(reviewStoreLists).forEach((review) => {
                    if(review.store === String(store._id) && review.storeList === String(stores._id)) {
                        reviewCheck = false
                    }
                })
                if(reviewCheck) {
                    storeData.Information = Information
                    result.push(storeData)
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
            Stores.findOne({
                _id: req.params.id
            }, {
                Information: 1, Rating: 1, ReviewCount: 1,
            }),
        ]);
        res.status(200).send([reviewLists, store])
    } catch (err) {
        res.status(422).send(err.message)
    }
}
const getReview = async (req, res) => {
    try {
        const reviews = await Review.find().populate('Stores').populate('PostUser');
        res.status(200).send(reviews)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const UpReview = async (req, res) => {
    const { id } = req.body
    try {
        const review = await Review.findOneAndUpdate({
            _id: id
        }, {
            $inc: {
                Up: 1,
            }
        })        
        
        res.status(200).send(review)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const DownReview = async (req, res) => {
    const { id } = req.body
    try {
        const review = await Review.findOneAndUpdate({
            _id: id
        }, {
            $inc: {
                Up: -1,
            }
        })        
        
        res.status(200).send(review)
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
    uploadImage,
    getReview,
    UpReview,
    DownReview,
}