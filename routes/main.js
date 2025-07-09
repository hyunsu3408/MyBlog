const express = require("express");
const router = express.Router();
const mainLayout = "layouts/main.ejs"
const Post = require("../models/Post")
const asyncHandler = require("express-async-handler")
const adminLayout2 = "../views/layouts/admin-nologout";


// /와 /home 들어왔을 때 index.ejs를 보여줌
router.get(["/","/home"],asyncHandler(async(req,res)=>{

    const sort = req.query.sort || "recent";
    const keyword = req.query.keyword || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const search = keyword ? {
        $or:[
            {title : { $regex:keyword , $options: "i"}},
            {body : { $regex:keyword, $options: "i"}}
        ]} : {};

    const counted = await Post.aggregate([
        { $match : search },
        { $count : "total"}
    ])

    const totalCount = counted[0]?.total || 0;

    let sortOption = {createdAt: -1}; //기본 최신순
    if(sort === "likes"){
        sortOption = {likes : -1};
    }else if(sort === "comments"){
        sortOption = { commentCount: -1 };
    }else if(sort === "views"){
        sortOption = { views : -1}
    }

    const data = await Post.aggregate([
        {
            $match : search
        }
        ,
        {
            $lookup:{
                from: "comments", // collection 이름
                localField: "_id",
                foreignField: "postId",
                as: "comments"
            }
        },
        {
            $addFields:{
                commentCount: { $size: "$comments"}
            }
        },
        {
            $sort: sortOption
        },
        {
            $skip: skip
        },
        {
            $limit:10
        }
    ]);
    
    const postCount = await Post.countDocuments();
    const count = keyword ? totalCount : postCount;

    const locals={
        title:"Home",
        count: count,
        currentPage: page,
        totalPages: Math.ceil(totalCount/ limit)
    }

    res.render("index.ejs",{locals:locals,data,keyword,sort,layout:mainLayout})
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