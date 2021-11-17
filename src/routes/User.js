const express = require('express')
const router = express.Router()
const {
    getInformation,
    updateProfile,
    getChallengeLists,
    getStoreLists,
    getReviews
} = require('../controllers/User')

router.get('/', getInformation)
router.put('/', updateProfile)
router.get('/challenge', getChallengeLists)
router.get('/store', getStoreLists)
router.get('/review', getReviews)
module.exports = router