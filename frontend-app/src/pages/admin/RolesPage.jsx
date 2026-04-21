import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Save, Shield } from 'lucide-react';
import api from '../../utils/api';

// ---------------------------------------------------------------------------
// Page / permission definitions
// ---------------------------------------------------------------------------
const PAGES = [
  { key: 'dashboard',  label: 'Dashboard',      icon: '📊' },
  { key: 'invoices',   label: 'Invoices',        icon: '🧾' },
  { key: 'quotations', label: 'Quotations',      icon: '📄' },
  { key: 'inquiries',  label: 'Inquiries',       icon: '📩' },
  { key: 'bookings',   label: 'Bookings',        icon: '📅' },
  { key: 'customers',  label: 'Customers',       icon: '👥' },
  { key: 'packages',   label: 'Packages',        icon: '📦' },
  { key: 'staff',      label: 'Staff',           icon: '👷' },
  { key: 'corporate',  label: 'Corporate',       icon: '🏢' },
  { key: 'reports',    label: 'Reports',         icon: '📈' },
  { key: 'content',    label: 'Content/CMS',     icon: '✏️' },
  { key: 'settings',   label: 'Settings',        icon: '⚙️' },
  { key: 'roles',      label: 'Roles & Access',  icon: '🔐' },
];

const EMPTY_PERMISSIONS = Object.fromEntries(PAGES.map(p => [p.key, false]));

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------
function countEnabled(permissions) {
  return Object.values(permissions || {}).filter(Boolean).length;
}

function mergePermissions(base) {
  // Ensure all known page keys are present (fills gaps for old roles)
  return { ...EMPTY_PERMISSIONS, ...(base || {}) };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Single checkbox row inside the permission editor */
function PermissionRow({ page, checked, onChange, disabled }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.45rem 0.6rem',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? 'rgba(var(--maroon-rgb,139,0,0),0.06)' : 'transparent',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s',
      }}
    >
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange(page.key, e.target.checked)}
        disabled={disabled}
        style={{ accentColor: 'var(--maroon)', width: '16px', height: '16px', cursor: disabled ? 'not-allowed' : 'pointer' }}
      />
      <span style={{ fontSize: '1.1rem' }}>{page.icon}</span>
      <span style={{ fontSize: '0.9rem', color: 'var(--dark)', fontWeight: checked ? 600 : 400 }}>
        {page.label}
      </span>
    </label>
  );
}

/** Small chip shown on the role card for each enabled permission */
function PermChip({ label, icon }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        background: 'rgba(var(--maroon-rgb,139,0,0),0.08)',
        color: 'var(--maroon)',
        borderRadius: '12px',
        padding: '2px 8px',
        fontSize: '0.72rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {icon} {label}
    </span>
  );
}

/** Role card displayed in the main list */
function RoleCard({ role, onEdit, onDelete }) {
  const isAdmin = role.role_name === 'admin';
  const perms = mergePermissions(role.permissions);
  const enabledPages = PAGES.filter(p => perms[p.key]);

  return (
    <div
      style={{
        background: 'var(--cream, #fffdf7)',
        border: `1.5px solid ${isAdmin ? 'var(--gold, #c9a84c)' : 'var(--border, #e0d6c2)'}`,
        borderRadius: '12px',
        padding: '1.2rem 1.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        position: 'relative',
        boxShadow: isAdmin ? '0 2px 12px rgba(201,168,76,0.18)' : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          {isAdmin && (
            <Shield
              size={18}
              strokeWidth={2}
              style={{ color: 'var(--gold, #c9a84c)', flexShrink: 0 }}
            />
          )}
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--dark)', textTransform: 'capitalize' }}>
              {role.role_name}
            </h3>
            {role.description && (
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text, #555)', lineHeight: 1.3 }}>
                {role.description}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
          {!isAdmin && (
            <>
              <button
                onClick={() => onEdit(role)}
                title="Edit permissions"
                style={{
                  background: 'var(--maroon, #8b0000)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(role.role_name)}
                title="Delete role"
                style={{
                  background: 'transparent',
                  color: '#c0392b',
                  border: '1.5px solid #c0392b',
                  borderRadius: '7px',
                  padding: '5px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          {isAdmin && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--gold, #c9a84c)',
                fontWeight: 700,
                padding: '4px 10px',
                border: '1.5px solid var(--gold, #c9a84c)',
                borderRadius: '7px',
              }}
            >
              Protected
            </span>
          )}
        </div>
      </div>

      {/* Permission count badge */}
      <div style={{ fontSize: '0.78rem', color: 'var(--text, #555)' }}>
        <strong style={{ color: 'var(--maroon)' }}>{enabledPages.length}</strong>
        {' / '}
        {PAGES.length} pages enabled
      </div>

      {/* Chips for enabled permissions */}
      {enabledPages.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {enabledPages.map(p => (
            <PermChip key={p.key} label={p.label} icon={p.icon} />
          ))}
        </div>
      )}

      {enabledPages.length === 0 && (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
          No pages enabled for this role.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal (create + edit)
// ---------------------------------------------------------------------------
function RoleModal({ mode, initial, onClose, onSave, saving }) {
  const isCreate = mode === 'create';

  const [roleName, setRoleName]       = useState(initial?.role_name    || '');
  const [description, setDescription] = useState(initial?.description  || '');
  const [permissions, setPermissions] = useState(
    mergePermissions(initial?.permissions)
  );

  function togglePerm(key, val) {
    setPermissions(prev => ({ ...prev, [key]: val }));
  }

  function handleSelectAll(val) {
    setPermissions(Object.fromEntries(PAGES.map(p => [p.key, val])));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ roleName: roleName.trim(), description: description.trim(), permissions });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid var(--border, #e0d6c2)',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 1,
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--dark)' }}>
            {isCreate ? 'Create New Role' : `Edit: ${initial.role_name}`}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Role name (only editable on create) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: 'var(--dark)' }}>
              Role Name *
            </label>
            <input
              type="text"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              disabled={!isCreate}
              required={isCreate}
              placeholder="e.g. supervisor"
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                border: '1.5px solid var(--border, #e0d6c2)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: !isCreate ? '#f5f5f5' : '#fff',
                color: 'var(--dark)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: 'var(--dark)' }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short description of this role"
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                border: '1.5px solid var(--border, #e0d6c2)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Permissions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)' }}>
                Page Permissions
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    border: '1px solid var(--maroon)',
                    borderRadius: '5px',
                    background: 'transparent',
                    color: 'var(--maroon)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    border: '1px solid #aaa',
                    borderRadius: '5px',
                    background: 'transparent',
                    color: '#666',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  None
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '2px',
                border: '1.5px solid var(--border, #e0d6c2)',
                borderRadius: '10px',
                padding: '0.5rem',
                background: '#fafafa',
              }}
            >
              {PAGES.map(page => (
                <PermissionRow
                  key={page.key}
                  page={page}
                  checked={permissions[page.key]}
                  onChange={togglePerm}
                  disabled={false}
                />
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1.2rem',
                border: '1.5px solid var(--border, #e0d6c2)',
                borderRadius: '8px',
                background: '#fff',
                color: 'var(--dark)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.55rem 1.4rem',
                background: 'var(--maroon, #8b0000)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={15} />
              {saving ? 'Saving…' : isCreate ? 'Create Role' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function RolesPage() {
  const [roles, setRoles]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [saving, setSaving]     = useState(false);

  // Modal state
  const [modalMode, setModalMode]       = useState(null); // 'create' | 'edit' | null
  const [editingRole, setEditingRole]   = useState(null);

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------
  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/roles/');
      setRoles(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRoles(); }, [loadRoles]);

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  async function handleCreate({ roleName, description, permissions }) {
    if (!roleName) return;
    setSaving(true);
    try {
      await api.post('/roles/', { role_name: roleName, description, permissions });
      setModalMode(null);
      await loadRoles();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to create role');
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Edit
  // ---------------------------------------------------------------------------
  async function handleEdit({ description, permissions }) {
    if (!editingRole) return;
    setSaving(true);
    try {
      await api.put(`/roles/${editingRole.role_name}`, { description, permissions });
      setModalMode(null);
      setEditingRole(null);
      await loadRoles();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  async function handleDelete(role_name) {
    if (role_name === 'admin') {
      alert("The 'admin' role cannot be deleted.");
      return;
    }
    if (!window.confirm(`Delete role "${role_name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/roles/${role_name}`);
      await loadRoles();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete role');
    }
  }

  // ---------------------------------------------------------------------------
  // Modal routing
  // ---------------------------------------------------------------------------
  function openCreate() {
    setEditingRole(null);
    setModalMode('create');
  }

  function openEdit(role) {
    setEditingRole(role);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingRole(null);
  }

  function handleModalSave(data) {
    if (modalMode === 'create') handleCreate(data);
    else if (modalMode === 'edit') handleEdit(data);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Shield size={24} style={{ color: 'var(--maroon, #8b0000)' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--dark)', fontWeight: 700 }}>
              Roles &amp; Access
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text, #555)' }}>
              Manage portal roles and page-level permissions
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--maroon, #8b0000)',
            color: '#fff',
            border: 'none',
            borderRadius: '9px',
            padding: '0.6rem 1.2rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          New Role
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text, #555)' }}>
          Loading roles…
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          style={{
            background: '#fff0f0',
            border: '1.5px solid #f5c6c6',
            borderRadius: '10px',
            padding: '1rem 1.2rem',
            color: '#c0392b',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <X size={16} /> {error}
          <button
            onClick={loadRoles}
            style={{
              marginLeft: 'auto',
              background: '#c0392b',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 12px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Role cards grid */}
      {!loading && !error && (
        <>
          {roles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text, #555)' }}>
              No roles found. Click <strong>New Role</strong> to get started.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1rem',
              }}
            >
              {roles.map(role => (
                <RoleCard
                  key={role.role_name}
                  role={role}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create / Edit modal */}
      {modalMode && (
        <RoleModal
          mode={modalMode}
          initial={modalMode === 'edit' ? editingRole : null}
          onClose={closeModal}
          onSave={handleModalSave}
          saving={saving}
        />
      )}
    </div>
  );
}
