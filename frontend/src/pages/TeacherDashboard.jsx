import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaVideo, FaSignOutAlt, FaBars, FaTimes, FaFileAlt, FaBroadcastTower, FaBullhorn } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';

import TeacherChat from './TeacherChat'; 
import { DashboardTab, AnnouncementsTab, LiveTab, StudentsTab, AssignmentsTab, VideosTab, ExamsTab } from '../components/TeacherTabs';

// 🔥 MODAL IMPORTS
import { DeleteModal, SubmissionsModal, DocumentViewerModal, ExamGeneratorModal, CreateClassModal, UploadVideoModal, AssignmentModal, AnnouncementModal, ExamResultsModal } from '../components/TeacherModals'; 

const socket = io.connect('http://localhost:5000'); 

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  });

  const teacherInitial = user.name ? user.name.charAt(0).toUpperCase() : 'T';
  const teacherName = user.name || 'Instructor';
  const [imgError, setImgError] = useState(false);

  // DATA STATES
  const [classes, setClasses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classStudents, setClassStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState({});

  // CHAT STATES
  const [chatRequests, setChatRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const chatScrollRef = useRef(null);

  // EXAM RESULTS STATES
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [examResults, setExamResults] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [selectedExamTitle, setSelectedExamTitle] = useState('');

  // MODAL STATES
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', subject: '' });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', description: '', file: null });
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', file: null });
  const [showChatRequestsModal, setShowChatRequestsModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [newExam, setNewExam] = useState({ title: '', classroomId: '', date: '', startTime: '', duration: '', questions: [{ questionText: '', options: { a: '', b: '', c: '', d: '' }, correctOption: 'a' }] });
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [editingAnnounceId, setEditingAnnounceId] = useState(null);
  const [newAnnounce, setNewAnnounce] = useState({ title: '', message: '', classroomId: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null });

  // SUBMISSION STATES
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [currentSubmissions, setCurrentSubmissions] = useState([]);
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState('');
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [viewFileUrl, setViewFileUrl] = useState(null);

  // LIFECYCLE & DATA FETCHING
  useEffect(() => {
    socket.on("receive_message", (message) => setChatMessages((prev) => [...prev, message]));
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (selectedClassId) {
      fetch(`http://localhost:5000/api/teacher/class-students/${selectedClassId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const onlyStudents = data.filter(s => s.role !== 'teacher' && s._id !== (user._id || user.id));
        setClassStudents(onlyStudents);
        setTodayAttendance({}); 
      }).catch(err => toast.error("Could not load students"));
    } else { setClassStudents([]); }
  }, [selectedClassId, token, user]);

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const clsRes = await fetch('http://localhost:5000/api/teacher/classes', { headers });
      if (clsRes.ok) {
        const classData = await clsRes.json();
        setClasses(classData);
        let totalSt = 0;
        classData.forEach(c => {
          const validStudents = (c.students || []).filter(s => s._id !== (user._id || user.id));
          totalSt += validStudents.length;
        });
        setStudentsCount(totalSt);
      }
      
      const chatRes = await fetch('http://localhost:5000/api/communication/teacher/data', { headers });
      if (chatRes.ok) setChatRequests(await chatRes.json());

      if (activeTab === 'video-lectures') { const vidRes = await fetch('http://localhost:5000/api/teacher/videos', { headers }); if (vidRes.ok) setVideos(await vidRes.json()); }
      if (activeTab === 'assignments') { const assnRes = await fetch('http://localhost:5000/api/teacher/assignments', { headers }); if (assnRes.ok) setAssignments(await assnRes.json()); }
      if (activeTab === 'exams') { const exmRes = await fetch('http://localhost:5000/api/teacher/exams', { headers }); if (exmRes.ok) setExams(await exmRes.json()); }
      if (activeTab === 'announcements') {
        const annRes = await fetch('http://localhost:5000/api/announcements', { headers });
        if (annRes.ok) { const allAnns = await annRes.json(); setAnnouncements(allAnns.filter(a => a.teacherName === teacherName)); }
      }
    } catch (err) { toast.error("Could not fetch data from server."); }
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const startLiveClass = async (cls) => {
    const roomId = `${cls._id}-live`;
    const payload = { title: `🔴 LIVE NOW: ${cls.name}`, message: `A live video session has just started.`, classroomId: cls._id, className: cls.name, teacherName: teacherName };
    try {
      const res = await fetch('http://localhost:5000/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) socket.emit("new_announcement", payload); 
    } catch (err) {}
    socket.emit("notify_live_class", { className: cls.name, roomId: roomId });
    window.location.href = `/live/${roomId}`;
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    const targetClass = classes.find(c => c._id === newAnnounce.classroomId);
    const payload = { title: newAnnounce.title, message: newAnnounce.message, classroomId: newAnnounce.classroomId, className: targetClass?.name || 'General', teacherName: teacherName };
    const url = editingAnnounceId ? `http://localhost:5000/api/announcements/${editingAnnounceId}` : 'http://localhost:5000/api/announcements';
    try {
      const res = await fetch(url, { method: editingAnnounceId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editingAnnounceId ? "Announcement Updated!" : "Announcement Posted!");
        if (!editingAnnounceId) socket.emit("new_announcement", payload);
        setShowAnnounceModal(false); setEditingAnnounceId(null); setNewAnnounce({ title: '', message: '', classroomId: '' }); fetchData();
      } else toast.error("Failed to save announcement.");
    } catch (err) { toast.error("Server error while saving announcement."); }
  };

  const openEditAnnouncement = (ann) => { setEditingAnnounceId(ann._id); setNewAnnounce({ title: ann.title, message: ann.message, classroomId: ann.classroomId }); setShowAnnounceModal(true); };

  const handleChatStatus = async (requestId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/communication/request/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Student query ${status}!`);
        fetchData(); 
      } else toast.error("Failed to update query status.");
    } catch (err) { toast.error("Server error."); }
  };

  const openChat = async (request) => {
    setActiveChat(request);
    setShowChatRequestsModal(false);
    socket.emit("join_chat", request._id);
    try {
      const res = await fetch(`http://localhost:5000/api/communication/messages/${request._id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setChatMessages(await res.json()); else toast.error("Failed to load conversation.");
    } catch (err) { toast.error("Server error."); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChat) return;
    try {
      const res = await fetch('http://localhost:5000/api/communication/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ chatRequestId: activeChat._id, content: newMessageText })
      });
      if (res.ok) {
        const savedMessage = await res.json();
        setChatMessages((prev) => [...prev, savedMessage]); setNewMessageText('');
        socket.emit("send_message", { chatRequestId: activeChat._id, message: savedMessage });
      } else toast.error("Failed to send message.");
    } catch (err) { toast.error("Server error."); }
  };

  const deleteChatRequest = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/communication/request/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { toast.success("Query permanently cleared!"); setChatRequests(prev => prev.filter(req => req._id !== id)); } else toast.error("Failed to clear query.");
    } catch (err) { toast.error("Server error."); }
  };

  const requestDelete = (type, id) => { setDeleteConfirm({ isOpen: true, type, id }); };
  const confirmDelete = async () => {
    const { type, id } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, type: '', id: null }); 
    try { 
      const url = type === 'announcement' ? `http://localhost:5000/api/announcements/${id}` : `http://localhost:5000/api/teacher/${type}/${id}`;
      const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }}); 
      if (res.ok) { toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`); fetchData(); } else toast.error(`Failed to delete ${type}.`);
    } catch (err) { toast.error("Server error."); }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try { 
      const res = await fetch('http://localhost:5000/api/teacher/create-class', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newClass) }); 
      if (res.ok) { toast.success("Class created!"); setShowClassModal(false); setNewClass({ name: '', subject: '' }); fetchData(); } else toast.error("Failed to create class.");
    } catch (err) { toast.error("Server error."); }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault(); 
    const formData = new FormData(); formData.append('title', newVideo.title); formData.append('description', newVideo.description); if (newVideo.file) formData.append('file', newVideo.file);
    try { 
      const res = await fetch('http://localhost:5000/api/teacher/video', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData }); 
      if (res.ok) { toast.success("Video uploaded!"); setShowVideoModal(false); setNewVideo({ title: '', description: '', file: null }); fetchData(); } else toast.error("Failed to upload.");
    } catch (err) { toast.error("Server error."); }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault(); 
    const formData = new FormData(); if (newAssignment.title) formData.append('title', newAssignment.title); if (newAssignment.description) formData.append('description', newAssignment.description); if (newAssignment.dueDate) formData.append('dueDate', newAssignment.dueDate); if (newAssignment.file) formData.append('file', newAssignment.file);
    const url = editingAssignment ? `http://localhost:5000/api/teacher/assignment/${editingAssignment._id}` : `http://localhost:5000/api/teacher/assignment`;
    try { 
      const res = await fetch(url, { method: editingAssignment ? 'PUT' : 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData }); 
      if (res.ok) { toast.success(editingAssignment ? "Assignment updated!" : "Assignment posted!"); setShowAssignmentModal(false); setEditingAssignment(null); setNewAssignment({ title: '', description: '', dueDate: '', file: null }); fetchData(); } else toast.error("Failed to save.");
    } catch (err) { toast.error("Server error."); }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try { 
      const res = await fetch('http://localhost:5000/api/teacher/exam', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newExam) }); 
      if (res.ok) { toast.success("Exam generated!"); setShowExamModal(false); setNewExam({ title: '', classroomId: '', date: '', startTime: '', duration: '', questions: [{ questionText: '', options: { a: '', b: '', c: '', d: '' }, correctOption: 'a' }] }); fetchData(); } else toast.error("Failed to generate."); 
    } catch (err) { toast.error("Server error."); }
  };
  
  const addQuestion = () => setNewExam({ ...newExam, questions: [...newExam.questions, { questionText: '', options: { a: '', b: '', c: '', d: '' }, correctOption: 'a' }] });
  const updateQuestion = (index, field, value, isOption = false) => { const updated = [...newExam.questions]; if (isOption) updated[index].options[field] = value; else updated[index][field] = value; setNewExam({ ...newExam, questions: updated }); };

  const handleMarkAttendance = async (studentId, status) => {
    const today = new Date().toISOString().split('T')[0];
    try { 
      const res = await fetch('http://localhost:5000/api/teacher/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ studentId, date: today, status, classId: selectedClassId }) }); 
      if (res.ok) { toast.success(`Student marked ${status}!`); setTodayAttendance(prev => ({ ...prev, [studentId]: status })); } else toast.error("Failed to mark attendance.");
    } catch (err) { toast.error("Server error."); }
  };
  
  const resetAttendanceUI = (studentId) => { setTodayAttendance(prev => ({ ...prev, [studentId]: null })); };
  const handleManageClass = (classId) => { setSelectedClassId(classId); setActiveTab('students'); };
  const openEditAssignment = (assn) => { setEditingAssignment(assn); setNewAssignment({ title: assn.title, description: assn.description, dueDate: assn.dueDate ? new Date(assn.dueDate).toISOString().split('T')[0] : '', file: null }); setShowAssignmentModal(true); };

  const viewSubmissions = async (assignment) => {
    setSelectedAssignmentTitle(assignment.title); setShowSubmissionsModal(true); setIsLoadingSubmissions(true);
    try {
      const res = await fetch(`http://localhost:5000/api/teacher/assignment/${assignment._id}/submissions`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setCurrentSubmissions(await res.json()); else toast.error("Failed to load submissions.");
    } catch (err) { toast.error("Server error loading submissions."); } finally { setIsLoadingSubmissions(false); }
  };

  const evaluateSubmission = async (submissionId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/teacher/submission/${submissionId}/evaluate`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status }) });
      if (res.ok) {
        if(status === 'Pending') toast.success("Grade reset successfully."); else toast.success(`Assignment marked as ${status}!`);
        setCurrentSubmissions(prev => prev.map(s => s._id === submissionId ? { ...s, status } : s));
      } else toast.error("Failed to update status.");
    } catch (err) { toast.error("Server error."); }
  };

  // 🔥 THE CRASH-PROOF EXAM RESULTS HANDLER
  const viewExamResults = async (exam) => {
    setSelectedExamTitle(exam.title);
    setShowResultsModal(true); 
    setIsLoadingResults(true);
    setExamResults([]); 
    
    try {
      const res = await fetch(`http://localhost:5000/api/teacher/exam-results/${exam._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (Array.isArray(data)) {
          setExamResults(data);
        } else if (data.results && Array.isArray(data.results)) {
          setExamResults(data.results);
        } else if (data.data && Array.isArray(data.data)) {
          setExamResults(data.data);
        } else {
          setExamResults([]);
        }
      } else {
        toast.error(data.message || "Failed to load exam results.");
      }
    } catch (err) {
      toast.error("Server error loading results.");
    } finally {
      setIsLoadingResults(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `http://localhost:5000/${path.replace(/\\/g, '/')}`;
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
  const pendingCount = chatRequests.filter(q => q.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f4f9f7] flex flex-col md:flex-row font-sans text-slate-900 relative">
      <Toaster position="top-center" />
      
      {/* MOBILE NAV & SIDEBAR */}
      <div className="md:hidden bg-[#004c54] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 font-extrabold text-xl"><FaChalkboardTeacher /> Smart Edu</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white"><FaBars size={24} /></button>
      </div>

      <aside className={`${isMobileMenuOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} md:flex flex-col w-full md:w-72 bg-[#004c54] text-white h-screen md:sticky top-0 shadow-xl overflow-y-auto`}>
        {isMobileMenuOpen && <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white md:hidden"><FaTimes size={24}/></button>}

        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <FaChalkboardTeacher size={36} className="mb-2 text-white" />
          <h2 className="font-extrabold text-2xl tracking-tight text-white">Smart Edu</h2>
          <p className="text-xs font-medium text-[#e0f2f1] tracking-widest uppercase mt-1">Teacher Portal</p>
        </div>

        <div className="p-6 pb-2">
          <div className="bg-white/10 rounded-xl p-5 flex flex-col items-center text-center shadow-inner border border-white/10">
            <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-[3px] border-[#e0f2f1] flex items-center justify-center bg-[#0a7c71] text-white text-2xl font-bold shadow-md">
              {user?.profilePic && !imgError ? <img src={getImageUrl(user.profilePic)} alt="Profile" className="w-full h-full object-cover" onError={() => setImgError(true)} /> : teacherInitial}
            </div>
            <h3 className="font-bold text-sm text-white">{teacherName}</h3>
            <span className="mt-2 bg-[#0a7c71] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Verified Teacher</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-1 pb-6 md:pb-0">
          {[
            { id: 'dashboard', icon: <FaChalkboardTeacher size={18} />, label: 'Dashboard' },
            { id: 'students', icon: <FaUsers size={18} />, label: 'My Students' },
            { id: 'announcements', icon: <FaBullhorn size={18} />, label: 'Announcements' }, 
            { id: 'live-sessions', icon: <FaBroadcastTower size={18} />, label: 'Live Classes' }, 
            { id: 'video-lectures', icon: <FaVideo size={18} />, label: 'Recorded Videos' },
            { id: 'assignments', icon: <FaClipboardList size={18} />, label: 'Assignments' },
            { id: 'exams', icon: <FaFileAlt size={18} />, label: 'Exams' } 
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === tab.id ? 'bg-[#0a7c71] text-white shadow-md' : 'text-[#e0f2f1] hover:bg-white/10 hover:text-white'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-[#e0f2f1] hover:bg-red-600 hover:text-white transition-colors"><FaSignOutAlt /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto relative z-10 w-full">
        {activeTab === 'dashboard' && <DashboardTab teacherName={teacherName} pendingCount={pendingCount} setShowChatRequestsModal={setShowChatRequestsModal} setShowClassModal={setShowClassModal} studentsCount={studentsCount} classes={classes} setActiveTab={setActiveTab} handleManageClass={handleManageClass} requestDelete={requestDelete} />}
        {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} setEditingAnnounceId={setEditingAnnounceId} setNewAnnounce={setNewAnnounce} setShowAnnounceModal={setShowAnnounceModal} openEditAnnouncement={openEditAnnouncement} requestDelete={requestDelete} />}
        {activeTab === 'live-sessions' && <LiveTab classes={classes} startLiveClass={startLiveClass} />}
        {activeTab === 'students' && <StudentsTab classes={classes} selectedClassId={selectedClassId} setSelectedClassId={setSelectedClassId} classStudents={classStudents} todayAttendance={todayAttendance} handleMarkAttendance={handleMarkAttendance} resetAttendanceUI={resetAttendanceUI} />}
        {activeTab === 'assignments' && <AssignmentsTab assignments={assignments} setEditingAssignment={setEditingAssignment} setNewAssignment={setNewAssignment} setShowAssignmentModal={setShowAssignmentModal} viewSubmissions={viewSubmissions} openEditAssignment={openEditAssignment} requestDelete={requestDelete} />}
        {activeTab === 'video-lectures' && <VideosTab videos={videos} setShowVideoModal={setShowVideoModal} requestDelete={requestDelete} />}
        {activeTab === 'exams' && <ExamsTab exams={exams} setShowExamModal={setShowExamModal} requestDelete={requestDelete} viewExamResults={viewExamResults} />}
      </main>

      {/* MODALS */}
      <DeleteModal deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} confirmDelete={confirmDelete} />
      <SubmissionsModal showSubmissionsModal={showSubmissionsModal} setShowSubmissionsModal={setShowSubmissionsModal} selectedAssignmentTitle={selectedAssignmentTitle} isLoadingSubmissions={isLoadingSubmissions} currentSubmissions={currentSubmissions} setViewFileUrl={setViewFileUrl} evaluateSubmission={evaluateSubmission} />
      <DocumentViewerModal viewFileUrl={viewFileUrl} setViewFileUrl={setViewFileUrl} />
      <ExamGeneratorModal showExamModal={showExamModal} setShowExamModal={setShowExamModal} handleCreateExam={handleCreateExam} newExam={newExam} setNewExam={setNewExam} classes={classes} addQuestion={addQuestion} updateQuestion={updateQuestion} />
      <CreateClassModal showClassModal={showClassModal} setShowClassModal={setShowClassModal} handleCreateClass={handleCreateClass} newClass={newClass} setNewClass={setNewClass} />
      <UploadVideoModal showVideoModal={showVideoModal} setShowVideoModal={setShowVideoModal} handleUploadVideo={handleUploadVideo} newVideo={newVideo} setNewVideo={setNewVideo} />
      <AssignmentModal showAssignmentModal={showAssignmentModal} setShowAssignmentModal={setShowAssignmentModal} handleAssignmentSubmit={handleAssignmentSubmit} editingAssignment={editingAssignment} newAssignment={newAssignment} setNewAssignment={setNewAssignment} />
      <AnnouncementModal showAnnounceModal={showAnnounceModal} setShowAnnounceModal={setShowAnnounceModal} handlePostAnnouncement={handlePostAnnouncement} editingAnnounceId={editingAnnounceId} newAnnounce={newAnnounce} setNewAnnounce={setNewAnnounce} classes={classes} />
      
      {/* 🔥 THE NEW CRASH-PROOF EXAM RESULTS MODAL */}
      <ExamResultsModal showResultsModal={showResultsModal} setShowResultsModal={setShowResultsModal} examResults={examResults} isLoadingResults={isLoadingResults} selectedExamTitle={selectedExamTitle} />

      {/* CHAT COMPONENT */}
      <TeacherChat user={user} activeChat={activeChat} setActiveChat={setActiveChat} chatMessages={chatMessages} setChatMessages={setChatMessages} newMessageText={newMessageText} setNewMessageText={setNewMessageText} sendMessage={sendMessage} chatScrollRef={chatScrollRef} showChatRequestsModal={showChatRequestsModal} setShowChatRequestsModal={setShowChatRequestsModal} chatRequests={chatRequests} handleChatStatus={handleChatStatus} openChat={openChat} deleteChatRequest={deleteChatRequest} />
    </div>
  );
};

export default TeacherDashboard;