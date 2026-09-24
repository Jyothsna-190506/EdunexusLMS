import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/common/CourseCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
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

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CourseCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedDifficulty, selectedPrice, sortBy]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.get('/courses', { params });
      let data = res.data;

      // Client-side price filter
      if (selectedPrice === 'Free') {
        data = data.filter((c) => c.price === 0);
      } else if (selectedPrice === 'Paid') {
        data = data.filter((c) => c.price > 0);
      }

      // Client-side sorting
      if (sortBy === 'rating') {
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'price-low') {
        data.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortBy === 'price-high') {
        data.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (sortBy === 'newest') {
        data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } else {
        // Popularity default
        data.sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0));
      }

      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedPrice('All');
    setSortBy('popularity');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Explore Tech Courses
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Discover masterclasses in Artificial Intelligence, Java, Web Development, Cloud & more.
        </p>
      </div>

      {/* Search & Main Filter Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 2, minWidth: '260px' }}>
            <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '14px', left: '14px' }} />
            <input
              type="text"
              placeholder="Search by course title, skill, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Difficulty select */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="form-control form-select"
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTIES.filter((d) => d !== 'All').map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {/* Price select */}
          <div style={{ flex: 1, minWidth: '130px' }}>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="form-control form-select"
            >
              <option value="All">All Prices</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {/* Sort By select */}
          <div style={{ flex: 1, minWidth: '170px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control form-select"
            >
              <option value="popularity">Sort: Most Popular</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ minWidth: '110px' }}>
            <Search size={16} /> Search
          </button>
        </form>

        {/* Category Filter Chips */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingTop: '1.25rem',
          marginTop: '1.25rem',
          borderTop: '1px solid var(--border-color)',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-main)' }}>{courses.length}</strong> available courses
        </div>
        {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedPrice !== 'All' || searchTerm) && (
          <button onClick={handleResetFilters} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <RotateCcw size={14} /> Reset Filters
          </button>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <SlidersHorizontal size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Courses Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Try clearing your search query or selecting a different category.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalogPage;
