const express = require("express")
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtToken = process.env.JWT_Token;

//로그인을 위해 cookie-parser,json-web-token 모듈 설치

/**
 * Check Login
 */
const checkLogin = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        res.redirect("/admin")
    }
    else{
        try{
            const decoded = jwt.verify(token,jwtToken);
            req.userId = decoded.userId;
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

    res.render("admin/index",{locals,layout:adminLayout2});
})

router.get(
    "/post/:id",
    asyncHandler(async(req,res)=>{
        const data = await Post.findOne({ _id: req.params.id});
        const locals={
            title : data.title
        }
        res.render("post.ejs",{locals,data,layout:adminLayout})
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

    const token = jwt.sign({id:user._id},jwtToken,{expiresIn:"1h"});
    res.cookie("token",token,{httpOnly:true});
    res.redirect("/allPosts")

    }
));

// 전체 게시물 화면
router.get(
    "/allPosts",
    checkLogin,
    asyncHandler(async(req,res)=>{
        const locals={
            title:"Posts"
        }

        const data = await Post.find();
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


module.exports = router;