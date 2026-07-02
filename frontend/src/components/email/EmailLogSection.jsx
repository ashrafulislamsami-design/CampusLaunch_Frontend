import React, { useEffect, useState } from 'react';
import { getEmailLog } from '../../services/emailService';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const STATUS_STYLES = {
  sent: 'bg-green-950/30 text-green-400 border-green-900/30',
  failed: 'bg-red-950/30 text-red-400 border-red-900/30',
  skipped: 'bg-zinc-950 border-zinc-800 text-zinc-500',
};

const TYPE_LABELS = {
  welcome: 'Welcome',
  weekly_digest: 'Weekly Digest',
  session_booking_student: 'Session Booked',
  session_booking_mentor: 'New Session (Mentor)',
  session_reminder: 'Session Reminder',
  session_feedback: 'Feedback Request',
  pitch_registration: 'Pitch Registration',
  pitch_reminder: 'Pitch Reminder',
  pitch_results: 'Pitch Results',
  funding_reminder: 'Funding Reminder',
  curriculum_certificate: 'Certificate Earned',
  week_unlocked: 'New Week Unlocked',
  connection_request: 'Connection Request',
  connection_accepted: 'Connection Accepted',
  canvas_version_saved: 'Canvas Version',
};

const EmailLogSection = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEmailLog();
        setLogs(data);
      } catch (e) {
        setErr('Failed to load email log');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-0.5 h-4 bg-[#2563EB]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
          Delivery Audit
        </span>
      </div>
      <h2 className="text-xl font-bold text-zinc-100 tracking-tight" style={OUTFIT}>
        Recent Emails Sent to You
      </h2>
      <p className="text-xs text-zinc-500 mt-1 mb-5 leading-relaxed" style={MONO}>
        The last 20 emails our system delivered to your inbox.
      </p>

      <div className="bg-[#18181B] border border-[#27272A] rounded-sm overflow-hidden shadow-md">
        {loading && (
          <div className="p-8 text-center text-zinc-500 text-xs font-mono" style={MONO}>Loading audit logs…</div>
        )}
        {err && (
          <div className="p-8 text-center text-red-400 text-xs font-mono border border-red-900/30 bg-red-950/20" style={MONO}>{err}</div>
        )}
        {!loading && !err && logs.length === 0 && (
          <div className="p-8 text-center text-zinc-500 text-xs font-mono" style={MONO}>
            No emails yet. Your email history will appear here.
          </div>
        )}
        {!loading && !err && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#09090B] border-b border-[#27272A] text-zinc-500 font-semibold uppercase tracking-wider text-[10px]" style={MONO}>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Sent</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/50">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="px-4 py-3 font-semibold text-zinc-200 font-mono" style={MONO}>
                      {TYPE_LABELS[log.emailType] || log.emailType}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 max-w-xs truncate">
                      {log.subject}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 font-mono" style={MONO}>
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`
                          inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-semibold uppercase tracking-wider border
                          ${STATUS_STYLES[log.status] || 'bg-zinc-950 border-zinc-800 text-zinc-500'}
                        `}
                        style={MONO}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailLogSection;
