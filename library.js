const mongoose = require("mongoose");

const bookSchema  = new mongoose.Schema({
    ISBN: String,
    title: String,
    authors: Array,
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: Array,
    publication: Number,
});

const authorSchema  = new mongoose.Schema({
    id: Number,
    name: String,
    books: Array,
});

const publicationSchema  = new mongoose.Schema({
    id: Number,
    name: String,
    books: Array,
});


const publicationModel =  mongoose.model("Publication",publicationSchema);
const authorModel =  mongoose.model("Author",authorSchema);
const bookModel =  mongoose.model("Book",bookSchema);

module.exports = {publicationModel, authorModel, bookModel}; 