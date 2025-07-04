const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler")
require("dotenv").config();

const connectDb = asyncHandler(async(req,res)=>{
    const connect = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`DB Connect: ${connect.connection.host}`)
});

module.exports = connectDb;