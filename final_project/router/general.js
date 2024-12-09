const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  let booksPromise = new Promise((resolve, reject) => {
    resolve(books);
  });
  promisedBooks = await booksPromise;
  res.send(JSON.stringify(promisedBooks, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    const bookPromise = new Promise((resolve, reject) => {
        resolve(books[isbn]);
    })
    const promisedBook = await bookPromise;
    res.send(promisedBook);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const booksByAuthorPromise = new Promise((resolve, reject) => {
        let booksByAuthor = []
        for (key in books) {
            const book = books[key];
            if (book['author'] === author) {
                booksByAuthor.push(book);
            }
        }
        resolve(booksByAuthor)
    });
    const promisedBooksByAuthor = await booksByAuthorPromise;
    res.send(JSON.stringify(promisedBooksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const booksByTitlePromise = new Promise((resolve, reject) => {
        let booksByTitle = []
        for (key in books) {
            const book = books[key];
            if (book['title'] === title) {
                booksByTitle.push(book);
            }
        }
        resolve(booksByTitle);
    });
    const promisedBooksByTitle = await booksByTitlePromise;
    res.send(JSON.stringify(promisedBooksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]['reviews'], null, 4));
});

module.exports.general = public_users;
