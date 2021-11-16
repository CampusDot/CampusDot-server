const express = require('express')
const router = express.Router()
const {
    nearbySearch,
} = require('../controllers/GoogleMap')

router.post('/nearbySearch', nearbySearch)

module.exports = router