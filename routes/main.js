const express = require("express");
const router = express.Router();
const mainLayout = "layouts/main.ejs"
const Post = require("../models/Post")
const asyncHandler = require("express-async-handler")

// /와 /home 들어왔을 때 index.ejs를 보여줌
router.get(["/","/home"],asyncHandler(async(req,res)=>{
    const locals={
        title:"Home"
    }
    const data = await Post.find();
    res.render("index.ejs",{locals:locals,data,layout:mainLayout})
})
);

router.get("/about",(req,res)=>{
    const locals={
        title:"About"
    }
    res.render("about.ejs",{locals:locals,layout:mainLayout})
})

/**
 * 게시물 상세보기
 * GET /post/:id 
 */

router.get(
    "/post/:id",
    asyncHandler(async(req,res)=>{
        const data = await Post.findOne({ _id: req.params.id});
        res.render("post.ejs",{data,layout:mainLayout})
    }))


module.exports = router;

// 임시데이터 저장
Post.insertMany([
    // {
    //     title:"제목 1",
    //     body:"내용 1-안녕하세요 처음 만들었습니다."
    // },
    // {
    //     title:"제목 2",
    //     body:"내용 2-안녕하세요 처음 만들었습니다."
    // },{
    //     title:"제목 3",
    //     body:"내용 3-안녕하세요 처음 만들었습니다."
    // },{
    //     title:"제목 4",
    //     body:"내용 4-안녕하세요 처음 만들었습니다."
    // },{
    //     title:"제목 5",
    //     body:"내용 5-안녕하세요 처음 만들었습니다."
    // },
]);