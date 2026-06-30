import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '@/config';
import { Rocket } from 'lucide-react';

const CreateTeam = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', problemStatement: '', solution: '', targetCustomer: '', stage: 'Idea', logoUrl: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create team');

      // Redirect to new team dashboard
      navigate(`/teams/dashboard/${data._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center py-12 px-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-8 max-w-2xl w-full">
        {/* Terminal Header */}
        <div className="border-b border-[#27272A] pb-6 mb-6">
          <div className="flex items-center space-x-2 mb-2 font-mono text-[9px] text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>SYS_INIT // SECURE_INTAKE_SESSION</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Start Your Journey</h2>
          <p className="font-mono text-[10px] uppercase text-zinc-500 mt-1">CampusLaunch // Venture Initialization Parameters</p>
        </div>
        
        {error && (
          <div className="border border-red-500/30 bg-red-950/20 text-red-400 p-4 font-mono text-xs rounded-sm mb-6">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Startup Name</label>
              <input 
                type="text" 
                name="name" 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 bg-[#09090B] border border-[#27272A] text-white rounded-sm focus:border-[#2563EB] focus:ring-0 focus:outline-none transition-colors" 
                placeholder="e.g. NextGen AI" 
              />
            </div>
            
            <div className="col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Problem Statement</label>
              <textarea 
                name="problemStatement" 
                onChange={handleChange} 
                required 
                rows="3" 
                className="w-full px-4 py-2 bg-[#09090B] border border-[#27272A] text-white rounded-sm focus:border-[#2563EB] focus:ring-0 focus:outline-none transition-colors" 
                placeholder="What problem are you solving?"
              ></textarea>
            </div>

            <div className="col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Your Solution</label>
              <textarea 
                name="solution" 
                onChange={handleChange} 
                required 
                rows="3" 
                className="w-full px-4 py-2 bg-[#09090B] border border-[#27272A] text-white rounded-sm focus:border-[#2563EB] focus:ring-0 focus:outline-none transition-colors" 
                placeholder="How does your startup solve it?"
              ></textarea>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Target Customer</label>
              <input 
                type="text" 
                name="targetCustomer" 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 bg-[#09090B] border border-[#27272A] text-white rounded-sm focus:border-[#2563EB] focus:ring-0 focus:outline-none transition-colors" 
                placeholder="e.g. College Students" 
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Current Stage</label>
              <select 
                name="stage" 
                onChange={handleChange} 
                className="w-full px-4 py-2 bg-[#09090B] border border-[#27272A] text-white rounded-sm focus:border-[#2563EB] focus:ring-0 focus:outline-none transition-colors"
              >
                <option value="Idea">Just an Idea</option>
                <option value="Testing">Testing</option>
                <option value="Building MVP">Building MVP</option>
                <option value="Growing">Growing</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-mono text-xs uppercase tracking-widest py-3 px-4 rounded-sm transition duration-150"
            >
              Create Team workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
