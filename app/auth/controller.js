const User = require('../user/model');
const Company = require('../company/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');

const companyRegister = async (req, res, next) => {
    try {
        const payload = req.body;
        let company = await new Company({
            name: payload.name,
            email:payload.email,
            head_name: payload.head_name
        })
        let user = await new User({
            name: payload.head_name,
            email: payload.email,
            company: company._id,
            password: payload.password,
            role: 'admin'
        });
        await company.save();
        await user.save();
        return res.json(user); 
    } catch(err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

const registerStaff = async(req, res, next) => {
    try {
        const payload = req.body;
        let user = await new User(payload);
        await user.save();
        return res.json(user); 
    } catch(err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
};

const localStrategy = async(email, password, done) => {
    try {
        let user = 
            await User.findOne({email})
            .select('-__v -createdAt -updatedAt -cart_items -token');
        if (!user) return done();
        if(bcrypt.compareSync(password, user.password)) {
            ( {password, ...userWithoutPassword} = user.toJSON() );
            return done(null, userWithoutPassword);
        }
    }catch(err) {
        return done(err, null);
    }
    return done(null);
}

const login = async (req, res, next) => {
    passport.authenticate('local', async function(err, user) {
        if(err) return next(err);

        if(!user) return res.json({error: 1, message: 'email or password incorrect'})

        let signed = jwt.sign(user, config.secretKey)
        await User.findByIdAndUpdate(user._id, {$push: {token: signed}})

        res.json({
            message: 'Login Successfully',
            user,
            token: signed
        })
    }) (req, res, next)
};

const logout = async (req, res, next) => {
    let token = getToken(req);
    let user = await User.findOneAndUpdate({token: {$in: token}}, {$pull: {token: token}}, {userFindAndModify: false});
    if (!token || !user) {
        res.json({
            error: 1,
            message: 'No user Found'
        })
    }

    return res.json({
        error: 0,
        message: 'Logout Succesfully'
    });
};

const me = (req, res, next) => {
    if(!req.user) {
        res.json({
            err: 1,
            message: 'You are not logging or token expired'
        })
    }
    res.json(req.user);
}

module.exports = {
    registerStaff,
    companyRegister,
    login,
    localStrategy,
    logout,
    me
}