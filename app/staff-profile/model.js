const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const User = require('../user/model');

const staffProfileSchema = Schema({
    full_name: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'email harus diisi'],
        maxlength: [225, 'panjang email maksimal 225 karakter']
    },
    status: {
        type: String,
        enum: ['active', 'non-active', 'suspend'],
        default: 'non-active'
    },
    image_url: {
        type: String
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

staffProfileSchema.path('email').validate(async function(value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

staffProfileSchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('staff_profile').count({email: value});
        return !count
    } catch(err) {
        throw err
    }
}, attr => `${attr.value} sudah terdaftar`);

module.exports = model('staff_profile', staffProfileSchema)