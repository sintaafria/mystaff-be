const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const companySchema = Schema({
    name: {
        type: String,
        minlength: [3, 'panjang nama minimal 3 karakter'],
        maxlength: [225, 'panjang nama maksimal 225 karakter'],
        required: [true, 'nama harus diisi'],  
    },
    email: {
        type: String,
        required: [true, 'email harus diisi'],
        maxlength: [225, 'panjang email maksimal 225 karakter']
    },
    head_name: {
        type: String,
        required: [true, 'Kepala instansi atau perusahaan harus diisi']
    },
}, { timestamps: true });

companySchema.path('email').validate(async function(value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

companySchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('company').count({email: value});
        return !count;
    } catch(err) {
        throw err
    }
}, attr =>  `${attr.value} sudah terdaftar`);
 
module.exports = model('company', companySchema);