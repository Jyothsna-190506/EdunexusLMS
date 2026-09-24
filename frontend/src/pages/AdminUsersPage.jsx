import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/common/Sidebar';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Modal from '../components/common/Modal';
import {
  Users,
  Search,
  Shield,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const { showToast } = useNotification();

  // Role edit modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('STUDENT');
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('Error loading users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
    try {
      await api.put(`/admin/users/${user.id}/status`, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
      showToast(`User status updated to ${nextStatus}.`, 'success');
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update user status.', 'error');
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditRoleModalOpen(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdatingRole(true);
    try {
      await api.put(`/admin/users/${selectedUser.id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
      );
      showToast('User role updated successfully.', 'success');
      setEditRoleModalOpen(false);
    } catch (err) {
      console.error('Failed to change role:', err);
      showToast('Failed to update user role.', 'error');
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('User deleted successfully.', 'success');
    } catch (err) {
      console.error('Failed to delete user:', err);
      showToast('Failed to delete user.', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Search, filter, update security roles, and manage access statuses across all members.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 2, minWidth: '240px' }}>
              <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '160px' }}>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="form-control form-select"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="INSTRUCTOR">Instructors</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Data Table */}
        {loading ? (
          <SkeletonLoader count={5} />
        ) : filteredUsers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Users size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
            <h3>No Users Matching Criteria</h3>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={u.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || 'User'}`}
                            alt={u.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'INSTRUCTOR' ? 'badge-secondary' : 'badge-primary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`btn btn-sm ${u.status === 'DISABLED' ? 'btn-danger' : 'btn-success'}`}
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                          title="Click to toggle status"
                        >
                          {u.status || 'ACTIVE'}
                        </button>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenRoleModal(u)}
                            className="btn btn-secondary btn-sm"
                            title="Change Role"
                          >
                            <Edit2 size={14} /> Change Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Change Role Modal */}
        <Modal
          isOpen={editRoleModalOpen}
          onClose={() => setEditRoleModalOpen(false)}
          title={`Update Role for ${selectedUser?.name}`}
        >
          <form onSubmit={handleSaveRole}>
            <div className="form-group">
              <label className="form-label">Select System Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="form-control form-select"
              >
                <option value="STUDENT">STUDENT (Access courses, quizzes, certificates)</option>
                <option value="INSTRUCTOR">INSTRUCTOR (Create, edit & manage courses)</option>
                <option value="ADMIN">ADMIN (Full system moderation & analytics)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setEditRoleModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={updatingRole} className="btn btn-primary">
                {updatingRole ? 'Updating...' : 'Save Role'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default AdminUsersPage;
