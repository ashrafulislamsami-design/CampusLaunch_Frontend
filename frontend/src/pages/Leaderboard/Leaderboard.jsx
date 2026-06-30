import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Trophy, Users, Award, Star, TrendingUp, DollarSign, BookOpen, UserCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const DUMMY_UNI_RANKINGS = [
  { university: 'BUET', activeTeams: 24, totalFunding: 1250000, totalEvents: 18, totalMentorSessions: 142, totalCoursesFinished: 87, weightedScore: 9480 },
  { university: 'NSU', activeTeams: 19, totalFunding: 980000, totalEvents: 14, totalMentorSessions: 98, totalCoursesFinished: 63, weightedScore: 7210 },
  { university: 'BRAC University', activeTeams: 15, totalFunding: 720000, totalEvents: 11, totalMentorSessions: 74, totalCoursesFinished: 51, weightedScore: 5890 },
  { university: 'DU', activeTeams: 12, totalFunding: 540000, totalEvents: 9, totalMentorSessions: 61, totalCoursesFinished: 40, weightedScore: 4560 },
  { university: 'IUT', activeTeams: 9, totalFunding: 320000, totalEvents: 6, totalMentorSessions: 38, totalCoursesFinished: 28, weightedScore: 3120 },
];

const DUMMY_STUDENT_RANKINGS = [
  { _id: 'ds-1', name: 'Tanvir Ahmed', university: 'BUET', department: 'CSE', coursesFinished: 12, mentorSessions: 8, isAmbassador: true },
  { _id: 'ds-2', name: 'Nusrat Jahan', university: 'NSU', department: 'BBA', coursesFinished: 10, mentorSessions: 6, isAmbassador: false },
  { _id: 'ds-3', name: 'Rahim Khan', university: 'BRAC University', department: 'EEE', coursesFinished: 9, mentorSessions: 7, isAmbassador: false },
  { _id: 'ds-4', name: 'Sabrina Hossain', university: 'DU', department: 'Marketing', coursesFinished: 8, mentorSessions: 5, isAmbassador: true },
  { _id: 'ds-5', name: 'Kamal Uddin', university: 'IUT', department: 'ME', coursesFinished: 7, mentorSessions: 4, isAmbassador: false },
];

const Leaderboard = () => {
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('university');
  const [universityRankings, setUniversityRankings] = useState([]);
  const [studentRankings, setStudentRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'Organizer';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uniRes, studentRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/leaderboard/university`),
        axios.get(`${API_BASE_URL}/leaderboard/individual`)
      ]);
      setUniversityRankings(uniRes.data);
      setStudentRankings(studentRes.data);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNominate = async (studentId) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/leaderboard/ambassador/${studentId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success(res.data.message);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Nomination error:', err);
      toast.error('Failed to update ambassador status');
    }
  };

  const displayUni = universityRankings.length > 0 ? universityRankings : DUMMY_UNI_RANKINGS;
  const displayStudents = studentRankings.length > 0 ? studentRankings : DUMMY_STUDENT_RANKINGS;

  const tabBtnStyle = (active) => ({
    ...MONO,
    backgroundColor: active ? '#2563EB' : '#18181B',
    color: active ? 'white' : '#71717A',
    borderColor: active ? '#2563EB' : '#27272A',
  });

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-10">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="mb-8 bg-[#18181B] border border-[#27272A] rounded-sm p-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 bg-[#2563EB]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                Rankings
              </span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-100 flex items-center gap-3" style={OUTFIT}>
              <Trophy size={32} className="text-[#2563EB]" />
              Campus Ecosystem Leaderboard
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Celebrating the most active universities and stellar student entrepreneurs across the nation.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold" style={MONO}>Current Cycle</span>
            <span className="text-xs text-zinc-400" style={MONO}>Week 16 · Apr 20 – Apr 27, 2026</span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp size={12} className="text-[#2563EB]" />
              <span className="text-[10px] text-[#2563EB] font-semibold uppercase tracking-widest" style={MONO}>Live</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('university')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold uppercase tracking-widest text-xs border transition-colors"
            style={tabBtnStyle(activeTab === 'university')}
          >
            <Award size={14} /> University Rank
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold uppercase tracking-widest text-xs border transition-colors"
            style={tabBtnStyle(activeTab === 'student')}
          >
            <Users size={14} /> Student Stars
          </button>
        </div>

        {/* ── Main Container ───────────────────────────────────────── */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Trophy size={40} className="text-zinc-700 mb-3" />
              <p className="text-zinc-600 text-xs uppercase tracking-widest font-semibold" style={MONO}>Crunching Numbers...</p>
            </div>
          ) : activeTab === 'university' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    {['Rank', 'University', 'Teams', 'Funding', 'Events', 'Mentors', 'Grads', 'Score'].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayUni.map((uni, idx) => {
                    const isTop1 = idx === 0;
                    return (
                      <tr
                        key={uni.university}
                        className="border-b border-[#27272A] last:border-0 hover:bg-[#1F1F23] transition-colors"
                        style={isTop1 ? { backgroundColor: '#2563EB08' } : {}}
                      >
                        <td className="px-5 py-4">
                          <div
                            className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold"
                            style={{
                              ...MONO,
                              backgroundColor: isTop1 ? '#2563EB' : '#27272A',
                              color: isTop1 ? 'white' : '#71717A',
                            }}
                          >
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-100" style={OUTFIT}>{uni.university}</span>
                            {isTop1 && (
                              <span className="bg-[#2563EB] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-widest" style={MONO}>
                                Leader
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5" style={MONO}>
                            <BookOpen size={12} className="text-[#2563EB]" />
                            {uni.activeTeams}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5" style={MONO}>
                            <DollarSign size={12} className="text-green-500" />
                            {uni.totalFunding.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5" style={MONO}>
                            <Star size={12} className="text-amber-400" />
                            {uni.totalEvents}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5" style={MONO}>
                            <Users size={12} className="text-purple-400" />
                            {uni.totalMentorSessions}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5" style={MONO}>
                            <Star size={12} className="text-teal-400" />
                            {uni.totalCoursesFinished}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className="text-lg font-bold"
                            style={{ ...OUTFIT, color: isTop1 ? '#2563EB' : '#A1A1AA' }}
                          >
                            {uni.weightedScore.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    {['Rank', 'Student', 'University / Dept', 'Courses', 'Sessions', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayStudents.map((student, idx) => {
                    const isTop1 = idx === 0;
                    return (
                      <tr
                        key={student._id}
                        className="border-b border-[#27272A] last:border-0 hover:bg-[#1F1F23] transition-colors"
                        style={isTop1 ? { backgroundColor: '#2563EB08' } : {}}
                      >
                        <td className="px-5 py-4">
                          <div
                            className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold"
                            style={{
                              ...MONO,
                              backgroundColor: isTop1 ? '#2563EB' : '#27272A',
                              color: isTop1 ? 'white' : '#71717A',
                            }}
                          >
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-100" style={OUTFIT}>{student.name}</span>
                            {student.isAmbassador && (
                              <span className="flex items-center gap-1 text-[10px] text-[#2563EB] font-semibold uppercase tracking-widest mt-0.5" style={MONO}>
                                <UserCheck size={11} /> Ambassador
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-semibold text-zinc-300" style={OUTFIT}>{student.university}</div>
                          <div className="text-[10px] text-zinc-500 font-medium" style={MONO}>{student.department}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5" style={MONO}>
                            <BookOpen size={12} className="text-[#2563EB]" />
                            {student.coursesFinished || 0}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5" style={MONO}>
                            <Users size={12} className="text-purple-400" />
                            {student.mentorSessions || 0}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {isAdmin ? (
                            <button
                              onClick={() => handleNominate(student._id)}
                              className="px-3 py-1.5 rounded-sm text-[10px] font-semibold uppercase tracking-widest border transition-colors"
                              style={{
                                ...MONO,
                                backgroundColor: student.isAmbassador ? '#7F1D1D20' : '#16A34A18',
                                color: student.isAmbassador ? '#F87171' : '#4ADE80',
                                borderColor: student.isAmbassador ? '#F8717130' : '#4ADE8030',
                              }}
                            >
                              {student.isAmbassador ? 'Revoke Amb.' : 'Nominate Amb.'}
                            </button>
                          ) : (
                            student.isAmbassador && <Star size={18} className="text-amber-400 ml-auto" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-zinc-600 text-xs font-semibold flex items-center justify-center gap-2" style={MONO}>
          <TrendingUp size={14} className="text-zinc-700" />
          Rankings updated in real-time based on startup activity, mentor sessions, and curriculum progress.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
