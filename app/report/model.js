const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reportSchema = Schema({
    summary: {
        type: String,
        required: [true, 'Rangkuman kegiatan wajib diisi']
    },
    date: {
        type: Date,
        required: [true, 'Tanggal harus diisi']
    },
    start_time: {
        type: Date,
        required: [true, 'Waktu mulai harus diisi']
    },
    end_time: {
        type: Date,
        required: [true, 'Waktu selesai harus diisi']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    } 

}, {timestamps: true});

module.exports = model('report', reportSchema);