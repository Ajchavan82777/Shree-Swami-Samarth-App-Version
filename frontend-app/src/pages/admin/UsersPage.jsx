import { useState, useEffect } from 'react';
import { Plus, X, Trash2, Edit2, Shield, Eye, EyeOff } from 'lucide-react';
import api, { fmtDate } from '../../utils/api';

const ROLE_BADGE = {
  admin:   { label: 'Admin',   color: '#dc2626', bg: '#fee2e2' },
  manager: { label: 'Manager', color: '#ea580c', bg: '#ffedd5' },
  staff:   { label: 'Staff',   color: '#2563eb', bg: '#dbeafe' },
  viewer:  { label: 'Viewer',  color: '#6b7280', bg: '#f3f4f6' },
};

function RoleBadge({ role }) {
  const cfg = ROLE_BADGE[role] || { label: role, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33`,
    }}>
      <Shield size={11} />
      {cfg.label}
    </span>
  );
}

const EMPTY_CREATE = { name: '', email: '', password: '', role: '' };
const EMPTY_EDIT   = { name: '', role: '', password: '' };

export default function UsersPage() {
  const [users,       setUsers]       = useState([]);
  const [roles,       setRoles]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Create modal
  const [showCreate,    setShowCreate]    = useState(false);
  const [createForm,    setCreateForm]    = useState(EMPTY_CREATE);
  const [createErrors,  setCreateErrors]  = useState({});
  const [showCreatePwd, setShowCreatePwd] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Edit modal
  const [editTarget,   setEditTarget]   = useState(null);
  const [editForm,     setEditForm]     = useState(EMPTY_EDIT);
  const [editErrors,   setEditErrors]   = useState({});
  const [showEditPwd,  setShowEditPwd]  = useState(false);
  const [editLoading,  setEditLoading]  = useState(false);

  // Delete confirm
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get('/auth/users'),
      api.get('/roles/'),
      api.get('/auth/me'),
    ])
      .then(([usersRes, rolesRes, meRes]) => {
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
        setCurrentUser(meRes.data);
      })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const reload = () =>
    api.get('/auth/users').then(r => setUsers(r.data)).catch(() => {});

  // ─── Create ───────────────────────────────────────────────────────────────
  const openCreate = () => {
    setCreateForm({ ...EMPTY_CREATE, role: roles[0]?.role_name || '' });
    setCreateErrors({});
    setShowCreatePwd(false);
    setShowCreate(true);
  };

  const validateCreate = () => {
    const errs = {};
    if (!createForm.name.trim())     errs.name     = 'Name is required.';
    if (!createForm.email.trim())    errs.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(createForm.email)) errs.email = 'Invalid email.';
    if (!createForm.password.trim()) errs.password = 'Password is required.';
    if (!createForm.role)            errs.role     = 'Role is required.';
    return errs;
  };

  const handleCreate = async e => {
    e.preventDefault();
    const errs = validateCreate();
    if (Object.keys(errs).length) { setCreateErrors(errs); return; }
    setCreateLoading(true);
    try {
      await api.post('/auth/users', {
        name:     createForm.name.trim(),
        email:    createForm.email.trim().toLowerCase(),
        password: createForm.password,
        role:     createForm.role,
      });
      setShowCreate(false);
      await reload();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user.';
      setCreateErrors({ submit: msg });
    } finally {
      setCreateLoading(false);
    }
  };

  // ─── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = user => {
    setEditTarget(user);
    setEditForm({ name: user.name, role: user.role, password: '' });
    setEditErrors({});
    setShowEditPwd(false);
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.name.trim()) errs.name = 'Name is required.';
    if (!editForm.role)        errs.role = 'Role is required.';
    return errs;
  };

  const handleEdit = async e => {
    e.preventDefault();
    const errs = validateEdit();
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    setEditLoading(true);
    const payload = { name: editForm.name.trim(), role: editForm.role };
    if (editForm.password.trim()) payload.password = editForm.password;
    try {
      await api.put(`/auth/users/${editTarget.id}`, payload);
      setEditTarget(null);
      await reload();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user.';
      setEditErrors({ submit: msg });
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/auth/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isSelf = user => currentUser && user.id === currentUser.id;

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', margin: 0 }}>User Management</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>
            Manage portal users and their access roles
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add User
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--maroon)', color: '#fff' }}>
              {['Name', 'Email', 'Role', 'Created', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: h === 'Actions' ? 'right' : 'left',
                  fontWeight: 600, fontSize: 13, letterSpacing: '0.03em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: '#9ca3af' }}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id} style={{
                  background: idx % 2 === 0 ? '#fff' : 'var(--cream)',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--dark)' }}>
                    {user.name}
                    {isSelf(user) && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--maroon)', fontWeight: 600 }}>(You)</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151', fontSize: 14 }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}><RoleBadge role={user.role} /></td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>
                    {user.created_at ? fmtDate(user.created_at) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => openEdit(user)}
                        title="Edit user"
                        style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => !isSelf(user) && setDeleteTarget(user)}
                        disabled={isSelf(user)}
                        title={isSelf(user) ? 'Cannot delete yourself' : 'Delete user'}
                        style={{
                          padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
                          opacity: isSelf(user) ? 0.4 : 1, cursor: isSelf(user) ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Create Modal ─────────────────────────────────────────────────── */}
      {showCreate && (
        <ModalOverlay onClose={() => !createLoading && setShowCreate(false)}>
          <ModalHeader title="Add New User" onClose={() => !createLoading && setShowCreate(false)} />
          <form onSubmit={handleCreate} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px' }}>
              {createErrors.submit && <ErrorBanner msg={createErrors.submit} />}

              <FormField label="Full Name" required error={createErrors.name}>
                <input
                  className="form-input"
                  placeholder="e.g. Rajesh Sharma"
                  value={createForm.name}
                  onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                />
              </FormField>

              <FormField label="Email Address" required error={createErrors.email}>
                <input
                  className="form-input"
                  type="email"
                  placeholder="user@example.com"
                  value={createForm.email}
                  onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                />
              </FormField>

              <FormField label="Password" required error={createErrors.password}>
                <PasswordInput
                  value={createForm.password}
                  show={showCreatePwd}
                  onToggle={() => setShowCreatePwd(v => !v)}
                  onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Set a strong password"
                />
              </FormField>

              <FormField label="Role" required error={createErrors.role}>
                <select
                  className="form-select"
                  value={createForm.role}
                  onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="">Select role…</option>
                  {roles.map(r => (
                    <option key={r.role_name} value={r.role_name}>{r.role_name}</option>
                  ))}
                </select>
              </FormField>
            </div>
            <ModalFooter onCancel={() => setShowCreate(false)} loading={createLoading} submitLabel="Create User" />
          </form>
        </ModalOverlay>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {editTarget && (
        <ModalOverlay onClose={() => !editLoading && setEditTarget(null)}>
          <ModalHeader title={`Edit User — ${editTarget.name}`} onClose={() => !editLoading && setEditTarget(null)} />
          <form onSubmit={handleEdit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px' }}>
              {editErrors.submit && <ErrorBanner msg={editErrors.submit} />}

              <FormField label="Full Name" required error={editErrors.name}>
                <input
                  className="form-input"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                />
              </FormField>

              <FormField label="Role" required error={editErrors.role}>
                <select
                  className="form-select"
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="">Select role…</option>
                  {roles.map(r => (
                    <option key={r.role_name} value={r.role_name}>{r.role_name}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="New Password" hint="Leave blank to keep current password" error={editErrors.password}>
                <PasswordInput
                  value={editForm.password}
                  show={showEditPwd}
                  onToggle={() => setShowEditPwd(v => !v)}
                  onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter new password (optional)"
                />
              </FormField>
            </div>
            <ModalFooter onCancel={() => setEditTarget(null)} loading={editLoading} submitLabel="Save Changes" />
          </form>
        </ModalOverlay>
      )}

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      {deleteTarget && (
        <ModalOverlay onClose={() => !deleteLoading && setDeleteTarget(null)}>
          <div style={{ padding: '28px 24px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fee2e2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Trash2 size={24} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>
              Delete User?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {deleteLoading ? 'Deleting…' : <><Trash2 size={14} /> Delete User</>}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ModalOverlay({ children, onClose }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'fadeIn 0.15s ease',
      }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 24px', borderBottom: '1px solid var(--border)',
    }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--dark)', margin: 0 }}>{title}</h2>
      <button onClick={onClose} className="btn btn-ghost" style={{ padding: 4, lineHeight: 1 }}>
        <X size={18} />
      </button>
    </div>
  );
}

function ModalFooter({ onCancel, loading, submitLabel }) {
  return (
    <div style={{
      display: 'flex', gap: 12, justifyContent: 'flex-end',
      padding: '16px 24px', borderTop: '1px solid var(--border)',
    }}>
      <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}

function FormField({ label, required, hint, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && !error && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{hint}</p>}
      {error && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function PasswordInput({ value, show, onToggle, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        className="form-input"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingRight: 40 }}
      />
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280',
          display: 'flex', alignItems: 'center', padding: 0,
        }}
        tabIndex={-1}
        title={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function ErrorBanner({ msg }) {
  return (
    <div style={{
      background: '#fee2e2', border: '1px solid #fca5a5',
      color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13,
    }}>
      {msg}
    </div>
  );
}
