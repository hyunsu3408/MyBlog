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

app.listen(port,()=>{
    console.log(`APP listening on port ${port}`)
})