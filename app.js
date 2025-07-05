require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const connectDb = require("./config/db.js")

const app = express();
const port = process.env.PORT || 8800;

//DB 연결
connectDb();

app.use(expressLayouts)

app.set("view engine","ejs")
app.set("views","./views")

app.use(express.static("public"))

app.use("/",require("./routes/main"))
app.use("/",require("./routes/admin"))

app.listen(port,()=>{
    console.log(`APP listening on port ${port}`)
})

// git에서 .env파일 없애기
// git rm --cacahed .env -> .env -> git commit -m ""
// -> git push origin main