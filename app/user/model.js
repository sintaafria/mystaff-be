const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const staffProfile = require('../staff-profile/model');
const bcrypt = require('bcrypt');

const userSchema = Schema({
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
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company'
    },
    password: {
        type: String,
        required: [true, 'password harus diisi'],
        maxlength: [225, 'panjang password maksimal 225 karakter']
    },
    role: {
        type: String,
        enum: ['staff', 'admin'],
        default: 'staff'
    },
    token: [String]
    
}, { timestamps: true });

userSchema.path('email').validate(async function(value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

userSchema.path('email').validate(async function(value) {
    try {
        if(this.role === 'admin') {
            return
        }
        if(this.role === 'staff') {
            const staff = await staffProfile.findOne({email: value});
            if(staff) {
                if(staff.status === 'non-active') {
                    await staffProfile.findOneAndUpdate({email: value}, {status: 'active',user: this._id})
                    console.log(staff)
                    return
                } return !staff
            } return staff
        }
    } catch(err) {
        throw err
    }
}, attr => `Akun dengan ${attr.value} sudah terdaftar atau email belum terdaftar di instansi manapun `);

const HASH_ROUND = 10;
userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next()
});

const User = model('user', userSchema);
module.exports = User