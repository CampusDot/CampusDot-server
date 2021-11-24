const express = require('express')
const router = express.Router()
const {
    postReview,
    getReviewStore,
    getSelectedReview
} = require('../controllers/Review')

router.post('/', postReview)
router.get('/store', getReviewStore)
router.get('/:id', getSelectedReview)

module.exports = router
