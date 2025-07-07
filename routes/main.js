const express = require("express");
const router = express.Router();
const mainLayout = "layouts/main.ejs"
const Post = require("../models/Post")
const asyncHandler = require("express-async-handler")
const adminLayout2 = "../views/layouts/admin-nologout";

// /와 /home 들어왔을 때 index.ejs를 보여줌
router.get(["/","/home"],asyncHandler(async(req,res)=>{
    const data = await Post.find().sort({ createdAt: -1 });
    const locals={
        title:"Home",
        count: data.length
    }
    res.render("index.ejs",{locals:locals,data,layout:mainLayout})
})
);

router.get("/about",(req,res)=>{
    const locals={
        title:"About"
    }
    res.render("about.ejs",{locals:locals,layout:mainLayout})
})

router.get("/logoutposts",asyncHandler(async(req,res)=>{

    const keyword = req.query.keyword || "";
    const page = parseInt(req.query.page) || 1; //현재 페이지
    const perPage = 10; // 한 페이지당 게시물 수
    
    const search = keyword ? {$or:[
        {title : { $regex:keyword , $options: "i"}},
        {body : { $regex:keyword, $options: "i"}}
        ]} : {};
    const data = await Post.find(search)
        .sort({ createdAt: -1 })
        .skip((page-1)* perPage)
        .limit(perPage);
            
    const totalCount = await Post.countDocuments(search); // 총 게시물 수
            

    const locals={
        title:"Posts",
        keyword,
        count:totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount/ perPage)
        }
    
    res.render("logoutpost.ejs",{locals,data,layout:adminLayout2})
    
    })
)


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