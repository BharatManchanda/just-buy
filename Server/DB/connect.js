const mongoose = require('mongoose');
require("dotenv").config();

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const MONGO_URI = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/mydb';
    mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

module.exports = connectDB;