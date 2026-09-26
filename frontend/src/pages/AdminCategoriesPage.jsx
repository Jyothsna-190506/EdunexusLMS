import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  Code,
  Cpu,
  Database,
  Globe,
  ShieldCheck,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

const initialCategories = [
  { id: 'cat-1', name: 'Programming & Logic', slug: 'programming', coursesCount: 14, icon: 'Code', description: 'Core programming languages, data structures, algorithms, and design patterns.' },
  { id: 'cat-2', name: 'Web Development', slug: 'web-development', coursesCount: 22, icon: 'Globe', description: 'Modern front-end, back-end, Full-Stack frameworks, and responsive web design.' },
  { id: 'cat-3', name: 'Artificial Intelligence', slug: 'artificial-intelligence', coursesCount: 12, icon: 'Cpu', description: 'Machine learning, deep neural networks, LLMs, and prompt engineering.' },
  { id: 'cat-4', name: 'Cloud & DevOps', slug: 'cloud-devops', coursesCount: 8, icon: 'Server', description: 'Docker, Kubernetes, AWS, microservices, and CI/CD automation pipelines.' },
  { id: 'cat-5', name: 'Cybersecurity', slug: 'cybersecurity', coursesCount: 6, icon: 'ShieldCheck', description: 'Network defense, ethical hacking, cryptography, and application security.' },
  { id: 'cat-6', name: 'Databases & Big Data', slug: 'databases', coursesCount: 9, icon: 'Database', description: 'SQL, MongoDB, PostgreSQL, data warehousing, and distributed streams.' }
];

const AdminCategoriesPage = () => {
  const { showToast } = useNotification();
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', icon: 'Code' });

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm(cat);
    } else {
      setEditingCat(null);
      setCatForm({ name: '', slug: '', description: '', icon: 'Code' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingCat) {
      setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...catForm, id: c.id, coursesCount: c.coursesCount } : c));
      if (showToast) showToast('Category updated successfully', 'success');
    } else {
      const newCat = {
        ...catForm,
        id: `cat-${Date.now()}`,
        coursesCount: 0,
        slug: catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, '-')
      };
      setCategories([...categories, newCat]);
      if (showToast) showToast('New category created', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      if (showToast) showToast('Category deleted', 'info');
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <FolderTree size={28} color="var(--primary)" />
              Course Categories
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Manage curriculum domains, topic taxonomy, and catalog organization.
            </p>
          </div>

          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={16} />
            Create Category
          </button>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Grid of Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Layers size={22} />
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    {cat.coursesCount} Courses
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {cat.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
                  slug: /{cat.slug}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                  {cat.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <button onClick={() => handleOpenModal(cat)} className="btn btn-ghost" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                  <Edit2 size={15} /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id)} className="btn btn-ghost" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', color: 'var(--danger)' }}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                {editingCat ? 'Edit Category' : 'Create New Category'}
              </h3>
              <form onSubmit={handleSave}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Artificial Intelligence"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. artificial-intelligence"
                    value={catForm.slug}
                    onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="input"
                    placeholder="Brief description of the domain..."
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    style={{ height: 'auto' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCat ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCategoriesPage;
