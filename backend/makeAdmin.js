// FILE: backend/makeAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected");

    // 2. TARGET YOUR SPECIFIC USER ID
    // This is the ID you found in your database:
    const userId = "6995385399c0afcd96155631";

    console.log(`🔍 Searching for User ID: ${userId}...`);
    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ Error: Still cannot find user with this ID.");
      console.log("👉 Double check your .env file connects to the correct database.");
      process.exit();
    }

    // 3. FORCE UPDATE TO ADMIN
    user.role = "admin";
    await user.save();

    console.log("=======================================");
    console.log(`🎉 SUCCESS! Account Updated:`);
    console.log(`👤 Name:  ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👑 Role:  ${user.role}`);
    console.log("=======================================");
    console.log("👉 You can now log in at http://localhost:3000/login");
    
    process.exit();
  } catch (err) {
    console.error("❌ System Error:", err);
    process.exit();
  }
};

makeAdmin();