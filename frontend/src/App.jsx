import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationHandler from './components/NotificationHandler';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import StatusPage from './pages/Legal/StatusPage';
import TermsPage from './pages/Legal/TermsPage';
import PrivacyPage from './pages/Legal/PrivacyPage';
import StudentHome from './pages/Home/StudentHome';
import CreateTeam from './pages/StartupTeam/CreateTeam';
import TeamDashboard from './pages/StartupTeam/TeamDashboard';
import PublicProfile from './pages/StartupTeam/PublicProfile';
import BrowseTeams from './pages/StartupTeam/BrowseTeams';
import PortfolioEditor from './pages/StartupTeam/PortfolioEditor';
import ProfileSettings from './pages/Profile/ProfileSettings';
import FundingDirectory from './pages/Funding/FundingDirectory';
import CoFounderMatching from './pages/Matching/CoFounderMatching';
import StudentProfile from './pages/Profile/StudentProfile';
import BrowseProfiles from './pages/Profile/BrowseProfiles';
import MentorList from './pages/Mentors/MentorList';
import BookSession from './pages/Mentors/BookSession';
import MyBookings from './pages/Mentors/MyBookings';
import Leaderboard from './pages/Leaderboard/Leaderboard';
// Event Hub
import EventHub      from './pages/Events/EventHub';
import EventDetail   from './pages/Events/EventDetail';
import CreateEvent   from './pages/Events/CreateEvent';
import MyEvents      from './pages/Events/MyEvents';
import EventArchive  from './pages/Events/EventArchive';

// Pitch Deck
import MyDecks    from './pages/PitchDeck/MyDecks';
import UploadDeck from './pages/PitchDeck/UploadDeck';
import ReviewDeck from './pages/PitchDeck/ReviewDeck';
import DeckReport from './pages/PitchDeck/DeckReport';


const CanvasBuilderPage = lazy(() => import('./pages/CanvasBuilderPage'));
const EmailPreferencesPage = lazy(() => import('./pages/EmailPreferencesPage'));
const CurriculumPage = lazy(() => import('./pages/Curriculum/CurriculumPage'));
const CurriculumWeekPage = lazy(() => import('./pages/Curriculum/CurriculumWeekPage'));
const CurriculumCertificate = lazy(() => import('./pages/Curriculum/CurriculumCertificate'));
const PitchArenaPage = lazy(() => import('./pages/PitchArena/PitchArenaPage'));
const PitchEventDetailPage = lazy(() => import('./pages/PitchArena/PitchEventDetailPage'));
const PitchLiveRoomPage = lazy(() => import('./pages/PitchArena/PitchLiveRoomPage'));
const PitchAudiencePage = lazy(() => import('./pages/PitchArena/PitchAudiencePage'));
const PitchResultsPage = lazy(() => import('./pages/PitchArena/PitchResultsPage'));

const LazyFallback = () => (
  <div className="flex items-center justify-center py-24">
    <div className="text-zinc-500 text-[11px] uppercase tracking-widest" style={{ fontFamily: "'Geist Mono', monospace" }}>Loading...</div>
  </div>
);
import ConnectionRequests from './pages/Matching/ConnectionRequests';
import ConnectionsDashboard from './pages/Matching/ConnectionsDashboard';
import PrivateChat from './pages/Matching/PrivateChat';
import NotificationInbox from './pages/Notifications/NotificationInbox';

// AI Validator
import AIValidator from './pages/AI/AIValidator';
import AIReportPage from './pages/AI/AIReportPage';

// Resources
import Resources from './pages/Resources/Resources';
import AddResource from './pages/Resources/AddResource';
import ResourceDetail from './pages/Resources/ResourceDetail';
import EditResource from './pages/Resources/EditResource';

// Admin Panel
import AdminRoute from './components/AdminRoute';
const AdminDashboard    = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminMentors      = lazy(() => import('./pages/Admin/AdminMentors'));
const AdminOrganizers   = lazy(() => import('./pages/Admin/AdminOrganizers'));
const AdminReports      = lazy(() => import('./pages/Admin/AdminReports'));
const AdminFeatured     = lazy(() => import('./pages/Admin/AdminFeatured'));
const AdminUsers        = lazy(() => import('./pages/Admin/AdminUsers'));
const AdminStats        = lazy(() => import('./pages/Admin/AdminStats'));

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// AppShell: suppresses the Navbar and Footer on the dedicated landing page
const AppShell = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col overflow-x-hidden">
      {!isLanding && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isLanding && <Footer />}
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationHandler />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#18181B',
              color: '#FAFAFA',
              border: '1px solid #27272A',
              borderRadius: '2px',
              fontFamily: "'Geist Mono', monospace",
              fontSize: '12px',
            },
          }}
        />
        <AppShell>
            <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/status"  element={<StatusPage />} />
              <Route path="/terms"   element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/startup/:id" element={<PublicProfile />} />
              {/* Event Hub */}
              <Route path="/events/browse" element={<EventHub />} />
              <Route path="/events/archive" element={<EventArchive />} />
              <Route path="/events/my" element={<PrivateRoute><MyEvents /></PrivateRoute>} />
              <Route path="/events/create" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/edit" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />

              {/* Pitch Deck */}
              <Route path="/decks" element={<PrivateRoute><MyDecks /></PrivateRoute>} />
              <Route path="/decks/upload" element={<PrivateRoute><UploadDeck /></PrivateRoute>} />
              <Route path="/decks/:id/version" element={<PrivateRoute><UploadDeck /></PrivateRoute>} />
              <Route path="/decks/:id/review" element={<PrivateRoute><ReviewDeck /></PrivateRoute>} />
              <Route path="/decks/:id/report" element={<PrivateRoute><DeckReport /></PrivateRoute>} />
              
              <Route path="/profile/me" element={
                <PrivateRoute><StudentProfile /></PrivateRoute>
              } />
              <Route path="/profiles" element={<BrowseProfiles />} />
              <Route path="/profiles/:id" element={<StudentProfile />} />

              <Route path="/mentors" element={<MentorList />} />
              <Route path="/mentors/:mentorId/book" element={
                  <PrivateRoute><BookSession /></PrivateRoute>
              } />
              <Route path="/bookings/my" element={
                  <PrivateRoute><MyBookings /></PrivateRoute>
              } />
              

              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfileSettings />
                </PrivateRoute>
              } />
              
              <Route path="/home" element={
                <PrivateRoute>
                  <StudentHome />
                </PrivateRoute>
              } />
              <Route path="/events" element={
                <PrivateRoute>
                  <EventHub />
                </PrivateRoute>
              } />
              <Route path="/funding" element={
                <PrivateRoute>
                  <FundingDirectory />
                </PrivateRoute>
              } />

              <Route path="/matching" element={
                <PrivateRoute>
                  <CoFounderMatching />
                </PrivateRoute>
              } />

              <Route path="/curriculum" element={
                <PrivateRoute>
                  <CurriculumPage />
                </PrivateRoute>
              } />
              <Route path="/curriculum/week/:weekNumber" element={
                <PrivateRoute>
                  <CurriculumWeekPage />
                </PrivateRoute>
              } />
              <Route path="/curriculum/certificate" element={
                <PrivateRoute>
                  <CurriculumCertificate />
                </PrivateRoute>
              } />

              <Route path="/pitch-arena" element={
                <PrivateRoute>
                  <PitchArenaPage />
                </PrivateRoute>
              } />
              <Route path="/pitch-arena/event/:eventId" element={
                <PrivateRoute>
                  <PitchEventDetailPage />
                </PrivateRoute>
              } />
              <Route path="/pitch-arena/event/:eventId/room" element={
                <PrivateRoute>
                  <PitchLiveRoomPage />
                </PrivateRoute>
              } />
              <Route path="/pitch-arena/event/:eventId/audience" element={
                <PrivateRoute>
                  <PitchAudiencePage />
                </PrivateRoute>
              } />
              <Route path="/pitch-arena/event/:eventId/results" element={
                <PrivateRoute>
                  <PitchResultsPage />
                </PrivateRoute>
              } />

              <Route path="/connections" element={
                <PrivateRoute>
                  <ConnectionsDashboard />
                </PrivateRoute>
              } />

              <Route path="/requests" element={
                <PrivateRoute>
                  <ConnectionRequests />
                </PrivateRoute>
              } />

              <Route path="/chat/:connectionId" element={
                <PrivateRoute>
                  <PrivateChat />
                </PrivateRoute>
              } />

              <Route path="/teams/create" element={
                <PrivateRoute>
                  <CreateTeam />
                </PrivateRoute>
              } />
              <Route path="/teams/dashboard/:teamId" element={
                <PrivateRoute>
                  <TeamDashboard />
                </PrivateRoute>
              } />
              <Route path="/teams/browse" element={<BrowseTeams />} />
              <Route path="/teams/:teamId/portfolio/edit" element={
                <PrivateRoute>
                  <PortfolioEditor />
                </PrivateRoute>
              } />
              <Route path="/notifications" element={
                <PrivateRoute>
                  <NotificationInbox />
                </PrivateRoute>
              } />

              <Route path="/ai-validator" element={
                <PrivateRoute>
                  <AIValidator />
                </PrivateRoute>
              } />
              <Route path="/ai/report/:id" element={
                <PrivateRoute>
                  <AIReportPage />
                </PrivateRoute>
              } />
              <Route path="/leaderboard" element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              } />

              {/* Canvas Builder (Business Model Canvas) — additive routes */}
              <Route path="/canvas/:teamId" element={
                <PrivateRoute>
                  <CanvasBuilderPage />
                </PrivateRoute>
              } />
              <Route path="/canvas/share/:shareToken" element={<CanvasBuilderPage />} />

              {/* Automated Email Communication System — additive route */}
              <Route path="/settings/email-preferences" element={
                <PrivateRoute>
                  <EmailPreferencesPage />
                </PrivateRoute>
              } />

              {/* ── Admin Panel ─────────────────────────────────────────── */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />
              <Route path="/admin/mentors" element={
                <AdminRoute><AdminMentors /></AdminRoute>
              } />
              <Route path="/admin/organizers" element={
                <AdminRoute><AdminOrganizers /></AdminRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminRoute><AdminReports /></AdminRoute>
              } />
              <Route path="/admin/featured" element={
                <AdminRoute><AdminFeatured /></AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute><AdminUsers /></AdminRoute>
              } />
              <Route path="/admin/stats" element={
                <AdminRoute><AdminStats /></AdminRoute>
              } />

              {/* Resource Library */}
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/add" element={
                <PrivateRoute>
                  <AddResource />
                </PrivateRoute>
              } />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/resources/:id/edit" element={
                <PrivateRoute>
                  <EditResource />
                </PrivateRoute>
              } />
            </Routes>
            </Suspense>
        </AppShell>
      </Router>
    </AuthProvider>
  );
}

export default App;
