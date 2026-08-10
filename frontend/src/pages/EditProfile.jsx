import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaCamera } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bdate: '',
    education: '',
    address: ''
  });
  
  const [previewUrl, setPreviewUrl] = useState('');

  // Load current user data on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    setUser(storedUser);
    setFormData({
      name: storedUser.name || '',
      email: storedUser.email || '',
      phone: storedUser.phone || '',
      bdate: storedUser.bdate || '',
      education: storedUser.education || '',
      address: storedUser.address || ''
    });
    
    if (storedUser.profilePic) {
      setPreviewUrl(storedUser.profilePic);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 FIXED: Convert selected file to a permanent Base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is a Base64 string that can be safely stored in localStorage
        setPreviewUrl(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = { 
        ...user, 
        name: formData.name, 
        phone: formData.phone, 
        bdate: formData.bdate,
        education: formData.education,
        address: formData.address,
        // Since previewUrl is now a Base64 string (if they uploaded something) or the old URL, 
        // it will survive page navigation!
        profilePic: previewUrl 
      };
      
      // Save updated data to local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully!");
      
      // Route back to the correct dashboard after a short delay
      setTimeout(() => {
         const returnPath = user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
         navigate(returnPath);
      }, 1500);

    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    const returnPath = user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
    navigate(returnPath);
  };

  return (
    <div className="min-h-screen bg-[#f4f9f7] font-sans text-slate-800 flex flex-col">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-[#0d735e] text-white px-6 py-4 flex items-center shadow-md sticky top-0 z-50">
        <button onClick={goBack} className="p-2 hover:bg-white/20 rounded-full transition-colors mr-4">
          <FaArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight">Edit Profile</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-10 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Cover Photo Banner */}
          <div className="h-32 w-full bg-gradient-to-r from-[#0d735e] to-[#10b981]"></div>
          
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            
            {/* Avatar Upload Section */}
            <div className="relative -mt-16 mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-1.5 shadow-lg">
                  <div className="w-full h-full bg-[#0b5e4d] rounded-full overflow-hidden flex items-center justify-center border-2 border-dashed border-[#0d735e]">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#b2dfdb] font-extrabold text-5xl">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
                      </span>
                    )}
                  </div>
                </div>
                <label className="absolute bottom-1 right-1 bg-[#0d735e] text-white p-2.5 rounded-full cursor-pointer shadow-md hover:bg-[#0a5c4a] transition-transform hover:scale-110 border-2 border-white">
                  <FaCamera size={14} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Row 1 */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#0d735e]/20 focus:border-[#0d735e] transition-all" value={formData.name} onChange={handleInputChange} />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address (Read Only)</label>
                  <input type="email" name="email" disabled className="w-full bg-gray-100 border border-gray-200 text-gray-500 px-4 py-3 rounded-xl outline-none cursor-not-allowed" value={formData.email} />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input type="text" name="phone" placeholder="+1 234 567 8900" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#0d735e]/20 focus:border-[#0d735e] transition-all" value={formData.phone} onChange={handleInputChange} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                  <input type="date" name="bdate" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#0d735e]/20 focus:border-[#0d735e] transition-all text-slate-700" value={formData.bdate} onChange={handleInputChange} />
                </div>

                {/* Row 3 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Latest Education</label>
                  <input type="text" name="education" placeholder="e.g., B.Tech in Computer Science" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#0d735e]/20 focus:border-[#0d735e] transition-all" value={formData.education} onChange={handleInputChange} />
                </div>

                {/* Row 4 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
                  <input type="text" name="address" placeholder="123 Main Street, City, Country" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#0d735e]/20 focus:border-[#0d735e] transition-all" value={formData.address} onChange={handleInputChange} />
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button type="button" onClick={goBack} className="px-6 py-3 font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="px-8 py-3 font-bold text-white bg-[#0d735e] hover:bg-[#0a5c4a] rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;