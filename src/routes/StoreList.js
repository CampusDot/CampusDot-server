const express = require('express')
const router = express.Router()
const upload = require('../middlewares/Upload')
const {
    postStoreList,
    getSelectedStoreList,
    challengeStoreList,
    getChallengeLists,
    completeStoreList,
    uploadImage
} = require('../controllers/StoreList')

router.post('/', postStoreList)
router.get('/challenge', getChallengeLists)
router.get('/:id', getSelectedStoreList)
router.post('/challenge', challengeStoreList)
router.put('/challenge', completeStoreList)
router.post('/imgUpload', upload('storeList/').fields([{name: 'img'}, {name: 'storeListId'}]), uploadImage)

module.exports = router
