const jwt = require('jsonwebtoken');
const User = require('../model/User')

function verifyToken(req , res , next){
     const token = req.cookies.access_token;
     if(!token){
        return next('Not Authenticated')
     }
     jwt.verify(token , process.env.JWT_SECRET,(err, user)=>{
        if(err){
            return next(err)
            req.user  = user;
            next();
        }
     })
}
function verifyUser(req,res){
    verifyToken(req,res ,()=>{
     if(req.user._id == req.params.id||req.user.isAdmin){
         next()
     }
     else{
        return next('Not Authenticated')
     }
 
    })
 
 }
function verifyAdmin(req,res , next){
   verifyToken(req,res ,()=>{
    if(req.user.isAdmin){
        next()
    }
    else{
        return next("You are not authorized")
    }

   })

}
module.exports = verifyUser, verifyAdmin ;
     


