const express = require('express')
const router = express.Router()
const {
    getCollegeHint,
    getStoreHint
} = require('../controllers/Search')

router.get('/college/:term', getCollegeHint)
router.get('/store/:term', getStoreHint)

module.exports = router