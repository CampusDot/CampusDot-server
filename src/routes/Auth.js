const express = require('express')
const router = express.Router()
const {
    signIn,
    signUp,
    signDelete,
    googleSignIn,
    naverSignIn,
} = require('../controllers/Auth')

router.post('/signIn', signIn)
router.post('/signUp', signUp)
router.get('/signDelete/:id', signDelete)
router.get('/social/google/:email/:id', googleSignIn)
router.get('/social/naver/:token', naverSignIn);

module.exports = router