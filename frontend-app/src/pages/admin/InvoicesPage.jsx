import { useState, useEffect } from 'react';
import { Plus, X, Printer, Eye, Trash2 } from 'lucide-react';
import api, { fmt, fmtDate, cap } from '../../utils/api';

function InvoicePrintView({ invoice, onClose }) {
  const handlePrint = () => window.print();

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 780, maxHeight: '95vh' }}>
        <div className="modal-header" style={{ justifyContent: 'space-between' }}>
          <h2>Invoice Preview</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}><Printer size={14} /> Print / Download</button>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
        </div>
        <div className="modal-body" id="printable-invoice" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingBottom: 20, borderBottom: '2px solid var(--gold)' }}>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--maroon)', marginBottom: 4 }}>Shree Swami Samarth</h1>
              <p style={{ fontSize: 11, color: 'var(--gold-dark)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>Food & Hospitality Services</p>
              <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.6 }}>
                Vikhroli, Mumbai – 400083, Maharashtra<br />
                Phone: +91 98765 43210<br />
                Email: info@shreeswamisamarthfoods.com<br />
                GSTIN: 27XXXXX1234X1Z5
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ background: 'var(--cream-dark)', borderRadius: 10, padding: '12px 20px', marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: 'var(--text-light)', textTransform: 'uppercase' }}>Invoice No.</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--maroon)' }}>{invoice.invoice_number}</p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-light)' }}>Date: {fmtDate(invoice.invoice_date)}</p>
              {invoice.due_date && <p style={{ fontSize: 13, color: 'var(--text-light)' }}>Due: {fmtDate(invoice.due_date)}</p>}
              <span className={`badge badge-${invoice.payment_status}`} style={{ marginTop: 8, display: 'inline-flex' }}>
                {cap(invoice.payment_status)}
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-light)', marginBottom: 8 }}>Bill To</p>
            <p style={{ fontWeight: 700, fontSize: 16 }}>{invoice.customer_name}</p>
            {invoice.company_name && <p style={{ fontSize: 14, color: 'var(--text-light)' }}>{invoice.company_name}</p>}
            <p style={{ fontSize: 14, color: 'var(--text-light)' }}>{invoice.email}</p>
            {invoice.phone && <p style={{ fontSize: 14, color: 'var(--text-light)' }}>{invoice.phone}</p>}
          </div>

          {/* Event Info */}
          <div style={{ background: 'var(--cream)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div><p style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase' }}>Event</p><p style={{ fontSize: 14 }}>{invoice.event_type}</p></div>
            <div><p style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase' }}>Event Date</p><p style={{ fontSize: 14 }}>{fmtDate(invoice.event_date)}</p></div>
            <div><p style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase' }}>Venue</p><p style={{ fontSize: 14 }}>{invoice.venue || '—'}</p></div>
          </div>

          {/* Line Items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: 'var(--dark)' }}>
                <th style={{ color: 'var(--gold)', padding: '10px 12px', fontSize: 12, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Description</th>
                <th style={{ color: 'var(--gold)', padding: '10px 12px', fontSize: 12, textAlign: 'center' }}>Qty</th>
                <th style={{ color: 'var(--gold)', padding: '10px 12px', fontSize: 12, textAlign: 'right' }}>Rate</th>
                <th style={{ color: 'var(--gold)', padding: '10px 12px', fontSize: 12, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontSize: 14 }}>{item.description}</td>
                  <td style={{ padding: '12px', fontSize: 14, textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '12px', fontSize: 14, textAlign: 'right' }}>{fmt(item.rate)}</td>
                  <td style={{ padding: '12px', fontSize: 14, textAlign: 'right', fontWeight: 600 }}>{fmt(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 280 }}>
              {[
                ['Subtotal', fmt(invoice.subtotal)],
                ['Discount', invoice.discount > 0 ? `- ${fmt(invoice.discount)}` : '—'],
                [`Tax (${invoice.tax_rate || 5}%)`, fmt(invoice.tax_amount)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, borderBottom: '1px solid var(--cream-dark)' }}>
                  <span style={{ color: 'var(--text-light)' }}>{l}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 16, fontWeight: 700, borderBottom: '2px solid var(--gold)' }}>
                <span>Grand Total</span><span style={{ color: 'var(--maroon)' }}>{fmt(invoice.grand_total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                <span style={{ color: 'var(--text-light)' }}>Advance Paid</span><span style={{ color: 'var(--success)' }}>{fmt(invoice.advance_paid)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 15, fontWeight: 700 }}>
                <span>Balance Due</span><span style={{ color: invoice.balance_due > 0 ? 'var(--error)' : 'var(--success)' }}>{fmt(invoice.balance_due)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--cream)', borderRadius: 8, borderLeft: '3px solid var(--gold)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 4, textTransform: 'uppercase' }}>Terms & Notes</p>
              <p style={{ fontSize: 13 }}>{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-light)' }}>
            Thank you for choosing Shree Swami Samarth Food & Hospitality Services. We look forward to serving you again!
          </div>
        </div>
      </div>
      <style>{`@media print { .modal-overlay { position: static; background: none; } .modal { box-shadow: none; max-height: none; } .modal-header { display: none; } }`}</style>
    </div>
  );
}

export default function InvoicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [printInvoice, setPrintInvoice] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ customer_name: '', company_name: '', email: '', phone: '', event_type: '', event_date: '', venue: '', items: [{ description: '', qty: 1, rate: 0, total: 0 }], discount: 0, tax_rate: 5, advance_paid: 0, notes: '', invoice_date: new Date().toISOString().split('T')[0] });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/invoices/', { params: filter ? { status: filter } : {} })
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setItem = (i, k, v) => {
    const newItems = [...form.items];
    newItems[i][k] = v;
    if (k === 'qty' || k === 'rate') newItems[i].total = (parseFloat(newItems[i].qty) || 0) * (parseFloat(newItems[i].rate) || 0);
    setForm(f => ({ ...f, items: newItems }));
  };
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: '', qty: 1, rate: 0, total: 0 }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/invoices/', form);
      load(); setModal(false);
    } catch (e) { alert('Error: ' + e.message); } finally { setSaving(false); }
  };

  const handlePayment = async (inv) => {
    const amount = prompt(`Record payment for ${inv.invoice_number}\nBalance due: ${fmt(inv.balance_due)}\nEnter amount:`);
    if (!amount) return;
    const mode = prompt('Payment mode (Cash/NEFT/RTGS/Cheque/UPI):') || 'Cash';
    await api.post(`/invoices/${inv.id}/payment`, { amount: parseFloat(amount), mode });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete invoice?')) return;
    await api.delete(`/invoices/${id}`);
    load();
  };

  const subtotal = form.items.reduce((s, i) => s + (i.total || 0), 0);
  const tax = ((subtotal - (form.discount || 0)) * (form.tax_rate || 5)) / 100;
  const grand = subtotal - (form.discount || 0) + tax;

  return (
    <div>
      {printInvoice && <InvoicePrintView invoice={printInvoice} onClose={() => setPrintInvoice(null)} />}

      <div className="page-header">
        <h1 className="page-title">Invoices & Billing</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><Plus size={16} /> New Invoice</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['', 'All'], ['paid', 'Paid'], ['partial', 'Partial'], ['unpaid', 'Unpaid']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`btn btn-sm ${filter === v ? 'btn-primary' : 'btn-ghost'}`}>{l}</button>
        ))}
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : items.length === 0 ? (
          <div className="empty"><div className="empty-icon">🧾</div>No invoices found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Invoice No.</th><th>Client</th><th>Event</th><th>Date</th><th>Grand Total</th><th>Advance</th><th>Balance</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 700, color: 'var(--maroon)' }}>{inv.invoice_number}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.customer_name}</div>
                      {inv.company_name && <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{inv.company_name}</div>}
                    </td>
                    <td style={{ fontSize: 13 }}>{inv.event_type}</td>
                    <td style={{ fontSize: 13 }}>{fmtDate(inv.invoice_date)}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(inv.grand_total)}</td>
                    <td style={{ color: 'var(--success)' }}>{fmt(inv.advance_paid)}</td>
                    <td style={{ color: inv.balance_due > 0 ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>{fmt(inv.balance_due)}</td>
                    <td><span className={`badge badge-${inv.payment_status}`}>{cap(inv.payment_status)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setPrintInvoice(inv)} title="View/Print"><Eye size={13} /></button>
                        {inv.balance_due > 0 && <button className="btn btn-ghost btn-sm" onClick={() => handlePayment(inv)} title="Record Payment">₹+</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(inv.id)} title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 760 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Invoice</h2>
              <button className="close-btn" onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid" style={{ marginBottom: 16 }}>
                <div className="form-group"><label className="form-label">Client Name *</label><input className="form-input" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={form.company_name} onChange={e => set('company_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Event Type</label><input className="form-input" value={form.event_type} onChange={e => set('event_type', e.target.value)} placeholder="e.g. Wedding, Conference" /></div>
                <div className="form-group"><label className="form-label">Event Date</label><input className="form-input" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Venue</label><input className="form-input" value={form.venue} onChange={e => set('venue', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Invoice Date</label><input className="form-input" type="date" value={form.invoice_date} onChange={e => set('invoice_date', e.target.value)} /></div>
              </div>

              {/* Line Items */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Line Items</p>
                {form.items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 32px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input className="form-input" placeholder="Description" value={item.description} onChange={e => setItem(i, 'description', e.target.value)} style={{ padding: '8px 12px' }} />
                    <input className="form-input" type="number" placeholder="Qty" value={item.qty} onChange={e => setItem(i, 'qty', e.target.value)} style={{ padding: '8px 12px' }} />
                    <input className="form-input" type="number" placeholder="Rate" value={item.rate} onChange={e => setItem(i, 'rate', e.target.value)} style={{ padding: '8px 12px' }} />
                    <div style={{ padding: '8px 12px', background: 'var(--cream)', borderRadius: 8, fontSize: 14, fontWeight: 600, border: '1px solid var(--border)' }}>{fmt(item.total)}</div>
                    <button onClick={() => removeItem(i)} className="close-btn" style={{ width: 28, height: 28 }}><X size={14} /></button>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={addItem}><Plus size={14} /> Add Item</button>
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 280 }}>
                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 8 }}>
                    <div className="form-group"><label className="form-label">Discount (₹)</label><input className="form-input" type="number" value={form.discount} onChange={e => set('discount', parseFloat(e.target.value) || 0)} /></div>
                    <div className="form-group"><label className="form-label">Tax %</label><input className="form-input" type="number" value={form.tax_rate} onChange={e => set('tax_rate', parseFloat(e.target.value) || 0)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Advance Paid (₹)</label><input className="form-input" type="number" value={form.advance_paid} onChange={e => set('advance_paid', parseFloat(e.target.value) || 0)} /></div>
                  <div style={{ padding: '12px', background: 'var(--cream-dark)', borderRadius: 8, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>Tax</span><span>{fmt(tax)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, borderTop: '1px solid var(--border)', paddingTop: 6 }}><span>Grand Total</span><span style={{ color: 'var(--maroon)' }}>{fmt(grand)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><span>Balance Due</span><span style={{ fontWeight: 700, color: 'var(--error)' }}>{fmt(grand - (form.advance_paid || 0))}</span></div>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 12 }}><label className="form-label">Notes / Terms</label><textarea className="form-textarea" style={{ minHeight: 60 }} value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Creating...' : 'Create Invoice'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
