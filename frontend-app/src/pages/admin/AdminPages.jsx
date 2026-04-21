import { useState, useEffect, useRef } from 'react';
import { Plus, X, Eye, Trash2, Download, ChevronDown, Search } from 'lucide-react';
import api, { fmt, fmtDate, cap } from '../../utils/api';
import { downloadCSV, downloadExcel, downloadWordTable, downloadPrintTable } from '../../utils/tableExport';

// ---- SHARED SIMPLE CRUD TABLE (with Export) ----
function CrudTable({ title, columns, rows, onView, onEdit, onDelete, onCreate, loading, exportFilename }) {
  const [dlOpen, setDlOpen] = useState(false);
  const [search, setSearch] = useState('');
  const tableRef = useRef(null);
  const fname = exportFilename || title.replace(/\s+/g, '_');

  const filteredRows = search.trim()
    ? rows.filter(row => columns.some(col => {
        const v = row[col.key];
        return v != null && String(v).toLowerCase().includes(search.toLowerCase());
      }))
    : rows;

  const EXPORT_OPTS = [
    { label: '📄 CSV',        fn: () => downloadCSV(rows, columns, fname) },
    { label: '📊 Excel',      fn: () => downloadExcel(rows, columns, fname) },
    { label: '📝 Word',       fn: () => downloadWordTable(rows, columns, fname) },
    { label: '🖨 Print / PDF', fn: () => downloadPrintTable(tableRef.current, fname) },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {rows.length > 0 && (
            <div style={{ position:'relative' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setDlOpen(o => !o)}
                style={{ display:'flex', alignItems:'center', gap:5 }}>
                <Download size={14} /> Export <ChevronDown size={12} />
              </button>
              {dlOpen && (
                <>
                  <div style={{ position:'fixed', inset:0, zIndex:98 }} onClick={() => setDlOpen(false)} />
                  <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'#fff', border:'1px solid var(--border)', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,0.12)', zIndex:99, minWidth:150, overflow:'hidden' }}>
                    {EXPORT_OPTS.map(o => (
                      <button key={o.label} onClick={() => { o.fn(); setDlOpen(false); }}
                        style={{ display:'block', width:'100%', padding:'10px 16px', border:'none', background:'transparent', textAlign:'left', cursor:'pointer', fontSize:13, whiteSpace:'nowrap' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {onCreate && <button className="btn btn-primary btn-sm" onClick={onCreate}><Plus size={16} /> New</button>}
        </div>
      </div>
      <div className="card">
        {!loading && (
          <div style={{ display:'flex', gap:8, padding:'10px 16px', borderBottom:'1px solid var(--border)', alignItems:'center', flexWrap:'wrap', background:'var(--cream)' }}>
            <div style={{ position:'relative', flex:1, minWidth:180 }}>
              <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)', pointerEvents:'none' }} />
              <input className="form-input" style={{ paddingLeft:32, fontSize:13 }}
                placeholder={`Filter by ${columns.slice(0,3).map(c=>c.label).join(', ').toLowerCase()}…`}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {search && (
              <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}><X size={12}/> Clear</button>
            )}
            <span style={{ fontSize:12, color:'var(--text-light)', whiteSpace:'nowrap' }}>
              {filteredRows.length}{rows.length !== filteredRows.length ? ` / ${rows.length}` : ''} records
            </span>
          </div>
        )}
        {loading ? <div className="loading">Loading...</div> : filteredRows.length === 0 ? (
          <div className="empty"><div className="empty-icon">📋</div>{search ? 'No records match your search.' : 'No records found'}</div>
        ) : (
          <div className="table-wrap" ref={tableRef}>
            <table>
              <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}<th>Actions</th></tr></thead>
              <tbody>
                {filteredRows.map((row, i) => (
                  <tr key={row.id || i}>
                    {columns.map(c => <td key={c.key}>{c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}</td>)}
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {onView && <button className="btn btn-ghost btn-sm" onClick={() => onView(row)}><Eye size={13} /></button>}
                        {onEdit && <button className="btn btn-ghost btn-sm" onClick={() => onEdit(row)}>Edit</button>}
                        {onDelete && <button className="btn btn-danger btn-sm" onClick={() => onDelete(row.id)}><Trash2 size={13} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- CORPORATE PAGE ----
export function CorporatePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_name: '', email: '', phone: '', city: '', employees: '', service_type: '', monthly_value: '', status: 'prospect', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/corporate/').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try { await api.post('/corporate/', form); setModal(false); const r = await api.get('/corporate/'); setItems(r.data); } catch { }
    setSaving(false);
  };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/corporate/${id}`); const r = await api.get('/corporate/'); setItems(r.data); };

  const columns = [
    { key: 'company_name', label: 'Company', render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v}</div><div style={{ fontSize: 12, color: 'var(--text-light)' }}>{row.contact_name}</div></div> },
    { key: 'email', label: 'Contact', render: (v, row) => <div><div style={{ fontSize: 13 }}>{v}</div><div style={{ fontSize: 12, color: 'var(--text-light)' }}>{row.phone}</div></div> },
    { key: 'city', label: 'City' },
    { key: 'service_type', label: 'Service' },
    { key: 'monthly_value', label: 'Monthly Value', render: v => <strong>{v ? fmt(v) : '—'}</strong> },
    { key: 'status', label: 'Status', render: v => <span className={`badge badge-${v}`}>{cap(v)}</span> },
    { key: 'employees', label: 'Employees' },
  ];

  return (
    <>
      <CrudTable title="Corporate Leads" columns={columns} rows={items} loading={loading} onCreate={() => setModal(true)} onDelete={handleDelete} />
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>New Corporate Lead</h2><button className="close-btn" onClick={() => setModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Company Name *</label><input className="form-input" value={form.company_name} onChange={e => set('company_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Contact Name</label><input className="form-input" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Employees</label><input className="form-input" type="number" value={form.employees} onChange={e => set('employees', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Service Type</label><input className="form-input" value={form.service_type} onChange={e => set('service_type', e.target.value)} placeholder="e.g. Daily Meal Plan" /></div>
                <div className="form-group"><label className="form-label">Monthly Value (₹)</label><input className="form-input" type="number" value={form.monthly_value} onChange={e => set('monthly_value', e.target.value)} /></div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="prospect">Prospect</option><option value="negotiation">Negotiation</option><option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Lead'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---- BOOKINGS PAGE ----
export function BookingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customer_name: '', event_type: 'corporate', package_name: '', event_date: '', venue: '', guest_count: '', total_amount: '', advance_paid: 0, status: 'confirmed', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/bookings/').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/bookings/', { ...form, balance_due: (form.total_amount || 0) - (form.advance_paid || 0) });
      setModal(false); const r = await api.get('/bookings/'); setItems(r.data);
    } catch { } setSaving(false);
  };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/bookings/${id}`); const r = await api.get('/bookings/'); setItems(r.data); };

  const columns = [
    { key: 'customer_name', label: 'Client', render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v}</div><span className={`badge badge-${row.event_type}`} style={{ fontSize: 11 }}>{row.event_type}</span></div> },
    { key: 'package_name', label: 'Package' },
    { key: 'event_date', label: 'Event Date', render: v => fmtDate(v) },
    { key: 'venue', label: 'Venue' },
    { key: 'guest_count', label: 'Guests' },
    { key: 'total_amount', label: 'Total', render: v => fmt(v) },
    { key: 'balance_due', label: 'Balance', render: v => <span style={{ color: v > 0 ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>{fmt(v)}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`badge badge-${v}`}>{cap(v)}</span> },
  ];

  return (
    <>
      <CrudTable title="Bookings" columns={columns} rows={items} loading={loading} onCreate={() => setModal(true)} onDelete={handleDelete} />
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>New Booking</h2><button className="close-btn" onClick={() => setModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Client Name *</label><input className="form-input" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Event Type</label><select className="form-select" value={form.event_type} onChange={e => set('event_type', e.target.value)}><option value="corporate">Corporate</option><option value="wedding">Wedding</option><option value="event">Event</option></select></div>
                <div className="form-group"><label className="form-label">Package</label><input className="form-input" value={form.package_name} onChange={e => set('package_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Event Date</label><input className="form-input" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Venue</label><input className="form-input" value={form.venue} onChange={e => set('venue', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Guest Count</label><input className="form-input" type="number" value={form.guest_count} onChange={e => set('guest_count', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Total Amount (₹)</label><input className="form-input" type="number" value={form.total_amount} onChange={e => set('total_amount', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Advance Paid (₹)</label><input className="form-input" type="number" value={form.advance_paid} onChange={e => set('advance_paid', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}><option value="confirmed">Confirmed</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Booking'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---- CUSTOMERS PAGE ----
const EMPTY_CUSTOMER = { name: '', email: '', phone: '', type: 'individual', company: '', city: '' };

export function CustomersPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);   // null | 'create' | 'edit'
  const [form,    setForm]    = useState(EMPTY_CUSTOMER);
  const [editId,  setEditId]  = useState(null);
  const [saving,  setSaving]  = useState(false);

  const reload = () => api.get('/customers/').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { reload(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => { setForm(EMPTY_CUSTOMER); setEditId(null); setModal('create'); };
  const openEdit   = row => { setForm({ name: row.name || '', email: row.email || '', phone: row.phone || '', type: row.type || 'individual', company: row.company || '', city: row.city || '' }); setEditId(row.id); setModal('edit'); };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Name is required.');
    setSaving(true);
    try {
      if (modal === 'edit') {
        await api.put(`/customers/${editId}`, form);
      } else {
        await api.post('/customers/', form);
      }
      setModal(null);
      reload();
    } catch (e) { alert('Error: ' + (e.response?.data?.error || e.message)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await api.delete(`/customers/${id}`);
    reload();
  };

  const columns = [
    { key: 'name', label: 'Name', render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v}</div>{row.company && <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{row.company}</div>}</div> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'type', label: 'Type', render: v => <span className={`badge badge-${v === 'corporate' ? 'corporate' : 'general'}`}>{cap(v || 'individual')}</span> },
    { key: 'total_bookings', label: 'Bookings' },
    { key: 'total_spent', label: 'Total Spent', render: v => fmt(v) },
  ];

  return (
    <>
      <CrudTable title="Customers" columns={columns} rows={items} loading={loading} onCreate={openCreate} onEdit={openEdit} onDelete={handleDelete} exportFilename="customers" />
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'edit' ? 'Edit Customer' : 'New Customer'}</h2>
              <button className="close-btn" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={form.company} onChange={e => set('company', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : modal === 'edit' ? 'Save Changes' : 'Create Customer'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---- PACKAGES ADMIN PAGE ----
export function PackagesAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'corporate', price_per_person: '', min_persons: 25, description: '', inclusions: '', featured: false, active: true });
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get('/packages/').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, inclusions: typeof form.inclusions === 'string' ? form.inclusions.split('\n').filter(Boolean) : form.inclusions };
      await api.post('/packages/', payload); setModal(false); const r = await api.get('/packages/'); setItems(r.data);
    } catch { } setSaving(false);
  };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/packages/${id}`); const r = await api.get('/packages/'); setItems(r.data); };
  const columns = [
    { key: 'name', label: 'Package Name', render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v}</div>{row.featured && <span style={{ fontSize: 10, background: 'var(--gold)', color: 'var(--dark)', padding: '1px 6px', borderRadius: 10 }}>Featured</span>}</div> },
    { key: 'category', label: 'Category', render: v => <span className={`badge badge-${v}`}>{cap(v)}</span> },
    { key: 'price_per_person', label: 'Price/Person', render: v => fmt(v) },
    { key: 'min_persons', label: 'Min Persons' },
    { key: 'active', label: 'Status', render: v => <span className={`badge badge-${v ? 'confirmed' : 'cancelled'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ];
  return (
    <>
      <CrudTable title="Packages & Menu" columns={columns} rows={items} loading={loading} onCreate={() => setModal(true)} onDelete={handleDelete} />
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>New Package</h2><button className="close-btn" onClick={() => setModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Package Name *</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}><option value="corporate">Corporate</option><option value="wedding">Wedding</option><option value="events">Events</option></select></div>
                <div className="form-group"><label className="form-label">Price Per Person (₹)</label><input className="form-input" type="number" value={form.price_per_person} onChange={e => set('price_per_person', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Minimum Persons</label><input className="form-input" type="number" value={form.min_persons} onChange={e => set('min_persons', e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" style={{ minHeight: 70 }} value={form.description} onChange={e => set('description', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Inclusions (one per line)</label><textarea className="form-textarea" value={form.inclusions} onChange={e => set('inclusions', e.target.value)} placeholder="Breakfast&#10;Lunch&#10;Evening Snacks" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add Package'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---- STAFF PAGE ----
export function StaffPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', phone: '', email: '', specialization: '', experience_years: '' });
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get('/staff/').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try { await api.post('/staff/', form); setModal(false); const r = await api.get('/staff/'); setItems(r.data); } catch { } setSaving(false);
  };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/staff/${id}`); const r = await api.get('/staff/'); setItems(r.data); };
  const columns = [
    { key: 'name', label: 'Name', render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'role', label: 'Role' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'experience_years', label: 'Experience', render: v => v ? `${v} yrs` : '—' },
    { key: 'active', label: 'Status', render: v => <span className={`badge badge-${v ? 'active' : 'cancelled'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ];
  return (
    <>
      <CrudTable title="Staff & Team" columns={columns} rows={items} loading={loading} onCreate={() => setModal(true)} onDelete={handleDelete} />
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Add Staff Member</h2><button className="close-btn" onClick={() => setModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Role *</label><input className="form-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Chef, Coordinator, etc." /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Specialization</label><input className="form-input" value={form.specialization} onChange={e => set('specialization', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Experience (years)</label><input className="form-input" type="number" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add Staff'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---- QUOTATIONS PAGE ----
export function QuotationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customer_name: '', company_name: '', email: '', event_type: '', event_date: '', items: [{ description: '', qty: 1, rate: 0, total: 0 }], discount: 0, tax_rate: 5, notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/quotations/').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setItem = (i, k, v) => {
    const newItems = [...form.items]; newItems[i][k] = v;
    if (k === 'qty' || k === 'rate') newItems[i].total = (parseFloat(newItems[i].qty) || 0) * (parseFloat(newItems[i].rate) || 0);
    setForm(f => ({ ...f, items: newItems }));
  };
  const handleSave = async () => {
    setSaving(true);
    try { await api.post('/quotations/', form); setModal(false); const r = await api.get('/quotations/'); setItems(r.data); } catch { } setSaving(false);
  };
  const handleConvert = async (id) => {
    if (!confirm('Convert this quotation to an invoice?')) return;
    await api.post(`/quotations/${id}/convert`); const r = await api.get('/quotations/'); setItems(r.data);
    alert('Invoice created! Check the Invoices section.');
  };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/quotations/${id}`); const r = await api.get('/quotations/'); setItems(r.data); };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quotations</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><Plus size={16} /> New Quotation</button>
      </div>
      <div className="card">
        {loading ? <div className="loading">Loading...</div> : items.length === 0 ? (
          <div className="empty"><div className="empty-icon">📄</div>No quotations yet</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Client</th><th>Event</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(q => (
                  <tr key={q.id}>
                    <td><div style={{ fontWeight: 600 }}>{q.customer_name}</div>{q.company_name && <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{q.company_name}</div>}</td>
                    <td><span className={`badge badge-${q.event_type}`}>{q.event_type}</span></td>
                    <td style={{ fontSize: 13 }}>{fmtDate(q.event_date)}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(q.total)}</td>
                    <td><span className={`badge badge-${q.status}`}>{cap(q.status)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {q.status !== 'converted' && <button className="btn btn-ghost btn-sm" onClick={() => handleConvert(q.id)} title="Convert to Invoice">→ Invoice</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>New Quotation</h2><button className="close-btn" onClick={() => setModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Client Name *</label><input className="form-input" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={form.company_name} onChange={e => set('company_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Event Type</label><input className="form-input" value={form.event_type} onChange={e => set('event_type', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Event Date</label><input className="form-input" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} /></div>
              </div>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Items</p>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px', gap: 8, marginBottom: 8 }}>
                  <input className="form-input" placeholder="Description" value={item.description} onChange={e => setItem(i, 'description', e.target.value)} style={{ padding: '8px 12px' }} />
                  <input className="form-input" type="number" placeholder="Qty" value={item.qty} onChange={e => setItem(i, 'qty', e.target.value)} style={{ padding: '8px 12px' }} />
                  <input className="form-input" type="number" placeholder="Rate" value={item.rate} onChange={e => setItem(i, 'rate', e.target.value)} style={{ padding: '8px 12px' }} />
                  <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))} className="close-btn"><X size={14} /></button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => setForm(f => ({ ...f, items: [...f.items, { description: '', qty: 1, rate: 0, total: 0 }] }))} style={{ marginBottom: 16 }}><Plus size={14} /> Add Item</button>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Discount (₹)</label><input className="form-input" type="number" value={form.discount} onChange={e => set('discount', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Tax Rate (%)</label><input className="form-input" type="number" value={form.tax_rate} onChange={e => set('tax_rate', e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Quotation'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- REPORTS PAGE ----
export function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/reports/summary').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="loading">Loading reports...</div>;
  if (!data) return <div className="empty">Failed to load reports</div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Reports & Analytics</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 18, marginBottom: 24 }}>
        {[
          ['Revenue Collected', fmt(data.revenue.total_collected)],
          ['Pending Revenue', fmt(data.revenue.pending)],
          ['Grand Total Billed', fmt(data.revenue.grand_total)],
          ['Total Customers', data.total_customers],
          ['Corporate Leads', data.total_corporate_leads],
          ['Staff Members', data.total_staff],
        ].map(([label, value]) => (
          <div key={label} className="stat-card">
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>Invoice Summary</h3>
          {[['Paid', data.invoices.paid, 'var(--success)'], ['Partial', data.invoices.partial, 'var(--warning)'], ['Unpaid', data.invoices.unpaid, 'var(--error)']].map(([l, v, c]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--cream-dark)' }}>
              <span style={{ fontSize: 14 }}>{l} Invoices</span>
              <span style={{ fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>Bookings by Type</h3>
          {Object.entries(data.bookings_by_type).map(([type, count]) => (
            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--cream-dark)' }}>
              <span className={`badge badge-${type}`}>{cap(type)}</span>
              <span style={{ fontWeight: 700 }}>{count} bookings</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>Top Packages</h3>
          {(data.top_packages || []).map(p => (
            <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--cream-dark)' }}>
              <span style={{ fontSize: 14 }}>{p.name}</span>
              <span style={{ fontWeight: 700, color: 'var(--maroon)' }}>{p.count} bookings</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>Inquiry Pipeline</h3>
          {Object.entries(data.inquiry_by_status).map(([status, count]) => (
            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--cream-dark)' }}>
              <span className={`badge badge-${status}`}>{cap(status)}</span>
              <span style={{ fontWeight: 700 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- SETTINGS PAGE ----
export function SettingsPage() {
  return (
    <div>
      <div className="page-header"><h1 className="page-title">Settings</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 20 }}>Company Information</h3>
          {[['Company Name', 'Shree Swami Samarth Food and Hospitality Services'], ['GSTIN', '27XXXXX1234X1Z5'], ['Phone', '+91 98765 43210'], ['Email', 'info@shreeswamisamarthfoods.com'], ['Address', 'Vikhroli, Mumbai – 400083, Maharashtra']].map(([k, v]) => (
            <div key={k} className="form-group"><label className="form-label">{k}</label><input className="form-input" defaultValue={v} /></div>
          ))}
          <button className="btn btn-primary btn-sm">Save Changes</button>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 20 }}>Invoice Settings</h3>
          {[['Invoice Prefix', 'SSS-INV-'], ['Tax Rate (%)', '5'], ['Due Days', '15']].map(([k, v]) => (
            <div key={k} className="form-group"><label className="form-label">{k}</label><input className="form-input" defaultValue={v} /></div>
          ))}
          <div style={{ padding: '14px', background: '#E8EAF6', borderRadius: 8, marginTop: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#283593', marginBottom: 6 }}>🔑 Demo Admin Credentials</p>
            <p style={{ fontSize: 13, color: '#3949AB' }}>Email: admin@shreeswamisamarthfoods.demo</p>
            <p style={{ fontSize: 13, color: '#3949AB' }}>Password: Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
