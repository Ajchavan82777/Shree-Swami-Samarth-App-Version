import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare, Building2, Calendar, IndianRupee, Clock,
  TrendingUp, FileText, Receipt, ChevronLeft, ChevronRight, X, Plus, Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api, { fmt, fmtDate, cap } from '../../utils/api';

/* ─────────────────────────────────────────────────────────────────────────────
   DrillDownModal – full-screen overlay with a data table for a given KPI
───────────────────────────────────────────────────────────────────────────── */
function DrillDownModal({ drilldown, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!drilldown) return;
    setLoading(true);
    setRows([]);
    api.get(drilldown.endpoint)
      .then(r => { setRows(r.data?.results ?? r.data ?? []); })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [drilldown]);

  if (!drilldown) return null;
  const { title, type } = drilldown;

  let displayed = rows;
  if (type === 'corporate') displayed = rows.filter(r => r.client_type === 'corporate' || r.is_corporate);
  if (type === 'upcoming')  displayed = rows.filter(r => r.event_date && new Date(r.event_date) >= new Date(new Date().toDateString()));
  if (type === 'unpaid')    displayed = rows.filter(r => r.payment_status === 'unpaid' || r.payment_status === 'partial');
  if (type === 'paid')      displayed = rows.filter(r => r.payment_status === 'paid');

  const renderHeaders = () => {
    switch (type) {
      case 'inquiries': case 'corporate':
        return <tr><th>Name</th><th>Event Type</th><th>Event Date</th><th>Status</th><th>Phone</th></tr>;
      case 'bookings': case 'upcoming':
        return <tr><th>Customer</th><th>Event Type</th><th>Date</th><th>Venue</th><th>Amount</th><th>Status</th></tr>;
      case 'invoices': case 'unpaid': case 'paid':
        return <tr><th>Invoice #</th><th>Client</th><th>Grand Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr>;
      case 'quotations':
        return <tr><th>Quote #</th><th>Client</th><th>Event Type</th><th>Date</th><th>Total</th><th>Status</th></tr>;
      default:
        return <tr><th>#</th><th>Details</th></tr>;
    }
  };

  const renderRow = (row, idx) => {
    switch (type) {
      case 'inquiries': case 'corporate':
        return (
          <tr key={row.id ?? idx}>
            <td style={{ fontWeight: 600 }}>{row.name || row.customer_name || '—'}</td>
            <td><span className={`badge badge-${row.event_type}`}>{cap(row.event_type || '')}</span></td>
            <td>{fmtDate(row.event_date)}</td>
            <td><span className={`badge badge-${row.status}`}>{cap(row.status || '')}</span></td>
            <td>{row.phone || row.contact_phone || '—'}</td>
          </tr>
        );
      case 'bookings': case 'upcoming':
        return (
          <tr key={row.id ?? idx}>
            <td style={{ fontWeight: 600 }}>{row.customer_name || '—'}</td>
            <td><span className={`badge badge-${row.event_type}`}>{cap(row.event_type || '')}</span></td>
            <td>{fmtDate(row.event_date)}</td>
            <td>{row.venue || '—'}</td>
            <td>{fmt(row.total_amount ?? row.grand_total ?? 0)}</td>
            <td><span className={`badge badge-${row.status}`}>{cap(row.status || '')}</span></td>
          </tr>
        );
      case 'invoices': case 'unpaid': case 'paid':
        return (
          <tr key={row.id ?? idx}>
            <td style={{ fontWeight: 600 }}>{row.invoice_number || '—'}</td>
            <td>{row.customer_name || row.client_name || '—'}</td>
            <td>{fmt(row.grand_total ?? 0)}</td>
            <td>{fmt(row.paid_amount ?? 0)}</td>
            <td style={{ color: (row.balance_due ?? 0) > 0 ? 'var(--error)' : 'var(--success)' }}>{fmt(row.balance_due ?? 0)}</td>
            <td><span className={`badge badge-${row.payment_status}`}>{cap(row.payment_status || '')}</span></td>
          </tr>
        );
      case 'quotations':
        return (
          <tr key={row.id ?? idx}>
            <td style={{ fontWeight: 600 }}>{row.quotation_number || row.quote_number || '—'}</td>
            <td>{row.customer_name || row.client_name || '—'}</td>
            <td><span className={`badge badge-${row.event_type}`}>{cap(row.event_type || '')}</span></td>
            <td>{fmtDate(row.event_date || row.created_at)}</td>
            <td>{fmt(row.total_amount ?? row.total ?? 0)}</td>
            <td><span className={`badge badge-${row.status}`}>{cap(row.status || '')}</span></td>
          </tr>
        );
      default:
        return <tr key={idx}><td>{idx + 1}</td><td>{JSON.stringify(row)}</td></tr>;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 900, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'var(--maroon)', color: '#fff' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
            {!loading && <p style={{ margin: 0, fontSize: 13, opacity: 0.8, marginTop: 2 }}>{displayed.length} record{displayed.length !== 1 ? 's' : ''} found</p>}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <X size={18} /> Close
          </button>
        </div>
        <div style={{ padding: 24, maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>Loading records…</div>
          ) : displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No records found.</div>
          ) : (
            <div className="table-wrap">
              <table><thead>{renderHeaders()}</thead><tbody>{displayed.map((row, idx) => renderRow(row, idx))}</tbody></table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QuickCreateForm – inline form inside the calendar date panel
───────────────────────────────────────────────────────────────────────────── */
function QuickCreateForm({ dateStr, onSaved, onClose }) {
  const [type, setType] = useState('booking');
  const [form, setForm] = useState({ customer_name: '', event_type: '', start_date: dateStr, end_date: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.customer_name.trim()) return alert('Customer name is required.');
    setSaving(true);
    try {
      const base = {
        customer_name: form.customer_name,
        event_type: form.event_type,
        event_date: form.start_date,
        event_end_date: form.end_date || null,
        notes: form.notes,
      };
      if (type === 'booking') {
        await api.post('/bookings/', { ...base, status: 'confirmed' });
      } else if (type === 'quotation') {
        await api.post('/quotations/', { ...base, items: [], discount: 0, tax_rate: 18, quote_date: form.start_date, valid_until: form.end_date || null });
      } else {
        await api.post('/invoices/', { ...base, items: [], discount: 0, tax_rate: 18, grand_total: 0, invoice_date: form.start_date });
      }
      onSaved();
    } catch (e) {
      alert('Error: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid var(--border)', marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <strong style={{ fontSize: 13, color: 'var(--maroon)' }}>Quick Create</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}><X size={14} /></button>
      </div>

      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {['booking', 'quotation', 'invoice'].map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            flex: 1, padding: '5px 4px', borderRadius: 6, border: '1px solid',
            borderColor: type === t ? 'var(--maroon)' : 'var(--border)',
            background: type === t ? 'var(--maroon)' : '#fff',
            color: type === t ? '#fff' : 'var(--text)',
            cursor: 'pointer', fontSize: 11, fontWeight: 600, textTransform: 'capitalize'
          }}>{t}</button>
        ))}
      </div>

      <div className="inv-grid-2" style={{ marginBottom: 8 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Customer Name *</label>
          <input className="form-input" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} style={{ fontSize: 13, padding: '7px 10px' }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Event Type</label>
          <input className="form-input" value={form.event_type} onChange={e => set('event_type', e.target.value)} placeholder="Wedding, Corporate…" style={{ fontSize: 13, padding: '7px 10px' }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Start Date</label>
          <input className="form-input" type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} style={{ fontSize: 13, padding: '7px 10px' }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>End Date (multi-day)</label>
          <input className="form-input" type="date" value={form.end_date} min={form.start_date} onChange={e => set('end_date', e.target.value)} style={{ fontSize: 13, padding: '7px 10px' }} />
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 3 }}>Notes</label>
        <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} style={{ fontSize: 13, minHeight: 48, padding: '7px 10px' }} placeholder="Optional notes…" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving} style={{ flex: 2, justifyContent: 'center' }}>
          {saving ? 'Saving…' : `Create ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CalendarView – interactive monthly calendar with full date actions
───────────────────────────────────────────────────────────────────────────── */
function CalendarView({ events, onRefresh }) {
  const today = new Date();
  const nav = useNavigate();
  const [year, setYear]             = useState(today.getFullYear());
  const [mon, setMon]               = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showCreate, setShowCreate]   = useState(false);

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const DOW_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const YEARS = Array.from({ length: 111 }, (_, i) => 1980 + i);

  const firstDay    = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  /* Build eventMap — support single-day and multi-day via event_end_date */
  const eventMap = {};
  (events || []).forEach(ev => {
    if (!ev.event_date) return;
    const start = new Date(ev.event_date + 'T00:00:00');
    const end   = ev.event_end_date ? new Date(ev.event_end_date + 'T00:00:00') : start;
    const cur   = new Date(start);
    while (cur <= end) {
      if (cur.getFullYear() === year && cur.getMonth() === mon) {
        const key = cur.getDate();
        if (!eventMap[key]) eventMap[key] = [];
        if (!eventMap[key].find(e => e.id === ev.id)) eventMap[key].push(ev);
      }
      cur.setDate(cur.getDate() + 1);
    }
  });

  const dotColor = type => {
    if (!type) return '#9e9e9e';
    const t = type.toLowerCase();
    if (t.includes('wedding'))  return '#e91e63';
    if (t.includes('corporate')) return '#1565c0';
    if (t.includes('birthday') || t.includes('anniversary')) return '#ff9800';
    if (t.includes('pooja') || t.includes('religious')) return '#7b1fa2';
    return '#2e7d32';
  };

  const goToPrev = () => {
    if (mon === 0) { setMon(11); setYear(y => y - 1); } else setMon(m => m - 1);
    setSelectedDay(null); setShowCreate(false);
  };
  const goToNext = () => {
    if (mon === 11) { setMon(0); setYear(y => y + 1); } else setMon(m => m + 1);
    setSelectedDay(null); setShowCreate(false);
  };

  const isToday    = d => d && today.getFullYear() === year && today.getMonth() === mon && today.getDate() === d;
  const isSelected = d => selectedDay?.day === d;

  const handleDayClick = d => {
    if (!d) return;
    if (isSelected(d)) { setSelectedDay(null); setShowCreate(false); return; }
    setSelectedDay({ day: d, events: eventMap[d] || [] });
    setShowCreate(false);
  };

  const handleDelete = async ev => {
    if (!window.confirm(`Delete booking for "${ev.customer_name}"?`)) return;
    try {
      await api.delete(`/bookings/${ev.id}`);
      setSelectedDay(null);
      onRefresh();
    } catch (e) { alert('Delete failed: ' + (e.response?.data?.message || e.message)); }
  };

  const dateStr = selectedDay
    ? `${year}-${String(mon + 1).padStart(2, '0')}-${String(selectedDay.day).padStart(2, '0')}`
    : '';

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      {/* ── Header: nav + month/year dropdowns ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <button onClick={goToPrev} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <select value={mon} onChange={e => { setMon(Number(e.target.value)); setSelectedDay(null); setShowCreate(false); }}
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: 'var(--dark)', background: '#fff' }}>
            {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e => { setYear(Number(e.target.value)); setSelectedDay(null); setShowCreate(false); }}
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: 'var(--dark)', background: '#fff' }}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => { setYear(today.getFullYear()); setMon(today.getMonth()); setSelectedDay(null); }}
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, cursor: 'pointer', background: '#fff', color: 'var(--text-light)' }}>
            Today
          </button>
        </div>
        <button onClick={goToNext} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Day name headers ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-light)', padding: '3px 0' }}>{d}</div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, idx) => {
          const dayEvts = day ? (eventMap[day] || []) : [];
          const dots    = dayEvts.slice(0, 3);
          const extra   = dayEvts.length - 3;
          const sel     = isSelected(day);
          const tod     = isToday(day);
          return (
            <div key={idx} onClick={() => handleDayClick(day)}
              style={{
                minHeight: 52, borderRadius: 6, padding: '5px 4px',
                border: tod ? '2px solid var(--gold)' : sel ? '2px solid var(--maroon)' : '1px solid var(--border)',
                background: !day ? 'var(--cream)' : sel ? 'rgba(114,28,36,0.07)' : '#fff',
                cursor: day ? 'pointer' : 'default',
                transition: 'background .12s',
              }}
              onMouseEnter={e => { if (day && !sel) e.currentTarget.style.background = '#f5f0e8'; }}
              onMouseLeave={e => { if (day && !sel) e.currentTarget.style.background = '#fff'; }}
            >
              {day && (
                <>
                  <div style={{ fontSize: 12, fontWeight: (tod || sel) ? 700 : 400, color: tod ? 'var(--gold)' : sel ? 'var(--maroon)' : 'var(--dark)', textAlign: 'right', marginBottom: 3 }}>{day}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {dots.map((ev, i) => (
                      <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor(ev.event_type), display: 'inline-block' }} title={ev.customer_name} />
                    ))}
                    {extra > 0 && <span style={{ fontSize: 8, color: 'var(--text-light)', lineHeight: '7px' }}>+{extra}</span>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap', fontSize: 11, color: 'var(--text-light)', alignItems: 'center' }}>
        {[['Wedding','#e91e63'],['Corporate','#1565c0'],['Birthday/Anniv','#ff9800'],['Religious','#7b1fa2'],['Other','#2e7d32']].map(([l,c]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
          </span>
        ))}
        <span style={{ fontStyle: 'italic', marginLeft: 'auto' }}>Click any date to view or add events</span>
      </div>

      {/* ── Selected Date Panel ── */}
      {selectedDay && (
        <div style={{ marginTop: 14, background: 'var(--cream)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
          {/* Panel header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <strong style={{ fontSize: 14, color: 'var(--maroon)' }}>
              {DOW_NAMES[new Date(year, mon, selectedDay.day).getDay()]}, {MONTH_NAMES[mon]} {selectedDay.day}, {year}
            </strong>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setShowCreate(c => !c)}
                style={{ padding: '5px 12px', borderRadius: 6, background: showCreate ? 'rgba(114,28,36,0.1)' : 'var(--gold)', color: showCreate ? 'var(--maroon)' : 'var(--dark)', border: showCreate ? '1px solid var(--maroon)' : 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={13} /> {showCreate ? 'Cancel' : 'Add Event'}
              </button>
              <button onClick={() => { setSelectedDay(null); setShowCreate(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: 4 }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Events list */}
          {selectedDay.events.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-light)', margin: '0 0 10px' }}>No events on this date yet. Click "Add Event" to create one.</p>
          ) : selectedDay.events.map((ev, i) => (
            <div key={ev.id ?? i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, background: '#fff', marginBottom: 6, border: '1px solid var(--border)', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.customer_name || '—'}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-light)' }}>
                  {cap(ev.event_type || '')}
                  {ev.venue ? ` · ${ev.venue}` : ''}
                  {ev.total_amount > 0 ? ` · ${fmt(ev.total_amount)}` : ''}
                </p>
                {ev.event_end_date && ev.event_end_date !== ev.event_date && (
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--gold-dark)' }}>Multi-day: {fmtDate(ev.event_date)} – {fmtDate(ev.event_end_date)}</p>
                )}
                <span className={`badge badge-${ev.status}`} style={{ fontSize: 10, marginTop: 3, display: 'inline-block' }}>{cap(ev.status || '')}</span>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => nav('/admin/bookings')} style={{ padding: '4px 8px', borderRadius: 5, background: 'var(--cream)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 11 }}>View</button>
                <button onClick={() => nav('/admin/bookings')} style={{ padding: '4px 8px', borderRadius: 5, background: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2', cursor: 'pointer', fontSize: 11 }}>Edit</button>
                <button onClick={() => handleDelete(ev)} style={{ padding: '4px 8px', borderRadius: 5, background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', cursor: 'pointer', fontSize: 11 }}>Del</button>
              </div>
            </div>
          ))}

          {/* Quick create form */}
          {showCreate && (
            <QuickCreateForm
              dateStr={dateStr}
              onSaved={() => { setShowCreate(false); setSelectedDay(null); onRefresh(); }}
              onClose={() => setShowCreate(false)}
            />
          )}

          {/* Navigation shortcuts */}
          {!showCreate && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: selectedDay.events.length > 0 ? 10 : 0 }}>
              <button onClick={() => nav('/admin/bookings')} style={{ padding: '6px 12px', borderRadius: 6, background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', cursor: 'pointer', fontSize: 12 }}>+ New Booking</button>
              <button onClick={() => nav('/admin/quotations')} style={{ padding: '6px 12px', borderRadius: 6, background: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb', cursor: 'pointer', fontSize: 12 }}>+ New Quotation</button>
              <button onClick={() => nav('/admin/invoices')} style={{ padding: '6px 12px', borderRadius: 6, background: '#fce4ec', color: '#880e4f', border: '1px solid #f8bbd0', cursor: 'pointer', fontSize: 12 }}>+ New Invoice</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ProgressBar & StatusProgress
───────────────────────────────────────────────────────────────────────────── */
function ProgressBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
        <span style={{ color: 'var(--text)' }}>{label}</span>
        <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{value} <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>({pct}%)</span></span>
      </div>
      <div style={{ height: 8, background: 'var(--cream)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width .5s ease' }} />
      </div>
    </div>
  );
}

function StatusProgress({ pipeline }) {
  if (!pipeline) return null;
  const inqSt    = pipeline.inquiry_status || {};
  const invSt    = pipeline.invoice_status || {};
  const bkSt     = pipeline.booking_status || {};
  const inqTotal = pipeline.total_inquiries_all || 0;
  const invTotal = pipeline.total_invoices_all  || 0;
  const bkTotal  = pipeline.total_bookings_all  || 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16, marginBottom: 20 }}>
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={16} style={{ color: 'var(--maroon)' }} /> Inquiries Pipeline</h3>
        <ProgressBar label="New"       value={inqSt.new       || 0} total={inqTotal} color="#42a5f5" />
        <ProgressBar label="Quoted"    value={inqSt.quoted    || 0} total={inqTotal} color="#ab47bc" />
        <ProgressBar label="Booked"    value={inqSt.booked    || 0} total={inqTotal} color="#26a69a" />
        <ProgressBar label="Completed" value={inqSt.completed || 0} total={inqTotal} color="var(--success)" />
        <ProgressBar label="Cancelled" value={inqSt.cancelled || 0} total={inqTotal} color="var(--error)" />
      </div>
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Receipt size={16} style={{ color: 'var(--maroon)' }} /> Invoice Status</h3>
        <ProgressBar label="Paid"    value={invSt.paid    || 0} total={invTotal} color="var(--success)" />
        <ProgressBar label="Partial" value={invSt.partial || 0} total={invTotal} color="var(--warning)" />
        <ProgressBar label="Unpaid"  value={invSt.unpaid  || 0} total={invTotal} color="var(--error)" />
      </div>
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} style={{ color: 'var(--maroon)' }} /> Bookings Status</h3>
        <ProgressBar label="Confirmed" value={bkSt.confirmed || 0} total={bkTotal} color="#42a5f5" />
        <ProgressBar label="Ongoing"   value={bkSt.ongoing   || 0} total={bkTotal} color="var(--warning)" />
        <ProgressBar label="Completed" value={bkSt.completed || 0} total={bkTotal} color="var(--success)" />
        <ProgressBar label="Cancelled" value={bkSt.cancelled || 0} total={bkTotal} color="var(--error)" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   KpiCard
───────────────────────────────────────────────────────────────────────────── */
function KpiCard({ Icon, label, value, color, iconColor, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="stat-card" onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', boxShadow: hovered ? '0 6px 24px rgba(0,0,0,0.13)' : '0 1px 4px rgba(0,0,0,0.06)', transform: hovered ? 'translateY(-2px)' : 'none', transition: 'box-shadow .2s, transform .2s' }}>
      <div className="stat-icon" style={{ background: color }}><Icon size={20} style={{ color: iconColor }} /></div>
      <div className="stat-value" title={String(value)}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main DashboardPage
───────────────────────────────────────────────────────────────────────────── */
const PERIODS = [
  { label: 'All',        value: 'all'   },
  { label: 'Today',      value: 'today' },
  { label: 'This Week',  value: 'week'  },
  { label: 'This Month', value: 'month' },
  { label: 'This Year',  value: 'year'  },
];

export default function DashboardPage() {
  const [period,    setPeriod]    = useState('month');
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [drilldown, setDrilldown] = useState(null);
  const [pdfBusy,   setPdfBusy]   = useState(false);
  const dashboardRef = useRef(null);

  const fetchDashboard = useCallback((p) => {
    setLoading(true);
    api.get(`/dashboard/?period=${p}`)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDashboard(period); }, [period, fetchDashboard]);

  const handleDownloadPDF = async () => {
    const el = dashboardRef.current;
    if (!el) return;
    setPdfBusy(true);
    try {
      const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, logging: false, backgroundColor: '#FDF8F0' });
      const pdf    = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfW   = pdf.internal.pageSize.getWidth();
      const pdfH   = (canvas.height * pdfW) / canvas.width;
      const pageH  = pdf.internal.pageSize.getHeight();
      let   yPos   = 0;
      while (yPos < pdfH) {
        if (yPos > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, -yPos, pdfW, pdfH);
        yPos += pageH;
      }
      pdf.save(`dashboard-summary-${new Date().toISOString().split('T')[0]}.pdf`);
    } finally { setPdfBusy(false); }
  };

  if (loading) return <div className="loading">Loading dashboard…</div>;
  if (!data)   return <div className="empty">Failed to load dashboard data.</div>;

  const { summary, recent_inquiries, recent_invoices, upcoming_events, all_events, pipeline } = data;

  const KPI_CARDS = [
    { icon: MessageSquare, label: 'Total Inquiries',   value: summary.total_inquiries,         color: '#E3F2FD', iconColor: '#1565C0', dd: { title: 'Total Inquiries',   endpoint: '/inquiries/',  type: 'inquiries'  } },
    { icon: Building2,     label: 'Corporate Leads',   value: summary.corporate_leads,          color: '#E8EAF6', iconColor: '#283593', dd: { title: 'Corporate Leads',   endpoint: '/inquiries/',  type: 'corporate'  } },
    { icon: Calendar,      label: 'Total Bookings',    value: summary.total_bookings,           color: '#E8F5E9', iconColor: '#2E7D32', dd: { title: 'Total Bookings',    endpoint: '/bookings/',   type: 'bookings'   } },
    { icon: Clock,         label: 'Upcoming Events',   value: summary.upcoming_events,          color: '#FFF3E0', iconColor: '#E65100', dd: { title: 'Upcoming Events',   endpoint: '/bookings/',   type: 'upcoming'   } },
    { icon: IndianRupee,   label: 'Pending Amount',    value: fmt(summary.pending_amount),      color: '#FFEBEE', iconColor: '#C62828', dd: { title: 'Unpaid / Partial',  endpoint: '/invoices/',   type: 'unpaid'     } },
    { icon: TrendingUp,    label: 'Revenue Collected', value: fmt(summary.total_revenue),       color: '#F3E5F5', iconColor: '#6A1B9A', dd: { title: 'Revenue Collected', endpoint: '/invoices/',   type: 'paid'       } },
    { icon: FileText,      label: 'Quotations',        value: summary.total_quotations ?? '—',  color: '#E0F7FA', iconColor: '#00695C', dd: { title: 'All Quotations',    endpoint: '/quotations/', type: 'quotations' } },
    { icon: Receipt,       label: 'Paid Invoices',     value: summary.paid_invoices,            color: '#F9FBE7', iconColor: '#558B2F', dd: { title: 'Paid Invoices',     endpoint: '/invoices/',   type: 'paid'       } },
  ];

  return (
    <div ref={dashboardRef}>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleDownloadPDF} disabled={pdfBusy} className="btn btn-ghost btn-sm" title="Download summary as PDF">
            <Download size={14} /> {pdfBusy ? 'Generating…' : 'PDF'}
          </button>
          <Link to="/admin/inquiries" className="btn btn-primary btn-sm">+ New Inquiry</Link>
        </div>
      </div>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {PERIODS.map(p => (
          <button key={p.value} onClick={() => setPeriod(p.value)} style={{
            padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: period === p.value ? 'var(--maroon)' : 'var(--cream)',
            color: period === p.value ? '#fff' : 'var(--dark)',
            boxShadow: period === p.value ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            transition: 'all .2s'
          }}>{p.label}</button>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 14, marginBottom: 28 }}>
        {KPI_CARDS.map(({ icon: Icon, label, value, color, iconColor, dd }) => (
          <KpiCard key={label} Icon={Icon} label={label} value={value} color={color} iconColor={iconColor} onClick={() => setDrilldown(dd)} />
        ))}
      </div>

      {/* Calendar */}
      <CalendarView events={all_events || upcoming_events || []} onRefresh={() => fetchDashboard(period)} />

      {/* Status bars */}
      <StatusProgress pipeline={pipeline} />

      {/* Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={16} style={{ color: 'var(--maroon)' }} /> Recent Inquiries</h3>
            <Link to="/admin/inquiries" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>View all →</Link>
          </div>
          {!recent_inquiries?.length ? (
            <p className="empty" style={{ padding: 16 }}>No inquiries yet</p>
          ) : recent_inquiries.slice(0, 5).map(inq => (
            <div key={inq.id} style={{ padding: '11px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{inq.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '2px 0 0' }}>{cap(inq.event_type || '')} · {fmtDate(inq.event_date)}</p>
              </div>
              <span className={`badge badge-${inq.status}`}>{cap(inq.status || '')}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Receipt size={16} style={{ color: 'var(--maroon)' }} /> Recent Invoices</h3>
            <Link to="/admin/invoices" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>View all →</Link>
          </div>
          {!recent_invoices?.length ? (
            <p className="empty" style={{ padding: 16 }}>No invoices yet</p>
          ) : recent_invoices.slice(0, 5).map(inv => (
            <div key={inv.id} style={{ padding: '11px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{inv.invoice_number}</p>
                <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '2px 0 0' }}>{inv.customer_name} · {fmt(inv.grand_total)}</p>
              </div>
              <span className={`badge badge-${inv.payment_status}`}>{cap(inv.payment_status || '')}</span>
            </div>
          ))}
        </div>
      </div>

      <DrillDownModal drilldown={drilldown} onClose={() => setDrilldown(null)} />
    </div>
  );
}
