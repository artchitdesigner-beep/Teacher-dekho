import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import BecomeTutor from './pages/BecomeTutor';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicRoute from './components/layout/PublicRoute';
import PublicLayout from './components/layout/PublicLayout';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SearchTeachers from './pages/student/SearchTeachers';
import TeacherProfilePublic from './pages/student/TeacherProfilePublic';
import MyCourses from './pages/student/MyCourses';
import MyRequests from './pages/student/MyRequests';
import BookingDetail from './pages/student/BookingDetail';
import SavedTeachers from './pages/student/SavedTeachers';
import BatchDetails from './pages/student/BatchDetails';
import Wallet from './pages/student/Wallet';
import StudentProfile from './pages/student/StudentProfile';
import BookingCheckout from './pages/student/BookingCheckout';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherRequests from './pages/teacher/TeacherRequests';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherBookingDetail from './pages/teacher/TeacherBookingDetail';
import TeacherAvailability from './pages/teacher/TeacherAvailability';
import TeacherWallet from './pages/teacher/TeacherWallet';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Explorable Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/search" element={<SearchTeachers />} />
          <Route path="/become-tutor" element={<BecomeTutor />} />
          <Route path="/batch/:id" element={<BatchDetails />} />
          <Route path="/teacher/:id" element={<TeacherProfilePublic />} />
        </Route>

        {/* Auth Routes - Redirects to dashboard if logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<DashboardLayout role="student" />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="courses/:id" element={<BookingDetail />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="saved" element={<SavedTeachers />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="batch/:id" element={<BatchDetails />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="search" element={<SearchTeachers />} />
          <Route path="batches" element={<SearchTeachers />} />
          <Route path="teacher/:id" element={<TeacherProfilePublic />} />
          <Route path="booking/checkout" element={<BookingCheckout />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<DashboardLayout role="teacher" />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="requests" element={<TeacherRequests />} />
          <Route path="schedule" element={<TeacherSchedule />} />
          <Route path="availability" element={<TeacherAvailability />} />
          <Route path="wallet" element={<TeacherWallet />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="bookings/:id" element={<TeacherBookingDetail />} />
          <Route path="notifications" element={<Notifications />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
