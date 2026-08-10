import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap, FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const userRole = data.user.role;
        if (userRole === 'admin') navigate('/admin-dashboard');
        else if (userRole === 'teacher') navigate('/teacher-dashboard');
        else navigate('/student-dashboard');
      } else {
        setError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError('');
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google', {
          access_token: tokenResponse.access_token
        });
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const userRole = res.data.user.role;
        if (userRole === 'admin') navigate('/admin-dashboard');
        else if (userRole === 'teacher') navigate('/teacher-dashboard');
        else navigate('/student-dashboard');

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Google Authentication failed.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google Login was canceled or failed.');
    }
  });

  return (
    <div className="min-h-screen w-full flex font-sans bg-white selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* LEFT SIDE: VISUAL / BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between bg-[#0B0F19] overflow-hidden p-12">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter hover:opacity-80 transition-opacity w-fit">
            <FaGraduationCap size={28} className="text-indigo-400" />
            <span>Smart<span className="text-indigo-400">Edu</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md mt-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
            Welcome back to your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              learning hub.
            </span>
          </h1>
          <p className="text-slate-400 font-medium leading-relaxed text-lg">
            Log in to continue accessing your virtual classrooms, assignments, and AI-powered study tools.
          </p>
        </div>

        <div className="relative z-10 w-full h-48 mt-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-6 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <div className="w-4 h-4 bg-indigo-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="w-24 h-2.5 bg-white/20 rounded-full mb-2"></div>
              <div className="w-16 h-2 bg-white/10 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-3 bg-white/10 rounded-full"></div>
            <div className="w-3/4 h-3 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-[420px]">
          
          <div className="lg:hidden flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter mb-10 justify-center">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FaGraduationCap size={22} />
            </div>
            <span>Smart<span className="text-indigo-600">Edu</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Log in</h2>
            <p className="text-slate-500 font-medium text-sm">Enter your credentials to access your account.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl flex items-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                {/* 🔥 THIS IS THE FIXED LINK 🔥 */}
                <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative group">
                <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-12 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 transform -translate-y-1/2 right-4 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none">
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={`w-full group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
              {!isLoading && <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-400 font-medium">Or continue with</span></div>
            </div>
            <button onClick={() => handleGoogleAuth()} type="button" className="mt-8 w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-3.5 rounded-xl transition-all shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="mt-8 text-center text-slate-500 font-medium text-sm">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Create an account</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;