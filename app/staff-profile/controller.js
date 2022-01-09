const staffProfile = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { subject } = require('@casl/ability');
const { policyFor } = require('../../utils');

const store = async (req, res, next) => {
    try{
        const payload = req.body;
        let profile = await new staffProfile({...payload, company: req.user.company});
        await profile.save();
        return res.json(profile);
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

const update = async (req, res, next) => {
    try {
        let payload = req.body;
        let { id } = req.params;
        let profile = await staffProfile.findById(id)
        let subjectProfile = subject('staff-profile', {user_id: profile.user});
        let policy = policyFor(req.user);
        if(!policy.can('update', subjectProfile)) {
            return res.json({
                error: 1,
                message: 'You are not allowed to modify this resource'
            })
        }

        if(req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length-1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/profile-images/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let currImg = `${config.rootPath}/public/images/profile-images/${profile.image_url}`
                    if(fs.existsSync(currImg)) {
                        fs.unlinkSync(currImg);
                    }

                    profile = await staffProfile.findByIdAndUpdate(id, {...payload, image_url:filename}, {
                        new: true,
                        runValidators: true
                    })
                    return res.json(profile)
                } catch(err) {
                    fs.unlinkSync(target_path);
                    if(err && err.name === 'ValidationError'){
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }

                    next(err);
                }
            });

            src.on('error', async() => {
                next(err);
            });
        } else {
            let profile = await staffProfile.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            })
            return res.json(profile);
        }
    } catch (err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        };
        next(err);
    } 

};

const show = async (req, res, next) => {
    try{       
        const profile = await staffProfile.findOne({user: req.user._id})
        return res.json(profile)
    } catch(err) {
        next(err);
    }
};

module.exports = {
    store,
    update,
    show
}