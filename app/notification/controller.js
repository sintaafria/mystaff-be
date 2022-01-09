const { model } = require('mongoose');
const Notif = require('./model');

const index = async (req, res, next) => {
    try {
        const notif = await Notif.find({user: req.user._id}).populate('permit');
        res.json(notif);
    } catch(err) {
        next(err);
    }
};

const detail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notif = await Notif.findOneAndUpdate(
            {user: req.user._id, 
            _id: id},
            {read: true}
        ). pupulate('permit')
        await notif.save();
        res.json(notif);
    } catch(err) {
        next(err);
    }
};

module.exports = {
    index,
    detail
}