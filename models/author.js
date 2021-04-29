const mongoose = require("mongoose");
const Books = require("./books")
const mongooseShema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    }
})
mongooseShema.pre("remove",function(next){
    Books.find({author:this.id},(err,books) =>{
        if(err){
            next(err)
        }else if(books.length > 0){
            next(new Error("This author has books still"))
        }else{
            next();
        }
    })
})

const expi =  mongoose.model("Mybrary",mongooseShema);
module.exports = expi