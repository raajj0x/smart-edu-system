const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 1. Attempt connection
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 2. Success Message
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    // 3. Error Message (Authentication or Network)
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;