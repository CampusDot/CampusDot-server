const express = require('express')
const router = express.Router()
const {
    postReview,
} = require('../controllers/Review')

router.post('/', postReview)

module.exports = router
