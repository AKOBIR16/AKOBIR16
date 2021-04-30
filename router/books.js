const express = require("express");
const router = express.Router();
const fs = require("fs")
const mongoose = require("mongoose")
const Book = require("../models/books");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"]
const Author = require("../models/author")

router.get("/", async (req, res) => {
    let query = await Book.find()
    if (req.query.title != null && req.query.title != "") {
        query = query.filter(obj => obj.title.search(new RegExp(req.query.title, "i")) != -1);
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.filter(obj => new Date(obj.publishDate).getTime() >= new Date(req.query.publishedBefore).getTime())
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.filter(obj => new Date(obj.publishDate).getTime() <= new Date(req.query.publishedAfter).getTime())
    }
    try {

        res.render("books/index", {
            books: query,
            searchOptions: req.query
        })
    } catch {
        res.redirect("/")
    }
})
router.get("/new", async (req, res) => {
    const book = new Book();
    renderMessage(res, book);
})
router.post("/", async (req, res) => {
    const readyBook = new Book({
        title: req.body.title,
        description: req.body.description,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate),
        author: req.body.author
    })
saveCoverImage(readyBook, req.body.cover);
    try {
        const newbook = await readyBook.save();
        res.redirect("books")
    } catch (err) {
        console.log(err)
        renderMessage(res, readyBook, true);
    }
})
router.get("/:id", async (req, res) => {

    const book = await Book.findById(req.params.id)
        .populate('author')
        .exec()
    try {
        res.render("books/show", {
            books: book
        })
    } catch {
        res.redirect("/")
    }
})
router.get("/:id/edit", async (req, res) => {
    const book = await Book.findById(req.params.id)
    renderEdit(res, book);
})
router.put("/:id", async (req, res) => {
    const readyBook = await Book.findById(req.params.id);
     readyBook.title = req.body.title;
     readyBook.description = req.body.description;
     readyBook.pageCount = req.body.pageCount;
     readyBook.publishDate = new Date(req.body.publishDate);
     readyBook.author = req.body.author;
    
    
    try {
        saveCoverImage(readyBook, req.body.cover);
        const newbook = await readyBook.save();
        res.redirect("/books")
        
    } catch (err) {
        console.log(err)
        renderMessage(res, readyBook, true);
    }
})
router.delete("/:id",async (req,res) => {
    book = await Book.findById(req.params.id)
    try{
       const deletedBook = await Book.deleteOne(book)  
      res.redirect('/books');
    }catch(err){
        if(book == null){
           res.render("/books/show",{
               books:book,
               errorMessage: "could not remove book"
           })
            
        }else{
            console.log(err);
          res.redirect(`/`);
        }
    }

})
async function renderEdit(res, book, hasError = false) {
    const authors = await Author.find();
    try {
        const params = {
            book: book,
            authors: authors
        }
        if (hasError) params.errorMessage = "error message has "
      res.render("books/edit", params)
    } catch {
        res.redirect("/books")
    }
}

async function renderMessage(res, book, hasError = false) {
        const authors = await Author.find();
        try {
            const params = {
                book: book,
                authors: authors
            }
            if (hasError) params.errorMessage = "error message has "
            res.render("books/new", params)
        } catch {
            res.redirect("/books")
        }
}
function saveCoverImage(book, encoded) {  
    if (encoded.length!==0) {
        const cover = JSON.parse(encoded);
        if (cover != null && imageMimeTypes.includes(cover.type)) {
            book.coverImage = new Buffer.from(cover.data, "base64")
            book.coverImageType = cover.type
        }
    }else{
        return
    }
}








module.exports = router