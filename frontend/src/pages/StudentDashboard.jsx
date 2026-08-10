import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';
import { 
  FaUserGraduate, FaSearch, FaBookOpen, FaCalendarCheck, 
  FaFileAlt, FaVideo, FaSignOutAlt, FaBars, FaTimes, 
  FaBroadcastTower, FaCommentDots, FaRobot, FaPaperPlane, 
  FaExclamationTriangle, FaUserEdit, FaBullhorn, FaEnvelope 
} from 'react-icons/fa';

import { OverviewTab, AttendanceTab, AnnouncementsTab, BrowseTab, MyCoursesTab, LiveTab, ExamsTab } from '../components/StudentTabs';

// 🔥 GLOBAL BACKEND URL & SOCKET
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io.connect(BACKEND_URL); 

const formatAIResponse = (text) => {
  if (!text) return null;
  
  let processedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-[#e6f4f1] text-[#0d735e] px-1.5 py-0.5 rounded text-[13px] font-mono border border-[#b2dfdb]">$1</code>')
    .replace(/ --- /g, '</p><hr class="my-4 border-gray-200" /><p class="mb-3 leading-relaxed text-slate-700">');

  const lines = processedText.split('\n');
  let html = '';
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3 class="text-lg font-bold text-[#0d735e] mt-4 mb-2">${trimmed.replace('### ', '')}</h3>`;
    } else if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2 class="text-xl font-extrabold text-[#0a5c4a] mt-5 mb-3">${trimmed.replace('## ', '')}</h2>`;
    } else if (trimmed.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h1 class="text-2xl font-black text-slate-900 mt-6 mb-4">${trimmed.replace('# ', '')}</h1>`;
    } else if (trimmed === '---') {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<hr class="my-4 border-gray-200" />`;
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (!inList) {
        html += `<ul class="list-disc pl-5 mb-4 space-y-2 text-slate-700 marker:text-[#0d735e]">`;
        inList = true;
      }
      html += `<li>${trimmed.substring(2)}</li>`;
    } else if (trimmed === '') {
      if (inList) { html += '</ul>'; inList = false; }
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p class="mb-3 leading-relaxed text-slate-700">${trimmed}</p>`;
    }
  });

  if (inList) html += '</ul>';
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { tab } = useParams(); 
  const activeTab = tab || 'dashboard'; 

  const setActiveTab = (newTab) => { navigate(`/student-dashboard/${newTab}`); };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } });
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [allClasses, setAllClasses] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [activeLiveRooms, setActiveLiveRooms] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseContent, setCourseContent] = useState({ videos: [], assignments: [] });
  const [activeExam, setActiveExam] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [showTeacherChatModal, setShowTeacherChatModal] = useState(false);
  const [teacherChatMsg, setTeacherChatMsg] = useState('');
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [myInbox, setMyInbox] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const chatScrollRef = useRef(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const aiScrollRef = useRef(null);

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, submissionId: null });

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    socket.on("active_rooms_update", (rooms) => setActiveLiveRooms(rooms));
    
    socket.on("receive_message", (message) => {
      setChatMessages((prev) => [...prev, message]);
      if (!activeChat || activeChat._id !== message.chatRequestId) {
        toast.success("New message from Instructor!", { icon: '💬', style: { background: '#0d735e', color: '#fff' } });
        fetchInboxData(localStorage.getItem('token')); 
      }
    });

    socket.on("live_class_started", (data) => {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-800">🔴 {data.className} is LIVE!</span>
          <button onClick={() => { toast.dismiss(t.id); window.location.href = `/live/${data.roomId}`; }} className="bg-red-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-red-600">Join Now</button>
        </div>
      ), { duration: 8000, position: 'top-right' });

      if ("Notification" in window && Notification.permission === "granted") {
        const osNotification = new Notification(`🔴 ${data.className} is LIVE!`, {
          body: `Your instructor just started a live video session. Click here to join.`,
          icon: '/favicon.ico' 
        });

        osNotification.onclick = (e) => {
          e.preventDefault();
          window.focus(); 
          window.location.href = `/live/${data.roomId}`;
        };
      }
    });

    socket.on("announcement_received", (data) => {
      if (!data.title.includes("LIVE NOW")) toast.success(`📢 Update from ${data.teacherName}: ${data.title}`, { duration: 6000 });
      if (activeTab === 'announcements') fetchDashboardData(localStorage.getItem('token'));
    });

    return () => {
      socket.off("active_rooms_update"); socket.off("receive_message"); socket.off("live_class_started"); socket.off("announcement_received");
    };
  }, [activeChat, activeTab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!token) { navigate('/login'); return; }
    setUser(userData);
    fetchDashboardData(token); fetchInboxData(token);
  }, [navigate, activeTab]);

  useEffect(() => { if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight; }, [chatHistory, isAIOpen]);
  useEffect(() => { if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight; }, [chatMessages, activeChat]);

  const fetchDashboardData = async (token) => {
    setIsLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (activeTab === 'dashboard' || activeTab === 'browse') {
        const res = await axios.get(`${BACKEND_URL}/api/student/all-classes`, config);
        setAllClasses(res.data.filter(cls => cls.teacher != null));
      }
      if (activeTab === 'dashboard' || activeTab === 'my-courses' || activeTab === 'live' || activeTab === 'announcements') {
        const res = await axios.get(`${BACKEND_URL}/api/student/my-classes`, config);
        
        const validMyClasses = res.data.filter(cls => cls.teacher != null);
        setMyClasses(validMyClasses);
        
        if (activeTab === 'announcements') {
          const annRes = await axios.get(`${BACKEND_URL}/api/announcements`, config);
          const myClassIds = validMyClasses.map(c => c._id);
          setAnnouncements(annRes.data.filter(a => myClassIds.includes(a.classroomId)));
        }
        const subRes = await axios.get(`${BACKEND_URL}/api/student/my-submissions`, config);
        setMySubmissions(subRes.data);
      }
      if (activeTab === 'dashboard' || activeTab === 'attendance') {
        const res = await axios.get(`${BACKEND_URL}/api/student/my-attendance`, config);
        setAttendance(res.data);
      }
      if (activeTab === 'dashboard' || activeTab === 'exams') {
        const res = await axios.get(`${BACKEND_URL}/api/student/exams`, config);
        setExams(res.data.filter(ex => ex.classroom && ex.classroom.teacher != null));
      }
    } catch (error) { toast.error("Error fetching dashboard data."); } finally { setIsLoading(false); }
  };

  const fetchInboxData = async (token) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/communication/student/data`, { headers: { Authorization: `Bearer ${token}` } });
      setMyInbox(res.data);
    } catch (error) { console.error("Could not fetch inbox"); }
  };

  const handleOpenCourse = async (cls) => {
    if (!cls.teacher || !cls.teacher._id) {
      toast.error("This course is no longer available.");
      return;
    }

    setSelectedCourse(cls);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${BACKEND_URL}/api/student/content/${cls.teacher._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setCourseContent(res.data);
    } catch (error) { toast.error("Error fetching course content."); }
  };

  const handleUploadSubmission = async (assignmentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);
    const token = localStorage.getItem('token');
    
    const toastId = toast.loading("Uploading your assignment...");
    try {
      await axios.post(`${BACKEND_URL}/api/student/submit-assignment`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Assignment submitted successfully!", { id: toastId });
      fetchDashboardData(token); 
    } catch(err) { 
      toast.error("Failed to submit assignment", { id: toastId }); 
    }
  };

  const handleDeleteSubmission = (submissionId) => {
    setDeleteConfirm({ isOpen: true, submissionId });
  };

  const confirmDeleteSubmission = async () => {
    const { submissionId } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, submissionId: null }); 

    const token = localStorage.getItem('token');
    const toastId = toast.loading("Removing submission...");
    try {
      await axios.delete(`${BACKEND_URL}/api/student/delete-submission/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Submission removed!", { id: toastId });
      fetchDashboardData(token); 
    } catch(err) { 
      toast.error("Failed to delete submission", { id: toastId }); 
    }
  };

  const handleSendTeacherRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/student/chat-request`, { teacherId: selectedCourse?.teacher?._id, initialMessage: teacherChatMsg }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Chat request sent to instructor!");
      setShowTeacherChatModal(false); setTeacherChatMsg(''); fetchInboxData(token); 
    } catch (error) { toast.error(error.response?.data?.msg || "Failed to send request"); }
  };

  const openTeacherChat = async (request) => {
    setActiveChat(request); setShowInboxModal(false); socket.emit("join_chat", request._id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/communication/messages/${request._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setChatMessages(res.data);
    } catch (err) { toast.error("Could not load messages"); }
  };

  const sendHumanMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChat) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/api/communication/message`, { chatRequestId: activeChat._id, content: newMessageText }, { headers: { Authorization: `Bearer ${token}` } });
      const savedMessage = res.data;
      setChatMessages((prev) => [...prev, savedMessage]); setNewMessageText('');
      socket.emit("send_message", { chatRequestId: activeChat._id, message: savedMessage });
    } catch (err) { toast.error("Failed to send message"); }
  };

  const handleStartExam = (exam) => { setActiveExam(exam); setExamAnswers({}); };
  const handleAnswerSelect = (questionId, option) => { setExamAnswers(prev => ({ ...prev, [questionId]: option })); };
  const handleSubmitExam = async (e) => {
    e.preventDefault();
    if (Object.keys(examAnswers).length < activeExam.questions.length && !window.confirm("You haven't answered all questions. Submit anyway?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/api/student/submit-exam`, { examId: activeExam._id, answers: examAnswers }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`🎉 Exam Submitted! You scored ${res.data.score}/${res.data.totalQuestions} (${res.data.percentage}%)`, { duration: 6000 });
      setActiveExam(null); setExamAnswers({}); fetchDashboardData(token);
    } catch (err) { toast.error(err.response?.data?.msg || "Failed to submit exam."); }
  };

  const handleJoinClass = async (classId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/student/join-class/${classId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Successfully joined the course!"); fetchDashboardData(token);
    } catch (error) { toast.error(error.response?.data?.msg || "Failed to join"); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };
  const handleEditProfile = (e) => { e.preventDefault(); e.stopPropagation(); navigate('/edit-profile'); };

  const handleAIAssistant = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = { role: 'user', parts: [{ text: chatInput }] };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory); setChatInput('');
    try {
      const res = await axios.post(`${BACKEND_URL}/api/chat/message`, { 
        message: userMessage.parts[0].text, 
        history: chatHistory.map(msg => ({ role: msg.role, parts: msg.parts })) 
      });
      setChatHistory([...updatedHistory, { role: 'model', parts: [{ text: res.data.reply }] }]);
    } catch (error) {
      setChatHistory([...updatedHistory, { role: 'model', isError: true, parts: [{ text: error.response?.data?.error || "AI connection failed." }] }]);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${BACKEND_URL}/${path.replace(/\\/g, '/')}`;
  };

  const progress = user?.profilePic ? 100 : 60; 
  const pendingExamsCount = exams.filter(exam => !exam.taken).length;
  const attendancePercentage = attendance.length > 0 ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-[#f4f9f7] flex flex-col md:flex-row font-sans text-slate-800 relative">
      <Toaster position="top-center" />
      
      <div className="md:hidden bg-[#0d735e] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 font-extrabold text-xl"><FaUserGraduate /> Smart Edu</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2"><FaBars size={24} /></button>
      </div>

      <aside className={`${isMobileMenuOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} md:flex flex-col w-full md:w-72 bg-[#0d735e] text-white h-screen md:sticky top-0 shadow-xl overflow-y-auto`}>
        {isMobileMenuOpen && <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-white/80 md:hidden"><FaTimes size={24}/></button>}

        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <FaUserGraduate size={36} className="mb-2" />
          <h2 className="font-extrabold text-2xl tracking-tight">Smart Edu</h2>
          <p className="text-xs font-medium text-emerald-200 tracking-wider uppercase mt-1">Student Portal</p>
        </div>

        <div className="p-6 pb-2">
          <div className="bg-[#0b5e4d] rounded-xl p-4 flex flex-col items-center text-center shadow-inner relative">
            <div className="relative w-20 h-20 mb-3">
              <div className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-1000" style={{ background: `conic-gradient(#34d399 ${progress}%, #064e3b 0)` }}>
                <div className="w-[72px] h-[72px] bg-[#0b5e4d] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#0b5e4d]">
                  {user?.profilePic && !imgError ? (
                    <img src={getImageUrl(user.profilePic)} alt="Profile" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  ) : (
                    <span className="text-[#b2dfdb] font-extrabold text-2xl">{user?.name?.charAt(0).toUpperCase() || 'S'}</span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#0d735e] border border-[#0b5e4d] text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm">{progress}%</div>
            </div>
            <h3 className="font-bold text-sm text-white mt-1">{user?.name || 'Student Name'}</h3>
            <span className="mt-1 bg-[#148e75] text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">Active Learner</span>
            <button onClick={handleEditProfile} className="mt-4 w-full flex items-center justify-center gap-2 py-1.5 bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white text-xs font-bold rounded-lg transition-colors border border-white/5"><FaUserEdit size={14} /> Edit Profile</button>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-1 pb-6 md:pb-0">
          {[
            { id: 'dashboard', icon: <FaUserGraduate size={18} />, label: 'Overview' },
            { id: 'browse', icon: <FaSearch size={18} />, label: 'Browse Classes' },
            { id: 'my-courses', icon: <FaBookOpen size={18} />, label: 'My Learning' }, 
            { id: 'attendance', icon: <FaCalendarCheck size={18} />, label: 'Attendance' },
            { id: 'announcements', icon: <FaBullhorn size={18} />, label: 'Announcements' }, 
            { id: 'live', icon: <FaBroadcastTower size={18} />, label: 'Live Classes' }, 
            { id: 'exams', icon: <FaFileAlt size={18} />, label: 'Assessments' } 
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-[#148e75] text-white font-bold shadow-md border-l-4 border-white' : 'text-emerald-100 hover:bg-[#0b5e4d]'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-emerald-200 hover:bg-red-500 hover:text-white transition-colors"><FaSignOutAlt /> Logout</button></div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto relative z-10 w-full">
        {isLoading && activeTab === 'dashboard' ? (
           <div className="flex items-center justify-center h-full text-[#0d735e] font-bold">Loading...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && <OverviewTab user={user} navigate={navigate} myClasses={myClasses} attendancePercentage={attendancePercentage} pendingExamsCount={pendingExamsCount} activeLiveRooms={activeLiveRooms} setActiveTab={setActiveTab} setSelectedCourse={setSelectedCourse} handleOpenCourse={handleOpenCourse} setShowInboxModal={setShowInboxModal} myInbox={myInbox} setIsAIOpen={setIsAIOpen} />}
            {activeTab === 'attendance' && <AttendanceTab attendance={attendance} />}
            {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} />}
            {activeTab === 'browse' && <BrowseTab allClasses={allClasses} handleJoinClass={handleJoinClass} />}
            
            {activeTab === 'my-courses' && (
              <MyCoursesTab 
                selectedCourse={selectedCourse} 
                myClasses={myClasses} 
                handleOpenCourse={handleOpenCourse} 
                setSelectedCourse={setSelectedCourse} 
                setShowTeacherChatModal={setShowTeacherChatModal} 
                courseContent={courseContent} 
                setActiveTab={setActiveTab} 
                mySubmissions={mySubmissions}                
                handleUploadSubmission={handleUploadSubmission} 
                handleDeleteSubmission={handleDeleteSubmission} 
              />
            )}
            
            {activeTab === 'live' && <LiveTab myClasses={myClasses} activeLiveRooms={activeLiveRooms} />}
            {activeTab === 'exams' && <ExamsTab activeExam={activeExam} exams={exams} handleStartExam={handleStartExam} handleSubmitExam={handleSubmitExam} examAnswers={examAnswers} handleAnswerSelect={handleAnswerSelect} setActiveExam={setActiveExam} />}
          </>
        )}
      </main>

      {/* OVERLAY MODALS */}
      {showTeacherChatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-2 text-[#0d735e]">Ask a Question</h3>
            <p className="text-sm text-slate-500 mb-6">Send a chat request to your instructor. They will accept it in their inbox.</p>
            <form onSubmit={handleSendTeacherRequest} className="space-y-4">
              <textarea placeholder="What do you need help with?" required rows="4" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg outline-none focus:border-[#0d735e] resize-none text-sm" value={teacherChatMsg} onChange={(e) => setTeacherChatMsg(e.target.value)}></textarea>
              <div className="flex justify-end gap-3 mt-4"><button type="button" onClick={() => setShowTeacherChatModal(false)} className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-lg text-sm">Cancel</button><button type="submit" className="px-5 py-2.5 font-bold text-white bg-[#0d735e] hover:bg-[#0a5c4a] rounded-lg text-sm shadow-md">Send Request</button></div>
            </form>
          </div>
        </div>
      )}

      {showInboxModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div><h3 className="text-2xl font-extrabold text-[#0d735e] flex items-center gap-3">My Inbox</h3><p className="text-sm text-slate-500 font-medium mt-1">Check responses from your instructors.</p></div>
              <button onClick={() => setShowInboxModal(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-red-500 rounded-full transition-all shadow-sm"><FaTimes size={18} /></button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4 flex-1 bg-white">
              {myInbox.length === 0 && (<div className="flex flex-col items-center justify-center py-16 opacity-50"><p className="text-lg font-bold text-slate-500">No messages yet!</p></div>)}
              {myInbox.map(req => (
                <div key={req._id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div><h4 className="font-bold text-slate-900 text-lg">Instructor: {req.teacher?.name}</h4><p className="text-sm text-slate-500 italic mt-1">Your query: "{req.initialMessage}"</p></div>
                    {req.status === 'accepted' && <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Accepted</span>}
                  </div>
                  {req.status === 'accepted' && (<div className="flex justify-end border-t border-gray-100 pt-3"><button onClick={() => openTeacherChat(req)} className="px-6 py-2 bg-[#0d735e] text-white text-sm font-bold rounded-xl hover:bg-[#0a5c4a] transition-colors shadow-sm">Open Chat</button></div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔥 CUSTOM DELETE CONFIRMATION MODAL 🔥 */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-gray-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Remove Submission?</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Are you sure you want to un-submit this assignment? You will need to upload it again before the deadline.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setDeleteConfirm({ isOpen: false, submissionId: null })} 
                className="px-6 py-3.5 font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all w-full"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteSubmission} 
                className="px-6 py-3.5 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/30 transition-all w-full"
              >
                Un-submit
              </button>
            </div>
          </div>
        </div>
      )}

      {activeChat && (
        <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[400px] bg-white md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 z-[60] flex flex-col overflow-hidden h-[100dvh] md:h-[600px] transition-all duration-300">
          <div className="bg-[#0d735e] p-5 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg backdrop-blur-sm border border-white/30">{activeChat.teacher?.name?.charAt(0).toUpperCase() || 'T'}</div><div><p className="font-bold text-lg leading-tight">{activeChat.teacher?.name}</p><p className="text-xs text-emerald-200">Instructor</p></div></div>
            <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><FaTimes size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 bg-[#f8fafc] flex flex-col gap-4 scroll-smooth" ref={chatScrollRef}>
            <div className="text-center my-4"><span className="bg-gray-200 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase">Chat Started</span></div>
            {chatMessages.map((msg, index) => {
              const isMe = msg.sender === user.id || msg.sender === user._id;
              const avatarLetter = isMe ? (user.name ? user.name.charAt(0).toUpperCase() : 'S') : (activeChat.teacher?.name ? activeChat.teacher.name.charAt(0).toUpperCase() : 'T');
              return (
                <div key={index} className={`flex gap-2 max-w-[90%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mt-auto ${isMe ? 'bg-[#0a5c4a]' : 'bg-blue-500'}`}>{avatarLetter}</div>
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}><div className={`px-4 py-2.5 text-[14px] shadow-sm ${isMe ? 'bg-[#0d735e] text-white rounded-2xl rounded-br-sm' : 'bg-white border border-gray-200 text-slate-800 rounded-2xl rounded-bl-sm'}`}>{msg.content}</div><span className="text-[10px] font-medium text-gray-400 mt-1 mx-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                </div>
              );
            })}
          </div>
          <form onSubmit={sendHumanMessage} className="p-4 bg-white border-t border-gray-100 flex items-end gap-3 z-10"><input type="text" placeholder="Type your message..." className="w-full bg-gray-50 border border-gray-200 px-5 py-3.5 rounded-full outline-none focus:border-[#0d735e] text-sm" value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} /><button type="submit" disabled={!newMessageText.trim()} className="p-3.5 bg-[#0d735e] text-white rounded-full hover:bg-[#0a5c4a] disabled:opacity-50 transition-all shrink-0"><FaPaperPlane size={16} className="ml-0.5" /></button></form>
        </div>
      )}

      {isAIOpen && (
        <div className="fixed bottom-6 right-6 w-[90%] md:w-[400px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 z-50 flex flex-col overflow-hidden h-[500px] md:h-[600px] animate-fade-in">
          <div className="bg-gradient-to-r from-[#0d735e] to-[#0a5c4a] p-5 text-white flex justify-between items-center shadow-md z-10"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 text-xl"><FaRobot /></div><div><p className="font-bold text-lg leading-tight">Gemini Tutor</p><p className="text-xs text-emerald-100 mt-0.5">Powered by Google AI</p></div></div><button onClick={() => setIsAIOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><FaTimes /></button></div>
          <div className="flex-1 overflow-y-auto p-5 bg-[#f8fafc] flex flex-col gap-4 scroll-smooth" ref={aiScrollRef}>
            
            {chatHistory.length === 0 && (
              <div className="flex flex-col max-w-[85%] self-start">
                <div className="px-5 py-3 text-[14px] leading-relaxed shadow-sm bg-white border border-gray-100 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm">
                  Hello! I am your Gemini AI Tutor. How can I help you study today?
                </div>
              </div>
            )}

            {chatHistory.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div key={idx} className={`flex flex-col max-w-[90%] ${isUser ? 'self-end' : 'self-start'}`}>
                  {msg.isError ? (
                    <div className="bg-white border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-sm"><FaExclamationTriangle className="shrink-0" />{msg.parts[0].text}</div>
                  ) : (
                    <div className={`px-5 py-4 text-[14px] shadow-sm ${isUser ? 'bg-[#0d735e] text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm'}`}>
                      {isUser ? msg.parts[0].text : formatAIResponse(msg.parts[0].text)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <form onSubmit={handleAIAssistant} className="p-4 bg-white border-t border-gray-100 flex items-end gap-3 z-10"><input type="text" placeholder="Ask your AI tutor anything..." className="w-full bg-gray-50 border border-gray-200 px-5 py-3.5 rounded-full outline-none focus:border-[#0d735e] text-sm" value={chatInput} onChange={(e) => setChatInput(e.target.value)} /><button type="submit" disabled={!chatInput.trim()} className="p-3.5 bg-[#0d735e] text-white rounded-full hover:bg-[#0a5c4a] disabled:opacity-50 transition-all shrink-0"><FaPaperPlane size={16} className="ml-0.5" /></button></form>
        </div>
      )}

      {!isAIOpen && (<button onClick={() => setIsAIOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-[#0d735e] hover:bg-[#0a5c4a] text-white rounded-full shadow-[0_10px_25px_-5px_rgba(13,115,94,0.5)] flex items-center justify-center transition-transform hover:scale-105 z-40 text-2xl"><FaRobot /></button>)}

    </div>
  );
};

export default StudentDashboard;