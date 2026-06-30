import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '@/config';
import toast from 'react-hot-toast';
import { Download, ThumbsUp, ThumbsDown, Eye, Plus, Filter } from 'lucide-react';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const DUMMY_RESOURCES = [
  {
    _id: 'dr-1',
    title: 'Lean Startup Methodology',
    description: 'A comprehensive guide to building a startup using lean principles, validated learning, and iterative development cycles.',
    stage: 'idea',
    type: 'pdf',
    downloads: 312,
    author: { name: 'Rahim Khan' },
    votes: { likes: 48, dislikes: 2 },
  },
  {
    _id: 'dr-2',
    title: 'Pitch Deck Template — Seed Round',
    description: 'A battle-tested 12-slide pitch deck template used by top-funded Bangladeshi startups. Includes investor-ready design.',
    stage: 'validation',
    type: 'doc',
    downloads: 887,
    author: { name: 'Nusrat Jahan' },
    votes: { likes: 124, dislikes: 5 },
  },
  {
    _id: 'dr-3',
    title: 'Business Model Canvas Workbook',
    description: 'Interactive workbook for mapping out all nine BMC building blocks with guided exercises and startup examples.',
    stage: 'idea',
    type: 'pdf',
    downloads: 543,
    author: { name: 'Farhan Ahmed' },
    votes: { likes: 76, dislikes: 3 },
  },
  {
    _id: 'dr-4',
    title: 'Y Combinator Application Guide',
    description: 'Community-sourced guide on how to write a compelling YC application, with annotated examples from accepted startups.',
    stage: 'early',
    type: 'text',
    downloads: 229,
    author: { name: 'Tasnim Akter' },
    votes: { likes: 55, dislikes: 1 },
  },
  {
    _id: 'dr-5',
    title: 'Startup Financial Modeling Basics',
    description: 'Introduction to P&L, runway calculations, unit economics, and investor-grade spreadsheet modeling for early-stage companies.',
    stage: 'early',
    type: 'link',
    downloads: 402,
    author: { name: 'Mehedi Hasan' },
    votes: { likes: 91, dislikes: 8 },
  },
  {
    _id: 'dr-6',
    title: 'Growth Hacking Playbook 2026',
    description: 'Proven growth frameworks for scaling user acquisition — from SEO and content marketing to referral loops and paid channels.',
    stage: 'growth',
    type: 'pdf',
    downloads: 736,
    author: { name: 'Sadia Islam' },
    votes: { likes: 142, dislikes: 11 },
  },
];

const STAGE_COLORS = {
  idea: { bg: '#2563EB18', color: '#2563EB', border: '#2563EB40' },
  validation: { bg: '#7C3AED18', color: '#7C3AED', border: '#7C3AED40' },
  early: { bg: '#16A34A18', color: '#16A34A', border: '#16A34A40' },
  growth: { bg: '#EA580C18', color: '#EA580C', border: '#EA580C40' },
  scaling: { bg: '#DC262618', color: '#DC2626', border: '#DC262640' },
};

const TYPE_COLORS = {
  text: { bg: '#71717A18', color: '#A1A1AA', border: '#3F3F4640' },
  doc: { bg: '#2563EB18', color: '#60A5FA', border: '#2563EB40' },
  pdf: { bg: '#DC262618', color: '#F87171', border: '#DC262640' },
  link: { bg: '#16A34A18', color: '#4ADE80', border: '#16A34A40' },
};

const Resources = () => {
  const { user, token } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    stage: '',
    type: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.stage) params.append('stage', filters.stage);
      if (filters.type) params.append('type', filters.type);
      params.append('sortBy', filters.sortBy);
      params.append('order', filters.order);

      const response = await axios.get(`${API_BASE_URL}/resources?${params}`);
      if (Array.isArray(response.data)) {
        setResources(response.data);
      } else {
        setResources([]);
        console.error('Expected array from /api/resources, got:', response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (resourceId, vote) => {
    try {
      await axios.post(`${API_BASE_URL}/resources/${resourceId}/vote`, { vote }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchResources(); // Refresh to get updated votes
      toast.success('Vote recorded');
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleDownload = async (resource) => {
    try {
      if (resource.type === 'link') {
        window.open(resource.content, '_blank');
      } else if (resource.type === 'text') {
        // For text resources, download as txt
        const blob = new Blob([resource.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // For doc/pdf files, download from backend endpoint
        const response = await axios.get(
          `${API_BASE_URL}/resources/${resource._id}/download`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
            responseType: 'blob'
          }
        );
        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = resource.title;
        link.click();
        URL.revokeObjectURL(url);
      }
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download');
    }
  };

  const stages = ['idea', 'validation', 'early', 'growth', 'scaling'];
  const types = ['text', 'doc', 'pdf', 'link'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-zinc-600 text-[11px] uppercase tracking-widest" style={MONO}>Loading Resources...</div>
      </div>
    );
  }

  const displayData = Array.isArray(resources) && resources.length > 0 ? resources : DUMMY_RESOURCES;

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 bg-[#2563EB]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                Knowledge Base
              </span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-100" style={OUTFIT}>Resource Library</h1>
            <p className="text-zinc-400 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Community-curated guides, templates, and tools for founders.
            </p>
          </div>
          {user && (
            <Link
              to="/resources/add"
              className="flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-blue-500 transition-colors"
              style={MONO}
            >
              <Plus size={14} />
              Add Resource
            </Link>
          )}
        </div>

        {/* ── Filters ─────────────────────────────────────────────── */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mr-2" style={MONO}>
              <Filter size={11} /> Filters:
            </span>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold" style={MONO}>Stage</span>
              <select
                value={filters.stage}
                onChange={(e) => setFilters({...filters, stage: e.target.value})}
                className="bg-[#09090B] border border-[#27272A] rounded-sm px-2.5 py-1.5 text-zinc-300 text-xs focus:outline-none focus:border-[#2563EB] transition-colors"
                style={MONO}
              >
                <option value="">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold" style={MONO}>Type</span>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="bg-[#09090B] border border-[#27272A] rounded-sm px-2.5 py-1.5 text-zinc-300 text-xs focus:outline-none focus:border-[#2563EB] transition-colors"
                style={MONO}
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold" style={MONO}>Sort By</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="bg-[#09090B] border border-[#27272A] rounded-sm px-2.5 py-1.5 text-zinc-300 text-xs focus:outline-none focus:border-[#2563EB] transition-colors"
                style={MONO}
              >
                <option value="createdAt">Date Added</option>
                <option value="downloads">Downloads</option>
                <option value="votes.likes">Likes</option>
              </select>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold" style={MONO}>Order</span>
              <select
                value={filters.order}
                onChange={(e) => setFilters({...filters, order: e.target.value})}
                className="bg-[#09090B] border border-[#27272A] rounded-sm px-2.5 py-1.5 text-zinc-300 text-xs focus:outline-none focus:border-[#2563EB] transition-colors"
                style={MONO}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div className="ml-auto flex items-center text-[10px] text-zinc-500" style={MONO}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-2" />
              {displayData.length} resources
            </div>
          </div>
        </div>

        {/* ── Resources Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayData.map(resource => {
            const stageStyle = STAGE_COLORS[resource.stage] || STAGE_COLORS.idea;
            const typeStyle = TYPE_COLORS[resource.type] || TYPE_COLORS.text;
            return (
              <div key={resource._id} className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 flex flex-col hover:border-zinc-600 transition-colors">
                {/* Header badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                    style={{ ...MONO, backgroundColor: stageStyle.bg, color: stageStyle.color, borderColor: stageStyle.border }}
                  >
                    {resource.stage}
                  </span>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                    style={{ ...MONO, backgroundColor: typeStyle.bg, color: typeStyle.color, borderColor: typeStyle.border }}
                  >
                    {resource.type}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-100 mb-1.5 leading-snug" style={OUTFIT}>{resource.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-3 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {resource.description}
                </p>

                <p className="text-[10px] text-zinc-600 mb-3" style={MONO}>
                  By {resource.author?.name || 'Unknown'} · {resource.downloads} downloads
                </p>

                {/* Votes */}
                <div className="flex items-center gap-3 mb-4 border-t border-[#27272A] pt-3">
                  <button
                    onClick={() => handleVote(resource._id, 'like')}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-green-400 transition-colors text-xs"
                    style={MONO}
                  >
                    <ThumbsUp size={13} />
                    {resource.votes.likes}
                  </button>
                  <button
                    onClick={() => handleVote(resource._id, 'dislike')}
                    className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 transition-colors text-xs"
                    style={MONO}
                  >
                    <ThumbsDown size={13} />
                    {resource.votes.dislikes}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/resources/${resource._id}`}
                    className="flex-1 bg-transparent text-zinc-400 border border-[#27272A] hover:border-zinc-500 hover:text-zinc-100 px-3 py-2 rounded-sm text-xs flex items-center justify-center gap-1.5 uppercase tracking-widest transition-colors font-semibold"
                    style={MONO}
                  >
                    <Eye size={12} />
                    View
                  </Link>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex-1 bg-[#2563EB] text-white hover:bg-blue-500 px-3 py-2 rounded-sm text-xs flex items-center justify-center gap-1.5 uppercase tracking-widest transition-colors font-semibold"
                    style={MONO}
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Resources;