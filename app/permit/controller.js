const User = require('../user/model');
const Permit = require('./model');
const path = require('path');
const fs = require('fs');
const Notif = require('../notification/model');
const { config } = require('dotenv');

const store = async (req, res, next) => {
    try{
        const payload = req.body;
        if(req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length-1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/permit-files/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    const permit = await new Permit({...payload, description_file_url:filename})
                    permit.save();
                    const notif = await new Notif({
                        read: false,
                        permit: permit._id,
                        user: req.user.company,
                    });
                    await notif.save();
                    return res.json(permit)
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
            const permit = await new Permit({...payload, status: 'diproses', user: req.user._id});
            await permit.save();
            const notif = await new Notif({
                read: false,
                permit: permit._id,
                user: req.user.company,
            });
            await notif.save();
            return res.json(permit);
        }
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
    try{
        const payload = req.body;
        let permit = Permit.findById(id);
        const user = await User.findById(permit.user)
        const subjectPermit = subject('report', {company: user.company});
        let policy = policyFor(req.user);
        if(!policy.can('update', subjectPermit)) {
            return res.json({
                error: 1,
                message: 'You are not allowed to modify this resource'
            });
        };
        permit = await Permit.findByIdAndUpdate(id, payload);
        
        const notif = await new Notif({
            read: false,
            permit: permit._id,
            user: permit.user,
        });
        await notif.save();
        return res.json(permit);
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

const index = async (req, res, next) => {
    try {
        const permit = await Permit.find({user: req.user._id});
        return res.json(permit);
    } catch(err) {
        next(err);
    }
}

module.exports = {
    store,
    update,
    index,
}