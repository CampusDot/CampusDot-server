const mongoose = require('mongoose');
const College = mongoose.model('College')
const Store = mongoose.model('Store')

const getCollegeHint = async (req, res) => {
    try {
        const colleges = await College.find({
            Name: {
                $regex: `${req.params.term}`,
            }
        }, {
            Name: 1
        })
        res.status(200).send(colleges)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getStoreHint = async (req, res) => {
    try {
        const stores = await Store.aggregate([
            {
                $match: {
                    $and: [{
                        College: req.user.College,
                        'Information.name': {
                            $regex: `${req.params.term}`
                        }
                    }]
                }
            }, {
                $project: {
                    Name: '$Information.name'
                }
            }
        ])
        console.log(stores)
        res.send(stores)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const getStores = async (req, res) => {
    try {
        const stores = await Store.aggregate([
            {
                $match: {
                    $and: [{
                        College: req.user.College,
                        'Information.name': {
                            $regex: `${req.params.term}`
                        }
                    }]
                }
            }, {
                $project: {
                    name: '$Information.name',
                    photos: '$Information.photos',
                    vicinity: '$Information.vicinity',
                }
            }
        ])
        console.log(stores)
        res.send(stores)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    getCollegeHint,
    getStoreHint,
    getStores
}