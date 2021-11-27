const express = require('express')
const router = express.Router()
const {
    postStoreList,
    getSelectedStoreList,
    challengeStoreList,
    getChallengeLists,
    completeStoreList
} = require('../controllers/StoreList')

router.post('/', postStoreList)
router.get('/challenge', getChallengeLists)
router.get('/:id', getSelectedStoreList)
router.post('/challenge', challengeStoreList)
router.put('/challenge', completeStoreList)

module.exports = router
