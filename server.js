// if(process.env.NODE_ENV !== "product"){
//    const dotenv = require("dotenv") }
const dotenv  = require("dotenv");
 dotenv.config();

const express = require("express")
const app = express();
const expresslayouts = require("express-ejs-layouts");
const expressRouter = require("./router/index")
const authorsRoute = require("./router/author");
const booksRoute = require("./router/books")
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const methodOverride = require("method-override")

app.set("view engine", "ejs")
app.set("views", __dirname + "/views");
app.set("layout","layouts/layout");
app.use(expresslayouts);
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use("/",expressRouter);
app.use(bodyParser.urlencoded({limit:"50mb",extended:false}))
app.use("/authors",authorsRoute);
app.use("/books",booksRoute);
// app.settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

mongoose.connect(process.env.Database_Url,{useNewUrlParser:true,useUnifiedTopology:true})
           .then(() => {
               console.log("Mongodbga ulanish hosil buldi....")
           })
           .catch((err) => {
               console.log(err)
           })

app.listen(process.env.PORT || 8080,() => {
    console.log("server eshitilyapti")
})
