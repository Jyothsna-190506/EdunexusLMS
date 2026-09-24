import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import { ProtectedRoute, RoleBasedRoute } from './components/common/ProtectedRoute';

// Pages
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
import CertificateVerifyPage from './pages/CertificateVerifyPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import InstructorCoursesPage from './pages/InstructorCoursesPage';
import CourseCreateEditPage from './pages/CourseCreateEditPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminReportsPage from './pages/AdminReportsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Helper component to redirect /dashboard based on role
const DashboardRedirect = () => {
  const { user, isStudent, isInstructor, isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (isInstructor) return <Navigate to="/instructor/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

// Layout wrapper to conditionally hide Navbar / Footer in distraction-free player
const AppLayout = () => {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith('/learn/');

  return (
    <div className="app-container">
      <Toast />
      {!isPlayer && <Navbar />}
      <main className="main-content">
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

          {/* Authenticated Routes */}
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
            path="/admin/courses"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminCoursesPage />
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

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isPlayer && <Footer />}
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
