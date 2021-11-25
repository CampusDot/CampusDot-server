const express = require('express')
const router = express.Router()
const {
    postStoreList,
    getSelectedStoreList,
    challengeStoreList,
    getChallengeLists
} = require('../controllers/StoreList')

router.post('/', postStoreList)
router.get('/challenge', getChallengeLists)
router.get('/:id', getSelectedStoreList)
router.post('/challenge', challengeStoreList)

module.exports = router
