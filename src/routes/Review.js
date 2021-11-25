const express = require('express')
const router = express.Router()
const upload = require('../middlewares/Upload')
const {
    postReview,
    getReviewStore,
    getSelectedReview,
    uploadImage
} = require('../controllers/Review')

router.post('/', postReview)
router.get('/store', getReviewStore)
router.get('/:id', getSelectedReview)
router.post('/imgUpload', upload('reviews/').fields([{name: 'img'}, {name: 'reviewId'}]), uploadImage)

module.exports = router
