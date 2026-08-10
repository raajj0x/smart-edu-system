import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // 🔥 IMPORTED FRAMER MOTION FOR SCROLL EFFECTS
import { 
  FaGraduationCap, 
  FaRobot,
  FaChalkboardTeacher,
  FaFileAlt,
  FaArrowRight,
  FaVideo,
  FaBrain,
  FaMagic, 
  FaStar,
  FaEnvelope, 
  FaPhoneAlt, 
  FaInstagram,
  FaCheckCircle
} from 'react-icons/fa';

const Home = () => {
  // Animation variants for scrolling
  const slideLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const slideRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans text-slate-900 selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden relative flex flex-col">
      
      {/* 🌌 ULTRA-PREMIUM BACKGROUND 🌌 */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-cyan-300/20 blur-[120px] z-0 pointer-events-none animate-pulse"></div>
      <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-500/10 blur-[100px] z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-emerald-400/10 blur-[100px] z-0 pointer-events-none"></div>

      {/* 💎 GLASSMORPHISM NAVBAR 💎 */}
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0d735e] to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <FaGraduationCap size={20} />
            </div>
            <span>Smart<span className="text-[#0d735e]">Edu</span></span>
          </div>
          
          <div className="flex gap-3 md:gap-6 items-center">
            <Link to="/login" className="font-bold text-slate-600 hover:text-[#0d735e] transition-colors text-sm md:text-base px-2">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 md:px-7 md:py-3 bg-slate-900 text-white font-bold text-sm md:text-base rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-300 border border-slate-700">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION (Kept Exactly the Same!) 🚀 */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-32 flex flex-col lg:flex-row items-center justify-between relative z-10 w-full gap-16">
        <div className="w-full lg:w-[55%] text-center lg:text-left flex flex-col items-center lg:items-start animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-black text-slate-700 uppercase tracking-widest">
            <FaMagic className="text-amber-500" /> SmartEdu 2.0 is Live
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black text-slate-900 leading-[1.05] tracking-tighter mb-6">
            Education, <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d735e] via-emerald-500 to-cyan-500">
              Engineered for you.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-lg mb-10 leading-relaxed">
            The all-in-one platform combining live virtual classrooms, intelligent resume generation, and a 24/7 AI-powered tutor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-[#0d735e] to-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-3 text-lg border border-emerald-400/30">
              Start Learning Now <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-[45%] relative h-[400px] sm:h-[500px] flex justify-center items-center">
          <div className="absolute w-[90%] max-w-[400px] h-[300px] bg-white/90 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-20 transform -rotate-2 hover:rotate-0 transition-transform duration-700">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-emerald-400"></div></div>
              <div className="h-4 w-32 bg-slate-100 rounded-md mx-auto"></div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="w-1/3 h-20 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-center items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-200"></div><div className="w-12 h-2 bg-emerald-200 rounded-full"></div></div>
              <div className="w-1/3 h-20 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col justify-center items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-200"></div><div className="w-12 h-2 bg-blue-200 rounded-full"></div></div>
              <div className="w-1/3 h-20 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col justify-center items-center gap-2"><div className="w-6 h-6 rounded-full bg-indigo-200"></div><div className="w-12 h-2 bg-indigo-200 rounded-full"></div></div>
            </div>
            <div className="w-full h-16 bg-slate-50 rounded-xl border border-slate-100 mb-3"></div><div className="w-full h-16 bg-slate-50 rounded-xl border border-slate-100"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 lg:-left-12 w-[220px] bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700 z-30 animate-[bounce_6s_infinite]">
            <div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white"><FaRobot size={14} /></div><p className="text-white text-xs font-bold">Gemini Tutor</p></div>
            <div className="w-full h-8 bg-slate-800 rounded-lg rounded-tl-none mb-2"></div><div className="w-3/4 h-8 bg-indigo-600 rounded-lg rounded-tr-none ml-auto"></div>
          </div>
          <div className="absolute -top-6 -right-6 lg:-right-8 w-[180px] bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white z-30 animate-[bounce_7s_infinite_reverse]">
            <div className="w-full h-20 bg-slate-900 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center"><FaVideo className="text-slate-600 text-2xl" /><div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase"><span className="w-1 h-1 bg-white rounded-full animate-pulse"></span> Live</div></div>
            <div className="h-3 w-20 bg-slate-200 rounded-full mb-2"></div><div className="h-2 w-12 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </main>

      {/* 🏆 STATS BANNER 🏆 */}
      <div className="w-full border-y border-slate-200 bg-white/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/50">
          <div className="flex flex-col items-center justify-center"><h4 className="text-3xl md:text-4xl font-black text-slate-900">98%</h4><p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">Completion Rate</p></div>
          <div className="flex flex-col items-center justify-center"><h4 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-1">24<span className="text-[#0d735e]">/</span>7</h4><p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">AI Availability</p></div>
          <div className="flex flex-col items-center justify-center"><h4 className="text-3xl md:text-4xl font-black text-slate-900">10k+</h4><p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">Active Students</p></div>
          <div className="flex flex-col items-center justify-center"><h4 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center"><FaStar className="text-amber-400 mr-2"/> 4.9</h4><p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">Average Rating</p></div>
        </div>
      </div>

      {/* ✨ ALTERNATING SCROLL FEATURES SECTION ✨ */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-32 w-full space-y-32 md:space-y-48">
        
        {/* Feature 1: Text Left, Visual Right */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={slideLeft}
            className="w-full md:w-1/2 space-y-6"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-200 mb-6">
              <FaChalkboardTeacher size={24} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Interactive Live Classrooms</h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Join high-fidelity live streams with native attendance tracking. Collaborate with your peers and instructors in real-time. Missing a class? Everything is automatically recorded, organized, and vaulted for you to review anytime.
            </p>
            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-emerald-500" /> HD Video Streaming</li>
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-emerald-500" /> Automated Attendance</li>
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-emerald-500" /> Instant Cloud Recordings</li>
            </ul>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={slideRight}
            className="w-full md:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-emerald-400/20 blur-[80px] rounded-full"></div>
            <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-slate-200">
              <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center">
                <FaVideo className="text-slate-700 text-5xl" />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-bold">Professor Smith is speaking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 2: Visual Left, Text Right */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={slideLeft}
            className="w-full md:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full"></div>
            <div className="relative bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-700 h-[350px] flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <FaRobot className="text-indigo-400 text-2xl" />
                <h3 className="text-white font-bold text-lg">Gemini Neural Tutor</h3>
              </div>
              <div className="space-y-4 flex-1">
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none w-[80%] border border-slate-700">
                  <p className="text-slate-300 text-sm leading-relaxed font-mono">How do I calculate the derivative of x²?</p>
                </div>
                <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none w-[85%] ml-auto border border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  <p className="text-white text-sm leading-relaxed font-mono">Using the power rule, bring the exponent down and subtract one: d/dx(x²) = 2x.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={slideRight}
            className="w-full md:w-1/2 space-y-6"
          >
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner border border-indigo-200 mb-6">
              <FaBrain size={24} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">24/7 AI Neural Tutor</h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Stuck on a complex equation at 2 AM? Our integrated Gemini-powered AI assistant is always awake. Get instant, step-by-step breakdowns of difficult concepts without ever leaving your dashboard.
            </p>
            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-indigo-500" /> Powered by Google Gemini</li>
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-indigo-500" /> Context-Aware Responses</li>
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-indigo-500" /> Zero Judgment Learning</li>
            </ul>
          </motion.div>
        </div>

        {/* Feature 3: Text Left, Visual Right */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={slideLeft}
            className="w-full md:w-1/2 space-y-6"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner border border-blue-200 mb-6">
              <FaFileAlt size={24} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Automated Resume Forge</h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Turn your coursework into a career. Our platform tracks the skills you acquire and automatically generates beautiful, ATS-friendly resumes so you are always ready for your next big opportunity.
            </p>
            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-blue-500" /> ATS-Optimized Formats</li>
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-blue-500" /> Auto-Skill Syncing</li>
              <li className="flex items-center gap-3 text-slate-700 font-bold"><FaCheckCircle className="text-blue-500" /> 1-Click PDF Export</li>
            </ul>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={slideRight}
            className="w-full md:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-blue-400/20 blur-[80px] rounded-full"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-slate-200 h-[350px] overflow-hidden flex flex-col items-center">
              <div className="w-full max-w-[250px] bg-slate-50 border border-slate-200 h-full rounded-t-xl p-4 shadow-sm relative top-10">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4"></div>
                <div className="h-3 w-24 bg-slate-300 rounded-full mx-auto mb-2"></div>
                <div className="h-2 w-32 bg-slate-200 rounded-full mx-auto mb-6"></div>
                
                <div className="h-2 w-full bg-slate-200 rounded-full mb-2"></div>
                <div className="h-2 w-full bg-slate-200 rounded-full mb-2"></div>
                <div className="h-2 w-3/4 bg-slate-200 rounded-full mb-6"></div>

                <div className="flex gap-2 mb-2">
                  <div className="px-2 py-1 bg-blue-100 rounded text-[8px] font-bold text-blue-700">React.js</div>
                  <div className="px-2 py-1 bg-blue-100 rounded text-[8px] font-bold text-blue-700">Node.js</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* 🎯 BOTTOM CTA SECTION 🎯 */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
        className="w-full bg-slate-900 relative z-20 overflow-hidden py-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#0d735e]/40 via-slate-900 to-slate-900"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to upgrade your education?</h2>
          <p className="text-xl text-emerald-100/70 mb-10 font-medium">Join thousands of students and teachers building the future of learning.</p>
          <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-black rounded-2xl shadow-2xl hover:bg-emerald-50 hover:scale-105 transition-all duration-300 text-lg">
            Create your free account
          </Link>
        </div>
      </motion.section>

      {/* 🏁 SUPER CUSTOM FOOTER WITH YOUR INFO 🏁 */}
      <footer className="relative z-20 bg-white border-t border-slate-200 pt-16 pb-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Column 1: Brand */}
            <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
              <div className="flex items-center gap-2 text-slate-900 font-black text-3xl tracking-tighter">
                <FaGraduationCap size={28} className="text-[#0d735e]" />
                <span>Smart<span className="text-[#0d735e]">Edu</span></span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                The next generation of educational technology. Engineered to make learning faster, smarter, and more engaging.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              <h4 className="text-slate-900 font-extrabold text-lg mb-2">Platform</h4>
              <Link to="/login" className="text-slate-500 font-bold hover:text-[#0d735e] transition-colors">Log In</Link>
              <Link to="/register" className="text-slate-500 font-bold hover:text-[#0d735e] transition-colors">Sign Up</Link>
              <a href="#features" className="text-slate-500 font-bold hover:text-[#0d735e] transition-colors">Features</a>
            </div>

            {/* Column 3: Contact Info (YOUR INFO) */}
            <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
              <h4 className="text-slate-900 font-extrabold text-lg mb-1">Get in Touch</h4>
              
              <a href="mailto:rbind009@gmail.com" className="flex items-center gap-3 text-slate-600 hover:text-[#0d735e] transition-colors font-bold group">
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-emerald-100 rounded-full flex items-center justify-center transition-colors">
                  <FaEnvelope size={16} className="text-slate-500 group-hover:text-[#0d735e]" />
                </div>
                rbind009@gmail.com
              </a>
              
              <a href="tel:7021410868" className="flex items-center gap-3 text-slate-600 hover:text-[#0d735e] transition-colors font-bold group">
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-emerald-100 rounded-full flex items-center justify-center transition-colors">
                  <FaPhoneAlt size={16} className="text-slate-500 group-hover:text-[#0d735e]" />
                </div>
                7021410868
              </a>
              
              <a href="https://instagram.com/raajj.0x" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-pink-600 transition-colors font-bold group">
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-pink-100 rounded-full flex items-center justify-center transition-colors">
                  <FaInstagram size={18} className="text-slate-500 group-hover:text-pink-600" />
                </div>
                @raajj.0x
              </a>
            </div>
            
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm font-bold text-center md:text-left">
              &copy; {new Date().getFullYear()} Smart Education System. Built by Raaj. All rights reserved.
            </p>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              All Systems Operational
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;