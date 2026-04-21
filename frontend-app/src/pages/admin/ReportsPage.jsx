import { useState, useEffect, useRef } from 'react';
import { Download, Printer, RefreshCw, Calendar } from 'lucide-react';
import api, { fmt } from '../../utils/api';
import { downloadPDF } from '../../components/admin/InvoiceTemplates';

// ─── Period options ───────────────────────────────────────────────────────────

const PERIODS = [
  { key: 'today',   label: 'Today' },
  { key: 'week',    label: 'This Week' },
  { key: 'month',   label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
  { key: 'year',    label: 'This Year' },
  { key: 'all',     label: 'All Time' },
];

// ─── Small helpers ────────────────────────────────────────────────────────────

function StatCard({ label, value, color = 'var(--maroon)', subValue, subLabel, borderColor }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 10,
      padding: '18px 20px',
      borderLeft: `4px solid ${borderColor || color}`,
      boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1.1 }}>{value ?? '—'}</div>
      {subValue != null && (
        <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 5 }}>
          {subLabel}: <span style={{ fontWeight: 600, color: 'var(--text)' }}>{subValue}</span>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontWeight: 700, fontSize: 14, color: 'var(--maroon)',
      marginBottom: 14, paddingBottom: 8,
      borderBottom: '2px solid var(--gold)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
    </div>
  );
}

function ProgressBar({ value, max, color = 'var(--maroon)', height = 8 }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: '#f3f4f6', borderRadius: height, height, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: height, transition: 'width 0.4s ease' }} />
    </div>
  );
}

function RowItem({ label, value, total, color, subLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--cream, #faf0d7)' }}>
      <div style={{ minWidth: 150, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
        {label}
        {subLabel && <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{subLabel}</div>}
      </div>
      <ProgressBar value={value} max={total} color={color || 'var(--maroon)'} />
      <div style={{ minWidth: 48, textAlign: 'right', fontWeight: 700, fontSize: 14, color: color || 'var(--maroon)' }}>
        {value}
      </div>
      {total > 0 && (
        <div style={{ minWidth: 42, textAlign: 'right', fontSize: 11, color: 'var(--text-light)' }}>
          {Math.round((value / total) * 100)}%
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [period,      setPeriod]      = useState('month');
  const [downloading, setDownloading] = useState(false);
  const [error,       setError]       = useState(null);

  const reportRef = useRef(null);

  const load = () => {
    setLoading(true);
    setError(null);
    api.get('/reports/summary')
      .then(r => { setData(r.data); setLoading(false); })
      .catch(e => {
        setError(e.response?.data?.error || 'Failed to load report data.');
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await downloadPDF(reportRef.current, `SSS-Report-${period}-${today}`);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const style = document.createElement('style');
    style.id = '__rpt_print_css';
    style.innerHTML = `
      @media print {
        body > * { display:none !important; }
        #__rpt_print_root { display:block !important; position:fixed; top:0; left:0; width:100%; z-index:99999; background:#fff; padding:20px; }
      }`;
    document.head.appendChild(style);
    const div = document.createElement('div');
    div.id = '__rpt_print_root';
    div.innerHTML = reportRef.current?.innerHTML || '';
    document.body.appendChild(div);
    window.print();
    setTimeout(() => {
      document.getElementById('__rpt_print_css')?.remove();
      document.getElementById('__rpt_print_root')?.remove();
    }, 1000);
  };

  const periodLabel = PERIODS.find(p => p.key === period)?.label || 'This Month';
  const generatedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  // ── Derived values ─────────────────────────────────────────────────────────
  const revenue = data?.revenue || {};
  const invoices = data?.invoices || {};
  const bookingsByType = data?.bookings_by_type || {};
  const topPackages = data?.top_packages || [];
  const inquiryByStatus = data?.inquiry_by_status || {};

  const totalBilled    = parseFloat(revenue.grand_total    || 0);
  const totalCollected = parseFloat(revenue.total_collected || 0);
  const totalPending   = parseFloat(revenue.pending         || 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const invoicePaid    = invoices.paid    || 0;
  const invoicePartial = invoices.partial || 0;
  const invoiceUnpaid  = invoices.unpaid  || 0;
  const invoiceTotal   = invoicePaid + invoicePartial + invoiceUnpaid;

  const bookingEntries = Object.entries(bookingsByType);
  const totalBookings  = bookingEntries.reduce((s, [, v]) => s + (v || 0), 0);

  const maxPkg = topPackages.length > 0 ? Math.max(...topPackages.map(p => p.count || 0)) : 1;

  const inquiryEntries  = Object.entries(inquiryByStatus);
  const totalInquiries  = inquiryEntries.reduce((s, [, v]) => s + (v || 0), 0);

  const BOOKING_COLORS = ['var(--maroon)', '#1d4ed8', '#16a34a', '#ca8a04', '#7c3aed', '#c2410c', '#0891b2'];
  const INQUIRY_COLORS = {
    new: '#1d4ed8', contacted: '#ca8a04', visited: '#7c3aed',
    quoted: '#0891b2', confirmed: '#16a34a', cancelled: '#dc2626', lost: '#6b7280',
  };

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: 10 }}>
        <h1 className="page-title">Reports &amp; Analytics</h1>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={load} title="Refresh data">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handlePrint} disabled={loading || !data}>
            <Printer size={14} /> Print
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF} disabled={loading || downloading || !data}>
            <Download size={14} /> {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ── Period selector ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <Calendar size={15} style={{ color: 'var(--text-light)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-light)', marginRight: 4 }}>Period:</span>
        {PERIODS.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`btn btn-sm ${period === p.key ? 'btn-primary' : 'btn-ghost'}`}>
            {p.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-light)' }}>
          Note: data reflects all records (API filtering coming soon)
        </span>
      </div>

      {/* ── Loading / Error ──────────────────────────────────────────────── */}
      {loading && <div className="loading">Loading report data…</div>}
      {!loading && error && (
        <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--error)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontWeight: 600 }}>{error}</div>
          <button className="btn btn-primary btn-sm" onClick={load} style={{ marginTop: 14 }}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* ── Report body (captured for PDF) ──────────────────────────────── */}
      {!loading && !error && data && (
        <div ref={reportRef}>
          {/* Report cover header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--maroon, #8B1A1A) 0%, #6b1414 100%)',
            borderRadius: 12, padding: '24px 28px', marginBottom: 24,
            color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Business Report</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Shree Swami Samarth Food &amp; Hospitality Services</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 16px', display: 'inline-block' }}>
                <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px' }}>Period</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{periodLabel}</div>
              </div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>Generated: {generatedDate}</div>
            </div>
          </div>

          {/* ── Section 1: Revenue Overview ───────────────────────────────── */}
          <div className="card" style={{ marginBottom: 20, padding: '20px 24px' }}>
            <SectionTitle>Revenue Overview</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 20 }}>
              <StatCard label="Total Billed"     value={fmt(totalBilled)}     color="var(--maroon)"  borderColor="var(--maroon)" />
              <StatCard label="Collected"        value={fmt(totalCollected)}  color="var(--success)" borderColor="var(--success)" />
              <StatCard label="Pending"          value={fmt(totalPending)}    color="var(--error)"   borderColor="var(--error)" />
              <StatCard
                label="Collection Rate"
                value={<span style={{ fontSize: 28 }}>{collectionRate}%</span>}
                color={collectionRate >= 80 ? 'var(--success)' : collectionRate >= 50 ? '#ca8a04' : 'var(--error)'}
                borderColor={collectionRate >= 80 ? 'var(--success)' : collectionRate >= 50 ? '#ca8a04' : 'var(--error)'}
              />
            </div>

            {/* Collection rate progress bar */}
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>Collection Progress</span>
                <span style={{ color: 'var(--text-light)', fontSize: 12 }}>{fmt(totalCollected)} of {fmt(totalBilled)}</span>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: 8, height: 14, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  width: `${collectionRate}%`, height: '100%', borderRadius: 8,
                  background: collectionRate >= 80 ? 'var(--success)' : collectionRate >= 50 ? '#ca8a04' : 'var(--error)',
                  transition: 'width 0.6s ease',
                }} />
                {collectionRate > 10 && (
                  <span style={{ position: 'absolute', right: `${100 - collectionRate + 2}%`, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                    {collectionRate}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Section 2: Invoice Summary ────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="card" style={{ padding: '20px 24px' }}>
              <SectionTitle>Invoice Summary</SectionTitle>
              {invoiceTotal === 0 ? (
                <div style={{ color: 'var(--text-light)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No invoice data</div>
              ) : (
                <>
                  {[
                    { label: 'Paid',    value: invoicePaid,    color: 'var(--success)' },
                    { label: 'Partial', value: invoicePartial, color: '#ca8a04' },
                    { label: 'Unpaid',  value: invoiceUnpaid,  color: 'var(--error)' },
                  ].map(row => (
                    <RowItem key={row.label} label={row.label} value={row.value} total={invoiceTotal} color={row.color} />
                  ))}
                  <div style={{ marginTop: 12, padding: '10px 0', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>Total Invoices</span>
                    <span style={{ fontWeight: 700, color: 'var(--maroon)', fontSize: 16 }}>{invoiceTotal}</span>
                  </div>
                </>
              )}
            </div>

            {/* ── Section 3: Business Overview ──────────────────────────────── */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <SectionTitle>Business Overview</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Customers',      value: data.total_customers       || 0, color: '#1d4ed8',       icon: '👥' },
                  { label: 'Staff Members',  value: data.total_staff           || 0, color: '#16a34a',       icon: '🧑‍🍳' },
                  { label: 'Corporate Leads',value: data.total_corporate_leads || 0, color: '#7c3aed',       icon: '🏢' },
                  { label: 'Total Bookings', value: data.total_bookings        || totalBookings || 0, color: 'var(--maroon)', icon: '📅' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: '#f9fafb', borderRadius: 8, padding: '14px 16px',
                    borderLeft: `3px solid ${item.color}`,
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 4 & 5: Bookings + Packages ───────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Bookings by Event Type */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <SectionTitle>Bookings by Event Type</SectionTitle>
              {bookingEntries.length === 0 ? (
                <div style={{ color: 'var(--text-light)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No booking data</div>
              ) : (
                bookingEntries
                  .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                  .map(([type, count], idx) => (
                    <RowItem
                      key={type}
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                      value={count || 0}
                      total={totalBookings}
                      color={BOOKING_COLORS[idx % BOOKING_COLORS.length]}
                    />
                  ))
              )}
              {totalBookings > 0 && (
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-light)', textAlign: 'right' }}>
                  Total: <strong style={{ color: 'var(--text)' }}>{totalBookings} bookings</strong>
                </div>
              )}
            </div>

            {/* Top Packages */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <SectionTitle>Top Packages</SectionTitle>
              {topPackages.length === 0 ? (
                <div style={{ color: 'var(--text-light)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No package data</div>
              ) : (
                topPackages
                  .slice(0, 8)
                  .map((pkg, idx) => (
                    <RowItem
                      key={pkg.name}
                      label={pkg.name}
                      subLabel={pkg.category ? pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1) : undefined}
                      value={pkg.count || 0}
                      total={maxPkg}
                      color={BOOKING_COLORS[idx % BOOKING_COLORS.length]}
                    />
                  ))
              )}
            </div>
          </div>

          {/* ── Section 6: Inquiry Pipeline ───────────────────────────────── */}
          <div className="card" style={{ marginBottom: 20, padding: '20px 24px' }}>
            <SectionTitle>Inquiry Pipeline</SectionTitle>
            {inquiryEntries.length === 0 ? (
              <div style={{ color: 'var(--text-light)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No inquiry data</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 4 }}>
                {inquiryEntries
                  .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                  .map(([status, count]) => (
                    <RowItem
                      key={status}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      value={count || 0}
                      total={totalInquiries}
                      color={INQUIRY_COLORS[status] || '#6b7280'}
                    />
                  ))}
              </div>
            )}
            {totalInquiries > 0 && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-light)', textAlign: 'right' }}>
                Total inquiries: <strong style={{ color: 'var(--text)' }}>{totalInquiries}</strong>
              </div>
            )}
          </div>

          {/* ── Report footer ─────────────────────────────────────────────── */}
          <div style={{
            borderTop: '2px solid var(--border)', paddingTop: 16, marginTop: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
            fontSize: 12, color: 'var(--text-light)',
          }}>
            <span>Shree Swami Samarth Food &amp; Hospitality Services · Vikhroli, Mumbai</span>
            <span>Generated on {generatedDate} · Period: {periodLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
