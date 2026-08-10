// ==========================================
// 📦 IMPORT MODELS
// ==========================================
const Classroom = require('../models/Classroom');
const Assignment = require('../models/Assignment');
const Video = require('../models/Video');
const Attendance = require('../models/Attendance');
const ChatRequest = require('../models/ChatRequest');
const Exam = require('../models/Exam');     
const Result = require('../models/Result'); 
const Submission = require('../models/Submission');

// 1. GET ALL AVAILABLE CLASSES
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Classroom.find().populate('teacher', 'name email');
    const classesWithStatus = classes.map(cls => ({
      ...cls._doc,
      isEnrolled: cls.students.includes(req.user.id)
    }));
    res.json(classesWithStatus);
  } catch (err) { res.status(500).send('Server Error'); }
};

// 2. JOIN A CLASS
exports.joinClass = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.classId);
    if (!classroom) return res.status(404).json({ msg: 'Class not found' });

    if (classroom.students.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already enrolled' });
    }

    classroom.students.push(req.user.id);
    await classroom.save();
    res.json({ msg: 'Successfully joined the class!' });
  } catch (err) { res.status(500).send('Server Error'); }
};

// 3. GET MY ENROLLED CLASSES
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Classroom.find({ students: req.user.id }).populate('teacher', 'name');
    res.json(classes);
  } catch (err) { res.status(500).send('Server Error'); }
};

// 4. GET CLASS CONTENT
exports.getClassContent = async (req, res) => {
  try {
    const videos = await Video.find({ teacher: req.params.teacherId }).sort({ createdAt: -1 });
    const assignments = await Assignment.find({ teacher: req.params.teacherId }).sort({ createdAt: -1 });
    res.json({ videos, assignments });
  } catch (err) { res.status(500).send('Server Error'); }
};

// 5. GET MY ATTENDANCE
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id }).populate('teacher', 'name');
    res.json(records);
  } catch (err) { res.status(500).send('Server Error'); }
};

// 6. REQUEST CHAT WITH TEACHER
exports.requestChat = async (req, res) => {
  const { teacherId, initialMessage } = req.body;
  try {
    const existing = await ChatRequest.findOne({ student: req.user.id, teacher: teacherId, status: 'pending' });
    if (existing) return res.status(400).json({ msg: 'Request already pending' });

    const newReq = new ChatRequest({ student: req.user.id, teacher: teacherId, initialMessage });
    await newReq.save();
    res.json({ msg: 'Request sent to teacher!' });
  } catch (err) { res.status(500).send('Server Error'); }
};

// 7. GET EXAMS
exports.getExams = async (req, res) => {
  try {
    const myClasses = await Classroom.find({ students: req.user.id });
    if (!myClasses.length) return res.json([]); 

    const classIds = myClasses.map(c => c._id);
    const exams = await Exam.find({ classroom: { $in: classIds } }).populate('classroom', 'name subject').lean().sort({ createdAt: -1 });
    const results = await Result.find({ student: req.user.id });

    const examsWithStatus = exams.map(exam => {
      const result = results.find(r => r.exam.toString() === exam._id.toString());
      return {
        ...exam,
        taken: !!result, 
        score: result ? result.score : null,
        totalQuestions: result ? result.totalQuestions : exam.questions.length
      };
    });

    res.json(examsWithStatus);
  } catch (err) { res.status(500).json({ msg: "Server Error fetching exams" }); }
};

// 8. SUBMIT EXAM
exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body; 
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });

    const existingResult = await Result.findOne({ exam: examId, student: req.user.id });
    if (existingResult) return res.status(400).json({ msg: "You have already submitted this exam." });

    let score = 0;
    let totalQuestions = exam.questions.length;
    exam.questions.forEach(question => {
      if (answers[question._id] && answers[question._id] === question.correctOption) score++;
    });

    const newResult = new Result({ exam: examId, student: req.user.id, score, totalQuestions });
    await newResult.save();

    res.json({ msg: "Exam Submitted Successfully", score, totalQuestions, percentage: ((score / totalQuestions) * 100).toFixed(1) });
  } catch (err) { res.status(500).json({ msg: "Server Error submitting exam" }); }
};

// 9. SUBMIT ASSIGNMENT (File Upload)
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    let submission = await Submission.findOne({ assignmentId, studentId: req.user.id });
    
    if (submission) { 
        submission.fileUrl = req.file.path.replace(/\\/g, "/");
        submission.submittedAt = Date.now();
        await submission.save();
    } else { 
        submission = new Submission({ 
          assignmentId, 
          studentId: req.user.id, 
          fileUrl: req.file.path.replace(/\\/g, "/") 
        });
        await submission.save();
    }
    res.json(submission);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 10. DELETE SUBMISSION
exports.deleteSubmission = async (req, res) => {
    try {
        const sub = await Submission.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });
        if (!sub) return res.status(404).json({ msg: "Submission not found" });
        res.json({ msg: "Deleted successfully" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 11. GET MY SUBMISSIONS
exports.getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user.id });
        res.json(submissions);
    } catch (error) { res.status(500).json({ error: error.message }); }
};