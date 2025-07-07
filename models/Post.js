//스키마와 모델링

const mongoose = require("mongoose");
const PostSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0 // 조회수 초기값
    }
})



module.exports = mongoose.model("Post",PostSchema);