// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            //unique: true 
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

// we are using pre-save to hash the password before saving it in the database 
// if we are not gonna use next then the code will get block
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

// Instance method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", UserSchema);
module.exports = { userModel };