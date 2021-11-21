const express = require('express')
const router = express.Router()
const {
    postStoreList,
} = require('../controllers/StoreList')

router.post('/storelist', postStoreList)

module.exports = router