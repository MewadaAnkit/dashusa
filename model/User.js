const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
     username:{
        type:String,
       
        unique:true
     },
     email:{
      type:String,
      required:true,
      unique:true
     },
     password:{
       type:String,
       required:true
     },
     isAdmin:{
       type:Boolean,
       default:false
     }
},{timestamps:true});



const User = mongoose.model('users', UserSchema);

module.exports = User;