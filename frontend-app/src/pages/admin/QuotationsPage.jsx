import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, X, Printer, Eye, Trash2, Download, Edit2, FileText, Search, RefreshCw } from 'lucide-react';
import api, { fmt, fmtDate } from '../../utils/api';
import {
  InvoicePreview, FONTS, THEMES, TEMPLATES, GST_TYPES, gstLines,
  downloadPDF, downloadJPG, downloadWord,
} from '../../components/admin/InvoiceTemplates';
import { useContent } from '../../context/ContentContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSavedDefaults() {
  try { return JSON.parse(localStorage.getItem('sss_invoice_defaults') || '{}'); } catch { return {}; }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_EVENT_TYPES = [
  'Wedding', 'Reception', 'Corporate Lunch', 'Corporate Dinner', 'Daily Meal Plan',
  'Conference Buffet', 'Birthday Party', 'Anniversary', 'Cocktail Party',
  'Baby Shower', 'Engagement', 'Farewell', 'Award Ceremony', 'Product Launch',
  'Team Outing', 'Festival Event', 'Pooja / Religious Event', 'Other',
];
function loadEventTypes() {
  try {
    const s = JSON.parse(localStorage.getItem('sss_event_types') || 'null');
    return Array.isArray(s) && s.length ? s : DEFAULT_EVENT_TYPES;
  } catch { return DEFAULT_EVENT_TYPES; }
}

const DFLT_COMPANY = {
  name: 'Shree Swami Samarth',
  tagline: 'Food & Hospitality Services',
  address: 'Vikhroli, Mumbai – 400083, Maharashtra',
  phone: '+91 98765 43210',
  email: 'info@shreeswamisamarthfoods.com',
  gstin: '27XXXXX1234X1Z5',
};

const STATUS_COLORS = {
  draft:     { bg: '#f3f4f6', color: '#6b7280' },
  sent:      { bg: '#dbeafe', color: '#1d4ed8' },
  accepted:  { bg: '#dcfce7', color: '#16a34a' },
  converted: { bg: '#ede9fe', color: '#7c3aed' },
  rejected:  { bg: '#fee2e2', color: '#dc2626' },
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatusBadge({ s }) {
  const c = STATUS_COLORS[s] || STATUS_COLORS.draft;
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: '3px 10px', borderRadius: 12,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    }}>{s || 'draft'}</span>
  );
}

function FieldGroup({ label, children, style = {} }) {
  return (
    <div className="form-group" style={style}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function calcTotals(form) {
  const subtotal = form.items.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  const taxable  = Math.max(subtotal - (parseFloat(form.discount) || 0), 0);
  const tax      = form.gst_type === 'none' ? 0
    : Math.round(taxable * (parseFloat(form.tax_rate) || 0) / 100 * 100) / 100;
  const grand    = Math.round((taxable + tax) * 100) / 100;
  return { subtotal, taxable, tax, grand };
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({ quotation, onClose, company }) {
  const { get } = useContent();
  const settingsLogo = get('company', 'invoice_logo_url', '') || get('company', 'logo_url', '');

  const _d = getSavedDefaults();
  const [template,    setTemplate]    = useState(_d.template   || TEMPLATES[0]?.id || 't01');
  const [themeName,   setThemeName]   = useState(_d.theme      || 'Gold & Maroon');
  const [font,        setFont]        = useState(_d.font       || 'Inter');
  const [orientation, setOrientation] = useState(_d.orientation || 'portrait');
  const [gstType,     setGstType]     = useState(quotation.gst_type || 'sgst_cgst');
  const [logo,        setLogo]        = useState('');
  const [includeLogo, setIncludeLogo] = useState(!!settingsLogo);
  const [downloading, setDownloading] = useState(false);
  const [zoom,        setZoom]        = useState(1.0);

  const printRef = useRef(null);
  const activeLogo = includeLogo ? (logo || settingsLogo) : '';

  const quoteNumber = quotation.quotation_number
    || (quotation.id ? `SSS-QUO-${quotation.id}` : 'SSS-QUO-PREVIEW');

  // Normalise to what InvoicePreview expects
  const previewData = {
    ...quotation,
    invoice_number: quoteNumber,
    invoice_date:   quotation.quote_date || quotation.invoice_date,
    due_date:       quotation.valid_until,
  };

  const handlePrint = () => {
    const style = document.createElement('style');
    style.id = '__quo_print_css';
    style.innerHTML = `
      @media print {
        body > * { display:none !important; }
        #__quo_print_root { display:block !important; position:fixed; top:0; left:0; width:100%; z-index:99999; }
      }`;
    document.head.appendChild(style);
    const div = document.createElement('div');
    div.id = '__quo_print_root';
    div.innerHTML = printRef.current?.innerHTML || '';
    document.body.appendChild(div);
    window.print();
    setTimeout(() => {
      document.getElementById('__quo_print_css')?.remove();
      document.getElementById('__quo_print_root')?.remove();
    }, 1000);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try { await downloadPDF(printRef.current, quoteNumber, orientation); }
    finally { setDownloading(false); }
  };

  const handleDownloadJPG = async () => {
    setDownloading(true);
    try { await downloadJPG(printRef.current, quoteNumber); }
    finally { setDownloading(false); }
  };

  const handleDownloadWord = () => {
    downloadWord(printRef.current, quoteNumber, quoteNumber);
  };

  const firstTemplate = TEMPLATES[0]?.id || 'classic';
  const activeTemplate = TEMPLATES.find(t => t.id === template) ? template : firstTemplate;
  const iw = typeof window !== 'undefined' ? window.innerWidth : 1200;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding: iw < 640 ? 0 : '12px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth:960, height: iw < 640 ? '100vh' : '92vh', background:'#fff', borderRadius: iw < 640 ? 0 : 12, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>
      {/* Top toolbar */}
      <div style={{ background: 'var(--dark)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 700, marginRight: 8, fontSize: 14 }}>
          Quotation Preview — {quoteNumber}
        </span>

        {/* Template selector */}
        <select value={activeTemplate} onChange={e => setTemplate(e.target.value)}
          style={{ padding:'5px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, cursor:'pointer', maxWidth:180 }}>
          {TEMPLATES.map(tp => <option key={tp.id} value={tp.id} style={{ color:'#000' }}>{tp.icon} {tp.name}</option>)}
        </select>

        {/* Color theme */}
        <select value={themeName} onChange={e => setThemeName(e.target.value)}
          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
          {Object.keys(THEMES).map(k => <option key={k} value={k} style={{ color: '#000' }}>{k}</option>)}
        </select>

        {/* Font */}
        <select value={font} onChange={e => setFont(e.target.value)}
          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, cursor: 'pointer', maxWidth: 140 }}>
          {FONTS.map(f => <option key={f} value={f} style={{ color: '#000', fontFamily: f }}>{f}</option>)}
        </select>

        {/* GST type */}
        <select value={gstType} onChange={e => setGstType(e.target.value)}
          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
          {GST_TYPES.map(g => <option key={g.value} value={g.value} style={{ color: '#000' }}>{g.label}</option>)}
        </select>

        {/* Orientation */}
        <select value={orientation} onChange={e => setOrientation(e.target.value)}
          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
          <option value="portrait" style={{ color: '#000' }}>⬜ Portrait</option>
          <option value="landscape" style={{ color: '#000' }}>▭ Landscape</option>
        </select>

        {/* Logo toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 12, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={includeLogo} onChange={e => setIncludeLogo(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: 'var(--gold)', cursor: 'pointer' }} />
          Logo
        </label>
        {includeLogo && (
          <input value={logo} onChange={e => setLogo(e.target.value)}
            placeholder={settingsLogo ? 'Override logo URL…' : 'Logo URL…'}
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, width: 180 }} />
        )}

        {/* Zoom controls */}
        <div style={{ display:'flex', alignItems:'center', gap:2, background:'rgba(255,255,255,0.08)', borderRadius:6, padding:'2px 6px' }}>
          <button onClick={() => setZoom(z => Math.max(0.4, parseFloat((z-0.1).toFixed(1))))} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:16, lineHeight:1, padding:'2px 4px' }}>−</button>
          <span style={{ color:'#ddd', fontSize:11, minWidth:34, textAlign:'center' }}>{Math.round(zoom*100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3.0, parseFloat((z+0.1).toFixed(1))))} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:16, lineHeight:1, padding:'2px 4px' }}>+</button>
          <button onClick={() => setZoom(1)} title="Reset zoom" style={{ background:'none', border:'none', color:'#aaa', cursor:'pointer', fontSize:13, padding:'2px 4px' }}>↺</button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={handlePrint} disabled={downloading}
            style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--gold)', color: 'var(--dark)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Printer size={13} /> Print
          </button>
          <button onClick={handleDownloadPDF} disabled={downloading}
            style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Download size={13} /> PDF
          </button>
          <button onClick={handleDownloadJPG} disabled={downloading}
            style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Download size={13} /> JPG
          </button>
          <button onClick={handleDownloadWord}
            style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <FileText size={13} /> Word
          </button>
          <button onClick={onClose}
            style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div style={{ flex: 1, overflow: 'auto', background: '#e5e7eb', padding: iw < 640 ? 8 : 24 }}>
        <div style={{ zoom: zoom }}>
          <div ref={printRef} style={{ minWidth: iw < 640 ? 680 : undefined, maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
            <InvoicePreview
              invoice={previewData}
              template={activeTemplate}
              themeName={themeName}
              font={font}
              logo={activeLogo}
              gstType={gstType}
              company={company}
              orientation={orientation}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function PackagePicker({ onApply }) {
  const [packages, setPackages] = useState([]);
  const [open,     setOpen]     = useState(false);
  const [pkgId,    setPkgId]    = useState('');
  const [persons,  setPersons]  = useState(50);

  useEffect(() => {
    api.get('/packages/').then(r => setPackages(r.data.filter(p => p.active !== false))).catch(() => {});
  }, []);

  if (!packages.length) return null;

  const selected = packages.find(p => p.id === parseInt(pkgId));

  const handleApply = () => {
    if (!selected) return;
    const qty   = Math.max(1, persons);
    const rate  = parseFloat(selected.price_per_person || 0);
    const total = qty * rate;
    const incl  = Array.isArray(selected.inclusions) && selected.inclusions.length
      ? ` — Incl: ${selected.inclusions.slice(0, 3).join(', ')}${selected.inclusions.length > 3 ? '…' : ''}`
      : '';
    onApply([{ description: `${selected.name}${incl}`, qty, rate, total }]);
    setOpen(false);
    setPkgId('');
  };

  return (
    <div style={{ marginBottom: 12, background: 'rgba(201,168,76,0.07)', borderRadius: 8, border: '1px dashed rgba(201,168,76,0.4)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#7a6030' }}>
        <span>📦 Apply from Package (optional)</span>
        <span style={{ fontSize: 11, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>Select Package</label>
            <select className="form-select" value={pkgId} onChange={e => {
              setPkgId(e.target.value);
              const p = packages.find(p => p.id === parseInt(e.target.value));
              if (p?.min_persons) setPersons(p.min_persons);
            }}>
              <option value="">— Choose a package —</option>
              {packages.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price_per_person}/person (min {p.min_persons})</option>)}
            </select>
          </div>
          <div style={{ width: 120 }}>
            <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>No. of Persons</label>
            <input className="form-input" type="number" value={persons} min={selected?.min_persons || 1}
              onChange={e => setPersons(Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
          {selected && (
            <div style={{ fontSize: 12, color: 'var(--maroon)', alignSelf: 'center', fontWeight: 700 }}>
              ₹{(persons * parseFloat(selected.price_per_person || 0)).toLocaleString('en-IN')}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, alignSelf: 'flex-end' }}>
            <button className="btn btn-primary btn-sm" onClick={handleApply} disabled={!pkgId}>✓ Apply</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quotation Form (Create / Edit) ──────────────────────────────────────────

function emptyForm() {
  return {
    customer_name: '', company_name: '', email: '', phone: '',
    event_type: '', event_date: '', venue: '',
    quote_date: new Date().toISOString().split('T')[0],
    valid_until: '',
    items: [{ description: '', qty: 1, rate: 0, total: 0 }],
    discount: 0, tax_rate: 18, gst_type: 'sgst_cgst',
    notes: '',
  };
}

function QuotationForm({ onSave, onClose, company, editQuotation }) {
  const { get: cget } = useContent();
  const settingsLogo = cget('company', 'invoice_logo_url', '') || cget('company', 'logo_url', '');

  const isEdit = !!editQuotation;

  const [form, setForm] = useState(() => {
    if (editQuotation) {
      return {
        customer_name: editQuotation.customer_name || '',
        company_name:  editQuotation.company_name  || '',
        email:         editQuotation.email         || '',
        phone:         editQuotation.phone         || '',
        event_type:    editQuotation.event_type    || '',
        event_date:    editQuotation.event_date    || '',
        venue:         editQuotation.venue         || '',
        quote_date:    editQuotation.quote_date    || new Date().toISOString().split('T')[0],
        valid_until:   editQuotation.valid_until   || '',
        items:         editQuotation.items?.length ? editQuotation.items : [{ description: '', qty: 1, rate: 0, total: 0 }],
        discount:      editQuotation.discount      || 0,
        tax_rate:      editQuotation.tax_rate      || 18,
        gst_type:      editQuotation.gst_type      || 'sgst_cgst',
        notes:         editQuotation.notes         || '',
      };
    }
    return emptyForm();
  });

  const [eventTypes] = useState(loadEventTypes);
  const _fd = getSavedDefaults();
  const [saving,      setSaving]      = useState(false);
  const [tab,         setTab]         = useState('form');
  const [font,        setFont]        = useState(_fd.font       || 'Inter');
  const [template,    setTemplate]    = useState(_fd.template   || TEMPLATES[0]?.id || 't01');
  const [themeName,   setThemeName]   = useState(_fd.theme      || 'Gold & Maroon');
  const [orientation, setOrientation] = useState(_fd.orientation || 'portrait');
  const [margins,     setMargins]     = useState(_fd.margins    || { top: 0, right: 0, bottom: 0, left: 0 });
  const [logo,        setLogo]        = useState(settingsLogo);
  const [includeLogo, setIncludeLogo] = useState(!!settingsLogo);
  const [etSearch,       setEtSearch]       = useState('');
  const [etOpen,         setEtOpen]         = useState(false);
  const [showFullPreview,setShowFullPreview] = useState(false);
  const [fpZoom,         setFpZoom]         = useState(1.0);
  const fpRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setItem = (i, k, v) => {
    const ni = [...form.items];
    ni[i][k] = v;
    if (k === 'qty' || k === 'rate') {
      ni[i].total = (parseFloat(ni[i].qty) || 0) * (parseFloat(ni[i].rate) || 0);
    }
    setForm(f => ({ ...f, items: ni }));
  };

  const addItem    = () => setForm(f => ({ ...f, items: [...f.items, { description: '', qty: 1, rate: 0, total: 0 }] }));
  const removeItem = i  => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const handlePackageApply = (newItems) => {
    setForm(f => {
      const hasContent = f.items.some(i => i.description.trim() !== '');
      return { ...f, items: hasContent ? [...newItems, ...f.items] : newItems };
    });
  };

  const { subtotal, tax, grand } = calcTotals(form);
  const taxable = Math.max(subtotal - (parseFloat(form.discount) || 0), 0);

  const activeLogo = includeLogo ? (logo || settingsLogo) : '';

  const previewQuotation = {
    ...form,
    subtotal, tax_amount: tax, grand_total: grand,
    balance_due: grand,
    advance_paid: 0,
    invoice_number: 'SSS-QUO-PREVIEW',
    invoice_date: form.quote_date,
    due_date: form.valid_until,
    payment_status: 'draft',
  };

  const filteredET = eventTypes.filter(e => e.toLowerCase().includes(etSearch.toLowerCase()));

  const handleSave = async () => {
    if (!form.customer_name.trim()) return alert('Client name is required.');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/quotations/${editQuotation.id}`, form);
        onSave(null);
      } else {
        const r = await api.post('/quotations/', form);
        onSave(r.data);
      }
    } catch (e) {
      alert('Error saving quotation: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  };

  const iw = typeof window !== 'undefined' ? window.innerWidth : 1200;

  const firstTemplate = TEMPLATES[0]?.id || 'classic';
  const activeTemplate = TEMPLATES.find(t => t.id === template) ? template : firstTemplate;

  const handleFpPrint = () => {
    const style = document.createElement('style');
    style.id = '__fp_print_css_q';
    style.innerHTML = '@media print { body > * { display:none !important; } #__fp_print_root_q { display:block !important; position:fixed; top:0;left:0;width:100%;z-index:99999; } }';
    document.head.appendChild(style);
    const div = document.createElement('div');
    div.id = '__fp_print_root_q';
    div.innerHTML = fpRef.current?.innerHTML || '';
    document.body.appendChild(div);
    window.print();
    setTimeout(() => { document.getElementById('__fp_print_css_q')?.remove(); document.getElementById('__fp_print_root_q')?.remove(); }, 1000);
  };

  return (
    <>
    {showFullPreview && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}
        onClick={e => { if (e.target === e.currentTarget) setShowFullPreview(false); }}>
        <div style={{ width: '100%', maxWidth: 980, height: '94vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 100px rgba(0,0,0,0.6)' }}>
          <div style={{ background: 'var(--dark)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
            <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14 }}>{isEdit ? 'Edit Quotation — Preview' : 'New Quotation — Preview'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '2px 6px', marginLeft: 8 }}>
              <button onClick={() => setFpZoom(z => Math.max(0.3, parseFloat((z - 0.1).toFixed(1))))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '2px 4px' }}>−</button>
              <span style={{ color: '#ddd', fontSize: 11, minWidth: 36, textAlign: 'center' }}>{Math.round(fpZoom * 100)}%</span>
              <button onClick={() => setFpZoom(z => Math.min(3.0, parseFloat((z + 0.1).toFixed(1))))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '2px 4px' }}>+</button>
              <button onClick={() => setFpZoom(1)} title="Reset" style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 12, padding: '2px 4px' }}>↺</button>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button onClick={handleFpPrint} style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Printer size={13} /> Print
              </button>
              <button onClick={async () => { await downloadPDF(fpRef.current, 'quotation-preview', orientation); }} style={{ padding: '6px 12px', borderRadius: 6, background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Download size={13} /> PDF
              </button>
              <button onClick={async () => { await downloadJPG(fpRef.current, 'quotation-preview'); }} style={{ padding: '6px 12px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Download size={13} /> JPG
              </button>
              <button onClick={() => downloadWord(fpRef.current, 'quotation-preview', 'SSS-QUO-PREVIEW')} style={{ padding: '6px 12px', borderRadius: 6, background: '#1d4ed8', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <FileText size={13} /> Word
              </button>
              <button onClick={() => setShowFullPreview(false)} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', background: '#e5e7eb', padding: 24 }}>
            <div style={{ zoom: fpZoom }}>
              <div ref={fpRef} style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                <InvoicePreview invoice={previewQuotation} template={activeTemplate} themeName={themeName} font={font} logo={activeLogo} gstType={form.gst_type} company={company} orientation={orientation} margins={margins} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'var(--dark)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 16 }}>
          {isEdit ? `Edit Quotation — ${editQuotation.quotation_number || `SSS-QUO-${editQuotation.id}`}` : 'Create Quotation'}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setTab('form')}
              style={{ padding: '5px 12px', borderRadius: 6, background: tab === 'form' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}>
              📝 Form
            </button>
            <button onClick={() => setShowFullPreview(true)}
              style={{ padding: '5px 14px', borderRadius: 6, background: 'var(--gold)', color: 'var(--dark)', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
              👁 Preview
            </button>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

        {/* LEFT: Form */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20, background: 'var(--cream)', display: tab === 'preview' && iw < 900 ? 'none' : 'block', minWidth: 0 }}>

          {/* Client Details */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--maroon)' }}>Client Details</p>
            <div className="inv-grid-2">
              <FieldGroup label="Client Name *">
                <input className="form-input" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Company">
                <input className="form-input" value={form.company_name} onChange={e => set('company_name', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Email">
                <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Phone">
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </FieldGroup>
            </div>
          </div>

          {/* Event Details */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--maroon)' }}>Event Details</p>
            <div className="inv-grid-2">
              {/* Event type with autocomplete */}
              <FieldGroup label="Event Type">
                <div style={{ position: 'relative' }}>
                  <input className="form-input" value={form.event_type} placeholder="Type or select…"
                    onChange={e => { set('event_type', e.target.value); setEtSearch(e.target.value); setEtOpen(true); }}
                    onFocus={() => setEtOpen(true)}
                    onBlur={() => setTimeout(() => setEtOpen(false), 200)} />
                  {etOpen && filteredET.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, zIndex: 100, maxHeight: 180, overflow: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {filteredET.map(et => (
                        <div key={et} onMouseDown={() => { set('event_type', et); setEtSearch(et); setEtOpen(false); }}
                          style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid var(--cream)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          {et}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FieldGroup>
              <FieldGroup label="Event Date">
                <input className="form-input" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Venue">
                <input className="form-input" value={form.venue} onChange={e => set('venue', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Quote Date">
                <input className="form-input" type="date" value={form.quote_date} onChange={e => set('quote_date', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Valid Until">
                <input className="form-input" type="date" value={form.valid_until} onChange={e => set('valid_until', e.target.value)} />
              </FieldGroup>
            </div>
          </div>

          {/* Line Items */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--maroon)' }}>Line Items</p>
            <PackagePicker onApply={handlePackageApply} />
            <div className="inv-items-header">
              {['Description', 'Qty', 'Rate (₹)', 'Total', ''].map(h => (
                <div key={h} style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {form.items.map((item, i) => (
              <div key={i} className="inv-items-row">
                <input className="form-input" placeholder="Description" value={item.description}
                  onChange={e => setItem(i, 'description', e.target.value)} style={{ padding: '7px 10px', fontSize: 13 }} />
                <input className="form-input" type="number" value={item.qty}
                  onChange={e => setItem(i, 'qty', e.target.value)} style={{ padding: '7px 8px', fontSize: 13 }} />
                <input className="form-input" type="number" value={item.rate}
                  onChange={e => setItem(i, 'rate', e.target.value)} style={{ padding: '7px 8px', fontSize: 13 }} />
                <div style={{ padding: '7px 8px', background: 'var(--cream)', borderRadius: 6, fontSize: 13, fontWeight: 600, border: '1px solid var(--border)', textAlign: 'right' }}>
                  {fmt(item.total)}
                </div>
                <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: 2 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop: 4 }}>
              <Plus size={13} /> Add Item
            </button>
          </div>

          {/* GST & Totals */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--maroon)' }}>Tax & Totals</p>
            <div className="inv-grid-3" style={{ marginBottom: 12 }}>
              <FieldGroup label="GST Type">
                <select className="form-select" value={form.gst_type} onChange={e => set('gst_type', e.target.value)}>
                  {GST_TYPES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </FieldGroup>
              {form.gst_type !== 'none' && (
                <FieldGroup label={form.gst_type === 'sgst_cgst' ? 'Total GST %' : form.gst_type === 'vat' ? 'VAT %' : 'Tax %'}>
                  <input className="form-input" type="number" value={form.tax_rate}
                    onChange={e => set('tax_rate', parseFloat(e.target.value) || 0)} />
                </FieldGroup>
              )}
              <FieldGroup label="Discount (₹)">
                <input className="form-input" type="number" value={form.discount}
                  onChange={e => set('discount', parseFloat(e.target.value) || 0)} />
              </FieldGroup>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--cream-dark, #f5f0e8)', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              {form.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--success)' }}>
                  <span>Discount</span><span>– {fmt(form.discount)}</span>
                </div>
              )}
              {gstLines(tax, form.tax_rate, form.gst_type).map(g => (
                <div key={g.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-light)' }}>
                  <span>{g.label}</span><span>{fmt(g.amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, borderTop: '1px solid var(--border)', paddingTop: 6, color: 'var(--maroon)' }}>
                <span>Grand Total</span><span>{fmt(grand)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <FieldGroup label="Notes / Terms">
              <textarea className="form-textarea" style={{ minHeight: 60, fontSize: 13 }}
                value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="Payment terms, special instructions, validity notes…" />
            </FieldGroup>
          </div>

          {/* Appearance */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--maroon)' }}>Quotation Appearance</p>
            <div className="inv-grid-2">
              <FieldGroup label="Template">
                <select className="form-select" value={template} onChange={e => setTemplate(e.target.value)}>
                  {TEMPLATES.map(tp => <option key={tp.id} value={tp.id}>{tp.icon} {tp.name}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Color Theme">
                <select className="form-select" value={themeName} onChange={e => setThemeName(e.target.value)}>
                  {Object.keys(THEMES).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Font">
                <select className="form-select" value={font} onChange={e => setFont(e.target.value)}>
                  {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Page Orientation">
                <select className="form-select" value={orientation} onChange={e => setOrientation(e.target.value)}>
                  <option value="portrait">⬜ Portrait (A4 vertical)</option>
                  <option value="landscape">▭ Landscape (A4 horizontal)</option>
                </select>
              </FieldGroup>
            </div>
            <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 8 }}>Page Margins (mm) — extra space added inside the page boundary</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                {['top','right','bottom','left'].map(side => (
                  <div key={side}>
                    <label style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginBottom: 3, textTransform: 'capitalize' }}>{side}</label>
                    <input className="form-input" type="number" min="0" max="40" value={margins[side]}
                      onChange={e => setMargins(m => ({ ...m, [side]: parseFloat(e.target.value) || 0 }))}
                      style={{ padding: '6px 8px', fontSize: 13 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none', fontWeight: 600, fontSize: 13 }}>
                  <input type="checkbox" checked={includeLogo} onChange={e => setIncludeLogo(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--gold)', cursor: 'pointer' }} />
                  Include Logo in Quotation
                </label>
                {settingsLogo && !includeLogo && (
                  <span style={{ fontSize: 11, color: 'var(--text-light)' }}>Logo configured in Settings — check to include</span>
                )}
              </div>
              {includeLogo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <input className="form-input" value={logo} onChange={e => setLogo(e.target.value)}
                      placeholder="Logo URL — leave blank to use logo from Settings" />
                    {!logo && settingsLogo && (
                      <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>Using logo from Settings</p>
                    )}
                  </div>
                  {(logo || settingsLogo) && (
                    <img src={logo || settingsLogo} alt="logo preview"
                      style={{ height: 44, maxWidth: 100, objectFit: 'contain', border: '1px solid var(--border)', borderRadius: 6, padding: 4, background: '#fff' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  {logo && (
                    <button onClick={() => setLogo('')} title="Clear override"
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 11, color: 'var(--error)' }}>
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, paddingBottom: 24 }}>
            <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 2, justifyContent: 'center' }}>
              {saving ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? '✓ Save Changes' : '✓ Create Quotation'}
            </button>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div style={{ width: 460, flexShrink: 0, overflow: 'auto', background: '#e5e7eb', padding: 16, borderLeft: '1px solid var(--border)', display: tab === 'form' && iw < 900 ? 'none' : 'block' }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: 12, textAlign: 'center' }}>Live Preview</p>
          <div style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ background: '#fff', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', minWidth: 820 }}>
            <InvoicePreview
              invoice={previewQuotation}
              template={activeTemplate}
              themeName={themeName}
              font={font}
              logo={activeLogo}
              gstType={form.gst_type}
              company={company}
              orientation={orientation}
              margins={margins}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QuotationsPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [preview,  setPreview]  = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing,  setEditing]  = useState(null);   // quotation object to edit
  const { get } = useContent();

  const company = {
    name:    get('company', 'name',    DFLT_COMPANY.name),
    tagline: get('company', 'tagline', DFLT_COMPANY.tagline),
    address: get('contact', 'address', DFLT_COMPANY.address),
    phone:   get('contact', 'phone',   DFLT_COMPANY.phone),
    email:   get('contact', 'email',   DFLT_COMPANY.email),
    gstin:   get('company', 'gstin',   DFLT_COMPANY.gstin),
  };

  const load = useCallback(() => {
    setLoading(true);
    api.get('/quotations/')
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this quotation?')) return;
    try {
      await api.delete(`/quotations/${id}`);
      load();
    } catch (e) {
      alert('Error deleting: ' + (e.response?.data?.error || e.message));
    }
  };

  const handleConvert = async (q) => {
    if (!confirm(`Convert quotation ${q.quotation_number || `SSS-QUO-${q.id}`} to an Invoice?`)) return;
    try {
      await api.post(`/quotations/${q.id}/convert`);
      load();
      alert('Invoice created successfully! Check the Invoices section.');
    } catch (e) {
      alert('Error converting: ' + (e.response?.data?.error || e.message));
    }
  };

  const filtered = items.filter(q =>
    (!statusFilter || (q.status || 'draft') === statusFilter) &&
    (!search ||
      q.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      q.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      q.event_type?.toLowerCase().includes(search.toLowerCase()) ||
      q.quotation_number?.toLowerCase().includes(search.toLowerCase()) ||
      q.phone?.toLowerCase().includes(search.toLowerCase()))
  );

  // Stat card counts
  const total     = items.length;
  const drafts    = items.filter(q => (q.status || 'draft') === 'draft').length;
  const sent      = items.filter(q => q.status === 'sent').length;
  const converted = items.filter(q => q.status === 'converted').length;

  return (
    <div>
      {preview && (
        <PreviewModal
          quotation={preview}
          onClose={() => setPreview(null)}
          company={company}
        />
      )}
      {creating && (
        <QuotationForm
          onSave={(quo) => { load(); setCreating(false); if (quo) setTimeout(() => setPreview(quo), 80); }}
          onClose={() => setCreating(false)}
          company={company}
        />
      )}
      {editing && (
        <QuotationForm
          onSave={() => { load(); setEditing(null); }}
          onClose={() => setEditing(null)}
          company={company}
          editQuotation={editing}
        />
      )}

      {/* Page header */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: 10 }}>
        <h1 className="page-title">Quotations</h1>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button className="btn btn-ghost btn-sm" onClick={load} title="Refresh">
            <RefreshCw size={14} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>
            <Plus size={15} /> New Quotation
          </button>
        </div>
      </div>

      {/* Summary stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { l: 'Total Quotes',  v: total,     c: 'var(--maroon)' },
          { l: 'Draft',         v: drafts,    c: '#6b7280' },
          { l: 'Sent',          v: sent,      c: '#1d4ed8' },
          { l: 'Converted',     v: converted, c: '#7c3aed' },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input className="form-input" placeholder="Search by name, phone, quote #…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 130, fontSize: 13 }}>
          <option value="">All Status</option>
          {['draft','sent','accepted','converted','rejected'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        {search && (
          <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>
            <X size={13} /> Clear
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-light)' }}>
          {filtered.length} {filtered.length === 1 ? 'quotation' : 'quotations'}
        </span>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading quotations…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📄</div>
            {search ? 'No quotations match your search.' : 'No quotations yet — create your first one!'}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quotation #</th>
                  <th>Client</th>
                  <th>Event Type</th>
                  <th>Event Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => {
                  const { grand } = calcTotals({ items: q.items || [], discount: q.discount || 0, tax_rate: q.tax_rate || 18, gst_type: q.gst_type || 'sgst_cgst' });
                  const displayTotal = q.grand_total || q.total || grand;
                  const qNum = q.quotation_number || `SSS-QUO-${q.id}`;
                  return (
                    <tr key={q.id}>
                      <td style={{ fontWeight: 700, color: 'var(--maroon)', whiteSpace: 'nowrap' }}>{qNum}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{q.customer_name}</div>
                        {q.company_name && <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{q.company_name}</div>}
                      </td>
                      <td style={{ fontSize: 13 }}>{q.event_type || '—'}</td>
                      <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDate(q.event_date)}</td>
                      <td style={{ fontWeight: 700 }}>{fmt(displayTotal)}</td>
                      <td><StatusBadge s={q.status || 'draft'} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setPreview(q)} title="Preview">
                            <Eye size={13} />
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(q)} title="Edit">
                            <Edit2 size={13} />
                          </button>
                          {q.status !== 'converted' && (
                            <button className="btn btn-ghost btn-sm" onClick={() => handleConvert(q)} title="Convert to Invoice"
                              style={{ color: '#7c3aed', fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}>
                              → Invoice
                            </button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q.id)} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
