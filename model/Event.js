const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate:String,
  Timing:String,
  Cost:String,
  Category:String,
  EventDesc:String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
