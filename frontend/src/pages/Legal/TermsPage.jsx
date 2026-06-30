const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const SECTIONS = [
  {
    id: '01',
    title: 'Acceptance of Terms',
    body: `By accessing or using CampusLaunch ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform. These terms apply to all users including students, mentors, and organizers.`,
  },
  {
    id: '02',
    title: 'Eligibility',
    body: `The Platform is intended for use by currently enrolled students, faculty, and verified professionals. You must be at least 16 years old to create an account. By registering, you represent that all information you provide is accurate and complete.`,
  },
  {
    id: '03',
    title: 'User Accounts',
    body: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify CampusLaunch immediately of any unauthorized use of your account. CampusLaunch is not liable for any loss or damage arising from your failure to protect your credentials.`,
  },
  {
    id: '04',
    title: 'Acceptable Use',
    body: `You agree not to use the Platform to post unlawful, harmful, or misleading content; impersonate any person; interfere with platform operations; scrape or harvest user data; or violate any applicable law. CampusLaunch reserves the right to suspend accounts in violation of these terms.`,
  },
  {
    id: '05',
    title: 'Intellectual Property',
    body: `All content, code, and design elements on the Platform are the property of CampusLaunch or its licensors. User-generated content remains owned by the respective user, but by posting content you grant CampusLaunch a non-exclusive license to display and distribute it within the Platform.`,
  },
  {
    id: '06',
    title: 'Disclaimer of Warranties',
    body: `The Platform is provided "as is" without warranties of any kind. CampusLaunch does not guarantee uninterrupted access or that the Platform will be error-free. Use of the Platform is at your own risk.`,
  },
  {
    id: '07',
    title: 'Limitation of Liability',
    body: `CampusLaunch shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid to CampusLaunch in the 12 months preceding the claim.`,
  },
  {
    id: '08',
    title: 'Changes to Terms',
    body: `CampusLaunch reserves the right to modify these Terms at any time. We will notify users of material changes via email or an in-platform notice. Continued use of the Platform after changes constitutes acceptance of the updated Terms.`,
  },
];

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-zinc-100 mb-3" style={OUTFIT}>Terms of Service</h1>
          <p className="text-zinc-500 text-sm" style={MONO}>
            Effective date: <span className="text-zinc-400">January 1, 2026</span>
            <span className="mx-3 text-zinc-700">·</span>
            Last updated: <span className="text-zinc-400">June 1, 2026</span>
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-px bg-[#27272A]">
          {SECTIONS.map(sec => (
            <div key={sec.id} className="bg-[#09090B] px-0">
              <div className="flex items-start gap-0 group">
                {/* Section number */}
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
            Questions?
          </span>
          <p className="text-zinc-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Contact us at{' '}
            <a
              href="mailto:legal@campuslaunch.io"
              className="text-[#2563EB] hover:text-blue-400 transition-colors"
              style={MONO}
            >
              legal@campuslaunch.io
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
