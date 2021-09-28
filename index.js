// MAIN BACKEND FILE
const { json } = require('express');
const db = require("./database/index");
require("dotenv").config();
// console.log(db.books);
// console.log(db.authors);
// console.log(db.publications);

const express = require("express");

//mongoose connection
const connectDB = require("./connection.js");

//mongoose model
const {bookModel, authorModel, publicationModel} = require("./library");
// const authorModel = require("./author");
// const publicationModel = require("./publication");

const app = express();


// using json for post
app.use(express.json());

// http://localhost:3000/
app.get("/", (req, res) => {
    return res.json({"WELCOME": `to my Backend Software for the Book Company`});
});

// http://localhost:3000/books
app.get("/books",async (req, res) => {
     try{
        const getAllBooks = await bookModel.find();
        if(getAllBooks == null){
            return res.json("Error");
        }
        return res.json({getAllBooks});
     }
     catch(e){
         return res.status(500).json({e : e.Message});
     }
});

// http://localhost:3000/book-isbn/12345Two
app.get("/book-isbn/:isbn",async (req, res) => {
    try{
        // console.log(req.params);
    const {isbn} = req.params;
    console.log(isbn);
    const getSpecificBook = await bookModel.findOne({ISBN : isbn})
    console.log(getSpecificBook);
    // console.log(getSpecificBook.length);
    if(!getSpecificBook){
        return res.json({Message : "No data Found"});
    }
    return res.json({getSpecificBook});
    }
    catch(e){
        return res.status(500).json({e : e.Message});
    }
});

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", (req, res) => {
    // // console.log(req.params);
    const {category} = req.params;
    // // console.log(isbn);
    const getSpecificBooks = db.books.filter((book) => book.category.includes(category));
    // // console.log(getSpecificBook);
    // // console.log(getSpecificBook.length);
    if(getSpecificBooks.length===0) {
        return res.json({"error": `No Books found for the category of ${category}`});
    }
    return res.json(getSpecificBooks);
});

// http://localhost:3000/authors
app.get("/authors", (req, res) => {
    const getAllAuthors = db.authors;
    return res.json(getAllAuthors);
});

// http://localhost:3000/author-id/1
app.get("/author-id/:id", (req, res) => {
    // console.log(req.params);
    let {id} = req.params;
    id = Number(id);
    // console.log(id);
    const getSpecificAuthor = db.authors.filter((author) => author.id === id);
    // console.log(getSpecificAuthor);
    // console.log(getSpecificAuthor.length);
    if(getSpecificAuthor.length===0) {
        return res.json({"error": `No Author found for the id of ${id}`});
    }
    return res.json(getSpecificAuthor[0]);
});

// http://localhost:3000/author-isbn/12345Two
app.get("/author-isbn/:isbn", (req, res) => {
    const {isbn} = req.params;
    const getSpecificAuthor = db.authors.filter((author) => author.books.includes(isbn));
    if(getSpecificAuthor.length===0) {
        return res.json({"error": `No Author found for the id of ${isbn}`});
    }
    return res.json(getSpecificAuthor);
});

// http://localhost:3000/publications
app.get("/publications", (req, res) => {
    const getAllPublications = db.publications;
    return res.json(getAllPublications);
});

// http://localhost:3000/publication-isbn/12345Two
app.get("/publication-isbn/:isbn", (req, res) => {
    const {isbn} = req.params;
    const getISBNPublications = db.publications.filter((publication) => publication.books.includes(isbn));
    if(getISBNPublications.length===0) {
        return res.json({"error": `No Author found for the id of ${isbn}`});
    }
    return res.json(getISBNPublications);
});

// Posting a new book
app.post("/addBook",async (req,res) => {
   try{
       console.log(req.body);
    const {newBook} = req.body;
    console.log(newBook);
    await bookModel.create(newBook);
    return res.json({newBook});
   }
   catch(error){
    return res.status(500).json({error : error.Message});
   }
});


// Posting new Author
app.post("/addauthor",async (req,res) => {
    try{
        const {newAuthor} = req.body;
        await authorModel.create(newAuthor);
        return res.json({newAuthor});
    }
    catch(e){
        res.status(500).json({e : e.Message});
    }
});

// Posting new publication
app.post("/addpublications",async (req,res) => {
    try{
        const {newPublication} = req.body;
        await publicationModel.create(newPublication);
        return res.json({newPublication});
    }
    catch(e){
        res.status(500).json({e : e.Message});
    }
});



//PUT



// change details of book 
// http://localhost:3000/updateBook/:isbn
app.put("/updateBook/:isbn",(req,res) => {
    try{
        const {updateBook} = req.params;
        
    }
    catch(e){
        res.json("Failed");
    }
});

// change details of Author 
// http://localhost:3000/updateAuthor/1
app.put("/updateAuthor/:id",(req,res) => {
    let {id} = req.params;
    id = Number(id)
    db.authors.forEach((author) => {
        if(author.id == id){
            console.log({...author,...req.body})
            return {...author,...req.body};
        }
        
        return author;
    })
    return res.json(db.authors)
    });


// change details of Publication
// http://localhost:3000/updatePublication/1
app.put("/updatePublication/:id",(req,res) => {
    let {id} = req.params;
    id = Number(id)
    db.publications.forEach((Publication) => {
        if(Publication.id == id){
            console.log({...Publication,...req.body})
            return {...Publication,...req.body};
        }
        
        return Publication;
    })
    return res.json(db.publications)
    });



// DELETE

// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", (req, res) => {
    // console.log(req.params);
    const {isbn} = req.params;
    const filteredBooks = db.books.filter((book) => book.ISBN!==isbn);
    // console.log(filteredBooks);
    db.books = filteredBooks;
    return res.json(db.books);
});

// http://localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id", (req, res) => {
    // console.log(req.params);
    let {isbn, id} = req.params;
    id = Number(id);
    db.books.forEach((book) => {
        if(book.ISBN === isbn) {
            if(!book.authors.includes(id)) {
                return;
            }
            book.authors = book.authors.filter((author) => author!==id);
            return book;
        }
        return book;
    })
    return res.json(db.books);
});

// http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", (req, res) => {
    let {id, isbn} = req.params;
    id = Number(id);
    db.authors.forEach((author) => {
        if(author.id == id) {
            if(!author.books.includes(isbn)) {
                return;
            }
            author.books = author.books.filter((author) => author!==isbn);
            console.log(author)
            return author;
        }
        console.log(author);
        return author;
    })
    return res.json(db.authors);
});

// http://localhost:3000/author-delete/1
app.delete("/author-delete/:id", (req, res) => {
    let {id} = req.params;
    id = Number(id)
    const filteredBooks = db.authors.filter((author) => author.id!==id);
    //  console.log(filteredBooks);
    db.authors = filteredBooks;
    return res.json(db.authors);
});

// http://localhost:3000/publication-delete/1
app.delete("/publication-delete/:id", (req, res) => {
    let {id} = req.params;
    id = Number(id);
    const filterPublications = db.publications.filter((public) => public.id !== id)
    db.publications = filterPublications
    return res.json(db.publications)
});


app.listen(process.env.PORT || 3000,() =>
 connectDB().then((data) =>
 console.log("Server started successfully"))
 .catch((error) => console.log(error))
 );  