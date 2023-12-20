const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User Name Cannot be Blank'],
    },
    password: {
        type: String,
        required: [true, 'Password Cannot be Blank']
    }
})

UserSchema.statics.findAndValidate = async function (username, password) {
    const user = await this.findOne({ username });
    const verifyPass = await bcrypt.compare(password, user.password);
    if (verifyPass) {
        return user;
    }
    else {
        return false;
    }
}

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', UserSchema);