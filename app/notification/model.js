const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notifSchema = Schema({
    status: {
        type: String,
        enum: ['belum dibaca', 'sudah dibaca']
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