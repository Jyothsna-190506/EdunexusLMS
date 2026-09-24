import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import RatingStars from '../components/common/RatingStars';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import {
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Star,
  FileText,
  ShieldCheck,
  Share2,
  Lock
} from 'lucide-react';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId, isAuthenticated]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch course info
      const courseRes = await api.get(`/courses/${courseId}`);
      setCourse(courseRes.data);

      // Expand first module by default
      if (courseRes.data.modules && courseRes.data.modules.length > 0) {
        setExpandedModules({ 0: true });
      }

      // 2. Fetch reviews
      try {
        const reviewsRes = await api.get(`/reviews/course/${courseId}`);
        setReviews(reviewsRes.data);
      } catch (e) {
        console.warn('No reviews found or error loading reviews');
      }

      // 3. Check enrollment status if logged in
      if (isAuthenticated) {
        try {
          const enrollRes = await api.get(`/enrollments/course/${courseId}`);
          setEnrollment(enrollRes.data);
        } catch (e) {
          setEnrollment(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch course details:', err);
      showToast('Error loading course details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/courses/${courseId}`);
      return;
    }

    setEnrolling(true);
    try {
      const res = await api.post('/enrollments', { courseId });
      setEnrollment(res.data);
      showToast('Successfully enrolled! Welcome aboard.', 'success');

      // Navigate to first lesson if available
      const firstLesson = course?.modules?.[0]?.lessons?.[0];
      if (firstLesson) {
        navigate(`/learn/${courseId}/${firstLesson.id}`);
      } else {
        navigate('/my-learning');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      showToast(err.response?.data?.message || 'Enrollment failed. Please try again.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    const firstLesson = course?.modules?.[0]?.lessons?.[0];
    if (firstLesson) {
      navigate(`/learn/${courseId}/${firstLesson.id}`);
    } else {
      navigate('/my-learning');
    }
  };

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        courseId,
        rating: userRating,
        comment: userComment.trim(),
      });
      setReviews((prev) => [res.data, ...prev]);
      showToast('Thank you! Your review has been submitted.', 'success');
      setReviewModalOpen(false);
      setUserComment('');
      setUserRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading course syllabus..." />;
  }

  if (!course) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Course Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>The course you requested does not exist.</p>
        <Link to="/courses" className="btn btn-primary">Browse All Courses</Link>
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const discountedPrice = course.discount > 0 ? (course.price * (1 - course.discount / 100)).toFixed(2) : course.price;

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Top Banner */}
      <section style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-color)',
        padding: '3.5rem 0',
      }}>
        <div className="container" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 550px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{course.category}</span>
              <span className="badge badge-accent">{course.difficulty}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
              {course.title}
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#F59E0B' }}>{course.rating?.toFixed(1) || '4.9'}</span>
                <RatingStars rating={course.rating || 4.9} size={16} />
                <span style={{ color: 'var(--text-muted)' }}>({reviews.length || 45} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <Users size={16} />
                <span>{course.enrolledStudents || 120} students enrolled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <Clock size={16} />
                <span>{course.duration || '15 Hours'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              <img
                src={course.instructorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName || 'Instructor'}`}
                alt={course.instructorName}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created by </span>
                <strong style={{ color: 'var(--text-main)' }}>{course.instructorName || 'EduNexus Faculty'}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area + Sticky Action Sidebar */}
      <div className="container" style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left Column: Outcomes, Requirements, Syllabus, Reviews */}
        <div style={{ flex: '1 1 650px', minWidth: '320px' }}>
          {/* What you'll learn */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                What You'll Learn
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                {course.learningOutcomes.map((outcome, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.925rem' }}>
                    <CheckCircle size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Curriculum Accordion */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Course Curriculum</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {course.modules?.length || 0} Modules &bull; {totalLessons} Lessons
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {course.modules?.map((module, mIdx) => {
                const isExpanded = expandedModules[mIdx];
                return (
                  <div
                    key={mIdx}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => toggleModule(mIdx)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        backgroundColor: 'var(--bg-subtle)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        Module {mIdx + 1}: {module.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {module.lessons?.length || 0} lessons
                        </span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--bg-card)' }}>
                        {module.lessons?.map((lesson, lIdx) => (
                          <div
                            key={lesson.id || lIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.65rem 0',
                              borderBottom: lIdx < module.lessons.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                              fontSize: '0.9rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <PlayCircle size={16} color="var(--primary)" />
                              <span style={{ color: 'var(--text-main)' }}>{lesson.title}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                              <Clock size={14} />
                              <span>{lesson.duration || '10 min'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Requirements</h3>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)' }}>
                {course.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Section */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Student Feedback</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>
                    {course.rating?.toFixed(1) || '4.9'}
                  </span>
                  <RatingStars rating={course.rating || 4.9} size={18} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({reviews.length} reviews)</span>
                </div>
              </div>

              {enrollment && (
                <button onClick={() => setReviewModalOpen(true)} className="btn btn-outline btn-sm">
                  <Star size={16} /> Write a Review
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first student to review this course!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{r.studentName || 'Student'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <RatingStars rating={r.rating} size={14} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Column: Enrollment Card */}
        <div style={{ flex: '1 1 340px', position: 'sticky', top: '90px' }}>
          <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ position: 'relative', height: '200px', backgroundColor: '#000' }}>
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(79, 70, 229, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                cursor: 'pointer'
              }}>
                <PlayCircle size={32} />
              </div>
            </div>

            <div style={{ padding: '1.75rem' }}>
              {/* Pricing */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {course.price === 0 ? (
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>Free</span>
                ) : (
                  <>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
                      ${discountedPrice}
                    </span>
                    {course.discount > 0 && (
                      <span style={{ fontSize: '1.1rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                        ${course.price}
                      </span>
                    )}
                    {course.discount > 0 && (
                      <span className="badge badge-danger" style={{ marginLeft: 'auto' }}>
                        {course.discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Action Button */}
              {enrollment ? (
                <button
                  onClick={handleStartLearning}
                  className="btn btn-success btn-lg"
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  <PlayCircle size={20} /> Continue Learning
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginBottom: '1rem', boxShadow: 'var(--shadow-glow)' }}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
                30-Day Money-Back Guarantee &bull; Instant Access
              </p>

              {/* Course Includes Perks */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>This course includes:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlayCircle size={16} color="var(--primary)" />
                    <span>{course.duration || '15 hours'} on-demand HD video</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} color="var(--secondary)" />
                    <span>{totalLessons} full interactive modules</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="var(--accent)" />
                    <span>Hands-on quizzes & source code</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} color="var(--warning)" />
                    <span>Verified certificate of completion</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="var(--success)" />
                    <span>Lifetime full platform access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write Course Review">
        <form onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0' }}>
              <RatingStars rating={userRating} size={28} interactive onRatingChange={setUserRating} />
              <span style={{ fontWeight: 700, marginLeft: '0.5rem' }}>{userRating} / 5 Stars</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Review / Feedback</label>
            <textarea
              className="form-control"
              placeholder="What did you like about this course? How did it help you?"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submittingReview} className="btn btn-primary">
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseDetailsPage;
