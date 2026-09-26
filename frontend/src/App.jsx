import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import { ProtectedRoute, RoleBasedRoute } from './components/common/ProtectedRoute';

// Public & Student Pages
import LandingPage from './pages/LandingPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import MyLearningPage from './pages/MyLearningPage';
import LearningPlayerPage from './pages/LearningPlayerPage';
import QuizPage from './pages/QuizPage';
import CertificatesPage from './pages/CertificatesPage';
import CertificateVerifyPage from './pages/CertificateVerifyPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Instructor Pages
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import InstructorCoursesPage from './pages/InstructorCoursesPage';
import CourseCreateEditPage from './pages/CourseCreateEditPage';
import InstructorLessonsPage from './pages/InstructorLessonsPage';
import InstructorStudentsPage from './pages/InstructorStudentsPage';
import InstructorAnalyticsPage from './pages/InstructorAnalyticsPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUserDetailsPage from './pages/AdminUserDetailsPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminCourseDetailsPage from './pages/AdminCourseDetailsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminCertificatesPage from './pages/AdminCertificatesPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

// Helper component to redirect /dashboard based on role
const DashboardRedirect = () => {
  const { isInstructor, isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (isInstructor) return <Navigate to="/instructor/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

// Layout wrapper to conditionally hide Navbar in distraction-free player
const AppLayout = () => {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith('/learn/');
  const isLanding = location.pathname === '/';

  return (
    <div className="app-container" style={isLanding ? { minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'visible' } : {}}>
      <Toast />
      {!isPlayer && <Navbar />}
      <main className={isLanding ? 'sketchbook-main' : 'main-content'} style={isLanding ? { padding: 0, margin: 0, flex: 1, height: 'calc(100vh - 72px)', width: '100%', overflow: 'hidden' } : {}}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CourseCatalogPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-certificate" element={<CertificateVerifyPage />} />
          <Route path="/verify-certificate/:certificateId" element={<CertificateVerifyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Authenticated Global Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                <StudentDashboardPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/my-learning"
            element={
              <ProtectedRoute>
                <MyLearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId/:lessonId"
            element={
              <ProtectedRoute>
                <LearningPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <CertificatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates/:certificateId"
            element={
              <ProtectedRoute>
                <CertificatesPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorDashboardPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/instructor/courses"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorCoursesPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/instructor/courses/create"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CourseCreateEditPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/edit"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CourseCreateEditPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/lessons"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorLessonsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/students"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorStudentsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/analytics"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorAnalyticsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/instructor/profile"
            element={
              <RoleBasedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <ProfilePage />
              </RoleBasedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminUsersPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminUserDetailsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminCoursesPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/courses/:id"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminCourseDetailsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminCategoriesPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminReviewsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/certificates"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminCertificatesPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminReportsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminSettingsPage />
              </RoleBasedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isPlayer && !isLanding && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppLayout />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
