// backend/controllers/teacherController.js
const Classroom = require('../models/Classroom');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const Video = require('../models/Video');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Result = require('../models/Result'); 
const Submission = require('../models/Submission');

// ==========================================
// 1. CLASSROOMS
// ==========================================
exports.createClass = async (req, res) => {
  const { name, subject } = req.body;
  try {
    const newClass = new Classroom({ name, subject, teacher: req.user.id, students: [] });
    await newClass.save();
    res.json({ message: "Classroom Created!", classroom: newClass });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Classroom.find({ teacher: req.user.id }).sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteClass = async (req, res) => {
  try {
    await Classroom.findByIdAndDelete(req.params.id);
    res.json({ message: "Class Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ==========================================
// 2. ASSIGNMENTS
// ==========================================
exports.createAssignment = async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const assignment = new Assignment({
      title, description, dueDate, teacher: req.user.id,
      pdfUrl: req.file ? req.file.path.replace(/\\/g, "/") : null
    });
    await assignment.save();
    res.json({ message: "Assignment Posted!", assignment });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (dueDate) assignment.dueDate = dueDate;
    if (req.file) assignment.pdfUrl = req.file.path.replace(/\\/g, "/");

    await assignment.save();
    res.json({ message: "Assignment Updated Successfully", assignment });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user.id }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ==========================================
// 3. VIDEOS
// ==========================================
exports.uploadVideo = async (req, res) => {
  const { title, description } = req.body;
  try {
    const video = new Video({
      title, description, teacher: req.user.id,
      videoUrl: req.file ? req.file.path.replace(/\\/g, "/") : null
    });
    await video.save();
    res.json({ message: "Video Uploaded Successfully!", video });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ teacher: req.user.id }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ==========================================
// 4. STUDENTS & ATTENDANCE
// ==========================================
exports.getClassStudents = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.classId).populate('students', 'name email');
    if (!classroom) return res.status(404).json({ message: "Class not found" });
    if (classroom.teacher.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });
    res.json(classroom.students);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyStudents = async (req, res) => {
  try {
    const classes = await Classroom.find({ teacher: req.user.id }).populate('students', 'name email');
    const studentMap = new Map();
    classes.forEach(cls => {
      cls.students.forEach(student => studentMap.set(student._id.toString(), student));
    });
    res.json(Array.from(studentMap.values()));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markAttendance = async (req, res) => {
  const { studentId, date, status, classId } = req.body;
  try {
    let record = await Attendance.findOne({ student: studentId, date: date, teacher: req.user.id });
    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = new Attendance({ date, student: studentId, teacher: req.user.id, status });
      await record.save();
    }
    res.json({ message: `Marked ${status}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ==========================================
// 5. EXAMS
// ==========================================
exports.createExam = async (req, res) => {
  try {
    const { title, classroomId, date, startTime, duration, questions } = req.body;
    if (!title || !classroomId || !date || !startTime || !duration || !questions || questions.length === 0) {
      return res.status(400).json({ msg: "Please select a class and fill all fields." });
    }
    const newExam = new Exam({ title, teacher: req.user.id, classroom: classroomId, date, startTime, duration, questions });
    await newExam.save();
    res.json(newExam);
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ teacher: req.user.id }).populate('classroom', 'name').sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });
    if (exam.teacher.toString() !== req.user.id) return res.status(401).json({ msg: "User not authorized" });
    await exam.deleteOne();
    res.json({ msg: "Exam removed" });
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.getExamResults = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });

    const results = await Result.find({ exam: req.params.examId }).populate('student', 'name email');
    let absentStudents = [];
    let className = "Unknown Class";

    if (exam.classroom) {
      const classroom = await Classroom.findById(exam.classroom).populate('students', 'name email');
      if (classroom) {
        className = classroom.name;
        const takenStudentIds = results.map(r => r.student._id.toString());
        absentStudents = classroom.students.filter(s => !takenStudentIds.includes(s._id.toString()));
      }
    }

    res.json({ examTitle: exam.title, className: className, results: results, absentStudents: absentStudents });
  } catch (err) { res.status(500).send("Server Error"); }
};

// ==========================================
// 6. SUBMISSIONS (VIEW & GRADE)
// ==========================================
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id }).populate('studentId', 'name email');
    res.json(submissions);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.evaluateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ msg: "Submission not found" });

    submission.status = req.body.status; // 'Approved' or 'Needs Revision'
    await submission.save();

    res.json(submission);
  } catch (error) { res.status(500).json({ error: error.message }); }
};