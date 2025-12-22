import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicRoute from './components/layout/PublicRoute';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SearchTeachers from './pages/student/SearchTeachers';
import TeacherProfilePublic from './pages/student/TeacherProfilePublic';
import MyBookings from './pages/student/MyBookings';
import MyRequests from './pages/student/MyRequests';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherRequests from './pages/teacher/TeacherRequests';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import TeacherProfile from './pages/teacher/TeacherProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Redirects to dashboard if logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<DashboardLayout role="student" />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="search" element={<SearchTeachers />} />
          <Route path="teacher/:id" element={<TeacherProfilePublic />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="requests" element={<MyRequests />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<DashboardLayout role="teacher" />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="requests" element={<TeacherRequests />} />
          <Route path="schedule" element={<TeacherSchedule />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
