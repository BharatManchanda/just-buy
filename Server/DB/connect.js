// const mongoose = require('mongoose');
require("dotenv").config();

// const connectDB = async () => {
//   try {
//     console.log("Connecting to MongoDB...");
//     // await mongoose.connect(process.env.CONNECTION_STRING);
//     await mongoose.connect(process.env.CONNECTION_STRING, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//   }
// };

// module.exports = connectDB;

// DB/connect.js
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connect;
