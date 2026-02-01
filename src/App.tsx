import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicRoute from './components/layout/PublicRoute';
import PublicLayout from './components/layout/PublicLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import { useAuth } from './lib/auth-context';

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700"></div>
  </div>
);

// Public Pages
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Login = lazy(() => import('./pages/Login'));
const BecomeTutor = lazy(() => import('./pages/BecomeTutor'));
const Corporate = lazy(() => import('./pages/Corporate'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SeedData = lazy(() => import('./pages/SeedData'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const SearchTeachers = lazy(() => import('./pages/student/SearchTeachers'));
const TeacherProfilePublic = lazy(() => import('./pages/student/TeacherProfilePublic'));
const MyCourses = lazy(() => import('./pages/student/MyCourses'));
const MyRequests = lazy(() => import('./pages/student/MyRequests'));
const BookingDetail = lazy(() => import('./pages/student/BookingDetail'));
const MyTeachers = lazy(() => import('./pages/student/MyTeachers'));
const BatchDetails = lazy(() => import('./pages/student/BatchDetails'));
const Wallet = lazy(() => import('./pages/student/Wallet'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));
const BookingCheckout = lazy(() => import('./pages/student/BookingCheckout'));
const StudentResources = lazy(() => import('./pages/student/StudentResources'));

// Teacher Pages
const TeacherStudents = lazy(() => import('./pages/teacher/TeacherStudents'));
const TeacherBatches = lazy(() => import('./pages/teacher/TeacherBatches'));
const TeacherReports = lazy(() => import('./pages/teacher/TeacherReports'));
const TeacherRequests = lazy(() => import('./pages/teacher/TeacherRequests'));
const TeacherIntegrations = lazy(() => import('./pages/teacher/TeacherIntegrations'));
const TeacherBackOffice = lazy(() => import('./pages/teacher/TeacherBackOffice'));
const TeacherExpenses = lazy(() => import('./pages/teacher/TeacherExpenses'));
const TeacherSchedule = lazy(() => import('./pages/teacher/TeacherSchedule'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherProfile = lazy(() => import('./pages/teacher/TeacherProfile'));
const TeacherBookingDetail = lazy(() => import('./pages/teacher/TeacherBookingDetail'));
const TeacherAvailability = lazy(() => import('./pages/teacher/TeacherAvailability'));
const TeacherWallet = lazy(() => import('./pages/teacher/TeacherWallet'));
const TeacherClassManage = lazy(() => import('./pages/teacher/TeacherClassManage'));
const Notifications = lazy(() => import('./pages/Notifications'));

// Role-based Home Component
const Home = () => {
  const { user, userRole } = useAuth();

  if (user && userRole === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return <StudentDashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Explorable Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/search" element={<SearchTeachers />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/become-tutor" element={<BecomeTutor />} />
            <Route path="/batch/:id" element={<BatchDetails />} />
            <Route path="/teacher/:id" element={<TeacherProfilePublic />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Route>

          {/* Auth Routes - Redirects to dashboard if logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<DashboardLayout role="student" />}>
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="courses/:id" element={<BookingDetail />} />
            <Route path="requests" element={<MyRequests />} />
            <Route path="teachers" element={<MyTeachers />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="batch/:id" element={<BatchDetails />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="search" element={<SearchTeachers />} />
            <Route path="batches" element={<SearchTeachers />} />
            <Route path="teacher/:id" element={<TeacherProfilePublic />} />
            <Route path="booking/checkout" element={<BookingCheckout />} />
            <Route path="resources" element={<StudentResources />} />
            <Route index element={<Navigate to="/" replace />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="batches" element={<TeacherBatches />} />
            <Route path="reports" element={<TeacherReports />} />
            <Route path="requests" element={<TeacherRequests />} />
            <Route path="uploads" element={<TeacherIntegrations />} />
            <Route path="back-office" element={<TeacherBackOffice />} />
            <Route path="expenses" element={<TeacherExpenses />} />
            <Route path="setup" element={<TeacherExpenses />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="availability" element={<TeacherAvailability />} />
            <Route path="wallet" element={<TeacherWallet />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="batches/:id" element={<TeacherClassManage />} />
            <Route path="bookings/:id" element={<TeacherBookingDetail />} />
            <Route path="notifications" element={<Notifications />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Catch all */}
          <Route path="/seed" element={<SeedData />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
