const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdminById = async () => {
  try {
    // 1. Connect to Database
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.");

    // 2. TARGET YOUR EXACT ID
    const userId = "6995385399c0afcd96155631";

    // 3. Find and Update
    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ Error: Still cannot find user with this ID.");
      console.log("👉 Check if your .env MONGO_URI is pointing to the correct database name.");
      process.exit();
    }

    console.log(`\n👤 Found User: ${user.name} (${user.email})`);
    console.log(`Current Role: ${user.role}`);

    // 4. Force Update to Admin
    user.role = "admin";
    await user.save();

    console.log(`\n🎉 SUCCESS! Role updated to: ${user.role}`);
    console.log("✅ You can now log in as Admin.");
    
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit();
  }
};

makeAdminById();