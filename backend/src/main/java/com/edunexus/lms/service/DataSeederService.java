package com.edunexus.lms.service;

import com.edunexus.lms.model.*;
import com.edunexus.lms.model.Module;
import com.edunexus.lms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DataSeederService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final ReviewRepository reviewRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeederService(UserRepository userRepository,
                             CourseRepository courseRepository,
                             QuizRepository quizRepository,
                             ReviewRepository reviewRepository,
                             EnrollmentRepository enrollmentRepository,
                             ProgressRepository progressRepository,
                             CertificateRepository certificateRepository,
                             NotificationRepository notificationRepository,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.quizRepository = quizRepository;
        this.reviewRepository = reviewRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
        this.certificateRepository = certificateRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure standard demo accounts always exist
        if (!userRepository.existsByEmail("student@edunexus.edu")) {
            createUser("Demo Student", "student@edunexus.edu", "password123", "STUDENT",
                    "Official Demo Student Account for testing EduNexus learning features.",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200");
        }
        if (!userRepository.existsByEmail("instructor@edunexus.edu")) {
            createUser("Demo Instructor", "instructor@edunexus.edu", "password123", "INSTRUCTOR",
                    "Official Demo Instructor Account for testing course creation and student management.",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200");
        }
        if (!userRepository.existsByEmail("admin@edunexus.edu")) {
            createUser("Demo Admin", "admin@edunexus.edu", "admin123", "ADMIN",
                    "Official Demo Admin Account for full platform administration.",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200");
        }

        if (userRepository.count() > 3 && courseRepository.count() >= 5) {
            if (quizRepository.count() == 0) {
                List<Course> allCourses = courseRepository.findAll();
                for (Course c : allCourses) {
                    createQuizForCourse(c, c.getTitle() + " Mastery Assessment");
                }
            }
            System.out.println("⚡ Database already initialized with rich EduNexus LMS datasets.");
            return;
        }

        System.out.println("🌱 Initializing EduNexus LMS database with rich realistic data...");

        // 1. Seed Users
        User admin = createUser("Admin User", "admin@edunexus.com", "Admin@123", "ADMIN",
                "Platform Administrator with complete system access and analytics monitoring.",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200");


        User instructor1 = createUser("Dr. Alex Chen", "alex.chen@edunexus.com", "Instructor@123", "INSTRUCTOR",
                "Principal AI Engineer & Ex-Google Lead Architect with 12+ years building distributed AI and cloud platforms.",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200");

        User instructor2 = createUser("Sarah Jenkins", "sarah.jenkins@edunexus.com", "Instructor@123", "INSTRUCTOR",
                "Senior Full Stack Java Engineer and author of 'Modern Spring Boot 3 in Practice'.",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200");

        User instructor3 = createUser("David Kumar", "david.kumar@edunexus.com", "Instructor@123", "INSTRUCTOR",
                "Cloud Solutions Architect & Certified Kubernetes Administrator. Passionate tech educator.",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200");

        User student1 = createUser("Emma Watson", "emma.watson@edunexus.com", "Student@123", "STUDENT",
                "Computer Science student eager to master Full-Stack Architecture and Modern Cloud Computing.",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200");

        User student2 = createUser("John Doe", "john.doe@edunexus.com", "Student@123", "STUDENT",
                "Aspiring AI Developer and Machine Learning enthusiast.",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200");

        User student3 = createUser("Priya Patel", "priya.patel@edunexus.com", "Student@123", "STUDENT",
                "Junior Software Developer looking to accelerate career growth in modern React and Spring ecosystems.",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200");

        // 2. Seed 10 Realistic Courses
        Course c1 = createFullStackJavaCourse(instructor2);
        Course c2 = createAiMlCourse(instructor1);
        Course c3 = createReactMasteryCourse(instructor2);
        Course c4 = createCloudDevOpsCourse(instructor3);
        Course c5 = createPythonDataScienceCourse(instructor1);
        Course c6 = createCybersecurityCourse(instructor3);
        Course c7 = createDsaJavaCourse(instructor2);
        Course c8 = createMicroservicesCourse(instructor2);
        Course c9 = createDeepLearningCourse(instructor1);
        Course c10 = createKubernetesMasteryCourse(instructor3);

        List<Course> courses = Arrays.asList(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10);
        List<Course> savedCourses = courseRepository.saveAll(courses);

        // 3. Seed Quizzes for all courses
        for (Course sc : savedCourses) {
            createQuizForCourse(sc, sc.getTitle() + " Mastery Assessment");
        }

        // 4. Seed Enrollments & Progress for Student 1 (Emma)
        Course javaSaved = savedCourses.get(0);
        Enrollment e1 = new Enrollment(student1.getId(), javaSaved.getId());
        e1.setProgressPercentage(100.0);
        e1.setCompleted(true);
        e1.setCompletedAt(Instant.now());
        enrollmentRepository.save(e1);

        Progress p1 = new Progress(student1.getId(), javaSaved.getId());
        p1.setPercentage(100.0);
        List<String> allLessonIds = new ArrayList<>();
        javaSaved.getModules().forEach(m -> m.getLessons().forEach(l -> allLessonIds.add(l.getId())));
        p1.setCompletedLessons(allLessonIds);
        if (!allLessonIds.isEmpty()) p1.setCurrentLessonId(allLessonIds.get(allLessonIds.size() - 1));
        progressRepository.save(p1);

        // Seed Certificate for completed course
        Certificate cert = new Certificate(
                "NEX-2026-89412057",
                student1.getId(),
                student1.getName(),
                student1.getEmail(),
                c1.getId(),
                c1.getTitle(),
                c1.getInstructorName(),
                98.5
        );
        cert.setVerificationUrl("/verify-certificate/NEX-2026-89412057");
        certificateRepository.save(cert);

        // Seed In-Progress Course for Emma
        Enrollment e2 = new Enrollment(student1.getId(), c2.getId());
        e2.setProgressPercentage(65.0);
        enrollmentRepository.save(e2);

        Progress p2 = new Progress(student1.getId(), c2.getId());
        p2.setPercentage(65.0);
        List<String> aiLessonIds = new ArrayList<>();
        if (!c2.getModules().isEmpty() && !c2.getModules().get(0).getLessons().isEmpty()) {
            aiLessonIds.add(c2.getModules().get(0).getLessons().get(0).getId());
            p2.setCurrentLessonId(c2.getModules().get(0).getLessons().get(0).getId());
        }
        p2.setCompletedLessons(aiLessonIds);
        progressRepository.save(p2);

        // 5. Seed Reviews
        createReview(student1, c1, 5.0, "This is by far the most thorough and well-explained Full Stack Java course I have ever taken. The Spring Security and MongoDB integration was crystal clear!");
        createReview(student3, c1, 4.8, "Exceptional curriculum. The real-world project structure gave me the exact confidence needed for senior tech interviews.");
        createReview(student2, c2, 5.0, "Dr. Alex Chen breaks down complex mathematical intuitions in neural networks into actionable Python code. 10/10!");
        createReview(student1, c3, 4.9, "The modern state management and custom design tokens approach was pure gold. Highly recommend!");

        // 6. Seed Notifications
        createNotification(student1.getId(), "Welcome to EduNexus LMS!", "Explore your enrolled courses and begin your learning adventure.", "SYSTEM", "/courses");
        createNotification(student1.getId(), "Certificate Earned!", "Congratulations! You earned your verified certificate for " + c1.getTitle(), "CERTIFICATE", "/profile");
        createNotification(student1.getId(), "New Module Available", "New hands-on project materials were added to Artificial Intelligence & Neural Networks.", "PROGRESS", "/learn/" + c2.getId() + "/" + aiLessonIds.get(0));

        System.out.println("✅ EduNexus LMS database seeded successfully!");
    }

    private User createUser(String name, String email, String password, String role, String bio, String image) {
        User user = new User(name, email, passwordEncoder.encode(password), role);
        user.setBio(bio);
        user.setProfileImage(image);
        user.setStatus("ACTIVE");
        user.setHeadline(role.equals("INSTRUCTOR") ? "Senior Instructor & Tech Lead" : "Lifelong Learner");
        return userRepository.save(user);
    }

    private Course createFullStackJavaCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Full Stack Java Development: Modern Spring Boot 3 & React");
        c.setSlug("full-stack-java-spring-boot-react");
        c.setSubtitle("Master enterprise Java, Spring Boot 3, Spring Security, MongoDB, and React with full production deployments.");
        c.setDescription("Build commercial-grade web applications from scratch. You will learn modern Java features, Spring Web, Spring Data MongoDB, JWT authentication, and build responsive frontend applications using React and custom CSS design systems.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Java");
        c.setDifficulty("Intermediate");
        c.setDuration("28h 45m");
        c.setThumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60");
        c.setPrice(79.99);
        c.setDiscountPrice(49.99);
        c.setFree(false);
        c.setRating(4.9);
        c.setReviewCount(148);
        c.setEnrolledStudents(1240);
        c.setPublished(true);
        c.setFeatured(true);
        c.setRequirements(Arrays.asList("Basic knowledge of Java syntax", "Understanding of fundamental web concepts (HTTP/JSON)", "A computer with Java 17+ and Node.js"));
        c.setLearningOutcomes(Arrays.asList(
                "Build scalable REST APIs with Spring Boot 3 & MongoDB",
                "Implement robust stateless JWT authentication & role-based authorization",
                "Create modern responsive React frontends with reusable components",
                "Master full-stack debugging, automated testing, and CI/CD deployment"
        ));

        // Modules & Lessons
        Module m1 = new Module("m1-java", "Module 1: Spring Boot 3 Architecture & Project Setup", "Get up and running with Spring Boot 3, Maven, and MongoDB", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-1", "Introduction to Spring Boot 3 Ecosystem", "An overview of Spring Boot 3, reactive vs servlet stack, and cloud-native architecture.", "https://www.youtube.com/watch?v=9SGDpanrc8U", "18:20", true),
                new Lesson("l1-2", "Setting up MongoDB Atlas Cloud Cluster", "Configuring cloud clusters, connection strings, and Spring Data MongoDB repositories.", "https://www.youtube.com/watch?v=oSIv-E60NiU", "22:15", true),
                new Lesson("l1-3", "Building RESTful Controllers & Exception Handling", "Creating clean REST endpoints with DTO validation and GlobalExceptionHandler.", "https://www.youtube.com/watch?v=31KTdfz635U", "25:40", false)
        ));

        Module m2 = new Module("m2-java", "Module 2: Enterprise Security & JWT Authentication", "Securing APIs with Spring Security 6, BCrypt, and JJWT", 2);
        m2.setLessons(Arrays.asList(
                new Lesson("l2-1", "Spring Security Architecture & Filter Chains", "Deep dive into SecurityFilterChain, DaoAuthenticationProvider, and UserDetails.", "https://www.youtube.com/watch?v=HER_7Wv9M0k", "30:10", false),
                new Lesson("l2-2", "Generating & Validating Stateless JWTs", "Implementing token generation, signature validation, and custom Bearer filter.", "https://www.youtube.com/watch?v=KxqlJBlR5VI", "28:50", false),
                new Lesson("l2-3", "Role-Based Access Control (RBAC)", "Configuring granular permissions for Students, Instructors, and Administrators.", "https://www.youtube.com/watch?v=vv0A9v1kRco", "21:30", false)
        ));

        Module m3 = new Module("m3-java", "Module 3: React Frontend Integration", "Connecting the React UI with Axios interceptors and global state", 3);
        m3.setLessons(Arrays.asList(
                new Lesson("l3-1", "React Architecture & Vite Project Structure", "Organizing components, hooks, contexts, and custom styling systems.", "https://www.youtube.com/watch?v=w7ejDZ8SWv8", "24:10", false),
                new Lesson("l3-2", "Axios Interceptors & JWT Token Lifecycle", "Injecting authorization headers and handling automatic 401 token refresh.", "https://www.youtube.com/watch?v=eJ3Y9B_h2_0", "26:45", false),
                new Lesson("l3-3", "Full Stack Deployment to Production", "Deploying the containerized application to AWS and Vercel.", "https://www.youtube.com/watch?v=2WrjXhW1l08", "32:00", false)
        ));

        c.setModules(Arrays.asList(m1, m2, m3));
        return c;
    }

    private Course createAiMlCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Artificial Intelligence & Machine Learning Masterclass");
        c.setSlug("artificial-intelligence-machine-learning-masterclass");
        c.setSubtitle("From mathematical foundations to deep learning, transformers, and practical LLM deployments.");
        c.setDescription("Unlock the power of modern AI. Learn foundational machine learning algorithms, deep neural networks with PyTorch, computer vision, natural language processing, and prompt engineering with large language models.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Artificial Intelligence");
        c.setDifficulty("Advanced");
        c.setDuration("34h 15m");
        c.setThumbnail("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60");
        c.setPrice(89.99);
        c.setDiscountPrice(59.99);
        c.setFree(false);
        c.setRating(4.95);
        c.setReviewCount(210);
        c.setEnrolledStudents(1890);
        c.setPublished(true);
        c.setFeatured(true);
        c.setRequirements(Arrays.asList("Basic Python programming", "Basic linear algebra and calculus concepts"));
        c.setLearningOutcomes(Arrays.asList(
                "Implement supervised & unsupervised machine learning algorithms",
                "Train deep neural networks and convolutional networks in PyTorch",
                "Understand transformers, attention mechanisms, and LLMs",
                "Deploy production AI inference APIs with FastAPI and Docker"
        ));

        Module m1 = new Module("m1-ai", "Module 1: Machine Learning Foundations", "Core algorithms and mathematical intuitions", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-ai-1", "Machine Learning Paradigms & Workflow", "Supervised, unsupervised, reinforcement learning workflows.", "https://www.youtube.com/watch?v=Gv9_4yMHFhI", "20:15", true),
                new Lesson("l1-ai-2", "Gradient Descent & Cost Functions", "Mathematical intuition behind optimization and learning rates.", "https://www.youtube.com/watch?v=IHZwWFHWa-w", "25:30", true),
                new Lesson("l1-ai-3", "Feature Engineering & Data Preprocessing", "Handling categorical data, scaling, and PCA dimensionality reduction.", "https://www.youtube.com/watch?v=nkg_0Yq1-gM", "22:40", false)
        ));

        Module m2 = new Module("m2-ai", "Module 2: Deep Learning & Neural Networks", "Building multi-layer perceptrons and training with backprop", 2);
        m2.setLessons(Arrays.asList(
                new Lesson("l2-ai-1", "Forward & Backward Propagation", "Computing gradients and understanding backpropagation mechanics.", "https://www.youtube.com/watch?v=Ilg3gGewQ5U", "34:10", false),
                new Lesson("l2-ai-2", "Convolutional Neural Networks (CNNs)", "Image recognition and feature extraction using convolutional kernels.", "https://www.youtube.com/watch?v=py5byOOHZM8", "31:20", false)
        ));

        c.setModules(Arrays.asList(m1, m2));
        return c;
    }

    private Course createReactMasteryCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Modern React 19 & Enterprise Frontend Architecture");
        c.setSlug("modern-react-enterprise-frontend-architecture");
        c.setSubtitle("Master React hooks, custom state machines, design systems, and lightning-fast Vite applications.");
        c.setDescription("Build ultra-responsive web applications with clean design systems, scalable component hierarchies, and modern state management patterns.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Web Development");
        c.setDifficulty("Intermediate");
        c.setDuration("21h 10m");
        c.setThumbnail("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60");
        c.setPrice(69.99);
        c.setDiscountPrice(39.99);
        c.setRating(4.85);
        c.setReviewCount(98);
        c.setEnrolledStudents(920);
        c.setPublished(true);
        c.setFeatured(true);
        c.setRequirements(Arrays.asList("Basic HTML, CSS, and modern JavaScript (ES6+)"));
        c.setLearningOutcomes(Arrays.asList(
                "Master React 19 Server Components, Actions, and Hooks",
                "Construct custom CSS design systems without heavy framework lock-in",
                "Integrate Recharts, interactive audio/video players, and PDF generators"
        ));

        Module m1 = new Module("m1-react", "Module 1: React Fundamentals & Component Design", "Clean component architecture", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-rc-1", "Component Lifecycles & Modern Hooks", "useState, useEffect, useMemo, and custom hooks.", "https://www.youtube.com/watch?v=w7ejDZ8SWv8", "19:40", true),
                new Lesson("l1-rc-2", "Building a Reusable Custom Design System", "Creating CSS variable tokens, elevation, and responsive cards.", "https://www.youtube.com/watch?v=FJDVKeh7RJI", "27:15", false)
        ));

        c.setModules(Arrays.asList(m1));
        return c;
    }

    private Course createCloudDevOpsCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Cloud Computing & DevOps: AWS, Docker & CI/CD Pipelines");
        c.setSlug("cloud-computing-devops-aws-docker-cicd");
        c.setSubtitle("Architect resilient cloud infrastructures, automate deployments, and containerize microservices.");
        c.setDescription("Hands-on cloud engineering course covering AWS EC2, S3, RDS, ECS, Docker containerization, Kubernetes orchestration, and GitHub Actions pipelines.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Cloud Computing");
        c.setDifficulty("All Levels");
        c.setDuration("26h 00m");
        c.setThumbnail("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60");
        c.setPrice(74.99);
        c.setDiscountPrice(44.99);
        c.setRating(4.9);
        c.setReviewCount(84);
        c.setEnrolledStudents(760);
        c.setPublished(true);
        c.setFeatured(true);
        c.setRequirements(Arrays.asList("Basic command-line familiarity"));
        c.setLearningOutcomes(Arrays.asList(
                "Deploy scalable architectures on AWS",
                "Build automated CI/CD pipelines with GitHub Actions",
                "Containerize microservices with Docker and Docker Compose"
        ));

        Module m1 = new Module("m1-cloud", "Module 1: Docker & Containerization", "Packaging modern web apps", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-cl-1", "Docker Images, Containers & Dockerfiles", "Writing efficient multi-stage build Dockerfiles.", "https://www.youtube.com/watch?v=fqMOX6JJhGo", "22:10", true),
                new Lesson("l1-cl-2", "AWS VPC, EC2 & Security Groups", "Configuring virtual private clouds and secure networking.", "https://www.youtube.com/watch?v=k1RI5locZE4", "30:00", false)
        ));

        c.setModules(Arrays.asList(m1));
        return c;
    }

    private Course createPythonDataScienceCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Python for Data Science, Analytics & Visualization");
        c.setSlug("python-data-science-analytics-visualization");
        c.setSubtitle("Master NumPy, Pandas, Matplotlib, Seaborn, and interactive analytical dashboards.");
        c.setDescription("Transform raw datasets into actionable insights. Learn exploratory data analysis, statistical modeling, data cleaning, and high-impact visual storytelling.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Data Science");
        c.setDifficulty("Beginner");
        c.setDuration("19h 30m");
        c.setThumbnail("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60");
        c.setPrice(59.99);
        c.setDiscountPrice(29.99);
        c.setRating(4.8);
        c.setReviewCount(62);
        c.setEnrolledStudents(540);
        c.setPublished(true);
        c.setRequirements(Arrays.asList("No prior programming experience required"));
        c.setLearningOutcomes(Arrays.asList("Perform data wrangling with Pandas", "Build statistical charts with Seaborn", "Extract business insights from tabular data"));

        Module m1 = new Module("m1-py", "Module 1: Python Data Science Stack", "NumPy & Pandas Essentials", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-py-1", "Vectorized Computation with NumPy", "Array slicing, broadcasting, and matrix math.", "https://www.youtube.com/watch?v=QUT1VHiLmmI", "18:00", true),
                new Lesson("l1-py-2", "Data Cleaning & Aggregations with Pandas", "GroupBy operations, pivot tables, and null handling.", "https://www.youtube.com/watch?v=vmEHCJofslg", "25:00", false)
        ));

        c.setModules(Arrays.asList(m1));
        return c;
    }

    private Course createCybersecurityCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Cybersecurity Fundamentals: Network Defense & Ethical Hacking");
        c.setSlug("cybersecurity-fundamentals-network-defense");
        c.setSubtitle("Learn threat modeling, network penetration testing, cryptography, and application security.");
        c.setDescription("Understand how cyber attacks occur and how to defend critical enterprise infrastructure. Master port scanning, vulnerability assessments, and web application security.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Cybersecurity");
        c.setDifficulty("Intermediate");
        c.setDuration("23h 40m");
        c.setThumbnail("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60");
        c.setPrice(69.99);
        c.setDiscountPrice(39.99);
        c.setRating(4.9);
        c.setReviewCount(73);
        c.setEnrolledStudents(610);
        c.setPublished(true);
        c.setRequirements(Arrays.asList("Basic networking fundamentals"));
        c.setLearningOutcomes(Arrays.asList("Perform vulnerability assessments", "Understand OWASP Top 10 web vulnerabilities", "Implement public key cryptography"));

        Module m1 = new Module("m1-sec", "Module 1: Ethical Hacking Foundations", "Reconnaissance & scanning", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-sec-1", "Network Reconnaissance & Nmap", "Port scanning, service enumeration, and stealth scans.", "https://www.youtube.com/watch?v=4t4kBkMsDbY", "24:00", true)
        ));
        c.setModules(Arrays.asList(m1));
        return c;
    }

    private Course createDsaJavaCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Data Structures & Algorithms in Java for FAANG Interviews");
        c.setSlug("data-structures-algorithms-java-interviews");
        c.setSubtitle("Master arrays, trees, dynamic programming, graphs, and conquer top tech coding rounds.");
        c.setDescription("Comprehensive DSA preparation covering time/space complexity, recursion, backtracking, tree traversals, shortest path graph algorithms, and DP patterns.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("DSA");
        c.setDifficulty("Advanced");
        c.setDuration("32h 00m");
        c.setThumbnail("https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60");
        c.setPrice(84.99);
        c.setDiscountPrice(49.99);
        c.setRating(4.95);
        c.setReviewCount(190);
        c.setEnrolledStudents(1450);
        c.setPublished(true);
        c.setRequirements(Arrays.asList("Solid proficiency in Java programming"));
        c.setLearningOutcomes(Arrays.asList("Solve 150+ LeetCode style algorithmic problems", "Master Dynamic Programming subproblems", "Analyze Big-O runtime & memory tradeoffs"));

        Module m1 = new Module("m1-dsa", "Module 1: Trees & Graphs", "Non-linear data structures", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-dsa-1", "Binary Tree Traversals & Recursion", "In-order, Pre-order, Post-order, and Level-order BFS.", "https://www.youtube.com/watch?v=fAAZixBzIAI", "28:30", true)
        ));
        c.setModules(Arrays.asList(m1));
        return c;
    }

    private Course createMicroservicesCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Building Event-Driven Microservices with Spring Boot & Kafka");
        c.setSlug("event-driven-microservices-spring-kafka");
        c.setSubtitle("Design fault-tolerant distributed systems with Apache Kafka, Spring Cloud, and API Gateways.");
        c.setDescription("Learn the patterns behind resilient microservices: Saga pattern, CQRS, event sourcing, circuit breakers with Resilience4j, and Kafka streaming.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Java");
        c.setDifficulty("Advanced");
        c.setDuration("25h 15m");
        c.setThumbnail("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60");
        c.setPrice(79.99);
        c.setDiscountPrice(49.99);
        c.setRating(4.88);
        c.setReviewCount(56);
        c.setEnrolledStudents(480);
        c.setPublished(true);
        c.setRequirements(Arrays.asList("Experience with Spring Boot and REST APIs"));
        c.setLearningOutcomes(Arrays.asList("Architect distributed message streams with Kafka", "Implement Circuit Breakers and API Gateways"));

        Module m1 = new Module("m1-ms", "Module 1: Distributed Architecture", "Event Streaming & Broker Setup", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-ms-1", "Kafka Producers, Consumers & Partitions", "Message durability, offset commits, and consumer groups.", "https://www.youtube.com/watch?v=R873BlBMUBY", "26:00", true)
        ));
        c.setModules(Arrays.asList(m1));
        return c;
    }

    private Course createDeepLearningCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Generative AI & LLM Application Engineering");
        c.setSlug("generative-ai-llm-application-engineering");
        c.setSubtitle("Build production RAG pipelines, LangChain agents, fine-tune models, and integrate Vector Databases.");
        c.setDescription("Master Generative AI engineering. Learn retrieval-augmented generation (RAG), vector embeddings, semantic search, agentic tool usage, and evaluation frameworks.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("Artificial Intelligence");
        c.setDifficulty("Intermediate");
        c.setDuration("20h 40m");
        c.setThumbnail("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60");
        c.setPrice(84.99);
        c.setDiscountPrice(54.99);
        c.setRating(4.92);
        c.setReviewCount(112);
        c.setEnrolledStudents(980);
        c.setPublished(true);
        c.setRequirements(Arrays.asList("Python programming proficiency"));
        c.setLearningOutcomes(Arrays.asList("Build enterprise RAG pipelines", "Deploy AI agents with custom tools", "Index and search high-dimensional vectors"));

        Module m1 = new Module("m1-genai", "Module 1: RAG Architecture", "Embeddings & Vector Search", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-gen-1", "Vector Embeddings & Semantic Similarity", "Generating vector representations with transformer models.", "https://www.youtube.com/watch?v=QdDoFfkVkcw", "21:30", true)
        ));
        c.setModules(Arrays.asList(m1));
        return c;
    }

    private Course createKubernetesMasteryCourse(User instructor) {
        Course c = new Course();
        c.setTitle("Kubernetes in Production: Orchestration & Helm Charts");
        c.setSlug("kubernetes-production-orchestration-helm");
        c.setSubtitle("Master Pods, Services, Ingress Controllers, StatefulSets, and Helm package management.");
        c.setDescription("Deep dive into Kubernetes architecture. Manage production clusters, configure autoscaling (HPA), set up monitoring with Prometheus & Grafana, and write custom Helm charts.");
        c.setInstructorId(instructor.getId());
        c.setInstructorName(instructor.getName());
        c.setInstructorBio(instructor.getBio());
        c.setInstructorImage(instructor.getProfileImage());
        c.setCategory("DevOps");
        c.setDifficulty("Advanced");
        c.setDuration("22h 30m");
        c.setThumbnail("https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60");
        c.setPrice(74.99);
        c.setDiscountPrice(44.99);
        c.setRating(4.87);
        c.setReviewCount(48);
        c.setEnrolledStudents(410);
        c.setPublished(true);
        c.setRequirements(Arrays.asList("Solid understanding of Docker containers"));
        c.setLearningOutcomes(Arrays.asList("Manage multi-node Kubernetes clusters", "Write declarative YAML manifests and Helm charts"));

        Module m1 = new Module("m1-k8s", "Module 1: Cluster Architecture", "Control Plane & Worker Nodes", 1);
        m1.setLessons(Arrays.asList(
                new Lesson("l1-k8s-1", "API Server, etcd, Kubelet & Kube-Proxy", "How Kubernetes orchestrates state across distributed nodes.", "https://www.youtube.com/watch?v=X48VuDVv0do", "27:10", true)
        ));
        c.setModules(Arrays.asList(m1));
        return c;
    }

    private void createQuizForCourse(Course course, String title) {
        Quiz quiz = new Quiz(course.getId(), title, "Test your understanding of the concepts covered across this course modules.", 15, 70);

        Question q1 = new Question("q1-" + course.getId(),
                "In Spring Boot, which annotation is used to mark a class as a global exception handler?",
                Arrays.asList("@ControllerAdvice / @RestControllerAdvice", "@ExceptionHandlerOnly", "@GlobalCatch", "@ResponseStatusManager"),
                0,
                "@RestControllerAdvice combines @ControllerAdvice and @ResponseBody to handle exceptions across all controllers.");

        Question q2 = new Question("q2-" + course.getId(),
                "Which HTTP status code is universally recommended when an unauthorized request fails due to missing or invalid JWT tokens?",
                Arrays.asList("200 OK", "401 Unauthorized", "404 Not Found", "500 Internal Server Error"),
                1,
                "HTTP 401 Unauthorized indicates that the request lacks valid authentication credentials for the target resource.");

        Question q3 = new Question("q3-" + course.getId(),
                "What is the primary advantage of storing MongoDB connection strings and JWT secrets in environment variables?",
                Arrays.asList("It speeds up database query indexing", "It keeps sensitive credentials safe and out of version control systems", "It allows MongoDB to bypass password authentication", "It compresses JSON documents automatically"),
                1,
                "Using environment variables prevents secrets from being leaked to source code repositories and adheres to the 12-factor app security principles.");

        Question q4 = new Question("q4-" + course.getId(),
                "In React, what is the best practice for synchronizing component state with asynchronous REST API requests?",
                Arrays.asList("Directly mutate DOM elements using document.getElementById", "Use useEffect hook or React Query with Axios to manage loading and error states", "Call synchronous while loops inside the render body", "Avoid using state variables altogether"),
                1,
                "Using useEffect with proper dependency arrays or data fetching libraries provides clean asynchronous lifecycle management without blocking the UI thread.");

        quiz.setQuestions(Arrays.asList(q1, q2, q3, q4));
        quizRepository.save(quiz);
    }

    private void createReview(User student, Course course, double rating, String comment) {
        Review review = new Review(
                student.getId(),
                student.getName(),
                student.getProfileImage(),
                course.getId(),
                course.getTitle(),
                rating,
                comment
        );
        reviewRepository.save(review);
    }

    private void createNotification(String userId, String title, String message, String type, String link) {
        Notification notification = new Notification(userId, title, message, type, link);
        notificationRepository.save(notification);
    }
}
