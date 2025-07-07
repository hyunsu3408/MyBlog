const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");


// 댓글 추가
router.post("/post/:id/comments",
    asyncHandler(async(req,res)=>{

        const postId = req.params.id;
        const text = req.body.text;

        let userId = null;
        let username = "익명";

        //로그인 상태일 경우
        if(res.locals.isLoggedIn && res.locals.userId && res.locals.username){
            userId = res.locals.userId;
            username = res.locals.username;
        }

        await Comment.create({
            postId,
            user : userId, //로그인 상태면 ObjectId, 아니면 null
            username, // "익명" 또는 로그인 유저 이름
            text
        })
        res.redirect("/post/"+postId)
    })
)

router.delete('/comments/:id/:postId',
    asyncHandler(async(req,res)=>{
        
        const postId = req.params.postId;
        const commentId = req.params.id;
        
        const comment = await Comment.findById(commentId);
        
        if(!comment ||
            !res.locals.isLoggedIn ||
            String(comment.user) !== res.locals.userId){
                return res.redirect("/post/"+postId + "?error=권한이 없습니다");
            }
            
        console.log("Delete 요청 수신됨",req.params.id);
        await Comment.findByIdAndDelete(commentId);
        res.redirect("/post/" + postId);

    })
)



module.exports = router;