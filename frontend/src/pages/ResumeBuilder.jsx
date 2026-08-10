import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaPlus, FaTrash, FaBriefcase, FaGraduationCap, FaUserAlt } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // --- RESUME STATE ---
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    location: 'Mumbai, India',
    linkedin: 'linkedin.com/in/johndoe',
    portfolio: 'github.com/johndoe',
    summary: 'A highly motivated software engineering student with a passion for building scalable web applications. Eager to contribute to innovative projects and continuously learn new technologies.'
  });

  const [experience, setExperience] = useState([
    { id: 1, title: 'Web Developer Intern', company: 'Tech Solutions Inc.', dates: 'June 2025 - Present', description: 'Developed interactive UI components using React.js and improved website load speeds by 20%.' }
  ]);

  const [education, setEducation] = useState([
    { id: 1, degree: 'B.Tech in Computer Science', institution: 'Smart Edu University', dates: '2022 - 2026', details: 'CGPA: 8.5/10. Core courses: Data Structures, Algorithms, Full Stack Web Development.' }
  ]);

  const [skills, setSkills] = useState('JavaScript, React.js, Node.js, Express, MongoDB, Python, Git & GitHub');

  // --- HANDLERS ---
  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const updateArrayItem = (setter, stateArray, id, field, value) => {
    setter(stateArray.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addArrayItem = (setter, stateArray, defaultItem) => {
    setter([...stateArray, { id: Date.now(), ...defaultItem }]);
  };

  const removeArrayItem = (setter, stateArray, id) => {
    setter(stateArray.filter(item => item.id !== id));
  };

  // 🔥 NEW DIRECT PDF DOWNLOAD LOGIC
  const handleDownloadPDF = async () => {
    const resumeElement = document.getElementById('resume-preview-container');
    if (!resumeElement) return;

    setIsDownloading(true);

    try {
      // 1. Take a high-quality screenshot of the Resume Div
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Increases quality
        useCORS: true,
        backgroundColor: '#ffffff' // Forces white background
      });

      // 2. Convert to Image
      const imgData = canvas.toDataURL('image/png');

      // 3. Setup PDF document (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // 4. Add Image to PDF and trigger direct browser download
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = personalInfo.fullName ? `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf` : 'My_Resume.pdf';
      pdf.save(fileName);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f9f7] font-sans text-slate-800 pb-10">
      
      {/* HEADER */}
      <div className="bg-[#0d735e] text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/student-dashboard')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-extrabold flex items-center gap-2"><FaUserAlt /> Smart Edu Resume Builder</h1>
        </div>
        <button 
          onClick={handleDownloadPDF} 
          disabled={isDownloading}
          className="bg-white text-[#0d735e] px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          <FaDownload /> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* ========================================== */}
        {/* 📝 LEFT PANEL: THE EDITOR */}
        {/* ========================================== */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-6 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
          
          {/* PERSONAL INFO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#0a5c4a] mb-4 flex items-center gap-2"><FaUserAlt /> Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="fullName" placeholder="Full Name" className="border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e]" value={personalInfo.fullName} onChange={handlePersonalInfoChange} />
              <input type="text" name="location" placeholder="Location (City, Country)" className="border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e]" value={personalInfo.location} onChange={handlePersonalInfoChange} />
              <input type="email" name="email" placeholder="Email Address" className="border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e]" value={personalInfo.email} onChange={handlePersonalInfoChange} />
              <input type="text" name="phone" placeholder="Phone Number" className="border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e]" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
              <input type="text" name="linkedin" placeholder="LinkedIn URL" className="border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e]" value={personalInfo.linkedin} onChange={handlePersonalInfoChange} />
              <input type="text" name="portfolio" placeholder="Portfolio/GitHub URL" className="border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e]" value={personalInfo.portfolio} onChange={handlePersonalInfoChange} />
              <textarea name="summary" placeholder="Professional Summary" rows="3" className="border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e] md:col-span-2 resize-none" value={personalInfo.summary} onChange={handlePersonalInfoChange}></textarea>
            </div>
          </div>

          {/* EXPERIENCE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0a5c4a] flex items-center gap-2"><FaBriefcase /> Experience</h3>
              <button onClick={() => addArrayItem(setExperience, experience, { title: '', company: '', dates: '', description: '' })} className="text-sm bg-[#e6f4f1] text-[#0d735e] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#b2dfdb]"><FaPlus /> Add</button>
            </div>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                <button onClick={() => removeArrayItem(setExperience, experience, exp.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><FaTrash /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 pr-8">
                  <input type="text" placeholder="Job Title" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e]" value={exp.title} onChange={(e) => updateArrayItem(setExperience, experience, exp.id, 'title', e.target.value)} />
                  <input type="text" placeholder="Company Name" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e]" value={exp.company} onChange={(e) => updateArrayItem(setExperience, experience, exp.id, 'company', e.target.value)} />
                  <input type="text" placeholder="Dates (e.g. Jan 2023 - Present)" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e] md:col-span-2" value={exp.dates} onChange={(e) => updateArrayItem(setExperience, experience, exp.id, 'dates', e.target.value)} />
                  <textarea placeholder="Description of your role and achievements..." rows="2" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e] md:col-span-2 resize-none" value={exp.description} onChange={(e) => updateArrayItem(setExperience, experience, exp.id, 'description', e.target.value)}></textarea>
                </div>
              </div>
            ))}
          </div>

          {/* EDUCATION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0a5c4a] flex items-center gap-2"><FaGraduationCap /> Education</h3>
              <button onClick={() => addArrayItem(setEducation, education, { degree: '', institution: '', dates: '', details: '' })} className="text-sm bg-[#e6f4f1] text-[#0d735e] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#b2dfdb]"><FaPlus /> Add</button>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                <button onClick={() => removeArrayItem(setEducation, education, edu.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><FaTrash /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 pr-8">
                  <input type="text" placeholder="Degree / Course" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e]" value={edu.degree} onChange={(e) => updateArrayItem(setEducation, education, edu.id, 'degree', e.target.value)} />
                  <input type="text" placeholder="School / University" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e]" value={edu.institution} onChange={(e) => updateArrayItem(setEducation, education, edu.id, 'institution', e.target.value)} />
                  <input type="text" placeholder="Dates (e.g. 2022 - 2026)" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e] md:col-span-2" value={edu.dates} onChange={(e) => updateArrayItem(setEducation, education, edu.id, 'dates', e.target.value)} />
                  <textarea placeholder="GPA, Coursework, etc..." rows="2" className="border border-gray-200 p-2.5 rounded-lg outline-none focus:border-[#0d735e] md:col-span-2 resize-none" value={edu.details} onChange={(e) => updateArrayItem(setEducation, education, edu.id, 'details', e.target.value)}></textarea>
                </div>
              </div>
            ))}
          </div>

          {/* SKILLS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#0a5c4a] mb-4">Technical Skills</h3>
            <textarea placeholder="React, Node.js, Python, Marketing, Figma..." rows="2" className="w-full border border-gray-200 p-3 rounded-lg outline-none focus:border-[#0d735e] resize-none" value={skills} onChange={(e) => setSkills(e.target.value)}></textarea>
          </div>

        </div>

        {/* ========================================== */}
        {/* 📄 RIGHT PANEL: THE LIVE A4 PREVIEW */}
        {/* ========================================== */}
        <div className="w-full lg:w-[55%] xl:w-[60%] flex justify-center overflow-x-auto pb-8">
          
          {/* THE ACTUAL A4 PAPER CONTAINER */}
          <div 
            id="resume-preview-container" 
            className="bg-white shadow-2xl overflow-hidden shrink-0"
            // Strict A4 dimensions for perfect PDF scaling
            style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }} 
          >
            {/* RESUME HEADER */}
            <div className="border-b-2 border-[#0d735e] pb-4 mb-5 text-center">
              <h1 className="text-4xl font-serif font-bold text-slate-900 uppercase tracking-widest">{personalInfo.fullName || 'YOUR NAME'}</h1>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                {personalInfo.location && <span>• {personalInfo.location}</span>}
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-sm text-[#0d735e] font-medium">
                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
              </div>
            </div>

            {/* SUMMARY */}
            {personalInfo.summary && (
              <div className="mb-5">
                <p className="text-sm text-slate-800 leading-relaxed text-justify">{personalInfo.summary}</p>
              </div>
            )}

            {/* EXPERIENCE */}
            {experience.length > 0 && experience.some(exp => exp.title || exp.company) && (
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#0a5c4a] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Experience</h2>
                {experience.map(exp => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900">{exp.title}</h3>
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">{exp.dates}</span>
                    </div>
                    <div className="text-sm text-[#0d735e] font-medium mb-1">{exp.company}</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {education.length > 0 && education.some(edu => edu.degree || edu.institution) && (
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#0a5c4a] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">{edu.dates}</span>
                    </div>
                    <div className="text-sm text-[#0d735e] font-medium mb-1">{edu.institution}</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{edu.details}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS */}
            {skills && (
              <div>
                <h2 className="text-lg font-bold text-[#0a5c4a] border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Skills</h2>
                <p className="text-sm text-slate-800 leading-relaxed">{skills}</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;