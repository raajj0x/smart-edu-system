import React from 'react';
import { FaTimes, FaExclamationTriangle, FaEye, FaCheckCircle, FaEdit, FaFileAlt, FaChevronDown } from 'react-icons/fa';

// 🔥 GLOBAL BACKEND URL
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ==========================================
// 1. DELETE CONFIRMATION MODAL
// ==========================================
export const DeleteModal = ({ deleteConfirm, setDeleteConfirm, confirmDelete }) => {
  if (!deleteConfirm.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-200">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <FaExclamationTriangle size={28} />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Are you sure?</h3>
        <p className="text-slate-600 font-medium mb-8">
          Do you really want to delete this {deleteConfirm.type}? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null })} className="px-6 py-3 font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full">
            Cancel
          </button>
          <button onClick={confirmDelete} className="px-6 py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-full">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SUBMISSIONS VIEW & GRADE MODAL
// ==========================================
export const SubmissionsModal = ({ showSubmissionsModal, setShowSubmissionsModal, selectedAssignmentTitle, isLoadingSubmissions, currentSubmissions, setViewFileUrl, evaluateSubmission }) => {
  if (!showSubmissionsModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[90] flex justify-center items-start pt-10 pb-10 overflow-y-auto p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl my-auto border border-gray-200">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Submissions: <span className="text-[#004c54]">{selectedAssignmentTitle}</span>
          </h3>
          <button onClick={() => setShowSubmissionsModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
            <FaTimes />
          </button>
        </div>

        {isLoadingSubmissions ? (
          <div className="text-center py-10 text-[#004c54] font-bold">Loading submissions...</div>
        ) : currentSubmissions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-gray-50 rounded-xl border border-gray-100">No submissions yet for this assignment.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-slate-800 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">Student Name</th>
                  <th className="p-4 font-bold">Submitted At</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentSubmissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{sub.studentId?.name || 'Unknown Student'}</td>
                    <td className="p-4 text-slate-600 text-sm">{new Date(sub.submittedAt).toLocaleString()}</td>
                    
                    <td className="p-4 text-right flex justify-end gap-2 items-center">
                      {/* 🔥 BACKEND_URL INJECTED HERE */}
                      <button onClick={() => setViewFileUrl(`${BACKEND_URL}/${sub.fileUrl}`)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors shadow-sm" title="View Document Natively">
                        <FaEye /> View
                      </button>
                      
                      {(!sub.status || sub.status === 'Pending') ? (
                        <>
                          <button onClick={() => evaluateSubmission(sub._id, 'Approved')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold text-sm rounded-lg transition-colors border border-emerald-200"><FaCheckCircle /> Approve</button>
                          <button onClick={() => evaluateSubmission(sub._id, 'Needs Revision')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-bold text-sm rounded-lg transition-colors border border-red-200"><FaTimes /> Reject</button>
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${sub.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{sub.status}</span>
                          <button onClick={() => evaluateSubmission(sub._id, 'Pending')} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white font-bold text-xs rounded-lg transition-colors border border-amber-200" title="Change Grade"><FaEdit /> Edit Grade</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. DOCUMENT VIEWER MODAL (IFRAME)
// ==========================================
export const DocumentViewerModal = ({ viewFileUrl, setViewFileUrl }) => {
  if (!viewFileUrl) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white p-4 rounded-[2rem] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-slate-100">
        <div className="flex justify-between items-center mb-4 px-4">
          <h3 className="text-xl font-black text-slate-900">Document Viewer</h3>
          <button onClick={() => setViewFileUrl(null)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"><FaTimes /></button>
        </div>
        <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
          <iframe src={viewFileUrl} title="Document Viewer" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. EXAM GENERATOR MODAL
// ==========================================
export const ExamGeneratorModal = ({ showExamModal, setShowExamModal, handleCreateExam, newExam, setNewExam, classes, addQuestion, updateQuestion }) => {
  if (!showExamModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex justify-center items-start pt-10 pb-10 overflow-y-auto p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl my-auto border border-gray-200">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <h3 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3"><FaFileAlt className="text-[#004c54]"/> Generate Exam</h3>
          <button onClick={() => setShowExamModal(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><FaTimes size={18} /></button>
        </div>
        
        <form onSubmit={handleCreateExam} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Exam Title</label><input type="text" placeholder="e.g. Midterm Assessment" required className="w-full bg-white border-2 border-gray-200 px-5 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-[#004c54]/10 focus:border-[#004c54] font-medium transition-colors shadow-sm" value={newExam.title} onChange={(e) => setNewExam({...newExam, title: e.target.value})} /></div>
            <div className="space-y-1 relative group w-full">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Classroom</label>
              <select required className="w-full bg-white border-2 border-gray-200 text-slate-800 px-5 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-[#004c54]/10 focus:border-[#004c54] transition-colors cursor-pointer appearance-none shadow-sm font-semibold hover:border-gray-300" value={newExam.classroomId} onChange={(e) => setNewExam({...newExam, classroomId: e.target.value})}><option value="" disabled>-- Select Classroom --</option>{classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}</select>
              <div className="absolute bottom-4 right-5 flex items-center pointer-events-none text-slate-400 group-hover:text-[#004c54] transition-colors"><FaChevronDown size={14} /></div>
            </div>
            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label><input type="date" required className="w-full bg-white border-2 border-gray-200 px-5 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-[#004c54]/10 focus:border-[#004c54] font-medium transition-colors text-slate-600 shadow-sm" value={newExam.date} onChange={(e) => setNewExam({...newExam, date: e.target.value})} /></div>
            <div className="flex gap-4">
              <div className="space-y-1 w-1/2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Start Time</label><input type="time" required className="w-full bg-white border-2 border-gray-200 px-5 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-[#004c54]/10 focus:border-[#004c54] font-medium transition-colors text-slate-600 shadow-sm" value={newExam.startTime} onChange={(e) => setNewExam({...newExam, startTime: e.target.value})} /></div>
              <div className="space-y-1 w-1/2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Duration</label><input type="number" placeholder="Mins" required className="w-full bg-white border-2 border-gray-200 px-5 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-[#004c54]/10 focus:border-[#004c54] font-medium transition-colors shadow-sm" value={newExam.duration} onChange={(e) => setNewExam({...newExam, duration: e.target.value})} /></div>
            </div>
          </div>
          
          <div className="mt-10">
            <div className="flex justify-between items-center mb-6"><h4 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">Question Bank <span className="bg-[#e0f2f1] text-[#004c54] text-xs px-3 py-1 rounded-md">{newExam.questions.length} Qs</span></h4><button type="button" onClick={addQuestion} className="text-sm bg-gray-100 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-[#004c54] hover:text-white transition-colors shadow-sm">+ Add Question</button></div>
            <div className="space-y-6">
              {newExam.questions.map((q, i) => (
                <div key={i} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm relative">
                  <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">{i + 1}</div>
                  <input type="text" placeholder="Type your question here..." required className="w-full mb-5 bg-gray-50 border-2 border-gray-200 px-5 py-4 rounded-xl outline-none focus:ring-4 focus:ring-[#004c54]/10 focus:border-[#004c54] font-bold text-lg transition-colors" value={q.questionText} onChange={(e) => updateQuestion(i, 'questionText', e.target.value)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-3"><span className="font-bold text-slate-400 w-4">A.</span><input type="text" placeholder="Option A" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg outline-none focus:border-[#004c54] focus:ring-1 focus:ring-[#004c54] font-medium transition-colors" value={q.options.a} onChange={(e) => updateQuestion(i, 'a', e.target.value, true)} /></div>
                    <div className="flex items-center gap-3"><span className="font-bold text-slate-400 w-4">B.</span><input type="text" placeholder="Option B" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg outline-none focus:border-[#004c54] focus:ring-1 focus:ring-[#004c54] font-medium transition-colors" value={q.options.b} onChange={(e) => updateQuestion(i, 'b', e.target.value, true)} /></div>
                    <div className="flex items-center gap-3"><span className="font-bold text-slate-400 w-4">C.</span><input type="text" placeholder="Option C" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg outline-none focus:border-[#004c54] focus:ring-1 focus:ring-[#004c54] font-medium transition-colors" value={q.options.c} onChange={(e) => updateQuestion(i, 'c', e.target.value, true)} /></div>
                    <div className="flex items-center gap-3"><span className="font-bold text-slate-400 w-4">D.</span><input type="text" placeholder="Option D" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg outline-none focus:border-[#004c54] focus:ring-1 focus:ring-[#004c54] font-medium transition-colors" value={q.options.d} onChange={(e) => updateQuestion(i, 'd', e.target.value, true)} /></div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#e0f2f1] p-4 rounded-lg border border-[#b2dfdb]">
                    <label className="text-sm font-extrabold text-[#004c54] uppercase tracking-wider">Correct Answer:</label>
                    <div className="relative group">
                      <select className="w-32 bg-white border-2 border-gray-200 text-[#004c54] font-bold px-4 py-2 rounded-md outline-none focus:border-[#004c54] focus:ring-4 focus:ring-[#004c54]/20 transition-colors cursor-pointer appearance-none shadow-sm hover:border-gray-300" value={q.correctOption} onChange={(e) => updateQuestion(i, 'correctOption', e.target.value)}><option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option></select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400 group-hover:text-[#004c54] transition-colors"><FaChevronDown size={12} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-200 sticky bottom-0 bg-white/90 backdrop-blur-sm p-4 rounded-xl">
            <button type="button" onClick={() => setShowExamModal(false)} className="px-8 py-3 font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-3 font-bold text-white bg-[#004c54] hover:bg-[#003339] rounded-lg transition-colors flex items-center gap-2">Deploy Exam</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 5. CREATE CLASS MODAL
// ==========================================
export const CreateClassModal = ({ showClassModal, setShowClassModal, handleCreateClass, newClass, setNewClass }) => {
  if (!showClassModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900">Create New Class</h3>
          <button onClick={() => setShowClassModal(false)} className="text-slate-400 hover:text-red-600 transition-colors"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Class Name</label><input type="text" required placeholder="e.g., Computer Science 101" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54]" value={newClass.name} onChange={(e) => setNewClass({...newClass, name: e.target.value})} /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Subject</label><input type="text" required placeholder="e.g., Programming" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54]" value={newClass.subject} onChange={(e) => setNewClass({...newClass, subject: e.target.value})} /></div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setShowClassModal(false)} className="px-6 py-2.5 font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2.5 font-bold text-white bg-[#004c54] hover:bg-[#003339] rounded-lg">Create Class</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 6. UPLOAD VIDEO MODAL
// ==========================================
export const UploadVideoModal = ({ showVideoModal, setShowVideoModal, handleUploadVideo, newVideo, setNewVideo }) => {
  if (!showVideoModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900">Upload Video Lecture</h3>
          <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-red-600 transition-colors"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handleUploadVideo} className="space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Video Title</label><input type="text" required placeholder="Enter title" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54]" value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Description</label><textarea required placeholder="Brief description..." className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54] min-h-[100px]" value={newVideo.description} onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}></textarea></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Video File (MP4)</label><input type="file" accept="video/mp4,video/x-m4v,video/*" required className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:border-[#004c54]" onChange={(e) => setNewVideo({...newVideo, file: e.target.files[0]})} /></div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setShowVideoModal(false)} className="px-6 py-2.5 font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2.5 font-bold text-white bg-[#004c54] hover:bg-[#003339] rounded-lg">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 7. POST / EDIT ASSIGNMENT MODAL
// ==========================================
export const AssignmentModal = ({ showAssignmentModal, setShowAssignmentModal, handleAssignmentSubmit, editingAssignment, newAssignment, setNewAssignment }) => {
  if (!showAssignmentModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900">{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</h3>
          <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 hover:text-red-600 transition-colors"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Assignment Title</label><input type="text" required placeholder="Enter title" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54]" value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Instructions / Description</label><textarea required placeholder="What should the students do?" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54] min-h-[100px]" value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}></textarea></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label><input type="date" required className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54]" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Attach File {editingAssignment && "(Optional)"}</label><input type="file" accept=".pdf,.doc,.docx" required={!editingAssignment} className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:border-[#004c54]" onChange={(e) => setNewAssignment({...newAssignment, file: e.target.files[0]})} /></div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setShowAssignmentModal(false)} className="px-6 py-2.5 font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2.5 font-bold text-white bg-[#004c54] hover:bg-[#003339] rounded-lg">{editingAssignment ? 'Update' : 'Publish'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 8. POST / EDIT ANNOUNCEMENT MODAL
// ==========================================
export const AnnouncementModal = ({ showAnnounceModal, setShowAnnounceModal, handlePostAnnouncement, editingAnnounceId, newAnnounce, setNewAnnounce, classes }) => {
  if (!showAnnounceModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900">{editingAnnounceId ? 'Edit Update' : 'Post Update'}</h3>
          <button onClick={() => setShowAnnounceModal(false)} className="text-slate-400 hover:text-red-600 transition-colors"><FaTimes size={20} /></button>
        </div>
        <form onSubmit={handlePostAnnouncement} className="space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Title</label><input type="text" required placeholder="e.g. Midterm Cancelled" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54]" value={newAnnounce.title} onChange={(e) => setNewAnnounce({...newAnnounce, title: e.target.value})} /></div>
          <div className="relative group">
            <label className="block text-sm font-bold text-slate-700 mb-1">Target Class</label>
            <select className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54] appearance-none" value={newAnnounce.classroomId} onChange={(e) => setNewAnnounce({...newAnnounce, classroomId: e.target.value})}>
              <option value="">General (All Classes)</option>
              {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 top-6 flex items-center px-4 pointer-events-none text-slate-400"><FaChevronDown size={14} /></div>
          </div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Message</label><textarea required placeholder="Details..." className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-[#004c54] min-h-[100px]" value={newAnnounce.message} onChange={(e) => setNewAnnounce({...newAnnounce, message: e.target.value})}></textarea></div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setShowAnnounceModal(false)} className="px-6 py-2.5 font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2.5 font-bold text-white bg-[#004c54] hover:bg-[#003339] rounded-lg">{editingAnnounceId ? 'Save Changes' : 'Broadcast'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 9. EXAM RESULTS MODAL (🔥 CRASH PROOF SAFEGUARD)
// ==========================================
export const ExamResultsModal = ({ showResultsModal, setShowResultsModal, examResults, isLoadingResults, selectedExamTitle }) => {
  if (!showResultsModal) return null;
  
  // 🔥 SAFEGUARD: Force examResults to always be an array so .map never crashes
  const safeResults = Array.isArray(examResults) ? examResults : [];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[90] flex justify-center items-start pt-10 pb-10 overflow-y-auto p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl my-auto border border-gray-200">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Exam Results: <span className="text-[#004c54]">{selectedExamTitle}</span>
          </h3>
          <button onClick={() => setShowResultsModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
            <FaTimes />
          </button>
        </div>

        {isLoadingResults ? (
          <div className="text-center py-10 text-[#004c54] font-bold">Loading student scores...</div>
        ) : safeResults.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-gray-50 rounded-xl border border-gray-100">No students have taken this exam yet.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-slate-800 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">Student Name</th>
                  <th className="p-4 font-bold text-center">Score</th>
                  <th className="p-4 font-bold text-center">Grade</th>
                  <th className="p-4 font-bold text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {safeResults.map((result, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{result.studentId?.name || 'Unknown Student'}</td>
                    <td className="p-4 text-center font-bold text-[#004c54]">{result.score} / {result.totalQuestions}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.percentage >= 80 ? 'bg-emerald-100 text-emerald-700' : result.percentage >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {result.percentage}%
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-600 text-sm">{new Date(result.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};