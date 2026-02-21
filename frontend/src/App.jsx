import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CourseView from './pages/CourseView';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminMeetings from './pages/AdminMeetings';
import UserMeetings from './pages/UserMeetings';
import CourseCatalog from './pages/CourseCatalog';
import StudentProgress from './pages/StudentProgress';
import LiveClass from './pages/LiveClass';
import ProtectedRoute from './components/ProtectedRoute';
import RecordedVideos from './pages/RecordedVideos';
import AdminGroups from './pages/AdminGroups';
import AdminSystemUsers from './pages/AdminSystemUsers';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

import AdminSettings from './pages/AdminSettings';

function App() {
  const location = useLocation();
  // We hide the global navbar on auth pages AND within the dashboard layouts (since they have their own Sidebar)
  const hideNavbarRoutes = ['/login', '/signup', '/admin-dashboard', '/admin-users', '/admin-members', '/admin-courses', '/admin-knowledge', '/admin-videos', '/admin-groups', '/admin-system-users', '/admin-meetings', '/admin-settings', '/user-dashboard', '/user-meetings', '/courses', '/progress', '/profile'];

  // Actually, simplified: If the path starts with /admin or /user, we probably hide the global top navbar
  // But for now let's just use the list or a regex.
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user') || location.pathname === '/courses' || location.pathname === '/progress' || location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show Global Navbar only on Home page and generic pages, NOT on Dashboards which have Sidebar */}
      {!hideNavbarRoutes.includes(location.pathname) && !location.pathname.startsWith('/live/') && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/superadmin-login" element={<SuperAdminLogin />} />

        {/* Super Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
          <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-members" element={<AdminUsers />} /> {/* Alias for Sidebar */}

          <Route path="/admin-courses" element={<AdminCourses />} />
          <Route path="/admin-knowledge" element={<AdminCourses />} />
          <Route path="/admin-videos" element={<RecordedVideos />} />
          <Route path="/admin-groups" element={<AdminGroups />} />
          <Route path="/admin-system-users" element={<AdminSystemUsers />} />

          <Route path="/admin-meetings" element={<AdminMeetings />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
          <Route path="/user-meetings" element={<UserMeetings />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/progress" element={<RecordedVideos />} />
          <Route path="/course/:id" element={<CourseView />} />
          <Route path="/live/:meetingId" element={<LiveClass />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
