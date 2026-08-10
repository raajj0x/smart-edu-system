import React from 'react';
import { 
  FaPlus, FaTrash, FaEdit, FaEye, FaBullhorn, FaBroadcastTower, 
  FaChevronDown, FaCheckCircle, FaTimes, FaUpload, FaFileAlt, FaCommentDots 
} from 'react-icons/fa';

// 🔥 GLOBAL BACKEND URL
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const borderColors = ['border-[#004c54]', 'border-[#0a7c71]', 'border-blue-600'];

// ==========================================
// 1. DASHBOARD OVERVIEW TAB
// ==========================================
export const DashboardTab = ({ teacherName, pendingCount, setShowChatRequestsModal, setShowClassModal, studentsCount, classes, setActiveTab, handleManageClass, requestDelete }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#004c54] tracking-tight">Instructor Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Welcome back, Professor {teacherName.split(' ')[0]}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowChatRequestsModal(true)} className="relative p-3 bg-white text-[#004c54] border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all" title="Student Queries">
          <FaCommentDots size={20} />
          {pendingCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{pendingCount}</span>}
        </button>
        <button onClick={() => setShowClassModal(true)} className="px-6 py-3 bg-[#004c54] hover:bg-[#003339] text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"><FaPlus /> Create New Class</button>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[ 
        { label: 'Total Students', value: studentsCount, action: () => setActiveTab('students') }, 
        { label: 'Active Courses', value: classes.length, action: () => setActiveTab('dashboard') }, 
        { label: 'Pending Queries', value: pendingCount, action: () => setShowChatRequestsModal(true) }, 
        { label: 'Average Rating', value: '4.8', action: null } 
      ].map((stat, i) => (
        <div key={i} onClick={stat.action} className={`bg-white rounded-xl border-b-[6px] border-[#004c54] shadow-sm py-8 px-4 text-center transition-all ${stat.action ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : ''}`}>
          <h3 className="text-4xl font-extrabold text-slate-900 mb-2">{stat.value}</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold text-[#004c54] text-center mb-6">Your Active Classes</h3>
        {classes.length === 0 && <p className="text-center text-slate-400">No active classes.</p>}
        {classes.map((cls, idx) => (
          <div key={cls._id} className={`bg-white rounded-xl shadow-sm border-l-[6px] ${borderColors[idx % borderColors.length]} p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow gap-4`}>
            <div className="w-full">
              <h4 className="font-bold text-slate-900 text-lg">{cls.name}</h4><p className="text-sm text-slate-500">{cls.subject} • {cls.students?.length || 0} Students</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button onClick={() => handleManageClass(cls._id)} className="px-4 py-2 text-sm bg-gray-50 border border-gray-200 text-[#004c54] font-bold rounded-lg hover:bg-[#e0f2f1] hover:border-[#0a7c71] flex-1 md:flex-none transition-colors">Manage</button>
              <button onClick={() => requestDelete('class', cls._id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg flex-none transition-colors"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
        <h3 className="text-xl font-bold text-[#004c54] text-center mb-6">Upcoming Schedule</h3>
        <div className="space-y-6">
          <div className="flex gap-4 items-start"><span className="bg-[#e0f2f1] text-[#004c54] font-bold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">10:00 AM</span><p className="text-sm font-medium text-slate-700 pt-1 border-b border-gray-50 pb-4 w-full">Q&A Session: React Hooks</p></div>
          <div className="flex gap-4 items-start"><span className="bg-[#e0f2f1] text-[#004c54] font-bold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">02:00 PM</span><p className="text-sm font-medium text-slate-700 pt-1 w-full">Doubt Clearing Session</p></div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. ANNOUNCEMENTS TAB
// ==========================================
export const AnnouncementsTab = ({ announcements, setEditingAnnounceId, setNewAnnounce, setShowAnnounceModal, openEditAnnouncement, requestDelete }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-3xl font-extrabold text-[#004c54]">Notices & Updates</h2>
        <p className="text-slate-500 font-medium mt-1">Broadcast important information to your students.</p>
      </div>
      <button onClick={() => { setEditingAnnounceId(null); setNewAnnounce({ title: '', message: '', classroomId: '' }); setShowAnnounceModal(true); }} className="px-6 py-2.5 bg-[#004c54] text-white font-bold rounded-lg shadow-sm hover:bg-[#003339] transition-colors flex items-center gap-2"><FaPlus /> Post Update</button>
    </div>
    
    <div className="space-y-4">
      {announcements.length === 0 && <p className="text-gray-500 text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">No announcements posted yet.</p>}
      {announcements.map(ann => (
        <div key={ann._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-start relative group hover:border-[#0a7c71] transition-colors">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="w-12 h-12 bg-[#e0f2f1] text-[#0a7c71] rounded-full flex items-center justify-center shrink-0 mt-1"><FaBullhorn size={20} /></div>
            <div className="flex-1 pr-4 md:pr-32">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-slate-900">{ann.title}</h3>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{ann.className}</span>
              </div>
              <p className="text-slate-600 mb-3">{ann.message}</p>
              <p className="text-xs text-slate-400 font-bold">{new Date(ann.date).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6">
            {!ann.title.includes("LIVE NOW") && (
              <button onClick={() => openEditAnnouncement(ann)} className="px-3 py-2 text-[#0a7c71] bg-[#e0f2f1] hover:bg-[#b2dfdb] rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"><FaEdit /> Edit</button>
            )}
            <button onClick={() => requestDelete('announcement', ann._id)} className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"><FaTrash /> Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 3. LIVE SESSIONS TAB
// ==========================================
export const LiveTab = ({ classes, startLiveClass }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-3xl font-extrabold text-[#004c54]">Live Virtual Classes</h2>
        <p className="text-slate-500 font-medium mt-1">Start a real-time interactive video session with your students.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.length === 0 && <p className="text-slate-500">No active classes available to go live.</p>}
      {classes.map((cls, idx) => (
        <div key={cls._id} className={`bg-white p-6 rounded-xl border-t-[4px] ${borderColors[idx % borderColors.length]} shadow-sm hover:shadow-md transition-shadow flex flex-col h-full`}>
          <div className="mb-6 flex-grow">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <FaBroadcastTower size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{cls.subject} • {cls.students?.length || 0} Students Enrolled</p>
          </div>
          <button onClick={() => startLiveClass(cls)} className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span> Start Live Session
          </button>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 4. STUDENTS TAB
// ==========================================
export const StudentsTab = ({ classes, selectedClassId, setSelectedClassId, classStudents, todayAttendance, handleMarkAttendance, resetAttendanceUI }) => (
  <div className="animate-fade-in space-y-8">
    <h2 className="text-3xl font-extrabold text-[#004c54]">Enrolled Students & Attendance</h2>
    
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-md">
      <label className="block text-sm font-bold text-slate-800 mb-2">Select Classroom to Manage:</label>
      <div className="relative group">
        <select className="w-full bg-white border-2 border-gray-200 text-slate-700 px-5 py-3.5 rounded-xl outline-none focus:border-[#004c54] focus:ring-4 focus:ring-[#004c54]/10 transition-all cursor-pointer appearance-none font-semibold hover:border-gray-300 shadow-sm" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
          <option value="" disabled>-- Choose a Class --</option>
          {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name} ({cls.subject})</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-400 group-hover:text-[#004c54] transition-colors">
          <FaChevronDown size={14} />
        </div>
      </div>
    </div>

    {selectedClassId && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-slate-800 border-b border-gray-200"><tr><th className="p-5 font-bold">Student Name</th><th className="p-5 font-bold">Email</th><th className="p-5 font-bold text-right">Mark Today's Attendance</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {classStudents.length === 0 && <tr><td colSpan="3" className="p-6 text-center text-slate-500 font-medium">No students enrolled in this course yet.</td></tr>}
            {classStudents.map(student => (
              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-5 font-bold text-slate-900">{student.name}</td>
                <td className="p-5 text-slate-600">{student.email}</td>
                <td className="p-5 flex justify-end gap-3 items-center">
                  {!todayAttendance[student._id] ? (
                    <>
                      <button onClick={() => handleMarkAttendance(student._id, 'Present')} className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-colors text-sm shadow-sm">Present</button>
                      <button onClick={() => handleMarkAttendance(student._id, 'Absent')} className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm shadow-sm">Absent</button>
                    </>
                  ) : todayAttendance[student._id] === 'Present' ? (
                    <button onClick={() => resetAttendanceUI(student._id)} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm flex items-center gap-2 shadow-sm hover:bg-emerald-700 transition-colors group relative" title="Click to edit/undo">
                      <FaCheckCircle /> Present
                      <span className="absolute -top-8 right-0 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">Click to Edit</span>
                    </button>
                  ) : (
                    <button onClick={() => resetAttendanceUI(student._id)} className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg text-sm flex items-center gap-2 shadow-sm hover:bg-red-700 transition-colors group relative" title="Click to edit/undo">
                      <FaTimes /> Absent
                      <span className="absolute -top-8 right-0 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">Click to Edit</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// ==========================================
// 5. ASSIGNMENTS TAB
// ==========================================
export const AssignmentsTab = ({ assignments, setEditingAssignment, setNewAssignment, setShowAssignmentModal, viewSubmissions, openEditAssignment, requestDelete }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex justify-between items-end mb-6">
      <h2 className="text-3xl font-extrabold text-[#004c54]">Assignments Manager</h2>
      <button onClick={() => { setEditingAssignment(null); setNewAssignment({title:'', description:'', dueDate:'', file:null}); setShowAssignmentModal(true); }} className="px-6 py-2.5 bg-[#004c54] text-white font-bold rounded-lg shadow-sm hover:bg-[#003339] transition-colors flex items-center gap-2"><FaPlus /> Create</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {assignments.map(assn => (
        <div key={assn._id} className="bg-white p-6 rounded-xl border-l-[6px] border-[#004c54] shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg text-slate-900">{assn.title}</h3><p className="text-sm text-slate-600 mb-4">{assn.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#004c54] bg-[#e0f2f1] px-3 py-1 rounded-md border border-[#b2dfdb]">Due: {new Date(assn.dueDate).toLocaleDateString()}</span>
            <div className="flex gap-2">
              <button onClick={() => viewSubmissions(assn)} className="px-3 py-1.5 bg-[#e0f2f1] text-[#0a7c71] font-bold rounded-lg hover:bg-[#004c54] hover:text-white transition-colors text-sm border border-[#b2dfdb]">View Submissions</button>
              {assn.pdfUrl && <a href={`${BACKEND_URL}/${assn.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 text-[#0a7c71] bg-gray-50 border border-gray-200 hover:bg-[#004c54] hover:text-white rounded-lg transition-colors"><FaEye /></a>}
              <button onClick={() => openEditAssignment(assn)} className="p-2 text-[#0a7c71] bg-gray-50 border border-gray-200 hover:bg-[#004c54] hover:text-white rounded-lg transition-colors"><FaEdit /></button>
              <button onClick={() => requestDelete('assignment', assn._id)} className="p-2 text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white rounded-lg transition-colors"><FaTrash /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 6. VIDEOS TAB
// ==========================================
export const VideosTab = ({ videos, setShowVideoModal, requestDelete }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex justify-between items-end mb-6">
      <h2 className="text-3xl font-extrabold text-[#004c54]">Recorded Video Lectures</h2>
      <button onClick={() => setShowVideoModal(true)} className="px-6 py-2.5 bg-[#004c54] text-white font-bold rounded-lg shadow-sm hover:bg-[#003339] transition-colors flex items-center gap-2"><FaUpload /> Upload Video</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {videos.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">No videos uploaded yet.</p>}
      {videos.map(vid => (
        <div key={vid._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col">
          <div className="w-full aspect-video bg-slate-900 relative group">
            {vid.videoUrl ? (
              <video className="w-full h-full object-contain bg-black" controls preload="metadata" controlsList="nodownload">
                {/* 🔥 BACKEND URL INJECTED */}
                <source src={`${BACKEND_URL}/${vid.videoUrl}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : <div className="w-full h-full flex items-center justify-center text-slate-500">Missing</div>}
          </div>
          <div className="p-5 flex-grow flex flex-col justify-between">
            <div><h3 className="font-bold text-slate-900 text-lg leading-tight mb-2">{vid.title}</h3><p className="text-sm text-slate-600 line-clamp-2">{vid.description}</p></div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{new Date(vid.createdAt).toLocaleDateString()}</span>
              <button onClick={() => requestDelete('video', vid._id)} className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors"><FaTrash /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 7. EXAMS TAB
// ==========================================
export const ExamsTab = ({ exams, setShowExamModal, requestDelete, viewExamResults }) => (
  <div className="animate-fade-in space-y-8">
    <div className="flex justify-between items-end mb-6">
      <div><h2 className="text-3xl font-extrabold text-[#004c54]">Exam Manager</h2><p className="text-slate-500 font-medium">Create assessments and review results.</p></div>
      <button onClick={() => setShowExamModal(true)} className="px-6 py-2.5 bg-[#004c54] text-white font-bold rounded-lg shadow-sm hover:bg-[#003339] transition-colors flex items-center gap-2"><FaPlus /> Generate Exam</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {exams.length === 0 && <p className="text-slate-500">No exams created.</p>}
      {exams.map(exam => (
        <div key={exam._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gray-100 text-[#004c54] rounded-xl flex items-center justify-center"><FaFileAlt size={20} /></div>
            <span className="px-3 py-1 bg-gray-100 text-slate-700 text-xs font-bold rounded-md border border-gray-200">{exam.duration} mins</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
          <p className="text-sm text-slate-500 font-medium mb-6">Class: {exam.classroom?.name} • Date: {exam.date}</p>
          <div className="flex gap-3 border-t border-gray-100 pt-4">
            <button onClick={() => viewExamResults(exam)} className="flex-1 py-2 bg-gray-50 border border-gray-200 hover:bg-[#004c54] hover:text-white text-[#004c54] font-bold rounded-lg transition-colors text-sm">View Results</button>
            <button onClick={() => requestDelete('exam', exam._id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"><FaTrash /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);