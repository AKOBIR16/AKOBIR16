const express = require("express");
const router = express.Router();
const Author = require("../models/author")
const Books = require("../models/books")
// all author get
router.get("/", async (req, res) => {
    const searchOptions = {}
    if(req.query.name != null && req.query.name !== ""){
        searchOptions.name = new RegExp(req.query.name)
    }
   try{
       const foundElement = await Author.find(searchOptions);
       res.render("authors/index",{
           authors:foundElement,
           searchOptions : req.query
       })
   }catch{
       res.redirect("/")
       console.log("Something went wrong")
   }
})
router.get("/new", (req, res) => {
    res.render("authors/new", { author: new Author() });
})
router.post("/", async (req, res) => {
    const newAuthor = new Author({
        name: req.body.name
    })
    try{
        await newAuthor.save();
        res.redirect("/authors")
    }
    catch(err){
        res.render("authors", {
            author:Author,
            errorMessage: "actually Create author"
        })
    }
})
router.get("/:id", async (req,res) => {
    const author = await Author.findById(req.params.id)
    const books = await Books.find({author:author});
    if(books == null){
    console.log(books);
    }
    try{
         res.render("authors/show", { author: author,books:books});
    } catch{
       res.redirect("/authors")
    }
    
})
router.get("/:id/edit",async (req,res) => {
    const author = await Author.findById(req.params.id)
    try{
         res.render("authors/edit", { author: author });
    } catch{
       res.redirect("/authors")
    }
    
})

router.put("/:id",async (req,res) =>{
     let author
    try{
      author = await Author.findById(req.params.id);
      author.name = req.body.name; 
      await author.save()
      res.redirect(`/authors`);

    }catch{
        if(author == null){
            res.redirect("/")
        }else{
          res.render("authors/edit", {
            author:author,
            errorMessage: "has error"
        })  
        }
    }
})
router.delete("/:id",async (req,res) =>{
    let author
    try{
      author = await Author.findById(req.params.id); 
      await author.remove();
      res.redirect('/authors');
    }catch(err){
        if(author == null){
            res.redirect("/")
        }else{
            console.log(err);
          res.redirect(`/authors/${author.id}`);
        }
    }
})






module.exports = router