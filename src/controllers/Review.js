const mongoose = require('mongoose');
const College = mongoose.model('College');
const User = mongoose.model('User');
const Review = mongoose.model('Review');
require('date-utils');


const postReview = async (req, res) => {
    const { Content, Rating, Store } = req.body;
    const Time = new Date();
    try {
        const review= 
            new Review({
              Content,
              Rating,
              Store,
              Time,
              PostUser: req.user._id
            }).save();
        res.send(review);
    } catch (err) {
        res.status(422).send(err.message)
    }
}

module.exports = {
    postReview ,
}