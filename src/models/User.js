const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    Email: {
        type: String,
        unique: true,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required:true,
        unique: true,
    },
    ProfileImage: {
        type: String,
        default : '',
    },
    College: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    UsedStamp: {
        type: Number,
        default:0
    },
    CollegePhoto:{
        type: String,
    },
    Approved:{
        type: Boolean,
        default: false,
    }
});

userSchema.pre('save', function(next){
    const user = this;
    if (!user.isModified('Password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.Password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.Password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword){
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.Password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false);
            }
            resolve(true);
        });
    });
};

mongoose.model('User', userSchema);