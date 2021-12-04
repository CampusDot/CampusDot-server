const express = require('express')
const router = express.Router()
const upload = require('../middlewares/Upload')
const {
    postReview,
    getReviewStore,
    getReview,
    getSelectedReview,
    DownReview,
    UpReview,
    uploadImage
} = require('../controllers/Review')

router.post('/', postReview)
router.post('/up', DownReview)
router.post('/down', UpReview)
router.get('/store', getReviewStore)
router.get('/', getReview);
router.get('/:id', getSelectedReview)
router.post('/imgUpload', upload('reviews/').fields([{name: 'img'}, {name: 'reviewId'}]), uploadImage)

module.exports = router
