const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const College = mongoose.model('College');
const StoreList = mongoose.model('StoreList');
const Notice = mongoose.model('Notice');
const Review = mongoose.model('Review');
const Stamp = mongoose.model('Stamp')

const request = require('request');

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).send()
        }
        const user = await User.findOne({ Email: email })
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
        const newUser = await new User({
            Email: email,
            Password: password,
            Name: name,
            College: myCollege._id
        }).save()
        await College.findOneAndUpdate({ 
            Name: college
        }, {
            $push: {
                Student: newUser._id
            }
        })
        const token = jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET)
        res.status(200).send(token)
    } catch (err) {
        return res.status(422).send(err.message)
    }
}

const signDelete = async (req, res) => {
    try {
        await Promise.all([
          StoreList.deleteMany({PostUser:req.params.id}),
          Notice.deleteMany({NoticedUser:req.params.id}),
          Review.deleteMany({PostUser:req.params.id}),
          Stamp.deleteMany({Owner:req.params.id}),
          User.deleteMany({_id:req.params.id}),
        ])
        res.status(200).send(true)
    } catch (err) {
        return res.status(422).send(err.message)
    }
}

const googleSignIn = async (req, res) => {
    const user = await User.findOne({ Email: req.params.email });
    if(user == null){
        res.send([false, req.params.email, req.params.id]);
    }else{
        try{
            await user.comparePassword(req.params.id);
            const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
            res.send([token, req.params.email, req.params.id]);
        } catch (err) {
            return res.status(422).send(err.message);
        }
    }
}

const naverSignIn = async (req, res) => {
    const naverOption = {
        url: "https://openapi.naver.com/v1/nid/me",
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.params.token
        },
    }
    try {
        request(naverOption, async (err, response, body) => {
            try {
                body = await JSON.parse(body);
                const user = await User.findOne({ Email: body.response.email });
                if(user == null){
                    res.send([false, body.response.email, body.response.id]);
                }else{
                    await user.comparePassword(body.response.id);
                    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
                    res.send([token, body.response.email, body.response.id]);
                }
            } catch (err) {
                return res.status(422).send(err.message);
            }
        })
    } catch (err) {
        return res.status(422).send(err.message);
    }
}

const getCollege = async (req, res) => {
    try {
        const colleges = await College.aggregate([
            { 
                $project: { 
                    StudentCount: { $size: "$Student" },
                    Name: 1
                },
            }, {
                $sort: {
                    Name: 1
                }
            }
        ])
        let result =[]
        Object.values(colleges).forEach((item) => result.push({
            value : item.Name,
            label : item.Name,
        }))
        res.status(200).send(result)
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    signIn,
    signUp,
    signDelete,
    googleSignIn,
    naverSignIn,
    getCollege,
}