import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '@/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const inputCls = "w-full bg-[#09090B] border border-[#27272A] rounded-sm px-3 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#2563EB] transition-colors";
const labelCls = "block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";
const selectCls = "w-full bg-[#09090B] border border-[#27272A] rounded-sm px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-[#2563EB] transition-colors";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    university: '',
    skills: '',
    lookingFor: '',
    hoursPerWeek: '',
    workStyle: '',
    ideaStage: '',
    adminSecret: '',
    jobDetails: '',
    expertise: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let idToken;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        idToken = await userCredential.user.getIdToken();
      } catch (fbErr) {
        console.warn('Firebase registration failed, trying fallback:', fbErr.message);
      }

      const payload = { ...formData };
      if (formData.role === 'Student') {
        payload.skills = formData.skills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        payload.lookingFor = formData.lookingFor
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        if (formData.hoursPerWeek) payload.hoursPerWeek = Number(formData.hoursPerWeek);
        if (formData.workStyle) payload.workStyle = formData.workStyle;
        if (formData.ideaStage) payload.ideaStage = formData.ideaStage;
      } else if (formData.role === 'Mentor') {
        payload.expertise = formData.expertise
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        // Ensure jobDetails is sent
        payload.jobDetails = formData.jobDetails;
      } else {
        delete payload.skills;
        delete payload.lookingFor;
        delete payload.jobDetails;
        delete payload.expertise;
      }

      const headers = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      login(data.token || idToken);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              New Account
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100" style={OUTFIT}>
            Create an Account
          </h1>
          <p className="text-zinc-500 text-sm mt-1" style={MONO}>
            Join the campus startup ecosystem
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6">
          {error && (
            <div className="bg-red-950/40 border border-red-800/60 text-red-400 px-3 py-2 rounded-sm mb-5 text-xs" style={MONO}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls} style={MONO}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} style={MONO} placeholder="Your full name" required />
            </div>
            <div>
              <label className={labelCls} style={MONO}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} style={MONO} placeholder="you@university.edu" required />
            </div>
            <div>
              <label className={labelCls} style={MONO}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputCls} style={MONO} placeholder="••••••••" required />
            </div>
            <div>
              <label className={labelCls} style={MONO}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className={selectCls} style={MONO}>
                <option value="Student">Student</option>
                <option value="Mentor">Mentor</option>
                <option value="Organizer">Organizer</option>
              </select>
            </div>

            {formData.role === 'Student' && (
              <>
                {/* Divider */}
                <div className="border-t border-[#27272A] pt-3">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold" style={MONO}>Student Details</span>
                </div>
                <div>
                  <label className={labelCls} style={MONO}>University</label>
                  <input type="text" name="university" value={formData.university} onChange={handleChange} className={inputCls} style={MONO} placeholder="e.g. BUET, NSU, DU" required />
                </div>
                <div>
                  <label className={labelCls} style={MONO}>Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className={inputCls}
                    style={MONO}
                    placeholder="React, Node.js, UI Design"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} style={MONO}>Interests (comma separated)</label>
                  <input
                    type="text"
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleChange}
                    className={inputCls}
                    style={MONO}
                    placeholder="AI, FinTech, Sustainability"
                    required
                  />
                </div>
                {/* Multi-dimensional matching fields */}
                <div>
                  <label className={labelCls} style={MONO}>Hours Available Per Week</label>
                  <select
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleChange}
                    className={selectCls}
                    style={MONO}
                    required
                  >
                    <option value="">Select availability</option>
                    <option value="5">~5 hrs/week (side project)</option>
                    <option value="10">~10 hrs/week (part-time)</option>
                    <option value="20">~20 hrs/week (serious)</option>
                    <option value="40">~40 hrs/week (full-time)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={MONO}>Work Style Preference</label>
                  <select
                    name="workStyle"
                    value={formData.workStyle}
                    onChange={handleChange}
                    className={selectCls}
                    style={MONO}
                    required
                  >
                    <option value="">Select preference</option>
                    <option value="remote">Online (Remote)</option>
                    <option value="in-person">Offline (In-Person)</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={MONO}>Startup Idea Stage</label>
                  <select
                    name="ideaStage"
                    value={formData.ideaStage}
                    onChange={handleChange}
                    className={selectCls}
                    style={MONO}
                  >
                    <option value="">Select stage</option>
                    <option value="idea">Idea — just brainstorming</option>
                    <option value="prototype">Prototype — building a demo</option>
                    <option value="mvp">MVP — first real product</option>
                    <option value="growth">Growth — users &amp; traction</option>
                  </select>
                </div>
              </>
            )}

            {formData.role === 'Mentor' && (
              <>
                <div className="border-t border-[#27272A] pt-3">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold" style={MONO}>Mentor Details</span>
                </div>
                <div>
                  <label className={labelCls} style={MONO}>Job Details (Title / Company)</label>
                  <input
                    type="text"
                    name="jobDetails"
                    value={formData.jobDetails}
                    onChange={handleChange}
                    className={inputCls}
                    style={MONO}
                    placeholder="Senior Developer at Google"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} style={MONO}>Expertise (comma separated)</label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    className={inputCls}
                    style={MONO}
                    placeholder="tech, marketing, fundraising"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white font-semibold py-2.5 px-4 rounded-sm text-sm uppercase tracking-widest hover:bg-blue-500 transition-colors mt-2"
              style={MONO}
            >
              Create Account
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500" style={MONO}>
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563EB] hover:text-blue-400 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
