const express = require('express').Router;
const router = express();
const mongoose = require('mongoose')
const Event = require('../model/Event')
const auth = require('../controller/auth');
const contact = require('../model/ContactUs');
const rateLimit = require('express-rate-limit')
const NodeCache = require("node-cache");
const Register = require('../model/Registration');
const cache = new NodeCache();


const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later"
});



router.post('/api/register', auth.register);

router.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const ispasswd = await bcrypt.compare(req.body.password, user.password);
    if (!ispasswd) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }


    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)

    //console.log('login success')
    res.cookie("access-token", token, {
      httpOnly: true,
    }).status(200).json(user)

  } catch (err) {
    res.status(400).json("Some error occured");
    console.log(err)
  }
})


router.post('/api/v2/addEventCalender', async (req, res) => {

  //const { eventName, eventDate, Timing, Cost, Category, EventDesc } = req.body;
  try {

    const newEvent = new Event({
      // eventName,
      // eventDate,
      // Timing,
      // Cost,
      // Category,
      // EventDesc

      ...req.body
    })

    const savedEvent = await newEvent.save();

    res.status(200).json("Event Created Successfully ")

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error ")
  }
})








//EVENT DELETE API ENDPOINT


router.delete('/api/calender/:id', limiter , async (req,res)=>{
  try {
    const id = req.params.id;
    const deleteHotel = await Event.findByIdAndDelete(id);
    res.status(200).json("Deleted Successfully");
} catch (err) {
    res.status(400).json(err)
}
})











router.get('/Calender', async (req, res) => {


  try {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = monthNames[currentDate.getMonth()];

    const formattedDate = `${currentMonth} ${currentYear}`;
    console.log(formattedDate)
    // const events = await Event.find({
    //    eventDate:formattedDate
    // });



    const eventsCurrentMonthYear = await Event.find({
      eventDate: { $regex: new RegExp(monthNames[currentMonth], 'i') }, // Case-insensitive match for the month
      eventDate: { $regex: new RegExp(currentYear, 'i') } // Match for the year
    });
    //  console.log(eventsCurrentMonthYear ,"dfata")
    res.status(200).json(eventsCurrentMonthYear);
    console.log('chali api to ')

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error ")
  }
})


router.get('/api/v2/Calender', async (req, res) => {


  try {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = monthNames[currentDate.getMonth()];

    const formattedDate = `${currentMonth} ${currentYear}`;
    console.log(formattedDate)
    // const events = await Event.find({
    //    eventDate:formattedDate
    // });

    const nextMonthIndex = (currentDate.getMonth() + 1) % 12;
    const nextYear = nextMonthIndex === 0 ? currentYear + 1 : currentYear;
    const nextMonth = monthNames[nextMonthIndex];


    // const eventsCurrentMonthYear = await Event.find({
    //   $and: [
    //     { "eventDate": { $regex: new RegExp(currentMonth, 'i') }}, // Match for the month
    //     { "eventDate": { $regex: new RegExp(currentYear, 'i') }} // Match for the year
    //   ]
    // });






    const eventsCurrentAndFutureMonthsYear = await Event.find({
      $or: [
        { // Events in current month and year
          $and: [
            { "eventDate": { $regex: new RegExp(currentMonth, 'i') } },
            { "eventDate": { $regex: new RegExp(currentYear, 'i') } }
          ]
        },
        { // Events in future months and years
          $and: [
            { "eventDate": { $regex: new RegExp(currentYear, 'i') } },
            { "eventDate": { $gt: formattedDate } }
          ]
        }, { // Events in future months of current year
          $and: [
            { "eventDate": { $regex: new RegExp(currentYear, 'i') } },
            { "eventDate": { $gte: formattedDate } }
          ]
        },
        { // Events in next month of current year
          $and: [
            { "eventDate": { $regex: new RegExp(nextMonth, 'i') } },
            { "eventDate": { $regex: new RegExp(nextYear, 'i') } }
          ]
        },
      ]
    });
    console.log(eventsCurrentAndFutureMonthsYear, "dfata")
    res.status(200).json({ eventsCurrentAndFutureMonthsYear, message: "Events retrieved successfully" });
    //  console.log('chali api to ')

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error ")
  }
})




router.get('/api/v2/Calender/:eventId',  async (req, res) => {
  try {
    const eventId = req.params.eventId;
    console.log('event', eventId)
    // Assuming your Event model has a field named "_id" for the event ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event, message: "Event retrieved successfully" });
    console.log('API called successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});










// router.get('/api/v2/search-result', async (req, res) => {


//   try {

//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//    
//     const currentMonth = monthNames[currentDate.getMonth()];

//     const formattedDate = `${currentMonth} ${currentYear}`;
//     console.log(formattedDate)



//     const eventsCurrentMonthYear = await Event.find({
//       $and: [
//         { "eventDate": { $regex: new RegExp(currentMonth, 'i') } }, // Match for the month
//         { "eventDate": { $regex: new RegExp(currentYear, 'i') } } // Match for the year
//       ]
//     });
//     //  console.log(eventsCurrentMonthYear ,"dfata")
//     res.status(200).json({ eventsCurrentMonthYear, message: "Events retrieved successfully" });
//     console.log(eventsCurrentMonthYear, "current year")


//   } catch (error) {
//     console.log(error)
//     res.status(500).json("Internal Server Error ")
//   }
// })

router.get('/api/v2/search-result', async (req, res) => {
  try {
    const { month, year } = req.query;


    console.log(month , year , "search")
    // Validate if month and year are provided
    if (!month || !year) {
      return res.status(400).json({ message: "Please provide both month and year parameters" });
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Validate if the provided month is valid
    const monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
    if (monthIndex === -1) {
      return res.status(400).json({ message: "Invalid month provided" });
    }

    // Convert year to number
    const queriedYear = parseInt(year, 10);

    // Check if the provided year is a valid number
    if (isNaN(queriedYear)) {
      return res.status(400).json({ message: "Invalid year provided" });
    }

    // Fetch events based on the queried month and year
    const eventsQueriedMonthYear = await Event.find({
      $and: [
        { "eventDate": { $regex: new RegExp(monthNames[monthIndex], 'i') } }, // Match for the month
        { "eventDate": { $regex: new RegExp(queriedYear, 'i') } } // Match for the year
      ]
    });

    res.status(200).json({ eventsQueriedMonthYear, message: "Events retrieved successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});






//Contact us Form






router.post('/api/v2/contactform', limiter, async (req, res) => {

  // const { Name, email , Message ,formData } = req.body;
  console.log(req.body, "body")
  try {

    const newContact = new contact({
      ...req.body
    })

    const savedEvent = await newContact.save();
    console.log(savedEvent, "event saved")

    res.status(200).json("Form Submitted Successfully")

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error ")
  }
})











router.get('/contact' , async (req, res) => {


  try {

    const ContactData = await contact.find();
    res.status(200).json(ContactData);
    console.log('chali api to ')

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error ")
  }
})






router.delete('/api/contact/:id',async (req,res)=>{
  try {
    const id = req.params.id;
    const deleteHotel = await contact.findByIdAndDelete(id);
    res.status(200).json("Deleted Successfully");
} catch (err) {
    res.status(400).json(err)
}
})



















router.post('/api/v2/formdata', limiter, async (req, res) => {

  // const {   fullname , email ,  dob ,  age , gender , Program , Phone , address , formData } = req.body;
  // console.log(  fullname , email ,  dob , age , gender , Program, address , formData,  "body")
  const { formData } = req.body;
  console.log(formData, "data");
  console.log(req.body)
  try {

    const newData = new Register({
      // fullname,
      // dob ,
      // email,
      // gender,
      // Phone ,
      // age,
      // address,
      // Program


      ...req.body
    })

    const savedEvent = await newData.save();
    console.log(savedEvent, "event saved")

    res.status(200).json("Form Submitted Successfully")

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error ")
  }
})



router.get('/formdata', async (req, res) => {


  try {

    const formData = await Register.find();
    res.status(200).json(formData);
    //console.log('chali api to ')

  } catch (error) {
    console.log(error)
    res.status(500).json("Internal Server Error ")
  }
})


module.exports = router
