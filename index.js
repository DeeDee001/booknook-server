require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");

const createBooksRouter = require("./routes/books");
const createBorrowsRouter = require("./routes/borrows");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/production with credentials
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booknook";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    db = client.db("booknook");
    console.log("Successfully connected to MongoDB database [booknook]!");

    // JWT Token Generation Route for Authenticated Users
    app.post("/jwt", async (req, res) => {
      try {
        const { email, name } = req.body;
        if (!email) {
          return res.status(400).json({ success: false, message: "Email is required to generate token" });
        }

        const secret = process.env.JWT_SECRET || "booknook_jwt_secret_key_change_me_in_production";
        const token = jwt.sign({ email, name: name || "User" }, secret, {
          expiresIn: "7d",
        });

        res.status(200).json({ success: true, token });
      } catch (err) {
        console.error("JWT signing error:", err);
        res.status(500).json({ success: false, message: "Failed to generate token" });
      }
    });

    // Mount API Routes
    app.use("/books", createBooksRouter(db));
    app.use("/borrows", createBorrowsRouter(db));

    // Welcome Root Route
    app.get("/", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Welcome to BookNook Server API",
        status: "Online",
        endpoints: [
          "GET /books",
          "GET /books/:id",
          "POST /books (Protected)",
          "PATCH /books/:id (Protected)",
          "DELETE /books/:id (Protected)",
          "POST /borrows (Protected)",
          "GET /borrows (Protected)",
          "DELETE /borrows/:id (Protected)",
        ],
      });
    });

    // 404 Route handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `API Route not found: ${req.method} ${req.originalUrl}`,
      });
    });

    // Global Error Handler
    app.use((err, req, res, next) => {
      console.error("Unhandled Server Error:", err.stack);
      res.status(500).json({
        success: false,
        message: "Internal server error occurred",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`BookNook server is running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

run().catch(console.dir);

module.exports = app;
