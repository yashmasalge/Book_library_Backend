const data = require("./database/index.js");
// console.log(data);

const express = require("express");

const app = express();

app.get("/",(req,res) => {
    const getAllBooks = data.books;
    return res.json(getAllBooks);
})

app.get("/book/:isbn",(req,res) => {
    console.log(req.params);
    const {isbn} = req.params;
    console.log(isbn)
    const getSpecificBook = data.books.filter((book) => book.ISBN == isbn);
    if(getSpecificBook.length == 0){
        return res.json("Error : No such Book Present");
    }
    return res.json(getSpecificBook[0]);
})

app.get("/book-category/:category",(req,res) => {
    console.log(req.params);
    const {category} = req.params;
    console.log(category)
    const getSpecificCategory = data.books.filter((book) => book.category.includes(category) == category);
    if(getSpecificCategory.length == 0){
        return res.json("Error : No such Book Present");
    }
    return res.json("getSpecificCategory.includes(book.category)");
})

app.listen(300,() =>{
    console.log("Server started")
})