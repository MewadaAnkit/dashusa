const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const auth = {
   async register(req, res) {
         //console.log(...req.body)
      try {
         const hashedpassword = await bcrypt.hash(req.body.password, 10)
         const newUser = new User({
            ...req.body,
            password: hashedpassword

         });
         await newUser.save();
         res.status(200).json('Registered Successfully')

      } catch (err) {
        console.log(err)
         res.status(500).json("Something Went Wrong !")

      }
   },
 async login(req, res, next) {
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
   },




   async forgotPassword(req, res) {
      try {
        const { email } = req.body;
  
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Here, you can directly use the user's password from the database
        const userPassword = user.password;
  
        const emailHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Forgot Password</title>
            </head>
            <body>
              <h1>Hello, ${user.username}!</h1>
              <p>
                You have requested your password. Your username is: ${user.username}
                <br />
                Your password is: ${userPassword}
                <br />
                Please ensure that you keep your password secure and do not share it with anyone.
              </p>
            </body>
          </html>
        `;
  
        // Set up your email transport and credentials here
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'nodemailer22222@gmail.com',
            pass: 'mqudvyfebulfxawy',
          },
        });
  
        const mailOptions = {
          from: 'Admin',
          to: email,
          subject: 'Forgot Password',
          html: emailHTML,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email' });
          }
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Password sent to your email' });
        });
      } catch (err) {
        console.error('Error sending password:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
  














 /*  async getUser(req,res , next){
      try {
         const user = await User.findById(req.params.id);
         res.status(200).json(user);
         
      } catch (err) {
          return next(err)
      }
   },
   
   async getUsers(req,res , next){
      try {
         const user = await User.find();
         res.status(200).json(user);
         
      } catch (err) {
          return next(err)
      }
   },
   async UpdateUser(req, res , next){
      try {
         const UpdatedUser = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
         res.status(200).json(UpdatedUser);
         
      } catch (err) {
          return next(err)
      }
   },
   async deleteUser(req,res , next){
      try {
         const deleteuser = await User.findByIdAndDelete(req.params.id);
         console.log('deleted success')
         res.status(200).json("User Deleted Successfully");
         
      } catch (err) {
          return next(err)
      }
   }*/
}

module.exports = auth
