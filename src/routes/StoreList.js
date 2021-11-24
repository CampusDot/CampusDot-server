const express = require('express')
const router = express.Router()
const {
    postStoreList,
    getSelectedStoreList,
    challengeStoreList,
} = require('../controllers/StoreList')

router.post('/', postStoreList)
router.get('/:id', getSelectedStoreList)
router.post('/challenge', challengeStoreList)

module.exports = router
