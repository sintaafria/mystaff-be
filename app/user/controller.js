const User = require('./model');
const staffProfile =  require('../staff-profile/model')

const showStaff = async (req, res, next) => {
    try{
        staff = await User.find({company: req.user.company, role: 'staff'})
        return res.json(staff);
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

const staffDetail = async (req, res, next) => {
    try{
        const { id } = req.params;
        let detail = await staffProfile.findOne({user: id, company: req.user.company}).populate('user', '-token').populate('company')
        return res.json(detail);
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

const destroy = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const staffProfile = await staffProfile.findOneAndDelete({user: id, company: req.user.company})
        const user = await User.findByIdAndDelete(id).select('-token')
        return res.json(staffProfile);
    } catch(err) {
        next(err)
    }
}

module.exports = {
    showStaff,
    staffDetail,
    destroy
}