import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';       
import Register from './pages/Register'; 
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard'; 
import AdminDashboard from './pages/AdminDashboard';     
import LiveClass from './pages/LiveClass'; 
import ResumeBuilder from './pages/ResumeBuilder'; 
import EditProfile from './pages/EditProfile'; 

// 🔥 NEW IMPORTS FOR PASSWORD RESET
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import PageTransition from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* We use location.pathname.split('/')[1] as the key so the whole screen doesn't flip on every single tab change, but DOES flip when changing major pages! */}
      <Routes location={location} key={location.pathname.split('/')[1]}>
        
        {/* 🔥 AUTH ROUTES: Keep the smooth Mac animations for a great first impression */}
        <Route path="/" element={<PageTransition type="mac"><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition type="mac"><Login /></PageTransition>} />       
        <Route path="/register" element={<PageTransition type="mac"><Register /></PageTransition>} /> 
        
        {/* 🔥 NEW PASSWORD RESET ROUTES */}
        <Route path="/forgot-password" element={<PageTransition type="mac"><ForgotPassword /></PageTransition>} /> 
        <Route path="/reset-password/:resetToken" element={<PageTransition type="mac"><ResetPassword /></PageTransition>} /> 
        
        {/* ⚡ DASHBOARD ROUTES: Removed animations so they snap in instantly! */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-dashboard/:tab" element={<StudentDashboard />} />
        
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} /> 
        <Route path="/teacher-dashboard/:tab" element={<TeacherDashboard />} /> 

        <Route path="/admin-dashboard" element={<AdminDashboard />} />     
        
        {/* ⚡ FEATURES: Removed animations for speed */}
        <Route path="/live/:roomId" element={<LiveClass />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        
      </Routes> 
    </AnimatePresence>
  );
};

function App() {
  const GOOGLE_CLIENT_ID = "1039550292983-nu8o733cuijnfafnfio8i4pask3ctj0a.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen font-sans text-slate-800 selection:bg-[#e6f4f1] selection:text-[#0d735e]">
          <AnimatedRoutes />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;