import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaGraduationCap, FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const { resetToken } = useParams(); // Grabs the token from the URL!
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    if (e.target.name === 'password') setPasswordError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Frontend Regex Validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/auth/resetpassword/${resetToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password })
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessage('Password successfully reset! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000); // Send them to login after 3 seconds
      } else {
        setError(data.message || 'Invalid or expired token.');
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
            Secure your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              account.
            </span>
          </h1>
          <p className="text-slate-400 font-medium leading-relaxed text-lg">
            Create a strong, new password to get back to your learning dashboard.
          </p>
        </div>
        <div></div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-[420px]">
          
          <div className="lg:hidden flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter mb-10 justify-center">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaGraduationCap size={22} /></div>
            <span>Smart<span className="text-indigo-600">Edu</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create New Password</h2>
            <p className="text-slate-500 font-medium text-sm">Please type your new password below.</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl flex items-center animate-fade-in">{error}</div>}
          {message && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-xl flex items-center gap-2 animate-fade-in"><FaCheckCircle size={18} /> {message}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative group">
                <FaLock className={`absolute top-1/2 transform -translate-y-1/2 left-4 transition-colors ${passwordError ? 'text-red-500' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                <input 
                  type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required maxLength={8}
                  className={`w-full pl-11 pr-12 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:ring-4 transition-all font-medium text-sm ${passwordError ? 'bg-red-50 border border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/10'}`} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 transform -translate-y-1/2 right-4 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none">
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              <p className={`text-[11px] font-bold ml-1 mt-1 transition-colors duration-300 ${passwordError ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                Must be exactly 8 characters containing both letters and numbers.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required maxLength={8}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm" 
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading || message !== ''} className={`w-full group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all mt-4 ${isLoading || message !== '' ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;