const express = require("express")
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtToken = process.env.JWT_Token;


//로그인을 위해 cookie-parser,json-web-token 모듈 설치

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


module.exports = router;