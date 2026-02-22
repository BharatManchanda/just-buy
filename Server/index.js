// index.js
require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
const multer = require("multer");
const { uploadImage } = require('./controllers/upload/upload');

// Database connection
const connectDB = require('./DB/connect');
const routes = require('./routes/index');

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL, // frontend domain
  credentials: true
}));
app.use(express.json());

// ===== Multer setup =====

// Use disk storage locally, memory storage on Vercel
const storage = process.env.VERCEL
  ? multer.memoryStorage() // ✅ Vercel serverless
  : multer.diskStorage({
      destination: path.join(__dirname, "uploads"),
      filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
    });

const upload = multer({ storage });

// Serve uploads folder locally
// if (!process.env.VERCEL) {
//   app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// }

// ===== Routes =====
app.get("/", (req, res) => res.send("Welcome to JustBuy API"));
app.use("/api/upload-image", upload.single('image'), uploadImage);
app.use("/api", routes);

// Simple health check
app.get('/ping', (req, res) => res.status(200).send('OK'));

// ===== Start Server =====
const port = process.env.PORT || 6000;

app.listen(port, async () => {
	await connectDB();
	console.log(`Server running on http://localhost:${port}`);
});