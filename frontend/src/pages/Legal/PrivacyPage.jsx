const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const SECTIONS = [
  {
    id: '01',
    title: 'Information We Collect',
    body: `We collect information you provide directly: name, email address, university, skills, and profile data. We also collect usage data automatically, including pages visited, features used, and device information. We do not sell your personal data to third parties.`,
  },
  {
    id: '02',
    title: 'How We Use Your Information',
    body: `We use your information to operate and improve the Platform; personalize your experience (e.g., co-founder matching); send transactional and platform notifications; prevent fraud and abuse; and comply with legal obligations. We do not use your data to train external AI models without explicit consent.`,
  },
  {
    id: '03',
    title: 'Data Sharing',
    body: `We may share data with trusted service providers who assist in operating the Platform (e.g., cloud hosting, email delivery) under strict confidentiality agreements. Your public profile information (name, skills, startup) is visible to other registered users by default. You can adjust visibility in your profile settings.`,
  },
  {
    id: '04',
    title: 'Cookies',
    body: `We use strictly necessary cookies for authentication and session management. We may also use analytics cookies to understand platform usage. You can disable analytics cookies in your browser settings without affecting core functionality.`,
  },
  {
    id: '05',
    title: 'Data Retention',
    body: `We retain your account data for as long as your account is active. If you delete your account, we will erase your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., dispute resolution).`,
  },
  {
    id: '06',
    title: 'Your Rights',
    body: `You have the right to access, correct, or delete your personal data at any time via your account settings. You may also request a portable export of your data. To exercise any rights not covered by your account settings, contact privacy@campuslaunch.io.`,
  },
  {
    id: '07',
    title: 'Security',
    body: `We implement industry-standard security measures including TLS encryption in transit, bcrypt password hashing, and regular security audits. No method of transmission over the Internet is 100% secure; we cannot guarantee absolute security.`,
  },
  {
    id: '08',
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the Platform. The effective date at the top of this page reflects the latest revision.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10 pb-8 border-b border-[#27272A]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Legal
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-3" style={OUTFIT}>Privacy Policy</h1>
          <p className="text-zinc-500 text-sm" style={MONO}>
            Effective date: <span className="text-zinc-400">January 1, 2026</span>
            <span className="mx-3 text-zinc-700">·</span>
            Last updated: <span className="text-zinc-400">June 1, 2026</span>
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-px bg-[#27272A]">
          {SECTIONS.map(sec => (
            <div key={sec.id} className="bg-[#09090B]">
              <div className="flex items-start gap-0">
                {/* Number */}
                <div className="w-12 shrink-0 py-5 px-3 border-r border-[#27272A] text-center">
                  <span className="text-[10px] font-bold text-zinc-700" style={MONO}>{sec.id}</span>
                </div>
                {/* Content */}
                <div className="flex-1 py-5 px-6">
                  <h2 className="text-sm font-bold text-zinc-100 mb-2" style={OUTFIT}>{sec.title}</h2>
                  <p className="text-zinc-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {sec.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-[#18181B] border border-[#27272A] p-5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 block mb-2" style={MONO}>
            Data Inquiries
          </span>
          <p className="text-zinc-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Contact our privacy team at{' '}
            <a
              href="mailto:privacy@campuslaunch.io"
              className="text-[#2563EB] hover:text-blue-400 transition-colors"
              style={MONO}
            >
              privacy@campuslaunch.io
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
