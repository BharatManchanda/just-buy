require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
const { uploadImage } = require('./controllers/upload/upload');

// Database connection
const connectDB = require('./DB/connect');
const routes = require('./routes/index');
const { upload } = require("./utils/storage");
// Middlewares
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: process.env.CLIENT_URL, // frontend domain
  credentials: true
}));

app.use(express.json());

// ==== Routes ====
app.get("/", (req, res) => res.send("Welcome to JustBuy API"));
app.use("/api/upload-image", upload.single('image'), uploadImage);
app.use("/api", routes);

// Simple health check
app.get('/ping', (req, res) => res.status(200).send('OK'));

// ===== Start Server =====
const port = process.env.PORT || 6000;

// app.listen(port, async () => {
// 	await connectDB();
// 	console.log(`Server running on http://localhost:${port}`);
// });
app.listen(port, "0.0.0.0", async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${port}`);
});