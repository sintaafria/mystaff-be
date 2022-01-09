const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const permitSchema = Schema({
    kind: {
        type: String,
        enum: ['sakit', 'cuti', 'lainnya'],
        required: [true, 'Jenis izin wajib diisi']
    },
    description: {
        type: String,
        required: [true, 'Keterangan harus diisi']
    },
    description_file_url: {
        type: String,
    },
    start_time: {
        type: Date,
        required: [true, 'Tanggal izin harus diisi']
    },
    end_time: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['diproses', 'disetujui', 'ditolak'],
        default: 'diproses'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    } 

}, {timestamps: true});

module.exports = model('permit', permitSchema);