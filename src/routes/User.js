const express = require('express')
const router = express.Router()
const upload = require('../middlewares/Upload')

const {
    getInformation,
    updateProfile,
    updateCollege,
    getChallengeLists,
    getStoreLists,
    getReviews,
    getNotices,
} = require('../controllers/User')

router.get('/', getInformation)
router.put('/', updateProfile)
router.put('/', updateProfile)
router.get('/challenge', getChallengeLists)
router.get('/store', getStoreLists)
router.get('/review', getReviews)
router.get('/notice', getNotices)
router.post('/updateCollege', upload('users/').fields([{name: 'img'}, {name: 'userId'}]), updateCollege)


module.exports = router