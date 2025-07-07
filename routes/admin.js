// 관리자 라우터

const express = require("express")
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
const adminlogin = "../views/layouts/admin-login"
const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment")
const User = require("../models/user");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtToken = process.env.JWT_Token;
const cookieParser = require('cookie-parser');


//로그인을 위해 cookie-parser,json-web-token 모듈 설치

/**
 * Check Login
 * 로그인 체크하기
 */
const checkLogin = (req,res,next)=>{
    
    const token = req.cookies.token;

    if(!token){
        res.redirect("/admin")
    }
    else{
        try{
            const decoded = jwt.verify(token,jwtToken);
            req.userId = decoded.id;
            // 관리자라면 next();
            next();
        }catch(err){
            res.redirect("/admin")
        }
    }
}

//**  
// Admin Page
// Get /admin
// */

router.get("/admin",(req,res)=>{
    const locals={
        title:"관리자 페이지",
    };

    res.render("admin/index",{locals,layout:adminlogin});
})

// 게시물 한개 불러오기
router.get(
    "/post/:id",
    asyncHandler(async(req,res)=>{
        const comments = await Comment.find({postId: req.params.id});

        const data = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc : { views : 1}},
            { new : true}
        );

        const locals={
            title : data.title
        }
        res.render("post.ejs",{locals,data,comments
            ,error: req.query.error || null
            ,layout:adminLayout})
    }))

/**
 * View Register Form
 * Get /register
 */
router.post("/register",asyncHandler(async(req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = await User.create({
        username: req.body.username,
        password:hashedPassword
    });

    //확인용
    //res.json(`user created : ${user}`)
    }
));





/**
 *  Check Login
 * Post /admin
 */
router.post("/admin",asyncHandler(async(req,res)=>{

    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(401).json({message:"일치하는 사용자가 없습니다."});
    }

    const isValidPassword = await bcrypt.compare(password,user.password);
    
    if (!isValidPassword){
        return res.status(401).json({message:"비밀번호가 일치하지 않습니다."});
    }

    const token = jwt.sign({id:user._id,username:username},jwtToken,{expiresIn:"1h"});
    res.cookie("token",token,{httpOnly:true});
    res.redirect("/allPosts")

    }
));

// 전체 게시물 화면
router.get(
    "/allPosts",
    checkLogin,
    asyncHandler(async(req,res)=>{

        const keyword = req.query.keyword || "";
        const page = parseInt(req.query.page) || 1; //현재 페이지
        const perPage = 10; // 한 페이지당 게시물 수

        const search = keyword ? {$or:[
            {title : { $regex:keyword , $options: "i"}},
            {body : { $regex:keyword, $options: "i"}}
        ]}:{};
        const data = await Post.find(search)
            .sort({ createdAt: -1 })
            .skip((page-1)* perPage)
            .limit(perPage);
        
        const totalCount = await Post.countDocuments(search); // 총 게시물 수

        const locals={
            title:"Posts",
            count: totalCount,
            // 무슨 검색했는지 보기 위한 템플릿
            keyword,
            currentPage: page,
            totalPages: Math.ceil(totalCount/ perPage)
        };

        res.render("admin/allPosts",{locals,data,layout:adminLayout});
    })
);

/**
 *  Admin Logout
 *  Get /logout
 */
router.get(
    "/logout",
    (req,res)=>{
        res.clearCookie("token");
        res.redirect("/");
    }
)

/**
 *  Admin - Add Post
 *  GET /add 
 */
router.get("/add",checkLogin,asyncHandler(async(req,res)=>{
    const locals={
        title:"게시물작성"
    }
    res.render("admin/add",{locals,layout:adminLayout});
}))


/**
 * Admin - Add Post
 * Post /add
 */
router.post("/add",checkLogin,asyncHandler(async(req,res)=>{
    const {title, body} = req.body;
    const newPost = new Post({
        title:title,
        body:body,
    })
    await Post.create(newPost);
    res.redirect("/allPosts")
}))

/**
 * Admin - edit Post
 * GET /edit/:id
 */
router.get("/edit/:id",
    checkLogin,
    asyncHandler(async(req,res)=>{
        const locals={ title: "게시물 편집"};
        const data = await Post.findOne({_id:req.params.id});
        res.render("admin/edit",{locals,data,layout:adminLayout})
    }))

/**
 * Admin - edit Post
 * PUT /edit/:id
 */

router.put("/edit/:id",
    checkLogin,
    asyncHandler(async(req,res)=>{
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            createdAt: Date.now()
        });
        res.redirect("/allPosts")
    })
)

/**
 * Admin - Delete Post
 * Delete /delete/:id
 */

router
.delete("/delete/:id",
    checkLogin,
    asyncHandler(async(req,res)=>{
        await Post.deleteOne({ _id : req.params.id });
        res.redirect("/allPosts")
    })
)

// 좋아요 기능
router
.post("/like/:id", asyncHandler(async(req,res)=>{

    const postId = req.params.id.toString();
    const post = await Post.findById(postId);

    // 사용자가 좋아요를 누른 게시물 ID 목록
    let likedPosts = req.cookies.likedPosts ? JSON.parse(req.cookies.likedPosts) : [];

    if(likedPosts.includes(postId)){
        //좋아요 취소
        if(post.likes>0){
            await Post.findByIdAndUpdate(postId,{ $inc : {likes: -1} });
        }
        //쿠키 배열에서 postId를 제거
        likedPosts = likedPosts.filter(id=>id !== postId);
    }else{
        //좋아요 추가
        await Post.findByIdAndUpdate(postId, { $inc : {likes : 1} });
        likedPosts.push(postId);
    }

    res.cookie("likedPosts",JSON.stringify(likedPosts),{
        maxAge:3600000, // 유효시간 60분
        httpOnly:true
    })

    res.redirect('/post/'+ req.params.id);
    })
);

router.post("/dislike/:id",
    asyncHandler(async(req,res)=>{
    
    const postId = req.params.id.toString();
    const post = await Post.findById(postId);

    let dislikedPosts = req.cookies.dislikedPosts ? JSON.parse(req.cookies.dislikedPosts) : [];

    if(dislikedPosts.includes(postId)){
        //싫어요 취소
        if(post.dislikes>0){
            await Post.findByIdAndUpdate(postId,{ $inc : {dislikes: -1} });
        }
        dislikedPosts = dislikedPosts.filter(id=>id !== postId);
    }else{
        //싫어요 추가
        await Post.findByIdAndUpdate(postId, { $inc : {dislikes : 1} });
        dislikedPosts.push(postId);
    }

    res.cookie("dislikedPosts",JSON.stringify(dislikedPosts),{
        maxAge:3600000, // 유효시간 60분
        httpOnly:true
    })

    res.redirect('/post/'+ req.params.id);

    })
)





module.exports = router;