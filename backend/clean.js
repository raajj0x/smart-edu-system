const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Make sure these match your actual model filenames!
const Classroom = require('./models/Classroom');
const Assignment = require('./models/Assignment');
const Video = require('./models/Video');
const Exam = require('./models/Exam');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🧹 Sweeping up ghost data...");
    
    // This deletes all the orphaned content left over from earlier
    await Classroom.deleteMany({});
    await Assignment.deleteMany({});
    await Video.deleteMany({});
    await Exam.deleteMany({});
    
    console.log("✅ All ghost courses and files have been permanently deleted!");
    process.exit();
  })
  .catch(err => {
    console.log("❌ Error:", err);
    process.exit(1);
  });