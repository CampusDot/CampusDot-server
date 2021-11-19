const express = require('express')
const router = express.Router()
const {
    getStore,
    getStoreLists,
    getCollege,
    getMyCollegeRanking,
    getOtherCollegeRanking
} = require('../controllers/College')

router.get('/store/:category/:page', getStore)
router.get('/storeLists/:page', getStoreLists)
router.get('/', getCollege)
router.get('/myRanking', getMyCollegeRanking)
router.get('/otherRanking', getOtherCollegeRanking)

module.exports = router