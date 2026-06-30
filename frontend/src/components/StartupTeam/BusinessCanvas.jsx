import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Save } from 'lucide-react';
import { API_BASE_URL } from '@/config';

const Block = ({ title, name, rowSpan, colSpan, extraClasses = '', value, onChange, onBlur }) => (
  <div className={`flex flex-col bg-[#18181B] p-5 border-[#27272A] ${rowSpan} ${colSpan} ${extraClasses} rounded-sm`}>
    <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 border-b border-[#27272A] pb-2 mb-3">{title}</h3>
    <textarea
      name={name}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      className="w-full h-full flex-grow resize-none border-none focus:ring-0 text-xs p-0 text-zinc-200 placeholder-zinc-700 leading-relaxed bg-transparent focus:outline-none"
      placeholder={`Blueprint ${title.toLowerCase()}...`}
    />
  </div>
);

const BusinessCanvas = ({ teamId }) => {
  const { token } = useContext(AuthContext);
  const [canvas, setCanvas] = useState({
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valuePropositions: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/teams/${teamId}/canvas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCanvas(data);
        }
      })
      .catch(err => console.error(err));
  }, [teamId, token]);

  const handleChange = (e) => setCanvas({ ...canvas, [e.target.name]: e.target.value });

  const handleSave = async (showToast = true) => {
    setSaving(true);
    if (showToast) setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/canvas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(canvas)
      });
      if (!res.ok) throw new Error('Failed to save canvas');
      if (showToast) {
        setMessage('Canvas updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      if (showToast) setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
      
      <div className="flex justify-between items-center mb-8 relative z-10 border-b border-[#27272A] pb-4">
        <h2 className="text-base font-bold text-white tracking-tight">Business Model Canvas</h2>
        <div className="flex items-center gap-4">
          {message && (
            <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-green-400 bg-green-950/20 border border-green-500/30 px-3 py-1.5 rounded-sm">
              {message}
            </span>
          )}
          <button 
            type="button"
            onClick={() => handleSave(true)} 
            disabled={saving}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest flex items-center gap-1.5 rounded-sm transition duration-150"
          >
            <Save size={12} /> <span>{saving ? 'Compiling...' : 'Commit Canvas'}</span>
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-[minmax(180px,auto)_minmax(180px,auto)_minmax(180px,auto)] gap-0 overflow-hidden border border-[#27272A] relative z-10 rounded-sm">
        
        {/* Top Row - 5 blocks width */}
        <Block title="Key Partners" name="keyPartners" value={canvas.keyPartners} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="md:row-span-2" colSpan="md:col-span-1" extraClasses="border-r border-b" />
        
        {/* Activities and Resources split Middle Left */}
        <div className="md:row-span-2 md:col-span-1 flex flex-col">
          <Block title="Key Activities" name="keyActivities" value={canvas.keyActivities} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="flex-1" colSpan="" extraClasses="border-b" />
          <Block title="Key Resources" name="keyResources" value={canvas.keyResources} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="flex-1" colSpan="" extraClasses="border-b" />
        </div>

        <Block title="Value Propositions" name="valuePropositions" value={canvas.valuePropositions} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="md:row-span-2" colSpan="md:col-span-1" extraClasses="border-l border-r border-b" />
        
        {/* Relationships and Channels split Middle Right */}
        <div className="md:row-span-2 md:col-span-1 flex flex-col">
          <Block title="Customer Relationships" name="customerRelationships" value={canvas.customerRelationships} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="flex-1" colSpan="" extraClasses="border-b" />
          <Block title="Channels" name="channels" value={canvas.channels} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="flex-1" colSpan="" extraClasses="border-b" />
        </div>

        <Block title="Customer Segments" name="customerSegments" value={canvas.customerSegments} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="md:row-span-2" colSpan="md:col-span-1" extraClasses="border-l border-b" />

        {/* Bottom Row - Cost Structure & Revenue Streams */}
        <Block title="Cost Structure" name="costStructure" value={canvas.costStructure} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="md:row-span-1" colSpan="md:col-span-2" extraClasses="border-r" />
        <Block title="Revenue Streams" name="revenueStreams" value={canvas.revenueStreams} onChange={handleChange} onBlur={() => handleSave(false)} rowSpan="md:row-span-1" colSpan="md:col-span-3" extraClasses="" />

      </div>
    </div>
  );
};

export default BusinessCanvas;
