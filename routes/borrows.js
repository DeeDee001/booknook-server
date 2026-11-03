const express = require("express");
const { ObjectId } = require("mongodb");
const verifyToken = require("../middleware/verifyToken");

const createBorrowsRouter = (db) => {
  const router = express.Router();
  const borrowsCollection = db.collection("borrows");
  const booksCollection = db.collection("books");

  // 6. POST /borrows — borrow a book (protected)
  router.post("/", verifyToken, async (req, res) => {
    try {
      const { bookId, bookTitle, bookImage, userEmail, userName, borrowDate, returnDate } = req.body;

      if (!bookId || !returnDate) {
        return res.status(400).json({
          success: false,
          message: "Book ID and Return Date are required to borrow a book",
        });
      }

      const today = new Date().toISOString().split("T")[0];
      if (returnDate < today) {
        return res.status(400).json({
          success: false,
          message: "Return date cannot be in the past. Please select a valid future date.",
        });
      }

      if (!ObjectId.isValid(bookId)) {
        return res.status(400).json({ success: false, message: "Invalid book ID format" });
      }

      const borrowerEmail = userEmail || req.user.email;
      const borrowerName = userName || req.user.name || "Reader";

      // 1. Verify book availability
      const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });
      if (!book) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }

      if (!book.totalCopies || book.totalCopies <= 0) {
        return res.status(400).json({
          success: false,
          message: "This book is currently out of stock and cannot be borrowed.",
        });
      }

      // 2. Challenge: No Double Borrow check
      const existingBorrow = await borrowsCollection.findOne({
        bookId: bookId.toString(),
        userEmail: borrowerEmail,
      });

      if (existingBorrow) {
        return res.status(400).json({
          success: false,
          message: "You have already borrowed this book! Please return it before borrowing again.",
        });
      }

      // 3. Challenge: Decrease available copies by 1 with $inc
      await booksCollection.updateOne(
        { _id: new ObjectId(bookId) },
        { $inc: { totalCopies: -1 } }
      );

      // 4. Save borrow record
      const borrowRecord = {
        bookId: bookId.toString(),
        bookTitle: bookTitle || book.title,
        bookImage: bookImage || book.image,
        userEmail: borrowerEmail,
        userName: borrowerName,
        borrowDate: borrowDate || new Date().toISOString().split("T")[0],
        returnDate: returnDate,
        createdAt: new Date(),
      };

      const result = await borrowsCollection.insertOne(borrowRecord);

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully! Happy reading.",
        data: { _id: result.insertedId, ...borrowRecord },
      });
    } catch (error) {
      console.error("Error borrowing book:", error);
      res.status(500).json({ success: false, message: "Failed to borrow book", error: error.message });
    }
  });

  // 7. GET /borrows — get the borrows of the logged in user (protected)
  router.get("/", verifyToken, async (req, res) => {
    try {
      const email = req.query.email || req.user.email;
      if (!email) {
        return res.status(400).json({ success: false, message: "User email is required" });
      }

      const borrows = await borrowsCollection
        .find({ userEmail: email })
        .sort({ createdAt: -1 })
        .toArray();

      res.status(200).json({
        success: true,
        count: borrows.length,
        data: borrows,
      });
    } catch (error) {
      console.error("Error fetching user borrows:", error);
      res.status(500).json({ success: false, message: "Failed to fetch borrowed books", error: error.message });
    }
  });

  // 8. DELETE /borrows/:id — return a book (protected)
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid borrow record ID" });
      }

      const borrowRecord = await borrowsCollection.findOne({ _id: new ObjectId(id) });
      if (!borrowRecord) {
        return res.status(404).json({ success: false, message: "Borrow record not found or already returned" });
      }

      // Challenge: Increase book copies by 1 with $inc upon return
      if (borrowRecord.bookId && ObjectId.isValid(borrowRecord.bookId)) {
        await booksCollection.updateOne(
          { _id: new ObjectId(borrowRecord.bookId) },
          { $inc: { totalCopies: 1 } }
        );
      }

      // Remove borrow record
      await borrowsCollection.deleteOne({ _id: new ObjectId(id) });

      res.status(200).json({
        success: true,
        message: "Book returned successfully! Thank you.",
      });
    } catch (error) {
      console.error("Error returning book:", error);
      res.status(500).json({ success: false, message: "Failed to return book", error: error.message });
    }
  });

  return router;
};

module.exports = createBorrowsRouter;
