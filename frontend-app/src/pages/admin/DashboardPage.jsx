import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, Building2, Calendar, IndianRupee, Clock,
  TrendingUp, FileText, Receipt, Users, ChevronLeft, ChevronRight, X
} from 'lucide-react';
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

  /* filter rows by sub-type where needed */
  let displayed = rows;
  if (type === 'corporate') displayed = rows.filter(r => r.client_type === 'corporate' || r.is_corporate);
  if (type === 'upcoming') displayed = rows.filter(r => {
    if (!r.event_date) return false;
    return new Date(r.event_date) >= new Date(new Date().toDateString());
  });
  if (type === 'unpaid') displayed = rows.filter(r => r.payment_status === 'unpaid' || r.payment_status === 'partial');
  if (type === 'paid') displayed = rows.filter(r => r.payment_status === 'paid');

  const renderHeaders = () => {
    switch (type) {
      case 'inquiries':
      case 'corporate':
        return <tr><th>Name</th><th>Event Type</th><th>Event Date</th><th>Status</th><th>Phone</th></tr>;
      case 'bookings':
      case 'upcoming':
        return <tr><th>Customer</th><th>Event Type</th><th>Date</th><th>Venue</th><th>Amount</th><th>Status</th></tr>;
      case 'invoices':
      case 'unpaid':
      case 'paid':
        return <tr><th>Invoice #</th><th>Client</th><th>Grand Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr>;
      case 'quotations':
        return <tr><th>Quote #</th><th>Client</th><th>Event Type</th><th>Date</th><th>Total</th><th>Status</th></tr>;
      default:
        return <tr><th>#</th><th>Details</th></tr>;
    }
  };

  const renderRow = (row, idx) => {
    switch (type) {
      case 'inquiries':
      case 'corporate':
        return (
          <tr key={row.id ?? idx}>
            <td style={{ fontWeight: 600 }}>{row.name || row.customer_name || '—'}</td>
            <td><span className={`badge badge-${row.event_type}`}>{cap(row.event_type || '')}</span></td>
            <td>{fmtDate(row.event_date)}</td>
            <td><span className={`badge badge-${row.status}`}>{cap(row.status || '')}</span></td>
            <td>{row.phone || row.contact_phone || '—'}</td>
          </tr>
        );
      case 'bookings':
      case 'upcoming':
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
      case 'invoices':
      case 'unpaid':
      case 'paid':
        return (
          <tr key={row.id ?? idx}>
            <td style={{ fontWeight: 600 }}>{row.invoice_number || '—'}</td>
            <td>{row.customer_name || row.client_name || '—'}</td>
            <td>{fmt(row.grand_total ?? 0)}</td>
            <td>{fmt(row.paid_amount ?? 0)}</td>
            <td style={{ color: (row.balance_due ?? 0) > 0 ? 'var(--error)' : 'var(--success)' }}>
              {fmt(row.balance_due ?? 0)}
            </td>
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
            <td>{fmt(row.total_amount ?? row.grand_total ?? 0)}</td>
            <td><span className={`badge badge-${row.status}`}>{cap(row.status || '')}</span></td>
          </tr>
        );
      default:
        return <tr key={idx}><td>{idx + 1}</td><td>{JSON.stringify(row)}</td></tr>;
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 16px', overflowY: 'auto'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 900,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden'
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 24px', background: 'var(--maroon)', color: '#fff'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
            {!loading && (
              <p style={{ margin: 0, fontSize: 13, opacity: 0.8, marginTop: 2 }}>
                {displayed.length} record{displayed.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
              color: '#fff', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            <X size={18} /> Close
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: 24, maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>Loading records…</div>
          ) : displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No records found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>{renderHeaders()}</thead>
                <tbody>{displayed.map((row, idx) => renderRow(row, idx))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CalendarView – monthly event calendar with dot indicators
───────────────────────────────────────────────────────────────────────────── */
function CalendarView({ events }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [popup, setPopup] = useState(null); // { day, events }

  const year = viewDate.getFullYear();
  const mon = viewDate.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  /* map event_date → events for the current month/year */
  const eventMap = {};
  (events || []).forEach(ev => {
    if (!ev.event_date) return;
    const d = new Date(ev.event_date);
    if (d.getFullYear() === year && d.getMonth() === mon) {
      const key = d.getDate();
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(ev);
    }
  });

  const dotColor = type => {
    if (!type) return 'var(--text-light)';
    const t = type.toLowerCase();
    if (t.includes('wedding') || t.includes('social')) return '#e91e63';
    if (t.includes('corporate')) return '#1565c0';
    return '#2e7d32';
  };

  const prevMonth = () => setViewDate(new Date(year, mon - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, mon + 1, 1));

  const isToday = day => day && today.getFullYear() === year && today.getMonth() === mon && today.getDate() === day;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      {/* Calendar header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={18} />
        </button>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{MONTH_NAMES[mon]} {year}</h3>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day names row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-light)', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, idx) => {
          const dayEvents = day ? (eventMap[day] || []) : [];
          const showDots = dayEvents.slice(0, 3);
          const extra = dayEvents.length - 3;
          return (
            <div
              key={idx}
              onClick={() => day && dayEvents.length > 0 && setPopup(p => p?.day === day ? null : { day, events: dayEvents })}
              style={{
                minHeight: 60, border: isToday(day) ? '2px solid var(--gold)' : '1px solid var(--border)',
                borderRadius: 8, padding: '6px 4px', background: day ? '#fff' : 'var(--cream)',
                cursor: day && dayEvents.length > 0 ? 'pointer' : 'default',
                transition: 'box-shadow .15s',
                boxShadow: popup?.day === day ? '0 0 0 3px var(--gold)' : 'none',
                position: 'relative'
              }}
            >
              {day && (
                <>
                  <div style={{
                    fontSize: 13, fontWeight: isToday(day) ? 700 : 400,
                    color: isToday(day) ? 'var(--gold)' : 'var(--dark)',
                    textAlign: 'right', marginBottom: 4
                  }}>{day}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {showDots.map((ev, i) => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: dotColor(ev.event_type), flexShrink: 0
                      }} title={ev.customer_name} />
                    ))}
                    {extra > 0 && <span style={{ fontSize: 9, color: 'var(--text-light)', lineHeight: '8px' }}>+{extra}</span>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Day popup */}
      {popup && (
        <div style={{
          marginTop: 12, background: 'var(--cream)', borderRadius: 10, padding: 14,
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <strong style={{ fontSize: 14 }}>
              Events on {MONTH_NAMES[mon]} {popup.day}, {year}
            </strong>
            <button onClick={() => setPopup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
          {popup.events.map((ev, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < popup.events.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{ev.customer_name}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-light)' }}>{cap(ev.event_type || '')}</p>
              </div>
              <span className={`badge badge-${ev.status}`}>{cap(ev.status || '')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ProgressBar – simple labeled horizontal progress bar
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

/* ─────────────────────────────────────────────────────────────────────────────
   StatusProgress – 3-panel pipeline / status view
───────────────────────────────────────────────────────────────────────────── */
function StatusProgress({ inquiries, invoices, bookings }) {
  const countBy = (arr, field, val) => (arr || []).filter(r => r[field] === val).length;
  const total = arr => (arr || []).length;

  const inqTotal = total(inquiries);
  const invTotal = total(invoices);
  const bkTotal = total(bookings);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16, marginBottom: 20 }}>
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <MessageSquare size={16} style={{ color: 'var(--maroon)' }} /> Inquiries Pipeline
        </h3>
        <ProgressBar label="New" value={countBy(inquiries,'status','new')} total={inqTotal} color="#42a5f5" />
        <ProgressBar label="Quoted" value={countBy(inquiries,'status','quoted')} total={inqTotal} color="#ab47bc" />
        <ProgressBar label="Booked" value={countBy(inquiries,'status','booked')} total={inqTotal} color="#26a69a" />
        <ProgressBar label="Completed" value={countBy(inquiries,'status','completed')} total={inqTotal} color="var(--success)" />
        <ProgressBar label="Cancelled" value={countBy(inquiries,'status','cancelled')} total={inqTotal} color="var(--error)" />
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Receipt size={16} style={{ color: 'var(--maroon)' }} /> Invoice Status
        </h3>
        <ProgressBar label="Paid" value={countBy(invoices,'payment_status','paid')} total={invTotal} color="var(--success)" />
        <ProgressBar label="Partial" value={countBy(invoices,'payment_status','partial')} total={invTotal} color="var(--warning)" />
        <ProgressBar label="Unpaid" value={countBy(invoices,'payment_status','unpaid')} total={invTotal} color="var(--error)" />
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={16} style={{ color: 'var(--maroon)' }} /> Bookings Status
        </h3>
        <ProgressBar label="Confirmed" value={countBy(bookings,'status','confirmed')} total={bkTotal} color="#42a5f5" />
        <ProgressBar label="Ongoing" value={countBy(bookings,'status','ongoing')} total={bkTotal} color="var(--warning)" />
        <ProgressBar label="Completed" value={countBy(bookings,'status','completed')} total={bkTotal} color="var(--success)" />
        <ProgressBar label="Cancelled" value={countBy(bookings,'status','cancelled')} total={bkTotal} color="var(--error)" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main DashboardPage
───────────────────────────────────────────────────────────────────────────── */
const PERIODS = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drilldown, setDrilldown] = useState(null);

  /* pipeline data for status progress bars */
  const [pipelineData, setPipelineData] = useState({ inquiries: [], invoices: [], bookings: [] });

  const fetchDashboard = useCallback((p) => {
    setLoading(true);
    api.get(`/dashboard/?period=${p}`)
      .then(r => { setData(r.data); })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDashboard(period); }, [period, fetchDashboard]);

  /* fetch pipeline data once for status progress bars */
  useEffect(() => {
    Promise.all([
      api.get('/inquiries/').catch(() => ({ data: [] })),
      api.get('/invoices/').catch(() => ({ data: [] })),
      api.get('/bookings/').catch(() => ({ data: [] })),
    ]).then(([inqR, invR, bkR]) => {
      const unwrap = r => r.data?.results ?? r.data ?? [];
      setPipelineData({ inquiries: unwrap(inqR), invoices: unwrap(invR), bookings: unwrap(bkR) });
    });
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;
  if (!data) return <div className="empty">Failed to load dashboard data.</div>;

  const { summary, recent_inquiries, recent_invoices, upcoming_events, all_events } = data;

  /* KPI card definitions */
  const KPI_CARDS = [
    {
      icon: MessageSquare, label: 'Total Inquiries', value: summary.total_inquiries,
      color: '#E3F2FD', iconColor: '#1565C0',
      dd: { title: 'Total Inquiries', endpoint: '/inquiries/', type: 'inquiries' }
    },
    {
      icon: Building2, label: 'Corporate Leads', value: summary.corporate_leads,
      color: '#E8EAF6', iconColor: '#283593',
      dd: { title: 'Corporate Leads', endpoint: '/inquiries/', type: 'corporate' }
    },
    {
      icon: Calendar, label: 'Total Bookings', value: summary.total_bookings,
      color: '#E8F5E9', iconColor: '#2E7D32',
      dd: { title: 'Total Bookings', endpoint: '/bookings/', type: 'bookings' }
    },
    {
      icon: Clock, label: 'Upcoming Events', value: summary.upcoming_events,
      color: '#FFF3E0', iconColor: '#E65100',
      dd: { title: 'Upcoming Events', endpoint: '/bookings/', type: 'upcoming' }
    },
    {
      icon: IndianRupee, label: 'Pending Amount', value: fmt(summary.pending_amount),
      color: '#FFEBEE', iconColor: '#C62828',
      dd: { title: 'Pending Amount — Unpaid / Partial Invoices', endpoint: '/invoices/', type: 'unpaid' }
    },
    {
      icon: TrendingUp, label: 'Revenue Collected', value: fmt(summary.total_revenue),
      color: '#F3E5F5', iconColor: '#6A1B9A',
      dd: { title: 'Revenue Collected — Paid Invoices', endpoint: '/invoices/', type: 'paid' }
    },
    {
      icon: FileText, label: 'Quotations', value: summary.total_quotations ?? '—',
      color: '#E0F7FA', iconColor: '#00695C',
      dd: { title: 'All Quotations', endpoint: '/quotations/', type: 'quotations' }
    },
    {
      icon: Receipt, label: 'Paid Invoices', value: summary.paid_invoices,
      color: '#F9FBE7', iconColor: '#558B2F',
      dd: { title: 'Paid Invoices', endpoint: '/invoices/', type: 'paid' }
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <Link to="/admin/inquiries" className="btn btn-primary btn-sm">+ New Inquiry</Link>
      </div>

      {/* Period filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {PERIODS.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            style={{
              padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: period === p.value ? 'var(--maroon)' : 'var(--cream)',
              color: period === p.value ? '#fff' : 'var(--dark)',
              boxShadow: period === p.value ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all .2s'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        {KPI_CARDS.map(({ icon: Icon, label, value, color, iconColor, dd }) => (
          <KpiCard
            key={label}
            Icon={Icon}
            label={label}
            value={value}
            color={color}
            iconColor={iconColor}
            onClick={() => setDrilldown(dd)}
          />
        ))}
      </div>

      {/* Calendar View */}
      <CalendarView events={all_events || upcoming_events || []} />

      {/* Status Progress Bars */}
      <StatusProgress
        inquiries={pipelineData.inquiries}
        invoices={pipelineData.invoices}
        bookings={pipelineData.bookings}
      />

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16 }}>
        {/* Recent Inquiries */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageSquare size={16} style={{ color: 'var(--maroon)' }} /> Recent Inquiries
            </h3>
            <Link to="/admin/inquiries" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>View all →</Link>
          </div>
          {!recent_inquiries?.length ? (
            <p className="empty" style={{ padding: 16 }}>No inquiries yet</p>
          ) : (
            recent_inquiries.slice(0, 5).map(inq => (
              <div key={inq.id} style={{
                padding: '11px 0', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{inq.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '2px 0 0' }}>
                    {cap(inq.event_type || '')} · {fmtDate(inq.event_date)}
                  </p>
                </div>
                <span className={`badge badge-${inq.status}`}>{cap(inq.status || '')}</span>
              </div>
            ))
          )}
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Receipt size={16} style={{ color: 'var(--maroon)' }} /> Recent Invoices
            </h3>
            <Link to="/admin/invoices" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>View all →</Link>
          </div>
          {!recent_invoices?.length ? (
            <p className="empty" style={{ padding: 16 }}>No invoices yet</p>
          ) : (
            recent_invoices.slice(0, 5).map(inv => (
              <div key={inv.id} style={{
                padding: '11px 0', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{inv.invoice_number}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '2px 0 0' }}>
                    {inv.customer_name} · {fmt(inv.grand_total)}
                  </p>
                </div>
                <span className={`badge badge-${inv.payment_status}`}>{cap(inv.payment_status || '')}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Drill-down modal */}
      <DrillDownModal drilldown={drilldown} onClose={() => setDrilldown(null)} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   KpiCard – extracted to keep hover state local
───────────────────────────────────────────────────────────────────────────── */
function KpiCard({ Icon, label, value, color, iconColor, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="stat-card"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        boxShadow: hovered ? '0 6px 24px rgba(0,0,0,0.13)' : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow .2s, transform .2s'
      }}
    >
      <div className="stat-icon" style={{ background: color }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
