const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        required: true
    },
    age: {
        type: String,
        
    },
    gender: {
        type: String
    },
    Phone: {
        type: String
    },
    address:{
        type:String
    },
    Program:{
    type: String,
    required: true
    }

}, { timestamps: true });



const Register = mongoose.model('registration', RegisterSchema);

module.exports = Register;