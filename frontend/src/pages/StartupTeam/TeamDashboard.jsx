import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Users, LayoutTemplate, KanbanSquare, Pencil, X, ExternalLink, Activity, MessageSquare, Trash2, FileText, Link as LinkIcon } from 'lucide-react';
import { API_BASE_URL } from '@/config';
import BusinessCanvas from '../../components/StartupTeam/BusinessCanvas';
import CollaborationHub from '../../components/StartupTeam/CollaborationHub';
import ProgressTimeline from '../../components/StartupTeam/ProgressTimeline';

const TeamDashboard = () => {
  const { teamId } = useParams();
  const { token } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'Member' });
  const [inviteError, setInviteError] = useState('');
  const [activeTab, setActiveTab] = useState('kanban');
  const [roleMessage, setRoleMessage] = useState('');
  const [updatingRole, setUpdatingRole] = useState(null);
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // CEO Project Edit State
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editProjectData, setEditProjectData] = useState({ name: '', problemStatement: '', solution: '', stage: '' });

  // Sync state when team is fetched natively
  useEffect(() => {
    if (team) {
      setEditProjectData({
        name: team.name || '',
        problemStatement: team.problemStatement || '',
        solution: team.solution || '',
        stage: team.stage || 'Idea'
      });
    }
  }, [team]);

  // Decode JWT to safely retrieve user ID without additional network fetch
  const getUserId = () => {
    if(!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user?.id || payload.id;
    } catch(e) { return null; }
  };
  const currentUserId = getUserId();
  const isCEO = team?.members.some(m => (m.userId._id === currentUserId || m.userId === currentUserId) && m.role === 'CEO');

  const getUploaderLabel = (doc) => {
    if (!doc.uploadedBy) return 'Uploaded by Unknown';
    if (typeof doc.uploadedBy === 'string') {
      return `Uploaded by ${doc.uploadedBy}`;
    }
    return `Uploaded by ${doc.uploadedBy.name || doc.uploadedBy.email || 'Team member'}`;
  };

  const normalizeReportId = (value) => {
    if (!value) return null;
    const cleaned = value.trim().replace(/[^a-zA-Z0-9]/g, '');
    return cleaned.length === 24 ? cleaned : null;
  };

  const getDocumentPath = (url) => {
    if (!url) return null;

    const normalizedUrl = url.trim();
    if (normalizedUrl.includes('/ai/report/')) {
      const reportId = normalizedUrl.split('/ai/report/').pop();
      const cleanId = normalizeReportId(reportId);
      return cleanId ? `/ai/report/${cleanId}` : null;
    }

    if (normalizedUrl.includes('/api/ai/reports/')) {
      const reportId = normalizedUrl.split('/api/ai/reports/').pop();
      const cleanId = normalizeReportId(reportId);
      return cleanId ? `/ai/report/${cleanId}` : null;
    }

    return null;
  };

  const handleDeleteDocument = async (docId) => {
    if (!isCEO) {
      toast.error('Only the CEO can delete saved pitches.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete document');
      toast.success('Pitch document deleted successfully.');
      fetchTeam();
    } catch (err) {
      console.error('Document deletion failed:', err);
      toast.error(err.message || 'Unable to delete document');
    }
  };

  const handleRoleChange = async (memberUserId, newRole) => {
    setUpdatingRole(memberUserId);
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${memberUserId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if(res.ok) {
        setTeam(data);
        setRoleMessage('Role Updated!');
        setTimeout(() => setRoleMessage(''), 3000);
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Failed to change role:', err);
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError('');
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(inviteData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to invite member');
      setShowInviteModal(false);
      setInviteData({ email: '', role: 'Member' });
      fetchTeam();
    } catch (err) {
      setInviteError(err.message);
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editProjectData)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update project details');
      }
      setShowEditProjectModal(false);
      fetchTeam();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const handleRemoveMember = async (memberUserId) => {
    if (!window.confirm('Are you sure you want to remove this member from the team?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${memberUserId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRoleMessage('Member Removed');
        setTimeout(() => setRoleMessage(''), 3000);
        fetchTeam();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to remove member');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleAcceptInvite = async (e) => {
    if (e) e.preventDefault();
    setAcceptingInvite(true);
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/invites/accept`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
        setRoleMessage('Invite Accepted!');
        setTimeout(() => setRoleMessage(''), 3000);
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to accept invite');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setAcceptingInvite(false);
    }
  };

  // Fetch Team Data
  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI Reports linked to this team
  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/reports/team/${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setReports(data);
      }
    } catch (err) {
      console.error('Failed to fetch AI reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchTeam();
    fetchReports();
    // eslint-disable-next-line
  }, [teamId]);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await fetch(`${API_BASE_URL}/teams/${teamId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchTeam(); // Refresh board
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await fetch(`${API_BASE_URL}/teams/${teamId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: newTaskTitle, status: 'To Do' })
      });
      setNewTaskTitle('');
      fetchTeam();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await fetch(`${API_BASE_URL}/teams/${teamId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTeam();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Truly Unify Vault: Combine documents and reports into a single chronological feed
  const unifiedVault = useMemo(() => {
    const docs = (team?.documents || []).map(d => ({ ...d, vaultType: 'document', date: d.createdAt || new Date() }));
    const reps = (reports || []).map(r => ({ ...r, vaultType: 'report', date: r.createdAt }));
    
    return [...docs, ...reps].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [team?.documents, reports]);

  if (loading) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><span className="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold" style={{fontFamily:"'Geist Mono',monospace"}}>Loading workspace...</span></div>;
  if (!team) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><span className="text-red-500 text-[10px] uppercase tracking-widest font-semibold" style={{fontFamily:"'Geist Mono',monospace"}}>Team not found or Unauthorized.</span></div>;

  // Group tasks for Kanban
  const columns = { 'To Do': [], 'In Progress': [], 'Done': [] };
  team.tasks.forEach(task => { if (columns[task.status]) columns[task.status].push(task); });

  const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
  const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

  const COLUMN_ACCENT = { 'To Do': '#71717A', 'In Progress': '#2563EB', 'Done': '#16A34A' };

  const tabStyle = (tab, activeColor = '#2563EB') => ({
    ...MONO,
    backgroundColor: activeTab === tab ? activeColor : '#18181B',
    color:           activeTab === tab ? 'white'       : '#71717A',
    borderColor:     activeTab === tab ? activeColor   : '#27272A',
  });

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[1880px] mx-auto py-8 px-4 md:px-10 flex flex-col md:flex-row gap-6">

        {/* ── SIDEBAR (Left Column) ─────────────────────────── */}
        <aside className="w-full md:w-80 shrink-0 flex flex-col gap-4">
          
          {/* Project card (Team Info) */}
          <section className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 relative">
            {isCEO && (
              <button
                onClick={() => setShowEditProjectModal(true)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors"
                title="Edit Project Details"
              >
                <Pencil size={14} />
              </button>
            )}
            <div className="flex items-start justify-between mb-3 pr-6">
              <h2 className="text-sm font-bold text-zinc-100 tracking-tight" style={OUTFIT}>
                {team.name}
              </h2>
              <a
                href={`/startup/${team._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-1 text-zinc-600 hover:text-zinc-100 hover:bg-[#27272A] transition-colors rounded-sm"
                title="View Public Pitch"
              >
                <ExternalLink size={12} />
              </a>
            </div>
            
            <div className="mb-4">
              <span className="inline-block px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest bg-[#2563EB15] text-[#60A5FA] border border-[#2563EB35] rounded-sm">
                {team.stage}
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              {team.problemStatement}
            </p>
          </section>

          {/* Members card */}
          <section className="bg-[#18181B] border border-[#27272A] rounded-sm flex flex-col">
            <div className="flex justify-between items-center px-5 py-3 border-b border-[#27272A]">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Users size={12} className="text-zinc-500" /> Members
              </span>
              <div className="flex items-center gap-2">
                {roleMessage && (
                  <span className="text-[9px] text-green-400 font-mono font-semibold uppercase tracking-widest">
                    {roleMessage}
                  </span>
                )}
                {isCEO && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="text-[9px] font-mono font-semibold uppercase tracking-widest px-2.5 py-1 bg-[#2563EB] text-white hover:bg-blue-700 rounded-sm transition-colors"
                  >
                    + Invite
                  </button>
                )}
              </div>
            </div>

            {/* Pending invite banner */}
            {team.members.find(m => m.userId._id === currentUserId && m.status === 'pending') && (
              <div className="mx-4 my-3 p-3 bg-[#2563EB08] border border-[#2563EB25] rounded-sm">
                <p className="text-xs text-zinc-300 mb-2 font-sans">
                  You have a pending invite to join {team.name}
                </p>
                <button
                  onClick={handleAcceptInvite}
                  disabled={acceptingInvite}
                  className="w-full px-3 py-1.5 bg-[#2563EB] text-white text-[9px] font-mono font-semibold uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-colors rounded-sm"
                >
                  {acceptingInvite ? 'Accepting...' : 'Accept Invite'}
                </button>
              </div>
            )}

            {/* Member list */}
            <ul className="flex flex-col divide-y divide-[#27272A]">
              {team.members.filter(m => m.status === 'accepted').map(m => (
                <li key={m._id} className="flex justify-between items-center gap-2 px-5 py-3 hover:bg-[#1E1E22] transition-colors">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-zinc-100 truncate" style={OUTFIT}>
                      {m.userId?.name || 'User'}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 truncate mt-0.5">
                      {m.userId?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCEO && m.userId._id !== currentUserId ? (
                      <>
                        <select
                          value={m.role}
                          disabled={updatingRole === m.userId._id}
                          onChange={e => handleRoleChange(m.userId._id, e.target.value)}
                          className="text-[9px] text-zinc-300 font-mono font-semibold bg-[#09090B] px-2 py-1 border border-[#27272A] focus:border-[#2563EB] focus:outline-none uppercase tracking-widest disabled:opacity-50 rounded-sm cursor-pointer"
                        >
                          <option value="CTO">CTO</option>
                          <option value="CMO">CMO</option>
                          <option value="Designer">Designer</option>
                          <option value="Member">Member</option>
                        </select>
                        <button
                          onClick={() => handleRemoveMember(m.userId._id)}
                          className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[9px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">
                        {m.role}
                      </span>
                    )}
                  </div>
                </li>
              ))}
              {team.members.filter(m => m.status === 'accepted').length === 0 && (
                <li className="px-5 py-4 text-center text-[9px] text-zinc-600 font-mono uppercase tracking-widest font-semibold">
                  No accepted members yet
                </li>
              )}
            </ul>
          </section>

          {/* Progress timeline */}
          <section className="bg-[#18181B] border border-[#27272A] rounded-sm p-1">
            <ProgressTimeline history={team.history} currentStage={team.stage} />
          </section>
        </aside>

        {/* ── CONTENT AREA (Right Column) ─────────────────────────── */}
        <main className="flex-1 min-w-0">

          {/* Tabs Navigation */}
          <nav className="flex border-b border-[#27272A] mb-6 overflow-x-auto scrollbar-none">
            {[
              { tab: 'kanban',    label: 'Kanban Board',       icon: KanbanSquare },
              { tab: 'canvas',    label: 'Business Canvas',    icon: LayoutTemplate },
              { tab: 'collab',    label: 'Collab Hub',         icon: MessageSquare },
              { tab: 'documents', label: 'Intelligence Hub',   icon: FileText },
            ].map(({ tab, label, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 shrink-0 flex items-center justify-center gap-2 py-3 px-4 font-mono text-[10px] font-semibold uppercase tracking-widest border-b-2 transition-all duration-150 ${
                  activeTab === tab 
                    ? 'border-[#2563EB] text-[#60A5FA] bg-[#2563EB05]' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20'
                }`}
              >
                <Icon size={12} /> <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* ── Kanban Board Tab ─────────────────────────────── */}
          <div className={activeTab === 'kanban' ? 'block' : 'hidden'}>
            <section className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-0.5 h-4 bg-[#2563EB]" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-500">
                  Kanban Board
                </span>
              </div>

              {/* Sleek Command Input Bar */}
              <form 
                onSubmit={handleAddTask} 
                className="flex bg-[#09090B] border border-[#27272A] rounded-sm p-1.5 gap-2 mb-8 focus-within:border-[#2563EB] transition-colors duration-150"
              >
                <div className="flex items-center pl-3 text-zinc-600">
                  <Plus size={16} />
                </div>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done? Enter command..."
                  className="flex-1 bg-transparent text-zinc-100 text-sm placeholder-zinc-700 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest rounded-sm transition-colors duration-150"
                >
                  Execute Add
                </button>
              </form>

              {/* Kanban Column Layout */}
              <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none gap-4 pb-4 md:pb-0">
                {Object.keys(columns).map(status => (
                  <div key={status} className="w-[85vw] md:w-auto shrink-0 snap-center bg-[#121214] border border-[#27272A] rounded-sm flex flex-col min-h-[500px]">
                    
                    {/* Column Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272A]">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: COLUMN_ACCENT[status] }}
                        />
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-200">
                          {status}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 border border-[#27272A] bg-[#09090B] text-zinc-400 rounded-sm">
                        {columns[status].length}
                      </span>
                    </div>

                    {/* Tasks List */}
                    <div className="flex flex-col gap-2 p-2 flex-1">
                      {columns[status].map(task => (
                        <div 
                          key={task._id} 
                          className="bg-[#18181B] border border-[#27272A] rounded-sm p-4 group hover:border-zinc-500 transition-colors duration-150"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <p className="text-xs text-zinc-200 leading-relaxed font-sans flex-1 pr-2">
                              {task.title}
                            </p>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
                              title="Delete task"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          
                          <div className="relative">
                            <select
                              value={task.status}
                              onChange={e => updateTaskStatus(task._id, e.target.value)}
                              className="w-full text-[9px] font-mono font-semibold uppercase tracking-widest bg-[#09090B] border border-[#27272A] p-2 text-zinc-500 hover:text-zinc-300 focus:outline-none focus:border-[#2563EB] transition-colors rounded-sm cursor-pointer"
                            >
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                          </div>
                        </div>
                      ))}
                      
                      {/* Empty Column State */}
                      {columns[status].length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#27272A] rounded-sm m-2 py-10 px-4">
                          <span className="text-[14px] text-zinc-800 mb-2">∅</span>
                          <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest text-center">
                            No Active Tasks
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Business Canvas Tab ─────────────────────────────── */}
          <div className={activeTab === 'canvas' ? 'block' : 'hidden'}>
            <BusinessCanvas teamId={teamId} />
          </div>

          {/* ── Collab Hub Tab ──────────────────────────────────── */}
          <div className={activeTab === 'collab' ? 'block' : 'hidden'}>
            <CollaborationHub 
              teamId={teamId} 
              messages={team.messages} 
              documents={team.documents} 
              onRefresh={fetchTeam}
              isCEO={isCEO}
              onDeleteDocument={handleDeleteDocument}
            />
          </div>

          {/* ── Intelligence Hub Tab ──────────────────────────── */}
          <div className={activeTab === 'documents' ? 'block' : 'hidden'}>
            <section className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-0.5 h-4 bg-[#7C3AED]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                  Strategy & Intelligence Hub
                </span>
              </div>

              {unifiedVault.length > 0 ? (
                <div className="flex flex-col gap-2 bg-transparent">
                  {unifiedVault.map(item => (
                    <div 
                      key={item._id} 
                      className="bg-[#18181B] border border-[#27272A] rounded-sm flex items-center hover:border-zinc-500 transition-colors group"
                    >
                      {/* Left indicator accent color */}
                      <div
                        className="w-1 self-stretch shrink-0"
                        style={{ backgroundColor: item.vaultType === 'document' ? '#7C3AED' : '#0891B2' }}
                      />
                      
                      {/* Date Block */}
                      <div className="w-24 shrink-0 px-4 py-4 border-r border-[#27272A] flex items-center justify-center">
                        <span className="text-[9px] font-mono text-zinc-500">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Info Block */}
                      <div className="flex-1 px-5 py-4 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border rounded-sm shrink-0"
                            style={{
                              backgroundColor: item.vaultType === 'document' ? '#7C3AED15' : '#0891B215',
                              color:           item.vaultType === 'document' ? '#C084FC'   : '#22D3EE',
                              borderColor:     item.vaultType === 'document' ? '#7C3AED30' : '#0891B230',
                            }}
                          >
                            {item.vaultType === 'document' ? (item.category || 'Document') : 'AI Analysis'}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-zinc-100 truncate" style={OUTFIT}>
                          {item.vaultType === 'document' ? item.title : (item.ideaData?.solution || 'AI Validation')}
                        </h4>
                        {item.vaultType === 'document' ? (
                          <p className="text-[9px] font-mono text-zinc-600 mt-1">{getUploaderLabel(item)}</p>
                        ) : (
                          <p className="text-[9px] font-mono text-zinc-600 mt-1">
                            Market: {item.aiResponse?.marketSize || 'N/A'} · Competitors: {item.aiResponse?.competitors?.length || 0}
                          </p>
                        )}
                      </div>
                      
                      {/* Actions Trigger Block */}
                      <div className="shrink-0 flex items-center border-l border-[#27272A] self-stretch">
                        {item.vaultType === 'document' ? (
                          <>
                            {getDocumentPath(item.url) ? (
                              <Link
                                to={getDocumentPath(item.url)}
                                className="flex items-center justify-center gap-1.5 px-4 h-full font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-100 hover:bg-[#27272A] border-r border-[#27272A] transition-colors"
                              >
                                <FileText size={12} /> Open
                              </Link>
                            ) : (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-4 h-full font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-100 hover:bg-[#27272A] border-r border-[#27272A] transition-colors"
                              >
                                <ExternalLink size={12} /> Open
                              </a>
                            )}
                            {isCEO && (
                              <button
                                onClick={() => handleDeleteDocument(item._id)}
                                className="px-4 h-full text-zinc-600 hover:text-red-400 hover:bg-[#27272A] transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </>
                        ) : (
                          <Link
                            to={`/ai/report/${item._id}`}
                            className="flex items-center justify-center gap-1.5 px-4 h-full font-mono text-[9px] font-semibold uppercase tracking-widest text-[#22D3EE] hover:bg-[#0891B215] transition-colors"
                          >
                            <Activity size={12} /> Full Report
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-[#27272A] rounded-sm bg-[#18181B]">
                  <FileText size={28} className="text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-semibold mb-2">
                    Vault is empty
                  </p>
                  <Link 
                    to="/ai-validator" 
                    className="text-[#2563EB] font-mono text-[9px] font-semibold uppercase tracking-widest hover:text-blue-400 transition-colors"
                  >
                    Execute AI Validation →
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* ── Invite Modal ─────────────────────────────────────── */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
              <span className="text-xs font-bold text-zinc-100" style={OUTFIT}>Invite Member</span>
              <button onClick={() => setShowInviteModal(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={16} /></button>
            </div>
            {inviteError && (
              <div className="mx-5 mt-4 px-3 py-2 bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-mono rounded-sm">
                ERROR: {inviteError}
              </div>
            )}
            <form onSubmit={handleInvite} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-[9px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">User Email</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={e => setInviteData({...inviteData, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] text-zinc-100 text-sm focus:outline-none focus:border-[#2563EB] rounded-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">Role</label>
                <select
                  value={inviteData.role}
                  onChange={e => setInviteData({...inviteData, role: e.target.value})}
                  className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] text-zinc-300 text-sm focus:outline-none focus:border-[#2563EB] rounded-sm transition-colors cursor-pointer"
                >
                  <option value="CTO">CTO</option>
                  <option value="CMO">CMO</option>
                  <option value="Designer">Designer</option>
                  <option value="Member">Member</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)} 
                  className="flex-1 px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-widest border border-[#27272A] text-zinc-500 hover:text-zinc-100 hover:border-zinc-500 rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-widest bg-[#2563EB] text-white hover:bg-blue-700 rounded-sm transition-colors"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Project Modal ───────────────────────────────── */}
      {showEditProjectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
              <span className="text-xs font-bold text-zinc-100" style={OUTFIT}>Edit Project Details</span>
              <button onClick={() => setShowEditProjectModal(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={16} /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <form id="edit-project-form" onSubmit={handleEditProject} className="flex flex-col gap-4">
                {[{ label: 'Project Name', key: 'name', type: 'text', required: true },].map(({ label, key, type, required }) => (
                  <div key={key}>
                    <label className="block text-[9px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={editProjectData[key]}
                      onChange={e => setEditProjectData({...editProjectData, [key]: e.target.value})}
                      required={required}
                      className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] text-zinc-100 text-sm focus:outline-none focus:border-[#2563EB] rounded-sm transition-colors"
                    />
                  </div>
                ))}
                {[{ label: 'Problem Statement', key: 'problemStatement' }, { label: 'Solution', key: 'solution' }].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-[9px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">{label}</label>
                    <textarea
                      value={editProjectData[key]}
                      onChange={e => setEditProjectData({...editProjectData, [key]: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] text-zinc-100 text-sm focus:outline-none focus:border-[#2563EB] rounded-sm transition-colors resize-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[9px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">Stage</label>
                  <select
                    value={editProjectData.stage}
                    onChange={e => setEditProjectData({...editProjectData, stage: e.target.value})}
                    className="w-full px-3 py-2 bg-[#09090B] border border-[#27272A] text-zinc-300 text-sm focus:outline-none focus:border-[#2563EB] rounded-sm transition-colors cursor-pointer"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Testing">Testing</option>
                    <option value="Building MVP">Building MVP</option>
                    <option value="Growing">Growing</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-[#27272A]">
              <button 
                type="button" 
                onClick={() => setShowEditProjectModal(false)} 
                className="flex-1 px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-widest border border-[#27272A] text-zinc-500 hover:text-zinc-100 hover:border-zinc-500 rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="edit-project-form" 
                className="flex-1 px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-widest bg-[#2563EB] text-white hover:bg-blue-700 rounded-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;
