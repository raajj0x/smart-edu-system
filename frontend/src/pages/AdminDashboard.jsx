import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaUserShield, 
  FaUserTie,
  FaTrash, 
  FaSignOutAlt,
  FaGraduationCap,
  FaArrowUp
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

// 🔥 GLOBAL BACKEND URL
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // ==========================================
  // 🔄 FETCH ALL USERS
  // ==========================================
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Failed to fetch users. Are you sure you are an Admin?");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ⬆️ PROMOTE TO TEACHER
  // ==========================================
  const handlePromote = async (id, name) => {
    if (!window.confirm(`Are you sure you want to promote ${name} to Teacher?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/promote/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success(`${name} has been promoted to Teacher!`);
        fetchUsers();
      } else {
        toast.error("Failed to promote user.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // 🗑️ DELETE USER
  // ==========================================
  const handleDelete = async (id, name, role) => {
    if (!window.confirm(`WARNING: Deleting ${name} will also wipe all their ${role === 'teacher' ? 'classes, exams, and videos' : 'results and attendance'}. Proceed?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/user/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success(`User ${name} deleted successfully.`);
        fetchUsers();
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ==========================================
  // 📊 CALCULATE STATS
  // ==========================================
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col md:flex-row font-sans text-slate-800 selection:bg-indigo-200 selection:text-indigo-900">
      <Toaster position="top-center" />

      <div className="md:hidden bg-white p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xl">
          <FaUserShield className="text-indigo-600" />
          <span>Admin Command</span>
        </div>
      </div>

      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
        <div className="p-8 pb-4">
          <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-2xl tracking-tight">
            <FaGraduationCap size={32} className="text-indigo-600" />
            <span>Smart<span className="text-indigo-600">Edu</span></span>
          </Link>
        </div>

        <div className="px-8 py-6 mb-4 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <FaUserShield />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">System Admin</p>
              <p className="text-xs font-medium text-indigo-500">Root Access</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-2 space-y-2">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-gray-50'}`}
          >
            <FaUsers size={18} /> User Management
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-gray-100 hover:text-red-500 transition-colors">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        {activeTab === 'users' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">User Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><FaUsers size={24} /></div>
                  <div>
                    <p className="text-slate-500 font-bold text-sm">Total Students</p>
                    <p className="text-2xl font-extrabold text-slate-900">{totalStudents}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><FaUserTie size={24} /></div>
                  <div>
                    <p className="text-slate-500 font-bold text-sm">Total Teachers</p>
                    <p className="text-2xl font-extrabold text-slate-900">{totalTeachers}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl"><FaUserShield size={24} /></div>
                  <div>
                    <p className="text-slate-500 font-bold text-sm">System Admins</p>
                    <p className="text-2xl font-extrabold text-slate-900">{totalAdmins}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
              {loading ? (
                <div className="p-10 text-center font-bold text-slate-500">Loading network data...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-sm tracking-wide">
                      <tr>
                        <th className="p-5 font-bold border-b border-gray-100">Name</th>
                        <th className="p-5 font-bold border-b border-gray-100">Email</th>
                        <th className="p-5 font-bold border-b border-gray-100">Current Role</th>
                        <th className="p-5 font-bold border-b border-gray-100 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.length === 0 && (
                        <tr><td colSpan="4" className="p-5 text-center text-gray-500">No users found.</td></tr>
                      )}
                      {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-5 font-bold text-slate-800">{user.name}</td>
                          <td className="p-5 text-slate-500 font-medium">{user.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' :
                              user.role === 'teacher' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-5 flex justify-end gap-3">
                            {user.role === 'student' && (
                              <button 
                                onClick={() => handlePromote(user._id, user.name)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                              >
                                <FaArrowUp /> Promote
                              </button>
                            )}
                            {user.email !== 'raj@smartedu.com' && (
                              <button 
                                onClick={() => handleDelete(user._id, user.name, user.role)}
                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                title="Delete User & Data"
                              >
                                <FaTrash />
                              </button>
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
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;