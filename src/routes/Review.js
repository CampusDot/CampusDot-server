const express = require('express')
const router = express.Router()
const upload = require('../middlewares/Upload')
const {
    postReview,
    getFilterType,
    getReviewStore,
    getReview,
    getSelectedReview,
    DownReview,
    UpReview,
    uploadImage,
    getRecommendStore
} = require('../controllers/Review')

router.post('/', postReview)
router.get('/filter', getFilterType)
router.post('/up', UpReview)
router.post('/down', DownReview)
router.get('/store', getReviewStore)
router.get('/', getReview);
router.get('/:id', getSelectedReview)
router.post('/imgUpload', upload('reviews/').fields([{name: 'img'}, {name: 'reviewId'}]), uploadImage)
router.post('/recommend', getRecommendStore)
module.exports = router
