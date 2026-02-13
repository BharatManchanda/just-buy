require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
const multer = require("multer");
const { uploadImage } = require('./controllers/upload/upload');

// middlewares
app.use(cors({

  origin: process.env.CLIENT_URL, // or your frontend domain
  credentials: true
}));
console.log("Client URL:", process.env.CLIENT_URL);
app.use(express.json());

// Serve uploads folder correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const connect = require('./DB/connect');
const routes = require('./routes/index');

// Ensure uploads are stored in the correct directory
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use("/api/upload-image", upload.single('image'), uploadImage);
app.use("/api", routes);
app.get('/ping', (req, res) => {
  res.status(200).send('OK');
});

// Connect to DB
// connect();

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

const port = process.env.PORT || 6000;
const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

start();

// ❗ Export the app instead of listening
module.exports = app;
