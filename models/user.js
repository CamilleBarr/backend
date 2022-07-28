const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const emailValidator = require('email-validator');


const userSchema = mongoose.Schema({
    email :{type : String, required : true, unique : true},
    password : {type : String, required : true},
    
});

userSchema.plugin(uniqueValidator , emailValidator);

module.exports = mongoose.model('User', userSchema);