const express = require("express");
const verifyAuth = require("../middleware/verifyAuth.middlerware");
const bookController = require("../controller/books.controller");

const booksRoutes = express.Router();

booksRoutes.get("/", bookController.getAllBooks);

booksRoutes.get("/:id", bookController.getBookById);

booksRoutes.get("/", verifyAuth, bookController.createBook);

booksRoutes.get("/:id", verifyAuth, bookController.updateBookById);

booksRoutes.get("/:id", verifyAuth, bookController.deleteBookById);

module.exports = booksRoutes;
