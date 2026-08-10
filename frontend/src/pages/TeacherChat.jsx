import React from 'react';
import { FaTimes, FaCommentDots, FaPaperPlane, FaClipboardList } from 'react-icons/fa';

const TeacherChat = ({
  user,
  activeChat,
  setActiveChat,
  chatMessages,
  setChatMessages,
  newMessageText,
  setNewMessageText,
  sendMessage,
  chatScrollRef,
  showChatRequestsModal,
  setShowChatRequestsModal,
  chatRequests,
  handleChatStatus,
  openChat,
  deleteChatRequest 
}) => {
  // 🔥 Safely store the current user ID as a String
  const currentUserId = String(user?._id || user?.id);

  return (
    <>
      {/* 🛑 STUDENT INBOX MODAL */}
      {showChatRequestsModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-extrabold text-[#004c54] flex items-center gap-3">
                  <FaCommentDots size={28} /> Student Inbox
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Manage and respond to student queries.</p>
              </div>
              <button 
                onClick={() => setShowChatRequestsModal(false)} 
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors shadow-sm"
              >
                <FaTimes size={18} />
              </button>
            </div>
            
            {/* Request List */}
            <div className="overflow-y-auto p-6 space-y-4 flex-1 bg-white">
              {chatRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 opacity-60">
                  <FaClipboardList size={64} className="text-gray-300 mb-4" />
                  <p className="text-lg font-bold text-slate-500">Inbox Zero!</p>
                  <p className="text-sm text-slate-400">You have no pending student queries.</p>
                </div>
              )}

              {chatRequests.map(req => (
                <div key={req._id} className="p-5 bg-gray-50 border border-gray-200 hover:shadow-sm rounded-xl transition-shadow group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#e0f2f1] text-[#004c54] font-bold text-xl flex items-center justify-center">
                        {req.student?.name?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{req.student?.name}</h4>
                        {req.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-widest mt-1">
                            New Request
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-4">
                    <p className="text-sm text-slate-600 font-medium italic">"{req.initialMessage}"</p>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-end items-center border-t border-gray-200 pt-4">
                    
                    <button 
                      onClick={() => deleteChatRequest(req._id)} 
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors mr-auto shadow-sm"
                    >
                      Clear
                    </button>

                    {req.status === 'pending' ? (
                      <>
                        <button onClick={() => handleChatStatus(req._id, 'rejected')} className="px-5 py-2.5 bg-white border border-gray-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors">
                          Reject
                        </button>
                        <button onClick={() => handleChatStatus(req._id, 'accepted')} className="px-5 py-2.5 bg-[#e0f2f1] text-[#004c54] hover:bg-[#0a7c71] hover:text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                          Accept Query
                        </button>
                      </>
                    ) : req.status === 'accepted' ? (
                      <button onClick={() => openChat(req)} className="w-full md:w-auto px-6 py-2.5 bg-[#004c54] text-white text-sm font-bold rounded-lg hover:bg-[#003339] shadow-sm flex justify-center items-center gap-2 transition-colors">
                        <FaCommentDots /> Open Conversation
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-200 text-slate-500 text-sm font-bold rounded-lg uppercase tracking-wider">
                        Declined
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 💬 FLOATING CHAT WINDOW */}
      {activeChat && (
        <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[400px] bg-white md:rounded-2xl shadow-2xl border border-gray-200 z-[60] flex flex-col overflow-hidden h-[100dvh] md:h-[600px] transition-all duration-300">
          
          <div className="bg-[#004c54] p-4 text-white flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg backdrop-blur-sm">
                  {activeChat.student?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#004c54] rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-lg leading-tight shadow-sm">{activeChat.student?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setChatMessages([])} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-colors">Clear</button>
              <button onClick={() => setActiveChat(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><FaTimes size={16} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-4 scroll-smooth" ref={chatScrollRef}>
            
            <div className="flex gap-2 max-w-[85%] self-start mt-2">
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mt-auto bg-slate-500">
                {activeChat.student?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase tracking-wider">Original Query</span>
                <div className="px-4 py-2.5 text-[15px] shadow-sm leading-relaxed bg-white border border-gray-200 text-slate-800 rounded-xl rounded-bl-sm">
                  {activeChat.initialMessage}
                </div>
              </div>
            </div>

            <div className="text-center my-4"><span className="bg-gray-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">Chat Started</span></div>
            
            {chatMessages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50"><p className="text-sm font-medium text-slate-500">You can now reply to the student.</p></div>
            )}
            
            {chatMessages.map((msg, index) => {
              
              // 🔥 FIXED LOGIC: Cast everything to String so object IDs don't break the comparison
              const senderId = msg.sender?._id ? String(msg.sender._id) : String(msg.sender);
              const isTeacher = senderId === currentUserId;
              
              // Safely determine which initial to show
              const avatarLetter = isTeacher 
                ? (user?.name ? user.name.charAt(0).toUpperCase() : 'T') 
                : (activeChat.student?.name ? activeChat.student.name.charAt(0).toUpperCase() : 'S');
              
              return (
                <div key={index} className={`flex gap-2 max-w-[85%] ${isTeacher ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mt-auto ${isTeacher ? 'bg-[#004c54]' : 'bg-slate-500'}`}>
                    {avatarLetter}
                  </div>
                  <div className={`flex flex-col ${isTeacher ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 text-[15px] shadow-sm leading-relaxed ${isTeacher ? 'bg-[#004c54] text-white rounded-xl rounded-br-sm' : 'bg-white border border-gray-200 text-slate-800 rounded-xl rounded-bl-sm'}`}>
                      {msg.content}
                    </div>
                    <span className={`text-[10px] font-medium text-gray-400 mt-1 mx-1 ${isTeacher ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-end gap-3 z-10">
            <div className="flex-1 relative">
              <input type="text" placeholder="Type your reply..." className="w-full bg-gray-50 border border-gray-200 px-5 py-3.5 rounded-full outline-none focus:border-[#004c54] focus:bg-white focus:ring-4 focus:ring-[#004c54]/10 text-sm transition-all pr-12" value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} />
            </div>
            <button type="submit" disabled={!newMessageText.trim()} className="p-3.5 bg-[#004c54] text-white rounded-full hover:bg-[#003339] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center shrink-0">
              <FaPaperPlane size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default TeacherChat;