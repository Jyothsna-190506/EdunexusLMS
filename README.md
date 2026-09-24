# 🎓 EduNexus LMS - Enterprise Learning Management System

> **"Learn Skills. Build Your Future."**  
> A full-stack commercial-grade EdTech SaaS platform engineered with **Java Spring Boot 3**, **Spring Security + JWT**, **MongoDB Atlas**, **React + Vite**, and a **custom CSS design system**.

---

## 🌟 Key Highlights & Features

### 👨‍🎓 1. Student Experience
- **Interactive Landing & Discovery**: High-converting Hero banner, dynamic statistics (`10,000+ Students`, `250+ Courses`, `100+ Instructors`), popular courses showcase, curriculum overview, and testimonials.
- **Course Catalog & Multi-Filters**: Real-time search across titles/skills, category filtering (AI, Java, Web Dev, DevOps, Cybersecurity, Python, etc.), difficulty levels, and price/rating sorting.
- **Detailed Course Previews**: Comprehensive syllabi breakdown by modules, learning outcomes checklist, prerequisites, instructor biographies, and student reviews.
- **Distraction-Free Video Learning Player**: Full HD video streaming with ReactPlayer, responsive curriculum sidebar with lesson progress indicators, dynamic notes scratchpad (persisted in browser), and one-click lesson completion.
- **Interactive Assessment & Quiz Engine**: Timed multi-question exams, instant submission with score calculation, pass/fail evaluation (70% passing threshold), detailed answer explanations, and celebration confetti.
- **Cryptographic & QR-Verifiable Certificates**: Automated digital certificate issuance upon course completion, public `/verify-certificate/:id` lookup with QR code rendering, and high-resolution PDF download using jsPDF.
- **Personalized Student Dashboard**: Continue Learning spotlight, progress metrics, Recharts weekly study activity analytics, and recommended courses.
- **My Learning Hub**: Dedicated course tracker with In-Progress, Completed, and Certificate download links.

### 👨‍🏫 2. Instructor Studio
- **Instructor Dashboard**: Real-time revenue metrics, active student counts, average ratings, and Recharts monthly revenue and student enrollment growth charts.
- **Multi-Step Course Creation Wizard**:
  1. *Basic Info*: Title, Description, Category, Difficulty, Duration
  2. *Media*: Thumbnail image URL and promo video
  3. *Curriculum Builder*: Dynamic Modules with unlimited video lessons
  4. *Quiz Builder*: Dynamic multiple-choice questions with answer keys and explanations
  5. *Pricing & Outcomes*: Price, discount percentages, learning outcomes, and requirements
- **Course Management**: Edit syllabi, delete courses, toggle publication status, and preview student view.

### ⚡ 3. Platform Administration
- **Executive Admin Dashboard**: Platform-wide KPIs (Total Users, Active Students, Instructors, Courses, Enrollments, Gross Revenue).
- **Demographics & Analytics**: User role distribution pie charts and enrollment scale area charts.
- **User Management Suite**: Searchable data table with role updating (`STUDENT`, `INSTRUCTOR`, `ADMIN`), active/disabled status toggle, and account deletion.
- **Course Moderation**: Global catalog inspection and moderation controls.
- **Performance & Audit Reports**: Revenue breakdowns and completion rates across technology categories.

### 🎨 4. Design System & Accessibility
- **Curated Color Palette**: Primary (`#4F46E5`), Secondary (`#7C3AED`), Accent (`#06B6D4`), Background (`#F8FAFC`), Dark (`#0F172A`).
- **Dark & Light Mode**: Smooth theme toggling persisted via `localStorage`.
- **Responsive Layout**: Desktop, laptop, tablet, and mobile layouts.
- **Micro-Animations & Feedback**: Non-intrusive toast notifications, skeleton loaders, and interactive rating stars.

---

## 🏗️ Architecture & Technology Stack

```text
React (Vite) Frontend
      │  (Axios Interceptors with Bearer JWT)
      ▼
Spring Boot 3.3.x REST API
      │
 ┌────┴─────────────────────────────┐
 │ Controller Layer                 │  (DTO Request/Response Validation)
 │ Service Layer                    │  (Business Logic & Token Generation)
 │ Security (Spring Security + JJWT)│  (Stateless BCrypt Authentication)
 │ Repository Layer                 │  (Spring Data MongoDB)
 └────┬─────────────────────────────┘
      ▼
MongoDB Atlas Cloud Cluster (edunexus_lms)
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM 7, Axios, Lucide React, Recharts, React Player, jsPDF, html2canvas, QRCode, Canvas Confetti |
| **Backend** | Java 17+, Spring Boot 3.3.4, Spring Security 6, JJWT 0.12.5, Spring Data MongoDB, Dotenv Java, Bean Validation |
| **Database** | MongoDB Atlas Cloud (`edunexus_lms` database) |
| **Styling** | Vanilla CSS3 Custom Design System (CSS Variables, Glassmorphism, HSL Palettes) |

---

## 📁 Project Structure

```text
edunexus-lms/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/ (Navbar, Footer, Sidebar, CourseCard, RatingStars, ProgressBar, StatCard, Toast, Modal, SkeletonLoader, LoadingSpinner, ProtectedRoute)
│   │   ├── context/ (AuthContext, ThemeContext, NotificationContext)
│   │   ├── pages/ (LandingPage, CourseCatalogPage, CourseDetailsPage, LoginPage, RegisterPage, ForgotPasswordPage, StudentDashboardPage, MyLearningPage, LearningPlayerPage, QuizPage, CertificateVerifyPage, InstructorDashboardPage, InstructorCoursesPage, CourseCreateEditPage, AdminDashboardPage, AdminUsersPage, AdminCoursesPage, AdminReportsPage, ProfilePage, AboutPage, ContactPage, NotFoundPage)
│   │   ├── services/ (api.js)
│   │   ├── styles/ (index.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── src/main/java/com/edunexus/lms/
│   │   ├── controller/ (AuthController, CourseController, EnrollmentController, ProgressController, QuizController, CertificateController, ReviewController, NotificationController, AdminController)
│   │   ├── service/ (AuthService, CourseService, EnrollmentService, ProgressService, QuizService, CertificateService, ReviewService, NotificationService, AdminService, DataSeederService)
│   │   ├── repository/ (UserRepository, CourseRepository, EnrollmentRepository, ProgressRepository, QuizRepository, QuizAttemptRepository, CertificateRepository, ReviewRepository, NotificationRepository)
│   │   ├── model/ (User, Course, Module, Lesson, Enrollment, Progress, Quiz, Question, QuizAttempt, Certificate, Review, Notification)
│   │   ├── dto/ (AuthResponse, LoginRequest, RegisterRequest, LessonProgressRequest, QuizAttemptRequest, QuizResultResponse, StatsResponse, InstructorStatsResponse, ApiResponse, etc.)
│   │   ├── security/ (JwtUtil, JwtAuthenticationFilter, UserDetailsServiceImpl, UserPrincipal, SecurityConfig, CorsConfig)
│   │   ├── exception/ (GlobalExceptionHandler, BadRequestException, ResourceNotFoundException, UnauthorizedException)
│   │   └── EduNexusLmsApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   ├── .env
│   └── .env.example
├── README.md
└── .gitignore
```

---

## 🔐 Demo Credentials

Use the **1-Click Demo Login** buttons on the `/login` page or use these credentials:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | `emma.watson@edunexus.com` (or `student@edunexus.edu`) | `Student@123` (or `password123`) | Browse, Enroll, Stream Video Lessons, Complete Quizzes, Download Certificates |
| **👨‍🏫 Instructor** | `alex.chen@edunexus.com` (or `instructor@edunexus.edu`) | `Instructor@123` (or `password123`) | Multi-step Course Creation, Manage Lessons & Quizzes, Instructor Analytics |
| **⚡ Admin** | `admin@edunexus.com` (or `admin@edunexus.edu`) | `Admin@123` (or `admin123`) | Platform Analytics, User Management, Role Elevation, Course Moderation |

---

## 🚀 Running the Application Locally

### Prerequisites
- **Java 17+** (JDK 17, 21, or 26)
- **Apache Maven 3.9+**
- **Node.js 18+** & **npm 9+**

### 1. Backend Setup (Spring Boot)
```bash
cd backend

# Create .env file with your MongoDB Atlas credentials:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.whbx5g0.mongodb.net
# JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970337336763979244226452948404D6351
# PORT=8080

# Build and run the backend
mvn spring-boot:run
```
*Backend runs on:* `http://localhost:8080`

### 2. Frontend Setup (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 🌐 REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user (Student / Instructor)
- `POST /api/auth/login` - Authenticate user & issue signed JWT
- `GET /api/auth/me` - Get profile of authenticated user

### Courses (`/api/courses`)
- `GET /api/courses` - Search, filter, and retrieve catalog courses
- `GET /api/courses/{id}` - Fetch course syllabus, modules & instructor details
- `POST /api/courses` - Create new course (Instructor/Admin)
- `PUT /api/courses/{id}` - Update course details & syllabus (Instructor/Admin)
- `DELETE /api/courses/{id}` - Remove course from platform (Instructor/Admin)

### Enrollments & Progress (`/api/enrollments`, `/api/progress`)
- `POST /api/enrollments` - Enroll student in course
- `GET /api/enrollments/my` - Get all student enrollments
- `GET /api/enrollments/course/{courseId}` - Get enrollment status for a course
- `POST /api/progress` - Mark lesson as completed and recalculate course progress %
- `GET /api/progress/course/{courseId}` - Get student's completed lessons & %

### Quizzes & Assessments (`/api/quizzes`)
- `GET /api/quizzes/{courseId}` - Get course quiz assessment
- `POST /api/quizzes` - Create/update course quiz with questions & explanations
- `POST /api/quizzes/{quizId}/attempt` - Submit exam answers & receive graded score

### Certificates & Verification (`/api/certificates`)
- `GET /api/certificates/my` - Get student's issued certificates
- `GET /api/certificates/{id}` - Get certificate metadata
- `GET /api/certificates/verify/{certificateId}` - Public cryptographic certificate verification

### Reviews & Notifications (`/api/reviews`, `/api/notifications`)
- `GET /api/reviews/course/{courseId}` - Fetch student reviews for course
- `POST /api/reviews` - Submit course rating & review
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

### Admin Suite (`/api/admin`)
- `GET /api/admin/users` - List all registered users
- `PUT /api/admin/users/{id}/role` - Update user role (`STUDENT`, `INSTRUCTOR`, `ADMIN`)
- `PUT /api/admin/users/{id}/status` - Toggle user account status (`ACTIVE` / `DISABLED`)
- `DELETE /api/admin/users/{id}` - Delete user account
- `GET /api/admin/statistics` - Platform operational KPIs

---

## 🔒 Security Compliance
- **Password Encryption**: BCrypt password hashing with high salt work-factor.
- **JWT Authentication**: High-entropy HMAC-SHA algorithm with automatic expiry.
- **Role-Based Authorization**: `hasRole('ADMIN')`, `hasAnyRole('INSTRUCTOR', 'ADMIN')` method-level & endpoint security.
- **Zero Hardcoded Secrets**: Credentials managed via environment variables and `.env` files.

---

## 📄 License
© 2026 **EduNexus LMS Platform**. All rights reserved.
