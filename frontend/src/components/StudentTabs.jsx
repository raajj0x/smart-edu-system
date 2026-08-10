import React from 'react';
import { 
  FaBookOpen, FaCalendarCheck, FaFileAlt, FaBroadcastTower, 
  FaEnvelope, FaStar, FaRobot, FaCheckCircle, FaTimes, 
  FaBullhorn, FaArrowLeft, FaCommentDots, FaVideo, FaEye, FaUpload, FaTrash 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// 🔥 GLOBAL BACKEND URL
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ==========================================
// 1. OVERVIEW TAB
// ==========================================
export const OverviewTab = ({ user, navigate, myClasses, attendancePercentage, pendingExamsCount, activeLiveRooms, setActiveTab, setSelectedCourse, handleOpenCourse, setShowInboxModal, myInbox, setIsAIOpen }) => (
  <div className="animate-fade-in space-y-8">
    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a5c4a] tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-slate-500 font-medium mt-1">Ready to fuel your creativity today?</p>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button onClick={() => navigate('/resume-builder')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 transition-all">
          <FaFileAlt /> Create Resume <FaStar className="text-[#fef08a] mb-0.5" />
        </button>
        <button onClick={() => setShowInboxModal(true)} className="relative p-3 bg-white text-[#0d735e] border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all flex-shrink-0" title="My Inbox">
          <FaEnvelope size={24} />
          {myInbox.some(req => req.status === 'accepted') && <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></span>}
        </button>
      </div>
    </header>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[ 
        { label: 'Enrolled Courses', value: myClasses.length, icon: <FaBookOpen /> }, 
        { label: 'Attendance', value: `${attendancePercentage}%`, icon: <FaCalendarCheck /> }, 
        { label: 'Pending Exams', value: pendingExamsCount, icon: <FaFileAlt /> }, 
        { label: 'Live Sessions', value: activeLiveRooms.length > 0 ? 'Live Now!' : 'Ready', icon: <FaBroadcastTower className={activeLiveRooms.length > 0 ? "text-red-500 animate-pulse" : ""} /> } 
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-xl border-b-[6px] border-[#0d735e] shadow-sm py-6 px-4 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${stat.value === 'Live Now!' ? 'bg-red-50 text-red-500' : 'bg-[#e6f4f1] text-[#0d735e]'}`}>{stat.icon}</div>
          <div><h3 className="text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</h3><p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p></div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">My Recent Courses</h3>
          <button onClick={() => { setActiveTab('my-courses'); setSelectedCourse(null); }} className="text-[#0d735e] text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {myClasses.length === 0 ? (
            <p className="text-slate-400 text-center py-4">You haven't enrolled in any courses yet.</p>
          ) : (
            myClasses.slice(0, 3).map(cls => (
              <div key={cls._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div><h4 className="font-bold text-slate-900">{cls.name}</h4><p className="text-xs text-slate-500">{cls.subject} • Instr: {cls.teacher?.name}</p></div>
                <button onClick={() => { setActiveTab('my-courses'); handleOpenCourse(cls); }} className="px-4 py-2 bg-[#e6f4f1] text-[#0d735e] font-bold text-sm rounded-lg hover:bg-[#0d735e] hover:text-white transition-colors">Resume</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-[#0d735e] rounded-xl shadow-md p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <FaRobot className="text-5xl mb-4 text-[#e6f4f1]" />
        <h3 className="text-xl font-bold mb-2">Stuck on a problem?</h3>
        <p className="text-sm text-emerald-100 mb-6">Ask your Gemini AI Tutor for instant help.</p>
        <button onClick={() => setIsAIOpen(true)} className="w-full py-3 bg-white text-[#0d735e] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors">Open AI Tutor</button>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. ATTENDANCE TAB
// ==========================================
export const AttendanceTab = ({ attendance }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-3xl font-extrabold text-[#0a5c4a]">My Attendance Record</h2>
        <p className="text-slate-500 font-medium mt-1">Track your presence across all enrolled courses.</p>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#e6f4f1] text-[#0d735e]">
          <tr>
            <th className="p-5 font-bold border-b border-emerald-200">Date</th>
            <th className="p-5 font-bold border-b border-emerald-200">Course</th>
            <th className="p-5 font-bold border-b border-emerald-200">Instructor</th>
            <th className="p-5 font-bold text-right border-b border-emerald-200">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {attendance.length === 0 && (
            <tr><td colSpan="4" className="p-10 text-center text-slate-500 font-medium">No attendance records found yet.</td></tr>
          )}
          {attendance.map((att, idx) => {
            const courseName = att.class?.name || att.classroom?.name || 'General Class';
            const instructorName = att.teacher?.name || 'Instructor';
            const dateString = new Date(att.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

            return (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="p-5 text-slate-600 font-medium">{dateString}</td>
                <td className="p-5 font-bold text-slate-900">{courseName}</td>
                <td className="p-5 text-slate-500">{instructorName}</td>
                <td className="p-5 text-right flex justify-end">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 w-28 ${att.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {att.status === 'Present' ? <FaCheckCircle /> : <FaTimes />} {att.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ==========================================
// 3. ANNOUNCEMENTS TAB
// ==========================================
export const AnnouncementsTab = ({ announcements }) => (
  <div className="animate-fade-in space-y-8">
    <h2 className="text-3xl font-extrabold text-[#0a5c4a]">Course Announcements</h2>
    <p className="text-slate-500 font-medium">Important updates from your instructors.</p>
    
    <div className="space-y-4">
      {announcements.length === 0 && <p className="text-gray-500 text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">No new announcements.</p>}
      {announcements.map(ann => (
        <div key={ann._id} className={`bg-white p-6 rounded-xl border ${ann.title.includes('LIVE NOW') ? 'border-red-200 shadow-md' : 'border-gray-100 shadow-sm'} flex flex-col sm:flex-row gap-4 items-start hover:shadow-md transition-shadow`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1 ${ann.title.includes('LIVE NOW') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
            <FaBullhorn size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-lg font-bold ${ann.title.includes('LIVE NOW') ? 'text-red-600' : 'text-slate-900'}`}>{ann.title}</h3>
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{ann.className}</span>
            </div>
            <p className="text-slate-600 mb-2">{ann.message}</p>
            <p className="text-xs text-slate-400 font-medium">Posted by {ann.teacherName} • {new Date(ann.date).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 4. BROWSE TAB
// ==========================================
export const BrowseTab = ({ allClasses, handleJoinClass }) => (
  <div className="animate-fade-in space-y-8">
    <h2 className="text-3xl font-extrabold text-[#0a5c4a]">Browse Course Catalog</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allClasses.map(cls => (
        <div key={cls._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-[#e6f4f1] text-[#0d735e] rounded-xl flex items-center justify-center mb-4 text-xl"><FaBookOpen /></div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{cls.name}</h3>
          <p className="text-sm text-slate-500 mb-6">{cls.subject} • By {cls.teacher?.name}</p>
          {cls.isEnrolled ? (
            <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 text-green-600 font-bold rounded-lg text-sm"><FaCheckCircle /> Enrolled</div>
          ) : (
            <button onClick={() => handleJoinClass(cls._id)} className="w-full py-2.5 bg-[#0d735e] text-white font-bold rounded-lg hover:bg-[#0a5c4a] transition-colors text-sm">Enroll Now</button>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 5. MY COURSES TAB
// ==========================================
export const MyCoursesTab = ({ 
  selectedCourse, myClasses, handleOpenCourse, setSelectedCourse, 
  setShowTeacherChatModal, courseContent, setActiveTab,
  mySubmissions, handleUploadSubmission, handleDeleteSubmission
}) => (
  <div className="animate-fade-in space-y-8">
    {!selectedCourse ? (
      <>
        <h2 className="text-3xl font-extrabold text-[#0a5c4a]">Select a Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClasses.map(cls => (
            <div key={cls._id} onClick={() => handleOpenCourse(cls)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#0d735e]/30 cursor-pointer transition-all group">
              <div className="w-14 h-14 bg-[#e6f4f1] text-[#0d735e] rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:bg-[#0d735e] group-hover:text-white transition-colors"><FaBookOpen /></div>
              <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{cls.subject} • Instr: {cls.teacher?.name}</p>
            </div>
          ))}
        </div>
      </>
    ) : (
      <div className="animate-fade-in">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-slate-500 hover:text-[#0d735e] font-bold mb-6 transition-colors"><FaArrowLeft /> Back to Courses</button>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0a5c4a]">{selectedCourse.name}</h2>
              <p className="text-slate-500 mt-1">Instructor: {selectedCourse.teacher?.name}</p>
            </div>
            <button onClick={() => setShowTeacherChatModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg font-bold text-sm transition-colors"><FaCommentDots /> Message Instructor</button>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FaVideo className="text-[#0d735e]"/> Video Lectures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {courseContent.videos.length === 0 && <p className="text-slate-500 text-sm">No videos uploaded yet.</p>}
            {courseContent.videos.map(vid => (
              <div key={vid._id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="w-full aspect-video bg-black">
                  <video className="w-full h-full object-contain" controls>
                    {/* 🔥 BACKEND_URL INJECTED */}
                    <source src={`${BACKEND_URL}/${vid.videoUrl}`} type="video/mp4" />
                  </video>
                </div>
                <div className="p-4"><h4 className="font-bold text-slate-900">{vid.title}</h4><p className="text-xs text-slate-500 mt-1">{vid.description}</p></div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FaFileAlt className="text-[#0d735e]"/> Assignments</h3>
          <div className="space-y-4">
            {courseContent.assignments.length === 0 && <p className="text-slate-500 text-sm">No assignments posted.</p>}
            {courseContent.assignments.map(assn => {
              
              const submission = mySubmissions?.find(s => s.assignmentId === assn._id);
              
              return (
                <div key={assn._id} className="flex flex-col p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{assn.title}</h4>
                      <p className="text-xs font-bold text-red-500 mt-1">Due: {new Date(assn.dueDate).toLocaleDateString()}</p>
                    </div>
                    {assn.pdfUrl && (
                      <a href={`${BACKEND_URL}/${assn.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#e6f4f1] text-[#0d735e] font-bold text-sm rounded-lg hover:bg-[#b2dfdb] transition">
                        <FaEye /> View PDF
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-3 mb-5">{assn.description}</p>
                  
                  <div className="border-t border-gray-200 pt-4 mt-auto">
                    {submission ? (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                            <FaCheckCircle className="text-emerald-500" /> Submitted
                          </div>
                          
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm ${
                            submission.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            submission.status === 'Needs Revision' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {submission.status || 'Pending'}
                          </span>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                          <a href={`${BACKEND_URL}/${submission.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none text-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors shadow-sm">View File</a>
                          
                          {submission.status !== 'Approved' && (
                            <>
                              <label className="flex-1 sm:flex-none text-center px-4 py-2 bg-[#0d735e] text-white font-bold text-sm rounded-lg hover:bg-[#0a5c4a] cursor-pointer transition-colors shadow-sm">
                                Re-upload
                                <input type="file" className="hidden" onChange={(e) => {
                                  if(e.target.files[0]) handleUploadSubmission(assn._id, e.target.files[0]);
                                }} />
                              </label>
                              
                              <button onClick={() => handleDeleteSubmission(submission._id)} className="px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm" title="Delete Submission">
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input 
                          type="file" 
                          id={`file-${assn._id}`} 
                          className="w-full sm:flex-1 text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#e6f4f1] file:text-[#0d735e] hover:file:bg-[#b2dfdb] border border-gray-200 rounded-lg p-1 bg-white cursor-pointer transition-colors shadow-sm" 
                        />
                        <button 
                          onClick={() => {
                            const fileInput = document.getElementById(`file-${assn._id}`);
                            if(fileInput.files[0]) {
                              handleUploadSubmission(assn._id, fileInput.files[0]);
                              fileInput.value = '';
                            } else {
                              toast.error("Please select a file to submit!");
                            }
                          }} 
                          className="w-full sm:w-auto px-6 py-3 bg-[#0d735e] text-white text-sm font-bold rounded-lg hover:bg-[#0a5c4a] shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                          <FaUpload /> Submit Assignment
                        </button>
                      </div>
                    )}
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </div>
);

// ==========================================
// 6. LIVE CLASSES TAB
// ==========================================
export const LiveTab = ({ myClasses, activeLiveRooms }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-3xl font-extrabold text-[#0a5c4a]">Live Classrooms</h2>
        <p className="text-slate-500 font-medium mt-1">Join active video sessions for your enrolled courses.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myClasses.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any classes yet.</p>
      ) : (
        myClasses.map((cls) => {
          const targetRoomId = `${cls._id}-live`;
          const isLiveNow = activeLiveRooms.includes(targetRoomId);

          return (
            <div key={cls._id} className={`bg-white p-6 rounded-xl border-t-[4px] ${isLiveNow ? 'border-red-500 shadow-md' : 'border-gray-200 shadow-sm'} transition-all flex flex-col h-full`}>
              <div className="mb-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLiveNow ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
                    <FaBroadcastTower size={24} />
                  </div>
                  {isLiveNow && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>Live</span>}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Instructor: {cls.teacher?.name}</p>
              </div>

              {isLiveNow ? (
                <button onClick={() => window.location.href = `/live/${targetRoomId}`} className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 transition shadow-sm">
                  Join Live Room
                </button>
              ) : (
                <button onClick={() => toast.error("This class is not currently live. Wait for the instructor to start it.", { icon: '🛑' })} className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2 transition">
                  Not Live
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  </div>
);

// ==========================================
// 7. EXAMS TAB
// ==========================================
export const ExamsTab = ({ activeExam, exams, handleStartExam, handleSubmitExam, examAnswers, handleAnswerSelect, setActiveExam }) => (
  <div className="animate-fade-in space-y-8">
    {!activeExam ? (
      <>
        <h2 className="text-3xl font-extrabold text-[#0a5c4a]">Assessments & Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.length === 0 && <p className="text-gray-500">No exams assigned right now.</p>}
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
                  {exam.taken ? <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Done</span> : <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase">Pending</span>}
                </div>
                <p className="text-sm text-slate-500 mb-6">{exam.classroom?.name} • {exam.duration} mins</p>
              </div>
              {exam.taken ? (
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200">
                  <span className="text-slate-500 text-sm font-bold">Your Score</span><span className="text-xl font-black text-[#0d735e]">{exam.score} <span className="text-sm text-slate-400">/ {exam.totalQuestions}</span></span>
                </div>
              ) : (
                <button onClick={() => handleStartExam(exam)} className="w-full py-2.5 bg-[#0d735e] text-white rounded-lg font-bold hover:bg-[#0a5c4a] transition-colors">Start Exam Now</button>
              )}
            </div>
          ))}
        </div>
      </>
    ) : (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
          <div><h2 className="text-3xl font-extrabold text-[#0a5c4a]">{activeExam.title}</h2><p className="text-slate-500 mt-1">{activeExam.classroom?.name}</p></div>
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">⏱️ {activeExam.duration} Minutes</div>
        </div>
        <form onSubmit={handleSubmitExam}>
          {activeExam.questions.map((q, i) => (
            <div key={q._id} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="font-bold text-slate-800 text-lg mb-5">{i + 1}. {q.questionText}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['a', 'b', 'c', 'd'].map(opt => (
                  <label key={opt} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${examAnswers[q._id] === opt ? 'border-[#0d735e] bg-[#e6f4f1]' : 'border-gray-200 bg-white hover:border-[#0d735e]/40'}`}>
                    <input type="radio" name={`question-${q._id}`} value={opt} checked={examAnswers[q._id] === opt} onChange={() => handleAnswerSelect(q._id, opt)} className="hidden" />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${examAnswers[q._id] === opt ? 'border-[#0d735e]' : 'border-gray-300'}`}>{examAnswers[q._id] === opt && <span className="w-2.5 h-2.5 bg-[#0d735e] rounded-full"></span>}</span>
                    <span className="text-slate-700 font-medium">{q.options[opt]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setActiveExam(null)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-8 py-3 bg-[#0d735e] text-white font-bold rounded-xl shadow-md hover:bg-[#0a5c4a] transition-all">Submit Answers</button>
          </div>
        </form>
      </div>
    )}
  </div>
);