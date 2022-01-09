const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notifSchema = Schema({
    read: {
        type: Boolean,
        default: false
    },
    permit: {
        type: Schema.Types.ObjectId,
        ref: 'permit'
    }, 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true});

module.exports = model('notification', notifSchema);