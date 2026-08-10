import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { FaArrowLeft, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'; 
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

const LiveClass = () => {
  const { roomId } = useParams();
  const containerRef = useRef(null);
  const zpRef = useRef(null);

  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || "Guest";
  const userId = user._id || Math.floor(Math.random() * 10000).toString();
  const isTeacher = user.role === 'teacher' || user.role === 'admin';

  useEffect(() => {
    if (!containerRef.current) return;

    // 🔥 If Teacher, tell the server the class is officially open
    if (isTeacher) {
      socket.emit("start_live_class", { roomId: roomId, className: roomId.replace('-live', '') });
    }

    // 🔥 If Student, listen for the teacher ending the class
    if (!isTeacher) {
      socket.on("force_end_class", (endedRoomId) => {
        if (endedRoomId === roomId) {
          // Replaced native alert() with our custom modal!
          setShowAlertModal(true);
        }
      });
    }

    const appID = 2113817755; 
    const serverSecret = "b0c53b2be86d0ac1badb28e90e426f20"; 
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, userId, userName);
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      turnOnMicrophoneWhenJoining: isTeacher,
      turnOnCameraWhenJoining: isTeacher,
      showScreenSharingButton: isTeacher,
      showRemoveUserButton: isTeacher,
      onLeaveRoom: () => {
        // 🔥 If teacher clicks the red hang up button, kill the class
        if (isTeacher) socket.emit("end_live_class", roomId);
        window.location.href = isTeacher ? '/teacher-dashboard' : '/student-dashboard';
      }
    });

    return () => {
      if (zpRef.current) zpRef.current.destroy();
      socket.off("force_end_class");
    };
  }, [roomId, isTeacher, userName, userId]);

  // Triggers the modal instead of window.confirm()
  const handleGoBackClick = () => {
    setShowConfirmModal(true);
  };

  // Executes the actual leave/end logic
  const executeLeaveRoom = () => {
    if (isTeacher) socket.emit("end_live_class", roomId);
    if (zpRef.current) zpRef.current.destroy(); 
    window.location.href = isTeacher ? '/teacher-dashboard' : '/student-dashboard';
  };

  return (
    <div className="w-full h-screen bg-[#111111] flex flex-col relative">
      
      {/* Top Navigation Bar */}
      <div className="p-4 bg-[#004c54] text-white font-bold flex justify-between items-center shadow-md z-10 relative">
        <div className="flex items-center gap-4">
          <button onClick={handleGoBackClick} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center">
            <FaArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span>Live Class Session</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isTeacher && <span className="bg-amber-400 text-amber-900 text-[10px] uppercase font-black px-2 py-0.5 rounded-sm">HOST</span>}
          <span className="text-sm font-medium bg-[#0a7c71] px-4 py-1.5 rounded-full border border-[#004c54]">{userName}</span>
        </div>
      </div>
      
      {/* Video Container */}
      <div ref={containerRef} className="flex-1 w-full h-full" />

      {/* ========================================== */}
      {/* 🛑 CUSTOM CONFIRMATION MODAL (Replaces window.confirm) */}
      {/* ========================================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaExclamationTriangle size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              {isTeacher ? "End Live Class?" : "Leave Class?"}
            </h3>
            <p className="text-slate-600 font-medium mb-8">
              {isTeacher 
                ? "Are you sure you want to end this live session for everyone?" 
                : "Are you sure you want to leave the live class? The session will continue without you."}
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="px-6 py-3 font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full"
              >
                Cancel
              </button>
              <button 
                onClick={executeLeaveRoom} 
                className="px-6 py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-full shadow-md hover:shadow-lg"
              >
                {isTeacher ? "End Class" : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ℹ️ CUSTOM ALERT MODAL (Replaces alert)      */}
      {/* ========================================== */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaInfoCircle size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Class Ended</h3>
            <p className="text-slate-600 font-medium mb-8">
              The instructor has ended this live video session for everyone.
            </p>
            <button 
              onClick={executeLeaveRoom} 
              className="px-6 py-3 font-bold text-white bg-[#004c54] hover:bg-[#003339] rounded-lg transition-colors w-full shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LiveClass;