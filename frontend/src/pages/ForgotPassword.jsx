import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaEnvelope, FaArrowRight, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessage('Success! A password reset link has been sent to your email.');
        setEmail(''); // Clear the input
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* LEFT SIDE: VISUAL / BRANDING */}
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
            Forgot your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              password?
            </span>
          </h1>
          <p className="text-slate-400 font-medium leading-relaxed text-lg">
            Don't worry, it happens to the best of us. Enter your email and we'll send you recovery instructions.
          </p>
        </div>
        <div></div> {/* Spacer */}
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-[420px]">
          
          <div className="lg:hidden flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter mb-10 justify-center">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaGraduationCap size={22} /></div>
            <span>Smart<span className="text-indigo-600">Edu</span></span>
          </div>

          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-6"><FaArrowLeft /> Back to login</Link>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Reset Password</h2>
            <p className="text-slate-500 font-medium text-sm">We'll email you instructions to reset your password.</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl flex items-center animate-fade-in">{error}</div>}
          {message && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-xl flex items-center gap-2 animate-fade-in"><FaCheckCircle size={18} /> {message}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" value={email} onChange={(e) => {setEmail(e.target.value); setError('');}} placeholder="you@example.com" required 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm" 
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading || !email} className={`w-full group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all mt-2 ${isLoading || !email ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
              {!isLoading && email && <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;