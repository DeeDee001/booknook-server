# BookNook Server API

BookNook is a lightweight, secure online library management REST API built with Node.js, Express, and MongoDB Native Driver.

## Features & Highlights

- **RESTful Endpoints**: Provides clean, standard CRUD endpoints for books and borrows.
- **JWT Authentication & Authorization**: Enforces strict token-based authorization on protected actions (adding, updating, deleting books, and borrowing/returning books).
- **Stock Management & Concurrency Handling**: Automatically decrements available copies with atomic `$inc: { totalCopies: -1 }` on borrow and restores copies on return.
- **Duplicate Borrow Prevention**: Prevents users from borrowing multiple copies of the exact same book concurrently.
- **CORS Configured**: Safe cross-origin access configured for local development and production deployments.

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Server health check and API overview |
| `POST` | `/jwt` | Public | Issue JWT authorization token for authenticated users |
| `GET` | `/books` | Public | Fetch books with optional filtering, sorting, search, and pagination |
| `GET` | `/books/:id` | Public | Fetch complete details of a single book |
| `POST` | `/books` | Protected | Add a new book to the library |
| `PATCH` | `/books/:id` | Protected | Update existing book information |
| `DELETE` | `/books/:id` | Protected | Remove a book from the library |
| `POST` | `/borrows` | Protected | Borrow a book (updates copy count, prevents duplicate borrow) |
| `GET` | `/borrows` | Protected | Fetch books borrowed by the currently logged-in user |
| `DELETE` | `/borrows/:id` | Protected | Return a borrowed book (restores copy count) |

## Deployment Guidelines

### Deploying to Render
1. Create a new Web Service connected to your BookNook server repository.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables in Render Dashboard:
   - `PORT=5000`
   - `MONGODB_URI=<Your MongoDB connection string>`
   - `JWT_SECRET=<Your JWT secret>`
   - `CLIENT_URL=<Your frontend URL>`

### Security & Verification
- Never commit real `.env` files into version control.
- Ensure all protected endpoints receive the `Authorization: Bearer <token>` header.
- CORS origins are restricted to authorized client domains.

   ```bash
   cd server-side
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of `server-side` (refer to `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   ```

4. Start the server:
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
