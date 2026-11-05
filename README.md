# 📚 BookNook Server API

**BookNook Server** is a fast, lightweight, and secure RESTful backend API built to power the **BookNook** library management system. It provides an efficient interface for managing book collections, handling inventory stock levels, processing borrowing and return workflows, and securing user transactions using token-based authorization.

The server is architected to work seamlessly both as a traditional Node.js/Express server and as a serverless backend ready for deployment on platforms like **Vercel**.

---

## ✨ Features

- **📖 Book Management (Full CRUD)**:
  - Add new books to the library collection.
  - View all books with real-time text search (title/author), category filtering, and sorting options.
  - Retrieve detailed information for individual books.
  - Update and delete existing book records.

- **🔄 Borrow & Return System**:
  - **Atomic Stock Management**: Automatically decrements available copies on borrow and increments them back on return using MongoDB `$inc`.
  - **Duplicate Borrow Prevention**: Prevents the same user from borrowing the same book multiple times concurrently.
  - **Borrow History**: Users can view their active borrowed books and process returns.

- **🔐 Authentication & Protected Routes**:
  - Issues JSON Web Tokens (JWT) for authenticated users via `/jwt`.
  - Middleware-based authorization (`verifyToken`) safeguarding sensitive write/update/delete and borrow operations.

- **🌐 Cross-Origin Resource Sharing (CORS)**:
  - Configured to allow secure requests from local development environments (`localhost:3000`) and production client domains (including `.vercel.app`).

- **⚡ Serverless & Cloud Ready**:
  - Includes connection pooling and cold-start optimization for serverless deployment on Vercel (`vercel.json` included).

---

## 🛠️ Technologies Used

| Category | Technology | Description |
|---|---|---|
| **Runtime** | [Node.js](https://nodejs.org/) | JavaScript runtime environment |
| **Framework** | [Express.js](https://expressjs.com/) | Minimalist web application framework for API routing |
| **Database** | [MongoDB](https://www.mongodb.com/) | NoSQL database with official native driver (`mongodb` v6) |
| **Authentication** | [jsonwebtoken (JWT)](https://jwt.io/) | Secure token creation and verification |
| **Security & CORS** | [cors](https://www.npmjs.com/package/cors) | Enabling Cross-Origin Resource Sharing |
| **Environment** | [dotenv](https://www.npmjs.com/package/dotenv) | Loads environment variables from `.env` |
| **Dev Tools** | [nodemon](https://nodemon.io/) | Auto-restarts the server during local development |
| **Deployment** | [Vercel](https://vercel.com/) | Optimized for serverless API hosting |

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Health check & API overview |
| `POST` | `/jwt` | Public | Generate JWT authorization token |
| `GET` | `/books` | Public | Fetch all books (supports query params: `search`, `category`, `sort`, `email`) |
| `GET` | `/books/:id` | Public | Fetch details of a single book by ID |
| `POST` | `/books` | Protected | Add a new book to the library |
| `PATCH` | `/books/:id` | Protected | Update an existing book's details |
| `DELETE` | `/books/:id` | Protected | Remove a book from the catalog |
| `POST` | `/borrows` | Protected | Borrow a book (decrements available copies) |
| `GET` | `/borrows` | Protected | Get all books borrowed by the current user |
| `DELETE` | `/borrows/:id` | Protected | Return a borrowed book (restores available copies) |

---

## 🚀 How to Run Locally

Follow these steps to set up and run the server on your local machine:

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or a local MongoDB instance running)

---

### 2. Clone the Repository
```bash
git clone https://github.com/DeeDee001/booknook-server.git
cd booknook-server
```
*(Or navigate to your local `server-side` directory if you already have the files).*

---

### 3. Install Dependencies
```bash
npm install
```

---

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
```

> **Note:**
> - Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., from MongoDB Atlas).
> - Make sure your MongoDB Atlas **Network Access** allows your IP address (or `0.0.0.0/0` for universal access).
> - If `JWT_SECRET` is not set in `.env`, the server automatically falls back to a default development secret key.

---

### 5. Start the Server

- **Development Mode** (with automatic restarts on code changes):
  ```bash
  npm run dev
  ```

- **Production / Standard Mode**:
  ```bash
  npm start
  ```

---

### 6. Verify Installation
Once the server starts, you will see a message like:
```text
Successfully connected to MongoDB database [booknook]!
BookNook server is running on port 5000
```
Open your browser or API client (Postman/Thunder Client) and visit:
[http://localhost:5000](http://localhost:5000)

You should receive a `200 OK` JSON response:
```json
{
  "success": true,
  "message": "Welcome to BookNook Server API",
  "status": "Online"
}
```
