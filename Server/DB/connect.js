const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    // await mongoose.connect(process.env.CONNECTION_STRING);
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

module.exports = connectDB;
