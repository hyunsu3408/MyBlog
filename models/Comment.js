const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "POST"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"User"
    },
    username:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Comment",commentSchema);