const express = require('express')
const router = express.Router()
const {
    getCollegeHint,
    getStoreHint,
    getStores,
} = require('../controllers/Search')

router.get('/college/:term', getCollegeHint)
router.get('/store/:term', getStoreHint)
router.get('/stores/:term', getStores)

module.exports = router