const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model("Visitor",VisitorSchema);