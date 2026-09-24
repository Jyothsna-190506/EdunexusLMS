import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Layers,
  Video,
  DollarSign,
  HelpCircle,
  BookOpen
} from 'lucide-react';

const CATEGORIES = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Java',
  'Python',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'Database',
  'DSA'
];

const CourseCreateEditPage = () => {
  const { id } = useParams(); // if present -> edit mode
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [duration, setDuration] = useState('12 Hours');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');
  const [price, setPrice] = useState(49.99);
  const [discount, setDiscount] = useState(20);
  const [learningOutcomes, setLearningOutcomes] = useState([
    'Build enterprise-ready full stack microservices',
    'Master Spring Security, JWT authentication, and MongoDB Atlas'
  ]);
  const [outcomeInput, setOutcomeInput] = useState('');
  const [requirements, setRequirements] = useState([
    'Basic programming fundamentals',
    'Computer with Internet connection'
  ]);
  const [requirementInput, setRequirementInput] = useState('');

  // Modules & Lessons dynamic builder
  const [modules, setModules] = useState([
    {
      title: 'Module 1: Foundations & Architecture Setup',
      lessons: [
        {
          id: 'l-1',
          title: 'Introduction & Project Overview',
          description: 'High-level architectural overview and development environment setup.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '12 min',
        },
      ],
    },
  ]);

  // Quiz Builder
  const [quizTitle, setQuizTitle] = useState('Final Mastery Assessment');
  const [questions, setQuestions] = useState([
    {
      questionText: 'What is the primary benefit of JWT authentication in microservices?',
      options: [
        'Stateless verification without server session storage',
        'Direct access to database credentials',
        'Automatic SQL query generation',
        'Elimination of HTTPS requirements'
      ],
      correctAnswerIndex: 0,
      explanation: 'JWT tokens are digitally signed and stateless, meaning the backend can verify identity without session storage.'
    }
  ]);

  useEffect(() => {
    if (isEditMode) {
      fetchCourseForEdit();
    }
  }, [id]);

  const fetchCourseForEdit = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${id}`);
      const data = res.data;
      setTitle(data.title || '');
      setDescription(data.description || '');
      setCategory(data.category || 'Web Development');
      setDifficulty(data.difficulty || 'Beginner');
      setDuration(data.duration || '12 Hours');
      setThumbnail(data.thumbnail || '');
      setPrice(data.price || 0);
      setDiscount(data.discount || 0);
      setLearningOutcomes(data.learningOutcomes || []);
      setRequirements(data.requirements || []);
      if (data.modules && data.modules.length > 0) {
        setModules(data.modules);
      }
    } catch (err) {
      console.error('Failed to load course for edit:', err);
      showToast('Error loading course details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Outcomes handlers
  const handleAddOutcome = () => {
    if (outcomeInput.trim()) {
      setLearningOutcomes([...learningOutcomes, outcomeInput.trim()]);
      setOutcomeInput('');
    }
  };

  const handleRemoveOutcome = (index) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  // Requirements handlers
  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // Module & Lesson Handlers
  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        title: `Module ${modules.length + 1}: New Topic`,
        lessons: [
          {
            id: `l-${Date.now()}`,
            title: 'Lesson 1: Deep Dive',
            description: 'Core concepts and implementation.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '15 min',
          },
        ],
      },
    ]);
  };

  const handleRemoveModule = (mIdx) => {
    setModules(modules.filter((_, i) => i !== mIdx));
  };

  const handleUpdateModuleTitle = (mIdx, newTitle) => {
    const updated = [...modules];
    updated[mIdx].title = newTitle;
    setModules(updated);
  };

  const handleAddLesson = (mIdx) => {
    const updated = [...modules];
    updated[mIdx].lessons.push({
      id: `l-${Date.now()}`,
      title: `Lesson ${updated[mIdx].lessons.length + 1}: New Concept`,
      description: 'Hands-on coding exercise.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '10 min',
    });
    setModules(updated);
  };

  const handleRemoveLesson = (mIdx, lIdx) => {
    const updated = [...modules];
    updated[mIdx].lessons = updated[mIdx].lessons.filter((_, i) => i !== lIdx);
    setModules(updated);
  };

  const handleUpdateLesson = (mIdx, lIdx, field, val) => {
    const updated = [...modules];
    updated[mIdx].lessons[lIdx][field] = val;
    setModules(updated);
  };

  // Quiz Question Handlers
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: 'Enter question text here...',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswerIndex: 0,
        explanation: 'Explanation of correct answer.',
      },
    ]);
  };

  const handleRemoveQuestion = (qIdx) => {
    setQuestions(questions.filter((_, i) => i !== qIdx));
  };

  const handleSaveCourse = async () => {
    if (!title.trim() || !description.trim()) {
      showToast('Please provide course title and description.', 'warning');
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    const coursePayload = {
      title,
      description,
      category,
      difficulty,
      duration,
      thumbnail,
      price: parseFloat(price) || 0,
      discount: parseFloat(discount) || 0,
      learningOutcomes,
      requirements,
      modules,
      published: true,
    };

    try {
      let createdCourseId = id;
      if (isEditMode) {
        await api.put(`/courses/${id}`, coursePayload);
        showToast('Course updated successfully! 🚀', 'success');
      } else {
        const res = await api.post('/courses', coursePayload);
        createdCourseId = res.data.id;
        showToast('Course published successfully! 🎉', 'success');
      }

      // Save / update quiz if configured
      if (createdCourseId && questions.length > 0) {
        try {
          await api.post('/quizzes', {
            courseId: createdCourseId,
            title: quizTitle,
            questions,
          });
        } catch (e) {
          console.warn('Quiz auto-save response:', e);
        }
      }

      navigate('/instructor/courses');
    } catch (err) {
      console.error('Course save error:', err);
      showToast(err.response?.data?.message || 'Failed to save course.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading course editor..." />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {isEditMode ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Follow the multi-step studio wizard to configure syllabus, lessons, and assessments.
            </p>
          </div>

          <button
            onClick={handleSaveCourse}
            disabled={saving}
            className="btn btn-primary"
            style={{ boxShadow: 'var(--shadow-glow)' }}
          >
            <Save size={18} /> {saving ? 'Publishing...' : 'Publish Course'}
          </button>
        </div>

        {/* Multi-Step Indicator Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-card)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem',
          overflowX: 'auto',
          gap: '1rem',
        }}>
          {[
            { step: 1, label: '1. Basic Info' },
            { step: 2, label: '2. Media' },
            { step: 3, label: '3. Curriculum' },
            { step: 4, label: '4. Quizzes' },
            { step: 5, label: '5. Pricing' },
          ].map((s) => {
            const isCurrent = currentStep === s.step;
            const isPassed = currentStep > s.step;

            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isCurrent ? 'var(--primary)' : isPassed ? 'var(--success)' : 'var(--text-muted)',
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {isPassed ? <CheckCircle2 size={16} /> : null}
                {s.label}
              </button>
            );
          })}
        </div>

        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>1. Basic Course Details</h2>

            <div className="form-group">
              <label className="form-label">Course Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Master Full Stack Java Microservices & MongoDB"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                placeholder="Provide a comprehensive summary of what students will achieve..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  className="form-control form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 18.5 Hours"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setCurrentStep(2)} className="btn btn-primary">
                Next: Media & Thumbnail <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Media & Thumbnail */}
        {currentStep === 2 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>2. Media & Thumbnail</h2>

            <div className="form-group">
              <label className="form-label">Thumbnail Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </div>

            {thumbnail && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Thumbnail Preview:
                </div>
                <div style={{ width: '280px', height: '160px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={thumbnail} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Previous
              </button>
              <button onClick={() => setCurrentStep(3)} className="btn btn-primary">
                Next: Curriculum Builder <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Curriculum & Modules Builder */}
        {currentStep === 3 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>3. Curriculum & Modules</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add modules and interactive video lessons</p>
              </div>

              <button onClick={handleAddModule} className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add Module
              </button>
            </div>

            {/* Modules List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {modules.map((m, mIdx) => (
                <div
                  key={mIdx}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-primary" style={{ flexShrink: 0 }}>Module {mIdx + 1}</span>
                    <input
                      type="text"
                      className="form-control"
                      value={m.title}
                      onChange={(e) => handleUpdateModuleTitle(mIdx, e.target.value)}
                      placeholder="Module Title"
                      style={{ fontWeight: 700 }}
                    />
                    <button
                      onClick={() => handleRemoveModule(mIdx)}
                      className="btn btn-ghost btn-icon"
                      style={{ color: 'var(--danger)' }}
                      title="Delete Module"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Lessons Inside Module */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-color)' }}>
                    {m.lessons?.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Lesson {lIdx + 1}</span>
                          <button
                            onClick={() => handleRemoveLesson(mIdx, lIdx)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)', padding: '2px 6px' }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>

                        <div className="grid-2" style={{ marginBottom: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Lesson Title"
                            value={lesson.title}
                            onChange={(e) => handleUpdateLesson(mIdx, lIdx, 'title', e.target.value)}
                          />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Duration (e.g. 15 min)"
                            value={lesson.duration}
                            onChange={(e) => handleUpdateLesson(mIdx, lIdx, 'duration', e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                          <input
                            type="url"
                            className="form-control"
                            placeholder="Video Stream URL (YouTube or MP4)"
                            value={lesson.videoUrl}
                            onChange={(e) => handleUpdateLesson(mIdx, lIdx, 'videoUrl', e.target.value)}
                          />
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Short summary of lesson concepts..."
                          value={lesson.description}
                          onChange={(e) => handleUpdateLesson(mIdx, lIdx, 'description', e.target.value)}
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddLesson(mIdx)}
                      className="btn btn-ghost btn-sm"
                      style={{ alignSelf: 'flex-start', color: 'var(--primary)', fontWeight: 600 }}
                    >
                      <Plus size={14} /> Add Lesson to Module {mIdx + 1}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Previous
              </button>
              <button onClick={() => setCurrentStep(4)} className="btn btn-primary">
                Next: Quiz Builder <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Quizzes Builder */}
        {currentStep === 4 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>4. Interactive Quiz Builder</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure graduation assessments for this course</p>
              </div>

              <button onClick={handleAddQuestion} className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add Question
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Quiz Assessment Title</label>
              <input
                type="text"
                className="form-control"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              {questions.map((q, qIdx) => (
                <div key={qIdx} style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Question {qIdx + 1}</span>
                    <button onClick={() => handleRemoveQuestion(qIdx)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Question prompt..."
                      value={q.questionText}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].questionText = e.target.value;
                        setQuestions(updated);
                      }}
                    />
                  </div>

                  {/* 4 Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {q.options?.map((opt, optIdx) => (
                      <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctAnswerIndex === optIdx}
                          onChange={() => {
                            const updated = [...questions];
                            updated[qIdx].correctAnswerIndex = optIdx;
                            setQuestions(updated);
                          }}
                          title="Mark as correct option"
                        />
                        <span style={{ fontWeight: 700, width: '20px' }}>{String.fromCharCode(65 + optIdx)}:</span>
                        <input
                          type="text"
                          className="form-control"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[qIdx].options[optIdx] = e.target.value;
                            setQuestions(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Explanation for the correct answer..."
                    value={q.explanation}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx].explanation = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button onClick={() => setCurrentStep(3)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Previous
              </button>
              <button onClick={() => setCurrentStep(5)} className="btn btn-primary">
                Next: Pricing & Outcomes <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Pricing & Outcomes */}
        {currentStep === 5 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>5. Pricing & Learning Outcomes</h2>

            <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
            </div>

            {/* Learning Outcomes Builder */}
            <div className="form-group">
              <label className="form-label">What will students learn? (Outcomes)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Build end-to-end REST APIs with Spring Data"
                  value={outcomeInput}
                  onChange={(e) => setOutcomeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                />
                <button type="button" onClick={handleAddOutcome} className="btn btn-secondary">
                  Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {learningOutcomes.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <span>&bull; {item}</span>
                    <button type="button" onClick={() => handleRemoveOutcome(idx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements Builder */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Course Prerequisites / Requirements</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Basic understanding of JavaScript or Java"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                />
                <button type="button" onClick={handleAddRequirement} className="btn btn-secondary">
                  Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {requirements.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <span>&bull; {item}</span>
                    <button type="button" onClick={() => handleRemoveRequirement(idx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Submission Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button onClick={() => setCurrentStep(4)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Previous
              </button>

              <button
                onClick={handleSaveCourse}
                disabled={saving}
                className="btn btn-primary btn-lg"
                style={{ boxShadow: 'var(--shadow-glow)' }}
              >
                <Save size={18} /> {saving ? 'Publishing Course...' : 'Publish Course Now'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseCreateEditPage;
