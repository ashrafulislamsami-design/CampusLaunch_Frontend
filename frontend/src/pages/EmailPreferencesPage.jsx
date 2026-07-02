import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  getEmailPreferences,
  updateEmailPreferences,
  resetEmailPreferences,
} from '../services/emailService';
import EmailPreferenceCategory from '../components/email/EmailPreferenceCategory';
import EmailPreferenceToggle from '../components/email/EmailPreferenceToggle';
import EmailLogSection from '../components/email/EmailLogSection';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const CATEGORIES = [
  {
    key: 'coFounderMatches',
    icon: '🤝',
    title: 'Co-Founder Matches',
    description: 'Connection requests and acceptances from potential co-founders.',
  },
  {
    key: 'mentorSessions',
    icon: '📅',
    title: 'Mentor Sessions',
    description: 'Booking confirmations, 24h & 1h reminders, and post-session feedback requests.',
  },
  {
    key: 'pitchEvents',
    icon: '🎤',
    title: 'Pitch Events',
    description: 'Registration confirmations, 2-day reminders, and event results.',
  },
  {
    key: 'fundingOpportunities',
    icon: '💰',
    title: 'Funding Opportunities',
    description: 'Deadline reminders for funding in your watchlist (7-day and 3-day).',
  },
  {
    key: 'curriculumProgress',
    icon: '📚',
    title: 'Curriculum Progress',
    description: 'New week unlocked notifications and completion certificates.',
  },
  {
    key: 'teamCanvasUpdates',
    icon: '🎨',
    title: 'Team Canvas Updates',
    description: 'When teammates save new versions of your Business Model Canvas.',
  },
];

const EmailPreferencesPage = () => {
  const [pref, setPref] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getEmailPreferences();
      setPref(data);
    } catch {
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const mergeCategory = (key, patch) => {
    setPref((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: { ...prev.preferences[key], ...patch },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateEmailPreferences({
        preferences: pref.preferences,
        unsubscribedAll: pref.unsubscribedAll,
      });
      setPref(updated);
      toast.success('Preferences saved successfully');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all email preferences to defaults?')) return;
    setSaving(true);
    try {
      const reset = await resetEmailPreferences();
      setPref(reset);
      toast.success('Preferences reset to defaults');
    } catch {
      toast.error('Failed to reset preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-zinc-500 text-xs font-mono" style={MONO}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-4 h-4 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
          <span>Synchronizing preference matrix…</span>
        </div>
      </div>
    );
  }

  if (!pref) return null;

  const isUnsubscribed = !!pref.unsubscribedAll;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-0.5 h-4 bg-[#2563EB]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
            Notification Control
          </span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight" style={OUTFIT}>
          Email Preferences
        </h1>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed" style={MONO}>
          Choose which emails you receive from CampusLaunch.
        </p>
      </div>

      {/* Master unsubscribe toggle */}
      <div
        className={`
          rounded-sm border p-5 mb-6 flex items-start justify-between gap-4 transition-all duration-300
          ${isUnsubscribed 
            ? 'bg-red-950/10 border-red-900/50 shadow-md shadow-red-950/5' 
            : 'bg-[#18181B] border-[#27272A] hover:border-zinc-700/50'}
        `}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-wide text-zinc-100" style={OUTFIT}>
              Pause All Communications
            </span>
            <span className="text-[9px] font-mono border border-red-900/30 text-red-400 bg-red-950/40 uppercase tracking-widest px-1.5 py-0.5 rounded-sm" style={MONO}>
              Master Toggle
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            You'll still receive essential transactional emails (like password
            resets). Everything else — including session reminders, digests, and co-founder updates —
            will be paused.
          </p>
        </div>
        <div className="pt-1">
          <EmailPreferenceToggle
            enabled={isUnsubscribed}
            onChange={(val) => setPref((p) => ({ ...p, unsubscribedAll: val }))}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {CATEGORIES.map(({ key, icon, title, description }) => {
          const cat = pref.preferences?.[key] || { enabled: true, frequency: 'immediate' };
          return (
            <EmailPreferenceCategory
              key={key}
              icon={icon}
              title={title}
              description={description}
              enabled={!!cat.enabled}
              disabled={isUnsubscribed}
              onToggle={(val) => mergeCategory(key, { enabled: val })}
            >
              <div className="flex items-center gap-4 text-xs font-mono py-1" style={MONO}>
                <span className="text-zinc-500 tracking-wider uppercase text-[10px]">Frequency</span>
                <div className="flex gap-2">
                  {['immediate', 'daily', 'off'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => mergeCategory(key, { frequency: f })}
                      className={`
                        px-3 py-1 rounded-sm text-[10px] uppercase font-semibold tracking-wider transition-all duration-200 border
                        ${cat.frequency === f
                          ? 'bg-blue-600 border-blue-500 text-zinc-100 shadow-sm shadow-blue-950/20'
                          : 'bg-[#09090B] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'}
                      `}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </EmailPreferenceCategory>
          );
        })}

        {/* Weekly digest (simple toggle) */}
        <EmailPreferenceCategory
          icon="📊"
          title="Weekly Digest"
          description="A Monday 9AM summary: matches, events, funding, curriculum."
          enabled={!!pref.preferences?.weeklyDigest?.enabled}
          disabled={isUnsubscribed}
          onToggle={(val) => mergeCategory('weeklyDigest', { enabled: val })}
        />
      </div>

      {/* Save & reset */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#27272A]/50">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`
            px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest text-zinc-100 transition-all duration-200 font-mono border
            ${saving 
              ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed' 
              : 'bg-blue-600 border-blue-500 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-950/30'}
          `}
          style={MONO}
        >
          {saving ? 'Saving Preferences…' : 'Save Preferences'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="px-6 py-3 rounded-sm font-semibold text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-200 bg-transparent border border-zinc-850 hover:border-zinc-700 hover:bg-zinc-800/10 transition-all duration-200 font-mono"
          style={MONO}
        >
          Reset to Defaults
        </button>
      </div>

      {/* Email log */}
      <EmailLogSection />
    </div>
  );
};

export default EmailPreferencesPage;
