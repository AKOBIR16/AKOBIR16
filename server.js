// if(process.env.NODE_ENV !== "product"){
//    require("dotenv")
// }
const dotenv  = require("dotenv");
dotenv.config()

const express = require("express")
const app = express();
const expresslayouts = require("express-ejs-layouts");
const expressRouter = require("./router/index")
const mongoose = require("mongoose");

app.set("view engine", "ejs")
app.set("views", __dirname + "/views");
app.set("layout","layouts/layout");
app.use(expresslayouts);
app.use(express.static("public"));
app.use("/",expressRouter);
// app.settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
console.log(process.env.Database_Url)
mongoose.connect(process.env.Database_Url,{useNewUrlParser:true,useUnifiedTopology:true});
const db = mongoose.connect
console.log(db);
// db.on("error",(error) => { console.error(error)});
// db.once("open",() => {console.log("Connected to mongodb")})

app.listen(process.env.Port || 3000,() => {
    console.log("server eshitilyapti")
})