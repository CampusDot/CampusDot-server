const express = require('express')
const router = express.Router()
const {
    getCollegeHint,
    getStoreHint,
    getStoreResult
} = require('../controllers/Search')

router.get('/collegeHint/:term', getCollegeHint)
router.get('/storeHint/:term', getStoreHint)
router.get('/store/:term', getStoreResult)

module.exports = router