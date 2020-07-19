const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let UserSchema = new mongoose.Schema({

    name: { type: String, required: [true, `Please enter your name`] },

    email: { 
        type: String,
        required: [true, `Email required for login purposes`],
        validate: {
            validator: function (email) {
                let regex = /\S+@\S+\.\S+/;
                return regex.test(String(email).toLowerCase());
            },
            message: props => `${props.value} is not a valid email!`
        } 
    },

    password: {
        type: String,
        required: [true, `Please enter a password`]
    },

    isAdmin: { type: Boolean, default: false },
    isStaff: { type: Boolean, default: false }
});

//==================== password hashing ====================//

//before saving entry
UserSchema.pre("save", function(next) {

    if (!this.isModified("password")) return next();

    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

//used for local strategy in passportConfig
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

//==================== export ====================//

module.exports = mongoose.model("User", UserSchema);