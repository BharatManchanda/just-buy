require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
const { uploadImage } = require('./controllers/upload/upload');
const next = require('next');

// Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({
  dev,
  dir: path.join(__dirname, '../Client'),
  webpack: true,
});
const handle = nextApp.getRequestHandler();

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
console.log("Client URL:", process.env.CLIENT_URL);
app.use(express.json());

// ==== Routes ====
app.use("/api/upload-image", upload.single('image'), uploadImage);
app.use("/api", routes);

// Simple health check
app.get('/ping', (req, res) => res.status(200).send('OK'));

// ===== Start Server =====
const port = process.env.PORT || 6000;

nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    return handle(req, res); // let Next.js handle frontend routes
  });

  app.listen(port, '0.0.0.0', async () => {
    await connectDB();
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}).catch((error) => {
  console.error('Failed to prepare Next.js app:', error);
  process.exit(1);
});


// app.listen(port, "0.0.0.0", async () => {
//   await connectDB();
//   console.log(`Server running on http://localhost:${port}`);
// });
