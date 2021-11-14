const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const College = mongoose.model('College');

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).send()
        }
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(422).send()
        }
        await user.comparePassword(password)
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET)
        return res.status(200).send(token)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

const signUp = async (req, res) => {
    try {
        const { email, password, college, name } = req.body
        const myCollege = await College.findOne({ Name: college })
        const newUser = new User({
            Email: email,
            Password: password,
            Name: name,
            College: myCollege._id
        }).save()
        const token = jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET)
        res.status(200).send(token)
    } catch (err) {
        return res.status(422).send(err.message)
    }
}

module.exports = {
    signIn,
    signUp
}