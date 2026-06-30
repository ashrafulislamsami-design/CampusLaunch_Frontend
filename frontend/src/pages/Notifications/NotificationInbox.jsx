// frontend/src/pages/Notifications/NotificationInbox.jsx
import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
  Bell, Users, Calendar, Trophy, Briefcase, BookOpen,
  CheckCheck, Check, Inbox, Settings, X, ToggleLeft, ToggleRight
} from 'lucide-react';

import { API_BASE_URL as API } from '@/config';

// Map notification types to icons and color classes
const TYPE_CONFIG = {
  MATCH: {
    icon: <Users size={12} />,
    color: 'text-purple-400',
    bg: 'bg-purple-950/20 border-purple-500/20',
    label: 'Co-Founder Match',
  },
  MENTOR: {
    icon: <Calendar size={12} />,
    color: 'text-blue-400',
    bg: 'bg-blue-950/20 border-blue-500/20',
    label: 'Mentor Session',
  },
  EVENT: {
    icon: <Trophy size={12} />,
    color: 'text-amber-400',
    bg: 'bg-amber-950/20 border-amber-500/20',
    label: 'Pitch Event',
  },
  TEAM_UPDATE: {
    icon: <Briefcase size={12} />,
    color: 'text-teal-400',
    bg: 'bg-teal-950/20 border-teal-500/20',
    label: 'Team Update',
  },
  FUNDING: {
    icon: <Bell size={12} />,
    color: 'text-green-400',
    bg: 'bg-green-950/20 border-green-500/20',
    label: 'Funding Alert',
  },
  COURSE: {
    icon: <BookOpen size={12} />,
    color: 'text-rose-400',
    bg: 'bg-rose-950/20 border-rose-500/20',
    label: 'Course Update',
  },
};

const SETTINGS_META = [
  { key: 'coFounderMatches', label: 'Co-Founder Matches', type: 'MATCH' },
  { key: 'mentorSessions', label: 'Mentor Sessions', type: 'MENTOR' },
  { key: 'pitchEvents', label: 'Pitch Events & Deadlines', type: 'EVENT' },
  { key: 'teamUpdates', label: 'Team Activity', type: 'TEAM_UPDATE' },
  { key: 'fundingAlerts', label: 'Funding Closing Alerts', type: 'FUNDING' },
  { key: 'courseUpdates', label: 'New Course Weeks', type: 'COURSE' },
];

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const NotificationInbox = () => {
  const { refreshUnreadCount } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    coFounderMatches: true,
    mentorSessions: true,
    pitchEvents: true,
    teamUpdates: true,
    fundingAlerts: true,
    courseUpdates: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/notifications`, authHeaders());
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/notifications/settings`, authHeaders());
      if (res?.data) {
        setSettings((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Error fetching notification settings', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, [fetchNotifications, fetchSettings]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/notifications/read/${id}`, {}, authHeaders());
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      // Update badge count in navbar - with small delay to ensure backend sync
      setTimeout(() => refreshUnreadCount(), 100);
    } catch (err) {
      console.error('Error marking as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API}/notifications/read-all`, {}, authHeaders());
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      // Update badge count in navbar - with small delay to ensure backend sync
      setTimeout(() => refreshUnreadCount(), 100);
    } catch (err) {
      console.error('Error marking all as read', err);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await axios.put(
        `${API}/notifications/settings`,
        { notificationSettings: settings },
        authHeaders()
      );
      setShowSettings(false);
    } catch (err) {
      console.error('Error saving settings', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered =
    activeFilter === 'ALL'
      ? notifications
      : activeFilter === 'UNREAD'
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.type === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#09090B]">
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 font-semibold animate-pulse">Accessing Alert Log...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] w-full text-zinc-100">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#27272A]">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              NOTIFICATIONS
              {unreadCount > 0 && (
                <span className="bg-[#2563EB] text-white text-[9px] font-mono font-semibold px-2 py-0.5 rounded-sm">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Your alerts and activity updates</p>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#60A5FA] bg-[#2563EB15] border border-[#2563EB35] hover:bg-[#2563EB] hover:text-white px-3 py-2 rounded-sm transition-colors duration-150"
              >
                <CheckCheck size={12} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400 bg-[#09090B] border border-[#27272A] hover:text-zinc-200 hover:border-zinc-500 px-3 py-2 rounded-sm transition-colors duration-150"
            >
              <Settings size={12} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {['ALL', 'UNREAD', 'MATCH', 'MENTOR', 'EVENT', 'TEAM_UPDATE', 'FUNDING', 'COURSE'].map((f) => {
            const cfg = TYPE_CONFIG[f];
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 font-mono text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-sm border transition duration-150 ${
                  activeFilter === f
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-[#18181B] text-zinc-500 border-[#27272A] hover:text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {cfg ? cfg.label : f === 'UNREAD' ? `Unread (${unreadCount})` : 'All'}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-4 border border-dashed border-[#27272A] bg-[#18181B] rounded-sm">
            <Inbox size={32} className="text-zinc-700" />
            <p className="font-mono text-[10px] uppercase tracking-widest font-semibold">Nothing here yet</p>
            <p className="text-xs text-zinc-600 font-sans">We'll alert you when something important happens.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((n) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG['TEAM_UPDATE'];
              return (
                <div
                  key={n._id}
                  className={`flex flex-col md:flex-row gap-4 p-4 border border-[#27272A] -mt-px bg-[#18181B] hover:bg-[#202022] transition-none rounded-none ${
                    n.isRead
                      ? 'border-l border-l-[#27272A]'
                      : 'border-l-4 border-l-[#2563EB]'
                  }`}
                >
                  
                  {/* Left Column (Type & Timestamp) */}
                  <div className="flex md:flex-col items-center md:items-start justify-between md:justify-center gap-2 shrink-0 md:w-44 border-b md:border-b-0 md:border-r border-[#27272A] pb-3 md:pb-0 md:pr-4">
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded-sm uppercase tracking-widest ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 tracking-wider">
                      {new Date(n.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Main Column (Content) */}
                  <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm text-white">
                        {n.title}
                      </p>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{n.message}</p>
                    </div>
                    
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        title="Mark as read"
                        className="text-zinc-500 hover:text-green-400 p-1 shrink-0 transition-colors"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Settings preferences modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#18181B] border border-[#27272A] rounded-sm w-full max-w-md">
              
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
                <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest">Notification Preferences</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider leading-relaxed">
                  Choose which types of notifications you want to receive as push alerts.
                </p>
                
                <div className="space-y-3 pt-2">
                  {SETTINGS_META.map(({ key, label, type }) => {
                    const cfg = TYPE_CONFIG[type];
                    const enabled = settings[key];
                    return (
                      <div key={key} className="flex items-center justify-between gap-3 p-2 bg-[#09090B] border border-[#27272A] rounded-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-sm bg-[#18181B] border border-[#27272A] flex items-center justify-center ${cfg.color}`}>
                            {cfg.icon}
                          </div>
                          <span className="text-xs font-bold text-zinc-300">{label}</span>
                        </div>
                        <button
                          onClick={() => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className={`transition-colors ${enabled ? 'text-[#2563EB]' : 'text-zinc-600'}`}
                        >
                          {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <button
                  onClick={saveSettings}
                  disabled={savingSettings}
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-3.5 rounded-sm transition-colors duration-150"
                >
                  {savingSettings ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationInbox;
