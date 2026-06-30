import { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Send, Link as LinkIcon, FilePlus, ExternalLink, Pin, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/config';

const CollaborationHub = ({ teamId, messages: initialMessages = [], documents = [], onRefresh, isCEO = false, onDeleteDocument }) => {
  const { token, user } = useContext(AuthContext);
  const [activeSubTab, setActiveSubTab] = useState('feed');
  const [msgText, setMsgText] = useState('');
  const [docData, setDocData] = useState({ title: '', url: '', category: 'Google Doc' });
  const [showDocForm, setShowDocForm] = useState(false);
  
  // New state for messaging features
  const [messages, setMessages] = useState(initialMessages);
  const [teamMembers, setTeamMembers] = useState([]);
  const [mentionDropdown, setMentionDropdown] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showPinned, setShowPinned] = useState(false);
  const textareaRef = useRef(null);

  // Load messages from API on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/${teamId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    const loadTeamMembers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/${teamId}/members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
        }
      } catch (err) {
        console.error('Failed to load team members:', err);
      }
    };

    const loadPinnedMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/${teamId}/pinned`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPinnedMessages(data);
        }
      } catch (err) {
        console.error('Failed to load pinned messages:', err);
      }
    };

    loadMessages();
    loadTeamMembers();
    loadPinnedMessages();
  }, [teamId, token]);

  // Handle @ mention autocomplete
  const handleTextChange = (e) => {
    const text = e.target.value;
    setMsgText(text);

    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = text.slice(lastAtIndex + 1);
      if (afterAt && !afterAt.includes(' ')) {
        const query = afterAt.toLowerCase();
        const filtered = teamMembers.filter(m =>
          m.name.toLowerCase().includes(query)
        );
        setFilteredMembers(filtered);
        setMentionDropdown({ start: lastAtIndex, query });
      } else if (!afterAt || afterAt.includes(' ')) {
        setMentionDropdown(null);
      }
    } else {
      setMentionDropdown(null);
    }
  };

  const handleSelectMention = (member) => {
    const beforeAt = msgText.slice(0, mentionDropdown.start);
    const afterSpace = msgText.slice(mentionDropdown.start + 1 + mentionDropdown.query.length);
    setMsgText(`${beforeAt}@${member.name} ${afterSpace}`);
    setMentionDropdown(null);
    setFilteredMembers([]);
    if (textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 0);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ teamId, text: msgText })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
        setMsgText('');
        setMentionDropdown(null);
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handlePinMessage = async (messageId, currentPinStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/${messageId}/pin`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedMessage = await res.json();
        setMessages(messages.map(m => m._id === messageId ? updatedMessage : m));
        
        // Reload pinned messages
        const pinnedRes = await fetch(`${API_BASE_URL}/messages/${teamId}/pinned`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pinnedRes.ok) {
          const data = await pinnedRes.json();
          setPinnedMessages(data);
        }
      }
    } catch (err) {
      console.error('Failed to pin message:', err);
    }
  };

  // Render message text with @mention highlighting
  const renderMessageWithMentions = (text) => {
    if (!text || teamMembers.length === 0) return text;
    
    // Build dynamic regex from team member names
    const memberNames = teamMembers.map(m => m.name).join('|');
    const mentionRegex = new RegExp('@(' + memberNames + ')', 'g');
    
    const parts = text.split(mentionRegex);
    return parts.map((part, idx) => {
      // Check if this part is a mention by seeing if it matches a team member name
      if (teamMembers.some(m => m.name === part)) {
        return (
          <span 
            key={idx} 
            className="bg-[#2563EB15] text-[#60A5FA] border border-[#2563EB35] font-mono text-[9px] px-1.5 py-0.5 rounded-sm hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer"
          >
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== msgId));
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const getUploaderLabel = (doc) => {
    if (!doc.uploadedBy) return 'Uploaded by Unknown';
    if (typeof doc.uploadedBy === 'string') {
      return `Uploaded by ${doc.uploadedBy}`;
    }
    return `Uploaded by ${doc.uploadedBy.name || doc.uploadedBy.email || 'Team member'}`;
  };

  const handleDeleteDocument = async (docId) => {
    if (onDeleteDocument) {
      return onDeleteDocument(docId);
    }
    if (!window.confirm('Remove this document from the vault?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${teamId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(docData)
      });
      if (res.ok) {
        setDocData({ title: '', url: '', category: 'Google Doc' });
        setShowDocForm(false);
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to add document:', err);
    }
  };

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden flex flex-col min-h-[500px]">
      
      <div className="flex justify-between items-center mb-8 relative z-10 border-b border-[#27272A] pb-4">
        <h2 className="text-base font-bold text-white tracking-tight">Collaboration Hub</h2>
        <div className="flex gap-2">
          {activeSubTab === 'feed' && (
            <button
              onClick={() => setShowPinned(!showPinned)}
              className={`px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest transition flex items-center gap-1.5 border rounded-sm ${
                showPinned 
                  ? 'bg-[#2563EB15] border-[#2563EB] text-[#60A5FA]' 
                  : 'bg-[#09090B] border-[#27272A] text-zinc-500 hover:text-zinc-300'
              }`}
              title="View pinned messages"
            >
              <Pin size={12} /> <span>Pinned</span>
            </button>
          )}
          
          <div className="flex bg-[#09090B] border border-[#27272A] rounded-sm p-0.5">
            <button 
              onClick={() => { setActiveSubTab('feed'); setShowPinned(false); }}
              className={`px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest transition rounded-sm ${
                activeSubTab === 'feed' 
                  ? 'bg-[#18181B] border border-[#27272A] text-white' 
                  : 'border border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Team Feed
            </button>
            <button 
              onClick={() => setActiveSubTab('vault')}
              className={`px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest transition rounded-sm ${
                activeSubTab === 'vault' 
                  ? 'bg-[#18181B] border border-[#27272A] text-white' 
                  : 'border border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Resource Vault
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        {activeSubTab === 'feed' ? (
          <div className="flex flex-col h-full">
            {/* Pinned Messages Panel */}
            {showPinned && pinnedMessages.length > 0 && (
              <div className="mb-4 p-4 bg-[#09090B] border border-[#2563EB35] rounded-sm">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#60A5FA] mb-3 flex items-center gap-2">
                  <Pin size={14} /> Pinned Messages
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {pinnedMessages.map((m) => (
                    <div key={m._id} className="bg-[#18181B] p-3 border-l-2 border-[#2563EB] rounded-sm">
                      <div className="text-[10px] font-mono font-bold text-[#60A5FA]">{m.senderName}</div>
                      <div className="text-xs text-zinc-400 mt-1">{m.text.slice(0, 100)}...</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-grow overflow-y-auto space-y-3 mb-6 pr-2">
              {messages.length === 0 && (
                <div className="text-center py-12 text-zinc-600 font-mono text-[9px] uppercase tracking-widest border border-dashed border-[#27272A] bg-[#09090B] rounded-sm">
                  No transmissions recorded yet. Start the conversation.
                </div>
              )}
              {messages.map((m) => (
                <div 
                  key={m._id} 
                  className={`border p-4 group relative rounded-sm transition-colors duration-150 ${
                    m.isPinned 
                      ? 'border-[#2563EB] bg-[#2563EB05]' 
                      : 'border-[#27272A] bg-[#09090B] hover:border-zinc-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-zinc-100 text-xs tracking-tight">{m.senderName}</span>
                      <span className="font-mono text-[8px] font-bold text-zinc-400 bg-[#18181B] px-1.5 py-0.5 border border-[#27272A] rounded-sm uppercase tracking-widest">
                        {m.senderRole}
                      </span>
                      {m.isPinned && <Pin size={12} className="text-[#60A5FA]" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono text-zinc-600">{new Date(m.createdAt).toLocaleTimeString()}</span>
                      <button
                        onClick={() => handlePinMessage(m._id, m.isPinned)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-[#60A5FA]"
                        title={m.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(m._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400"
                        title="Delete message"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-300 font-medium text-xs leading-relaxed mt-2">{renderMessageWithMentions(m.text)}</p>
                </div>
              ))}
            </div>

            {/* Message Input with @ mention autocomplete */}
            <form onSubmit={handleSendMessage} className="mt-auto space-y-2">
              <div className="relative">
                <textarea 
                  ref={textareaRef}
                  value={msgText}
                  onChange={handleTextChange}
                  placeholder="Type @ to mention teammates..."
                  className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] focus:border-[#2563EB] focus:ring-0 text-zinc-100 text-xs placeholder-zinc-700 font-mono resize-none rounded-sm transition-colors duration-150 focus:outline-none"
                  rows="2"
                />
                
                {/* @ Mention Dropdown */}
                {mentionDropdown && filteredMembers.length > 0 && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#18181B] border border-[#27272A] shadow-xl z-50 max-h-[200px] overflow-y-auto rounded-sm">
                    {filteredMembers.map((member) => (
                      <button
                        key={member._id}
                        type="button"
                        onClick={() => handleSelectMention(member)}
                        className="w-full text-left px-4 py-2 hover:bg-[#2563EB10] border-b border-[#27272A] last:border-b-0"
                      >
                        <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-100">{member.name}</div>
                        <div className="text-[8px] font-mono text-zinc-500 uppercase">{member.role}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-2.5 flex items-center justify-center gap-1.5 rounded-sm transition duration-150"
              >
                <Send size={14} /> <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Resource Vault</h3>
              <button 
                onClick={() => setShowDocForm(!showDocForm)}
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-sm transition-colors"
              >
                {showDocForm ? 'Close' : '+ Add Link'}
              </button>
            </div>

            {showDocForm && (
              <form 
                onSubmit={handleAddDocument} 
                className="bg-[#09090B] border border-[#27272A] p-5 rounded-sm space-y-4 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Title</label>
                    <input 
                      type="text"
                      value={docData.title}
                      onChange={e => setDocData({...docData, title: e.target.value})}
                      required
                      className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] focus:border-[#2563EB] focus:ring-0 text-zinc-100 text-xs rounded-sm focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Category</label>
                    <select 
                      value={docData.category}
                      onChange={e => setDocData({...docData, category: e.target.value})}
                      className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] focus:border-[#2563EB] focus:ring-0 text-zinc-300 text-xs rounded-sm focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Google Doc">Google Doc</option>
                      <option value="Figma">Figma</option>
                      <option value="Drive">Drive</option>
                      <option value="Pitch Deck">Pitch Deck</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Link URL</label>
                  <input 
                    type="url"
                    value={docData.url}
                    onChange={e => setDocData({...docData, url: e.target.value})}
                    required
                    placeholder="https://docs.google.com/..."
                    className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] focus:border-[#2563EB] focus:ring-0 text-zinc-100 text-xs rounded-sm focus:outline-none transition-colors"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-2.5 rounded-sm transition-colors"
                >
                  Commit to Vault
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.length === 0 && !showDocForm && (
                <div className="col-span-full text-center py-12 text-zinc-600 font-mono text-[9px] uppercase tracking-widest border border-dashed border-[#27272A] bg-[#09090B] rounded-sm">
                  Vault is currently empty.
                </div>
              )}
              {documents.map((doc, idx) => (
                <div 
                  key={doc._id || idx} 
                  className="p-4 bg-[#09090B] border border-[#27272A] hover:border-zinc-500 transition-colors group relative rounded-sm flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-[#18181B] border border-[#27272A] text-zinc-400 flex items-center justify-center rounded-sm shrink-0">
                    <LinkIcon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans text-xs font-bold text-zinc-100 truncate pr-6">{doc.title}</h4>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[9px] font-mono text-zinc-500">
                      <span>{getUploaderLabel(doc)}</span>
                      <span className="px-2 py-0.5 bg-[#18181B] border border-[#27272A] text-zinc-400 rounded-sm uppercase tracking-widest">{doc.category}</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    {isCEO && (
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400"
                        title="Remove from vault"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    {doc.url && (doc.url.includes('/ai/report/') || doc.url.includes('/api/ai/reports/')) ? (
                      <Link
                        to={(() => {
                          const url = doc.url.trim();
                          if (url.includes('/ai/report/')) {
                            const rawId = url.split('/ai/report/').pop();
                            return `/ai/report/${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
                          }
                          const rawId = url.split('/api/ai/reports/').pop();
                          return `/ai/report/${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
                        })()}
                        className="text-zinc-500 hover:text-[#60A5FA] transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    ) : (
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-[#60A5FA] transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationHub;
