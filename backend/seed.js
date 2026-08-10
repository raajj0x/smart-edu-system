const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Data Seeding Started..."))
  .catch(err => console.log(err));

const seedUsers = async () => {
  try {
    // 1. Delete any existing users (so we don't get duplicates)
    await User.deleteMany({});
    console.log("Old users removed.");

    // 2. Encrypt the password "123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123", salt);

    // 3. Define the 3 users
    const users = [
      {
        name: "Raj Admin",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin"
      },
      {
        name: "Raj Teacher",
        email: "teacher@test.com",
        password: hashedPassword,
        role: "teacher"
      },
      {
        name: "Raj Student",
        email: "student@test.com",
        password: hashedPassword,
        role: "student"
      }
    ];

    // 4. Insert them into MongoDB
    await User.insertMany(users);
    console.log("✅ Users Added Successfully!");
    
    // 5. Close connection
    mongoose.connection.close();
  } catch (error) {
    console.log("❌ Error:", error);
    process.exit(1);
  }
};

seedUsers();