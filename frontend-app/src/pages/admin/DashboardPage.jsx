import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Building2, Calendar, IndianRupee, Clock, TrendingUp } from 'lucide-react';
import api, { fmt, fmtDate, cap } from '../../utils/api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!data) return <div className="empty">Failed to load dashboard data.</div>;

  const { summary, recent_inquiries, recent_invoices, upcoming_events } = data;

  const STATS = [
    { icon: MessageSquare, label: 'Total Inquiries', value: summary.total_inquiries, color: '#E3F2FD', iconColor: '#1565C0' },
    { icon: Building2, label: 'Corporate Leads', value: summary.corporate_leads, color: '#E8EAF6', iconColor: '#283593' },
    { icon: Calendar, label: 'Total Bookings', value: summary.total_bookings, color: '#E8F5E9', iconColor: '#2E7D32' },
    { icon: Clock, label: 'Upcoming Events', value: summary.upcoming_events, color: '#FFF3E0', iconColor: '#E65100' },
    { icon: IndianRupee, label: 'Pending Amount', value: fmt(summary.pending_amount), color: '#FFEBEE', iconColor: '#C62828' },
    { icon: TrendingUp, label: 'Revenue Collected', value: fmt(summary.total_revenue), color: '#F3E5F5', iconColor: '#6A1B9A' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <Link to="/admin/inquiries" className="btn btn-primary btn-sm">+ New Inquiry</Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 18, marginBottom: 28 }}>
        {STATS.map(({ icon: Icon, label, value, color, iconColor }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: color }}>
              <Icon size={22} style={{ color: iconColor }} />
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Recent Inquiries */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 17 }}>Recent Inquiries</h3>
            <Link to="/admin/inquiries" style={{ fontSize: 13, color: 'var(--gold-dark)' }}>View all →</Link>
          </div>
          {recent_inquiries.length === 0 ? <p className="empty" style={{ padding: 20 }}>No inquiries yet</p> : (
            <div>
              {recent_inquiries.map(inq => (
                <div key={inq.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{inq.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{inq.event_type} · {fmtDate(inq.event_date)}</p>
                  </div>
                  <span className={`badge badge-${inq.status}`}>{cap(inq.status)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 17 }}>Recent Invoices</h3>
            <Link to="/admin/invoices" style={{ fontSize: 13, color: 'var(--gold-dark)' }}>View all →</Link>
          </div>
          {recent_invoices.length === 0 ? <p className="empty" style={{ padding: 20 }}>No invoices yet</p> : (
            <div>
              {recent_invoices.map(inv => (
                <div key={inv.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{inv.invoice_number}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{inv.customer_name} · {fmt(inv.grand_total)}</p>
                  </div>
                  <span className={`badge badge-${inv.payment_status}`}>{cap(inv.payment_status)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcoming_events.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>Upcoming Events</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Client</th><th>Event Type</th><th>Package</th><th>Date</th><th>Guests</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming_events.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.customer_name}</td>
                    <td><span className={`badge badge-${b.event_type}`}>{cap(b.event_type)}</span></td>
                    <td style={{ fontSize: 13 }}>{b.package_name}</td>
                    <td>{fmtDate(b.event_date)}</td>
                    <td>{b.guest_count}</td>
                    <td><span className={`badge badge-${b.status}`}>{cap(b.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
