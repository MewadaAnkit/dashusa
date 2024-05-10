const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  Name: String,
  email:String,
  Message:String,
  
},{timestamp:true});

const contact = mongoose.model('Contactus', ContactSchema);

module.exports = contact;
