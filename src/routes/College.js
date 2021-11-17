const express = require('express')
const router = express.Router()
const {
    getStore,
    getStoreLists
} = require('../controllers/College')

router.get('/store/:page', getStore)
router.get('/storeLists/:page', getStoreLists)
module.exports = router