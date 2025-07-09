// 1. 기본 설정
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const connectDb = require("./config/db.js");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override")
const jwt = require("jsonwebtoken");

const jwtToken = process.env.JWT_TOKEN;
const app = express();
const port = process.env.PORT || 8800;

const Visitor = require("./models/Visitor.js")

// 2.DB 연결
connectDb();

// 3. 미들웨어
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.use(cookieParser());
app.use(expressLayouts)
app.use(express.json());
app.use(express.static("public"))

// 4.로그인 상태 미들웨어
app.use(async(req, res, next) => {
    const token = req.cookies.token;
    let visitor = await Visitor.findOne();

    if (token) {
        try {
        const decoded = jwt.verify(token, jwtToken);
        res.locals.isLoggedIn = true;
        res.locals.userId = decoded.id;
        res.locals.username = decoded.username; 
    } catch (err) {
        console.log("JWT 만료 또는 위조:",err.message);
        res.clearCookie("token"); //만료된 쿠키 삭제
        res.locals.isLoggedIn = false;
        }
    } else {
        res.locals.isLoggedIn = false;
    }

    if(!visitor){
        visitor = new Visitor({count:1});
    } else{
        visitor.count += 1;
    }
    await visitor.save();

    res.locals.visitorCount = visitor.count;
    next();




});

// method-override 작동 확인 로그
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});


// 5.뷰 설정
app.set("view engine","ejs")
app.set("views","./views")

// 6.라우터
app.use("/",require("./routes/main"))
app.use("/",require("./routes/admin"))
app.use("/",require("./routes/comment"))

// 7. 서버 실행
app.listen(port,()=>{
    console.log(`APP listening on port ${port}`)
})

// git에서 .env파일 없애기
// git rm --cacahed .env -> .env -> git commit -m ""
// -> git push origin main