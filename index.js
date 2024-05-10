require('dotenv').config();
const express = require('express');
const app = express();
const Port = process.env.PORT || 8000;
const path = require('path')
const cors = require('cors');
const multer = require('multer');
const cookieParser = require("cookie-parser")
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

const DB = require('./model/connection')
app.use(require("./routes/router"))


app.listen(Port,()=>{
    console.log("Server Started Successfully ")
})
