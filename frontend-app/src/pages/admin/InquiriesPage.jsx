import { useState, useEffect } from 'react';
import { Plus, X, Search, RefreshCw } from 'lucide-react';
import api, { fmtDate, cap } from '../../utils/api';

const STATUS_OPTIONS = ['new', 'contacted', 'quoted', 'confirmed', 'cancelled'];

export default function InquiriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'view' | 'edit' | 'create'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/inquiries/', { params: filter ? { status: filter } : {} })
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const openView = (item) => { setSelected(item); setModal('view'); };
  const openEdit = (item) => { setSelected(item); setForm({ ...item }); setModal('edit'); };
  const openCreate = () => { setForm({ name: '', email: '', phone: '', company_name: '', event_type: 'corporate', service_type: '', event_date: '', venue: '', guest_count: '', budget_range: '', meal_preference: 'veg', notes: '', status: 'new' }); setModal('create'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/inquiries/', form);
      } else {
        await api.put(`/inquiries/${selected.id}`, form);
      }
      load();
      closeModal();
    } catch (e) {
      alert('Error saving: ' + (e.response?.data?.message || e.message));
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/inquiries/${id}`, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    await api.delete(`/inquiries/${id}`);
    load();
  };

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase()) ||
    i.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inquiries</h1>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={16} /> New Inquiry</button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by name, email, company..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
                {s === '' ? 'All' : cap(s)}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📭</div>No inquiries found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Contact</th><th>Event Type</th><th>Event Date</th>
                  <th>Guests</th><th>Status</th><th>Received</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inq => (
                  <tr key={inq.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inq.name}</div>
                      {inq.company_name && <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{inq.company_name}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{inq.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{inq.phone}</div>
                    </td>
                    <td><span className={`badge badge-${inq.event_type}`}>{cap(inq.event_type)}</span></td>
                    <td style={{ fontSize: 13 }}>{fmtDate(inq.event_date)}</td>
                    <td style={{ fontSize: 13 }}>{inq.guest_count || '—'}</td>
                    <td>
                      <select value={inq.status} onChange={e => handleStatusChange(inq.id, e.target.value)}
                        className={`badge badge-${inq.status}`} style={{ border: 'none', cursor: 'pointer', fontWeight: 600, background: 'transparent' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                      </select>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-light)' }}>{fmtDate(inq.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openView(inq)}>View</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(inq)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(inq.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inquiry Details</h2>
              <button className="close-btn" onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  ['Name', selected.name], ['Company', selected.company_name || '—'],
                  ['Email', selected.email], ['Phone', selected.phone],
                  ['Event Type', cap(selected.event_type)], ['Service', selected.service_type || '—'],
                  ['Event Date', fmtDate(selected.event_date)], ['Venue', selected.venue || '—'],
                  ['Guest Count', selected.guest_count || '—'], ['Budget', selected.budget_range || '—'],
                  ['Meal Pref', cap(selected.meal_preference)], ['Status', cap(selected.status)],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{val}</p>
                  </div>
                ))}
              </div>
              {selected.notes && (
                <div style={{ marginTop: 20, padding: 14, background: 'var(--cream)', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 6 }}>NOTES</p>
                  <p style={{ fontSize: 14 }}>{selected.notes}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Close</button>
              <button className="btn btn-primary btn-sm" onClick={() => { closeModal(); openEdit(selected); }}>Edit</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'create' ? 'New Inquiry' : 'Edit Inquiry'}</h2>
              <button className="close-btn" onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name || ''} onChange={e => set('name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={form.company_name || ''} onChange={e => set('company_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select className="form-select" value={form.event_type || 'corporate'} onChange={e => set('event_type', e.target.value)}>
                    <option value="corporate">Corporate</option><option value="wedding">Wedding</option><option value="event">Event</option><option value="general">General</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Service Type</label><input className="form-input" value={form.service_type || ''} onChange={e => set('service_type', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Event Date</label><input className="form-input" type="date" value={form.event_date || ''} onChange={e => set('event_date', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Venue</label><input className="form-input" value={form.venue || ''} onChange={e => set('venue', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Guest Count</label><input className="form-input" type="number" value={form.guest_count || ''} onChange={e => set('guest_count', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Budget Range</label><input className="form-input" value={form.budget_range || ''} onChange={e => set('budget_range', e.target.value)} /></div>
                <div className="form-group">
                  <label className="form-label">Meal Preference</label>
                  <select className="form-select" value={form.meal_preference || 'veg'} onChange={e => set('meal_preference', e.target.value)}>
                    <option value="veg">Vegetarian</option><option value="nonveg">Non-Veg</option><option value="mixed">Mixed</option><option value="jain">Jain</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status || 'new'} onChange={e => set('status', e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
