import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, X, Printer, Eye, Trash2, Download, Edit2, Search, FileImage, FileText } from 'lucide-react';
import api, { fmt, fmtDate, cap } from '../../utils/api';
import { InvoicePreview, FONTS, THEMES, TEMPLATES, GST_TYPES, gstLines, downloadPDF, downloadJPG, downloadWord } from '../../components/admin/InvoiceTemplates';
import { useContent } from '../../context/ContentContext';

const EVENT_TYPES = [
  'Wedding','Reception','Corporate Lunch','Corporate Dinner','Daily Meal Plan',
  'Conference Buffet','Birthday Party','Anniversary','Cocktail Party',
  'Baby Shower','Engagement','Farewell','Award Ceremony','Product Launch',
  'Team Outing','Festival Event','Pooja / Religious Event','Other',
];

const DFLT_COMPANY = {
  name:'Shree Swami Samarth', tagline:'Food & Hospitality Services',
  address:'Vikhroli, Mumbai – 400083, Maharashtra',
  phone:'+91 98765 43210', email:'info@shreeswamisamarthfoods.com',
  gstin:'27XXXXX1234X1Z5',
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function StatusBadge({ s }) {
  const c = s==='paid'?'#16a34a':s==='partial'?'#ca8a04':'#dc2626';
  return <span style={{ background:c+'22', color:c, padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, textTransform:'uppercase' }}>{s}</span>;
}

function FieldGroup({ label, children, style={} }) {
  return <div className="form-group" style={style}><label className="form-label">{label}</label>{children}</div>;
}

// ─── Print / PDF ─────────────────────────────────────────────────────────────
function printInvoice(invoice, settings) {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return alert('Allow pop-ups to print.');
  const { themeName, font, template, gstType, logo, company } = settings;
  const theme = Object.values(require ? {} : {}); // handled via injected HTML
  w.document.write(`
    <!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <title>Invoice ${invoice.invoice_number}</title>
    <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'${font}',sans-serif}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
    </head><body id="root"></body></html>`);
  w.document.close();
  setTimeout(() => {
    w.document.getElementById('root').innerHTML = document.getElementById('inv-preview-print')?.innerHTML || '';
    w.print();
  }, 600);
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

// ─── Invoice Preview Modal ────────────────────────────────────────────────────
function PreviewModal({ invoice, onClose, company }) {
  const { get } = useContent();
  const settingsLogo = get('company','invoice_logo_url','') || get('company','logo_url','');
  const [template,    setTemplate]    = useState(TEMPLATES[0]?.id || 't01');
  const [themeName,   setThemeName]   = useState('Gold & Maroon');
  const [font,        setFont]        = useState('Inter');
  const [gstType,     setGstType]     = useState(invoice.gst_type || 'sgst_cgst');
  const [logo,        setLogo]        = useState('');
  const [includeLogo, setIncludeLogo] = useState(!!settingsLogo);
  const [tab,         setTab]         = useState('preview');
  const [zoom,        setZoom]        = useState(1.0);

  const activeLogo = includeLogo ? (logo || settingsLogo) : '';
  const printRef = useRef(null);

  const handlePrint = () => {
    const style = document.createElement('style');
    style.id = '__inv_print_css';
    style.innerHTML = `
      @media print {
        body > * { display:none !important; }
        #__inv_print_root { display:block !important; position:fixed; top:0;left:0;width:100%;z-index:99999; }
      }`;
    document.head.appendChild(style);
    const div = document.createElement('div');
    div.id = '__inv_print_root';
    div.innerHTML = printRef.current?.innerHTML || '';
    document.body.appendChild(div);
    window.print();
    setTimeout(() => { document.getElementById('__inv_print_css')?.remove(); document.getElementById('__inv_print_root')?.remove(); }, 1000);
  };

  const toolbarBtn = (active, onClick, children) => (
    <button onClick={onClick} style={{ padding:'6px 12px', borderRadius:6, border:'1px solid var(--border)', background:active?'var(--dark)':'#fff', color:active?'#fff':'inherit', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>{children}</button>
  );

  const iw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding: iw < 640 ? 0 : '12px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth:960, height: iw < 640 ? '100vh' : '92vh', background:'#fff', borderRadius: iw < 640 ? 0 : 12, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>
      {/* Top bar */}
      <div style={{ background:'var(--dark)', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', flexShrink:0 }}>
        <span style={{ color:'var(--gold)', fontWeight:700, marginRight:8, fontSize:14 }}>Invoice Preview</span>

        {/* Template selector */}
        <select value={template} onChange={e => setTemplate(e.target.value)}
          style={{ padding:'5px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, cursor:'pointer', maxWidth:180 }}>
          {TEMPLATES.map(tp => <option key={tp.id} value={tp.id} style={{ color:'#000' }}>{tp.icon} {tp.name}</option>)}
        </select>

        {/* Color theme */}
        <select value={themeName} onChange={e=>setThemeName(e.target.value)}
          style={{ padding:'5px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, cursor:'pointer' }}>
          {Object.keys(THEMES).map(k => <option key={k} value={k} style={{ color:'#000' }}>{k}</option>)}
        </select>

        {/* Font */}
        <select value={font} onChange={e=>setFont(e.target.value)}
          style={{ padding:'5px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, cursor:'pointer', maxWidth:140 }}>
          {FONTS.map(f => <option key={f} value={f} style={{ color:'#000',fontFamily:f }}>{f}</option>)}
        </select>

        {/* GST type */}
        <select value={gstType} onChange={e=>setGstType(e.target.value)}
          style={{ padding:'5px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, cursor:'pointer' }}>
          {GST_TYPES.map(g => <option key={g.value} value={g.value} style={{ color:'#000' }}>{g.label}</option>)}
        </select>

        {/* Logo toggle */}
        <label style={{ display:'flex', alignItems:'center', gap:6, color:'#fff', fontSize:12, cursor:'pointer', userSelect:'none' }}>
          <input type="checkbox" checked={includeLogo} onChange={e=>setIncludeLogo(e.target.checked)}
            style={{ width:14, height:14, accentColor:'var(--gold)', cursor:'pointer' }} />
          Logo
        </label>
        {includeLogo && (
          <input value={logo} onChange={e=>setLogo(e.target.value)}
            placeholder={settingsLogo ? 'Override logo URL…' : 'Logo URL…'}
            style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, width:180 }} />
        )}

        {/* Zoom controls */}
        <div style={{ display:'flex', alignItems:'center', gap:2, background:'rgba(255,255,255,0.08)', borderRadius:6, padding:'2px 6px' }}>
          <button onClick={() => setZoom(z => Math.max(0.4, parseFloat((z-0.1).toFixed(1))))} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:16, lineHeight:1, padding:'2px 4px' }}>−</button>
          <span style={{ color:'#ddd', fontSize:11, minWidth:34, textAlign:'center' }}>{Math.round(zoom*100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3.0, parseFloat((z+0.1).toFixed(1))))} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:16, lineHeight:1, padding:'2px 4px' }}>+</button>
          <button onClick={() => setZoom(1)} title="Reset zoom" style={{ background:'none', border:'none', color:'#aaa', cursor:'pointer', fontSize:13, padding:'2px 4px' }}>↺</button>
        </div>

        <div style={{ marginLeft:'auto', display:'flex', gap:6, flexWrap:'wrap' }}>
          <button onClick={handlePrint} title="Print" style={{ padding:'6px 12px', borderRadius:6, background:'rgba(255,255,255,0.12)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:5 }}>
            <Printer size={13} /> Print
          </button>
          <button onClick={async()=>{ await downloadPDF(printRef.current, invoice.invoice_number||'invoice'); }} title="Download PDF"
            style={{ padding:'6px 12px', borderRadius:6, background:'#dc2626', color:'#fff', border:'none', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:5 }}>
            <Download size={13} /> PDF
          </button>
          <button onClick={async()=>{ await downloadJPG(printRef.current, invoice.invoice_number||'invoice'); }} title="Download JPG"
            style={{ padding:'6px 12px', borderRadius:6, background:'#2563eb', color:'#fff', border:'none', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:5 }}>
            <FileImage size={13} /> JPG
          </button>
          <button onClick={()=>downloadWord(printRef.current, invoice.invoice_number||'invoice', invoice.invoice_number)} title="Download Word"
            style={{ padding:'6px 12px', borderRadius:6, background:'#1d4ed8', color:'#fff', border:'none', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:5 }}>
            <FileText size={13} /> Word
          </button>
          <button onClick={onClose} style={{ padding:'6px 10px', borderRadius:6, background:'rgba(255,255,255,0.1)', color:'#fff', border:'none', cursor:'pointer' }}><X size={16}/></button>
        </div>
      </div>

      {/* Preview area */}
      <div style={{ flex:1, overflow:'auto', background:'#e5e7eb', padding: iw < 640 ? 8 : 24 }}>
        <div style={{ zoom: zoom }}>
          <div ref={printRef} style={{ minWidth: iw < 640 ? 680 : undefined, maxWidth:820, margin:'0 auto', background:'#fff', borderRadius:4, boxShadow:'0 4px 24px rgba(0,0,0,0.12)', overflow:'hidden' }}>
            <InvoicePreview invoice={invoice} template={template} themeName={themeName} font={font} logo={activeLogo} gstType={gstType} company={company} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── Invoice Form (Create / Edit) ─────────────────────────────────────────────
function InvoiceForm({ onSave, onClose, company, editInvoice }) {
  const { get: cget } = useContent();
  const settingsLogo = cget('company','invoice_logo_url','') || cget('company','logo_url','');
  const isEdit = !!editInvoice;

  const [form, setForm] = useState(editInvoice ? {
    customer_name: editInvoice.customer_name || '',
    company_name:  editInvoice.company_name  || '',
    email:         editInvoice.email         || '',
    phone:         editInvoice.phone         || '',
    event_type:    editInvoice.event_type    || '',
    event_date:    editInvoice.event_date    || '',
    venue:         editInvoice.venue         || '',
    items:         editInvoice.items?.length ? editInvoice.items : [{ description:'', qty:1, rate:0, total:0 }],
    discount:      parseFloat(editInvoice.discount)     || 0,
    tax_rate:      parseFloat(editInvoice.tax_rate)     || 18,
    gst_type:      editInvoice.gst_type      || 'sgst_cgst',
    advance_paid:  parseFloat(editInvoice.advance_paid) || 0,
    notes:         editInvoice.notes         || '',
    invoice_date:  editInvoice.invoice_date  || new Date().toISOString().split('T')[0],
    due_date:      editInvoice.due_date      || '',
  } : {
    customer_name:'', company_name:'', email:'', phone:'',
    event_type:'', event_date:'', venue:'',
    items:[{ description:'', qty:1, rate:0, total:0 }],
    discount:0, tax_rate:18, gst_type:'sgst_cgst', advance_paid:0,
    notes:'', invoice_date: new Date().toISOString().split('T')[0], due_date:'',
  });
  const [saving, setSaving]     = useState(false);
  const [tab, setTab]           = useState('form');
  const [font,     setFont]      = useState('Inter');
  const [template, setTemplate]  = useState('classic');
  const [themeName,setThemeName] = useState('Gold & Maroon');
  const [logo,     setLogo]      = useState(settingsLogo);
  const [includeLogo, setIncludeLogo] = useState(!!settingsLogo);
  const [etSearch, setEtSearch]  = useState('');
  const [etOpen,   setEtOpen]    = useState(false);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const setItem = (i,k,v) => {
    const ni = [...form.items]; ni[i][k]=v;
    if (k==='qty'||k==='rate') ni[i].total=(parseFloat(ni[i].qty)||0)*(parseFloat(ni[i].rate)||0);
    setForm(f=>({...f,items:ni}));
  };
  const addItem    = () => setForm(f=>({...f,items:[...f.items,{description:'',qty:1,rate:0,total:0}]}));
  const removeItem = i  => setForm(f=>({...f,items:f.items.filter((_,idx)=>idx!==i)}));

  const handlePackageApply = (newItems) => {
    setForm(f => {
      const hasContent = f.items.some(i => i.description.trim() !== '');
      return { ...f, items: hasContent ? [...newItems, ...f.items] : newItems };
    });
  };

  const subtotal = form.items.reduce((s,i)=>s+(parseFloat(i.total)||0),0);
  const taxable  = Math.max(subtotal-(parseFloat(form.discount)||0),0);
  const tax      = form.gst_type==='none' ? 0 : Math.round(taxable*(parseFloat(form.tax_rate)||0)/100*100)/100;
  const grand    = Math.round((taxable+tax)*100)/100;
  const balance  = Math.round((grand-(parseFloat(form.advance_paid)||0))*100)/100;

  const activeLogo = includeLogo ? logo : '';

  const previewInvoice = {
    ...form, subtotal, tax_amount:tax, grand_total:grand, balance_due:balance,
    invoice_number:'SSS-INV-PREVIEW', payment_status: balance<=0?'paid':form.advance_paid>0?'partial':'unpaid',
  };

  const filteredET = EVENT_TYPES.filter(e=>e.toLowerCase().includes(etSearch.toLowerCase()));

  const handleSave = async () => {
    if (!form.customer_name) return alert('Client name is required');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/invoices/${editInvoice.id}`, form);
        onSave(null);
      } else {
        const r = await api.post('/invoices/', form);
        onSave(r.data);
      }
    } catch(e) { alert('Error: '+e.message); } finally { setSaving(false); }
  };

  const iw = window.innerWidth;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:900, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ background:'var(--dark)', padding:'12px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <span style={{ color:'var(--gold)', fontWeight:700, fontSize:16 }}>{isEdit ? 'Edit Invoice' : 'Create Invoice'}</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          {/* Mobile tabs */}
          <div style={{ display:'flex', gap:4 }}>
            {['form','preview'].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{ padding:'5px 12px', borderRadius:6, background:tab===t?'var(--gold)':'rgba(255,255,255,0.1)', color:tab===t?'var(--dark)':'#fff', border:'none', cursor:'pointer', fontSize:12, fontWeight:tab===t?700:400 }}>
                {t==='form'?'📝 Form':'👁 Preview'}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'none', borderRadius:6, padding:'5px 10px', cursor:'pointer' }}><X size={16}/></button>
        </div>
      </div>

      {/* Body — split on desktop */}
      <div style={{ flex:1, overflow:'hidden', display:'flex' }}>

        {/* ── LEFT: Form ── */}
        <div style={{ flex:1, overflow:'auto', padding:20, background:'var(--cream)', display: tab==='preview'&&iw<900?'none':'block', minWidth:0 }}>

          {/* Client */}
          <div className="card" style={{ marginBottom:16, padding:16 }}>
            <p style={{ fontWeight:700, fontSize:13, marginBottom:12, color:'var(--maroon)' }}>Client Details</p>
            <div className="inv-grid-2">
              <FieldGroup label="Client Name *"><input className="form-input" value={form.customer_name} onChange={e=>set('customer_name',e.target.value)} /></FieldGroup>
              <FieldGroup label="Company"><input className="form-input" value={form.company_name} onChange={e=>set('company_name',e.target.value)} /></FieldGroup>
              <FieldGroup label="Email"><input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} /></FieldGroup>
              <FieldGroup label="Phone"><input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} /></FieldGroup>
            </div>
          </div>

          {/* Event */}
          <div className="card" style={{ marginBottom:16, padding:16 }}>
            <p style={{ fontWeight:700, fontSize:13, marginBottom:12, color:'var(--maroon)' }}>Event Details</p>
            <div className="inv-grid-2">
              {/* Event type with suggestions */}
              <FieldGroup label="Event Type">
                <div style={{ position:'relative' }}>
                  <input className="form-input" value={form.event_type} placeholder="Type or select..."
                    onChange={e=>{ set('event_type',e.target.value); setEtSearch(e.target.value); setEtOpen(true); }}
                    onFocus={()=>setEtOpen(true)} onBlur={()=>setTimeout(()=>setEtOpen(false),200)} />
                  {etOpen && filteredET.length>0 && (
                    <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid var(--border)', borderRadius:6, zIndex:100, maxHeight:180, overflow:'auto', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
                      {filteredET.map(et=>(
                        <div key={et} onMouseDown={()=>{ set('event_type',et); setEtSearch(et); setEtOpen(false); }}
                          style={{ padding:'8px 12px', cursor:'pointer', fontSize:13, borderBottom:'1px solid var(--cream)' }}
                          onMouseEnter={e=>e.target.style.background='var(--cream)'}
                          onMouseLeave={e=>e.target.style.background='#fff'}>{et}</div>
                      ))}
                    </div>
                  )}
                </div>
              </FieldGroup>
              <FieldGroup label="Event Date"><input className="form-input" type="date" value={form.event_date} onChange={e=>set('event_date',e.target.value)} /></FieldGroup>
              <FieldGroup label="Venue"><input className="form-input" value={form.venue} onChange={e=>set('venue',e.target.value)} /></FieldGroup>
              <FieldGroup label="Invoice Date"><input className="form-input" type="date" value={form.invoice_date} onChange={e=>set('invoice_date',e.target.value)} /></FieldGroup>
              <FieldGroup label="Due Date"><input className="form-input" type="date" value={form.due_date} onChange={e=>set('due_date',e.target.value)} /></FieldGroup>
            </div>
          </div>

          {/* Line Items */}
          <div className="card" style={{ marginBottom:16, padding:16 }}>
            <p style={{ fontWeight:700, fontSize:13, marginBottom:12, color:'var(--maroon)' }}>Line Items</p>
            <PackagePicker onApply={handlePackageApply} />
            <div className="inv-items-header">
              {['Description','Qty','Rate (₹)','Total',''].map(h=><div key={h} style={{ fontSize:11, color:'var(--text-light)', textTransform:'uppercase' }}>{h}</div>)}
            </div>
            {form.items.map((item,i)=>(
              <div key={i} className="inv-items-row">
                <input className="form-input" placeholder="Description" value={item.description} onChange={e=>setItem(i,'description',e.target.value)} style={{ padding:'7px 10px', fontSize:13 }} />
                <input className="form-input" type="number" value={item.qty} onChange={e=>setItem(i,'qty',e.target.value)} style={{ padding:'7px 8px', fontSize:13 }} />
                <input className="form-input" type="number" value={item.rate} onChange={e=>setItem(i,'rate',e.target.value)} style={{ padding:'7px 8px', fontSize:13 }} />
                <div style={{ padding:'7px 8px', background:'var(--cream)', borderRadius:6, fontSize:13, fontWeight:600, border:'1px solid var(--border)', textAlign:'right' }}>{fmt(item.total)}</div>
                <button onClick={()=>removeItem(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--error)', padding:2 }}><X size={14}/></button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop:4 }}><Plus size={13}/> Add Item</button>
          </div>

          {/* GST & Totals */}
          <div className="card" style={{ marginBottom:16, padding:16 }}>
            <p style={{ fontWeight:700, fontSize:13, marginBottom:12, color:'var(--maroon)' }}>Tax & Totals</p>
            <div className="inv-grid-3" style={{ marginBottom:12 }}>
              <FieldGroup label="GST Type">
                <select className="form-select" value={form.gst_type} onChange={e=>set('gst_type',e.target.value)}>
                  {GST_TYPES.map(g=><option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </FieldGroup>
              {form.gst_type!=='none' && (
                <FieldGroup label={form.gst_type==='sgst_cgst'?'Total GST %':form.gst_type==='vat'?'VAT %':'Tax %'}>
                  <input className="form-input" type="number" value={form.tax_rate} onChange={e=>set('tax_rate',parseFloat(e.target.value)||0)} />
                </FieldGroup>
              )}
              <FieldGroup label="Discount (₹)">
                <input className="form-input" type="number" value={form.discount} onChange={e=>set('discount',parseFloat(e.target.value)||0)} />
              </FieldGroup>
            </div>
            <FieldGroup label="Advance Paid (₹)" style={{ maxWidth:200 }}>
              <input className="form-input" type="number" value={form.advance_paid} onChange={e=>set('advance_paid',parseFloat(e.target.value)||0)} />
            </FieldGroup>
            {/* Summary */}
            <div style={{ background:'var(--cream-dark)', borderRadius:8, padding:12, marginTop:12, fontSize:13 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {gstLines(tax, form.tax_rate, form.gst_type).map(g=>(
                <div key={g.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:4, color:'var(--text-light)' }}><span>{g.label}</span><span>{fmt(g.amount)}</span></div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:15, borderTop:'1px solid var(--border)', paddingTop:6, color:'var(--maroon)' }}><span>Grand Total</span><span>{fmt(grand)}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}><span>Balance Due</span><span style={{ fontWeight:700, color:balance>0?'var(--error)':'var(--success)' }}>{fmt(balance)}</span></div>
            </div>
          </div>

          <div className="card" style={{ marginBottom:16, padding:16 }}>
            <FieldGroup label="Notes / Terms">
              <textarea className="form-textarea" style={{ minHeight:60, fontSize:13 }} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Payment terms, special instructions..." />
            </FieldGroup>
          </div>

          {/* Template settings (in form panel) */}
          <div className="card" style={{ padding:16, marginBottom:16 }}>
            <p style={{ fontWeight:700, fontSize:13, marginBottom:12, color:'var(--maroon)' }}>Invoice Appearance</p>
            <div className="inv-grid-2">
              <FieldGroup label="Template">
                <select className="form-select" value={template} onChange={e=>setTemplate(e.target.value)}>
                  {TEMPLATES.map(tp=><option key={tp.id} value={tp.id}>{tp.icon} {tp.name}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Color Theme">
                <select className="form-select" value={themeName} onChange={e=>setThemeName(e.target.value)}>
                  {Object.keys(THEMES).map(k=><option key={k} value={k}>{k}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Font">
                <select className="form-select" value={font} onChange={e=>setFont(e.target.value)}>
                  {FONTS.map(f=><option key={f} value={f} style={{ fontFamily:f }}>{f}</option>)}
                </select>
              </FieldGroup>
            </div>

            {/* Logo row */}
            <div style={{ marginTop:12, borderTop:'1px solid var(--border)', paddingTop:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', userSelect:'none', fontWeight:600, fontSize:13 }}>
                  <input type="checkbox" checked={includeLogo} onChange={e=>setIncludeLogo(e.target.checked)}
                    style={{ width:16, height:16, accentColor:'var(--gold)', cursor:'pointer' }} />
                  Include Logo in Invoice
                </label>
                {settingsLogo && !includeLogo && (
                  <span style={{ fontSize:11, color:'var(--text-light)' }}>Logo configured in Settings — check to include</span>
                )}
              </div>
              {includeLogo && (
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ flex:1 }}>
                    <input className="form-input" value={logo} onChange={e=>setLogo(e.target.value)}
                      placeholder="Logo URL — leave blank to use logo from Settings" />
                    {!logo && settingsLogo && (
                      <p style={{ fontSize:11, color:'var(--text-light)', marginTop:4 }}>Using logo from Settings</p>
                    )}
                  </div>
                  {(logo || settingsLogo) && (
                    <img src={logo || settingsLogo} alt="logo preview"
                      style={{ height:44, maxWidth:100, objectFit:'contain', border:'1px solid var(--border)', borderRadius:6, padding:4, background:'#fff' }}
                      onError={e=>{ e.target.style.display='none'; }} />
                  )}
                  {logo && (
                    <button onClick={()=>setLogo('')} title="Clear override"
                      style={{ padding:'6px 10px', borderRadius:6, border:'1px solid var(--border)', background:'#fff', cursor:'pointer', fontSize:11, color:'var(--error)' }}>
                      ✕ Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display:'flex', gap:10, paddingBottom:24 }}>
            <button className="btn btn-ghost" onClick={onClose} style={{ flex:1 }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex:2, justifyContent:'center' }}>
              {saving ? (isEdit?'Saving...':'Creating...') : (isEdit?'✓ Update Invoice':'✓ Create Invoice')}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div style={{ width:460, flexShrink:0, overflow:'auto', background:'#e5e7eb', padding:16, borderLeft:'1px solid var(--border)', display: tab==='form'&&iw<900?'none':'block' }}>
          <p style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'1px', color:'#888', marginBottom:12, textAlign:'center' }}>Live Preview</p>
          <div style={{ overflow:'auto', WebkitOverflowScrolling:'touch' }}>
            <div style={{ background:'#fff', borderRadius:4, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.1)', minWidth:820 }}>
              <InvoicePreview invoice={previewInvoice} template={template} themeName={themeName} font={font} logo={includeLogo ? (logo || settingsLogo) : ''} gstType={form.gst_type} company={company} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoicesPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [search,  setSearch]  = useState('');
  const [preview, setPreview]   = useState(null);
  const [creating,setCreating]  = useState(false);
  const [editing, setEditing]   = useState(null);
  const { get } = useContent();

  const company = {
    name:    get('company','name',    DFLT_COMPANY.name),
    tagline: get('company','tagline', DFLT_COMPANY.tagline),
    address: get('contact','address', DFLT_COMPANY.address),
    phone:   get('contact','phone',   DFLT_COMPANY.phone),
    email:   get('contact','email',   DFLT_COMPANY.email),
    gstin:   get('company','gstin',   DFLT_COMPANY.gstin),
  };

  const load = useCallback(() => {
    setLoading(true);
    api.get('/invoices/', { params: filter ? { payment_status: filter } : {} })
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handlePayment = async (inv) => {
    const amount = prompt(`Record payment for ${inv.invoice_number}\nBalance due: ${fmt(inv.balance_due)}\nEnter amount:`);
    if (!amount || isNaN(amount)) return;
    const mode = prompt('Payment mode:\nCash / NEFT / RTGS / Cheque / UPI') || 'Cash';
    await api.post(`/invoices/${inv.id}/payment`, { amount: parseFloat(amount), mode });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    await api.delete(`/invoices/${id}`);
    load();
  };

  const filtered = items.filter(inv =>
    !search ||
    inv.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
    inv.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    inv.event_type?.toLowerCase().includes(search.toLowerCase()) ||
    inv.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const totals = { grand: items.reduce((s,i)=>s+parseFloat(i.grand_total||0),0), paid: items.reduce((s,i)=>s+parseFloat(i.advance_paid||0),0), due: items.reduce((s,i)=>s+parseFloat(i.balance_due||0),0) };

  return (
    <div>
      {preview  && <PreviewModal invoice={preview} onClose={()=>setPreview(null)} company={company} />}
      {creating && <InvoiceForm  onSave={(inv)=>{ load(); setCreating(false); if (inv) setTimeout(()=>setPreview(inv), 80); }} onClose={()=>setCreating(false)} company={company} />}
      {editing  && <InvoiceForm  onSave={()=>{ load(); setEditing(null); }} onClose={()=>setEditing(null)} company={company} editInvoice={editing} />}

      <div className="page-header" style={{ flexWrap:'wrap', gap:10 }}>
        <h1 className="page-title">Invoices & Billing</h1>
        <button className="btn btn-primary btn-sm" onClick={()=>setCreating(true)}><Plus size={15}/> New Invoice</button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, marginBottom:20 }}>
        {[
          { l:'Total Billed', v:fmt(totals.grand), c:'var(--maroon)' },
          { l:'Collected',    v:fmt(totals.paid),  c:'var(--success)' },
          { l:'Outstanding',  v:fmt(totals.due),   c:'var(--error)' },
          { l:'Total Invoices',v:items.length,     c:'var(--gold-dark)' },
        ].map(s=>(
          <div key={s.l} className="card" style={{ padding:'14px 16px', textAlign:'center' }}>
            <div style={{ fontSize:11, color:'var(--text-light)', textTransform:'uppercase', marginBottom:4 }}>{s.l}</div>
            <div style={{ fontSize:20, fontWeight:700, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        {[['','All'],['paid','Paid'],['partial','Partial'],['unpaid','Unpaid']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} className={`btn btn-sm ${filter===v?'btn-primary':'btn-ghost'}`}>{l}</button>
        ))}
        <div style={{ marginLeft:'auto', position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
          <input className="form-input" placeholder="Search by name, phone, invoice #…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ paddingLeft:32, width:220, fontSize:13 }} />
        </div>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : filtered.length===0 ? (
          <div className="empty"><div className="empty-icon">🧾</div>{search?'No matching invoices':'No invoices yet'}</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice No.</th><th>Client</th><th>Event Type</th>
                  <th>Date</th><th>Grand Total</th><th>Paid</th>
                  <th>Balance</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv=>(
                  <tr key={inv.id}>
                    <td style={{ fontWeight:700, color:'var(--maroon)', whiteSpace:'nowrap' }}>{inv.invoice_number}</td>
                    <td>
                      <div style={{ fontWeight:600, fontSize:13 }}>{inv.customer_name}</div>
                      {inv.company_name && <div style={{ fontSize:11, color:'var(--text-light)' }}>{inv.company_name}</div>}
                    </td>
                    <td style={{ fontSize:13 }}>{inv.event_type || '—'}</td>
                    <td style={{ fontSize:12, whiteSpace:'nowrap' }}>{fmtDate(inv.invoice_date)}</td>
                    <td style={{ fontWeight:700 }}>{fmt(inv.grand_total)}</td>
                    <td style={{ color:'var(--success)', fontSize:13 }}>{fmt(inv.advance_paid)}</td>
                    <td style={{ fontWeight:700, color: parseFloat(inv.balance_due)>0?'var(--error)':'var(--success)' }}>{fmt(inv.balance_due)}</td>
                    <td><StatusBadge s={inv.payment_status} /></td>
                    <td>
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                        <button className="btn btn-ghost btn-sm" onClick={()=>setPreview(inv)} title="Preview & Download"><Eye size={13}/></button>
                        <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(inv)} title="Edit Invoice"><Edit2 size={13}/></button>
                        {parseFloat(inv.balance_due)>0 && (
                          <button className="btn btn-ghost btn-sm" onClick={()=>handlePayment(inv)} title="Record Payment" style={{ color:'var(--success)', fontWeight:700 }}>₹+</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(inv.id)} title="Delete"><Trash2 size={13}/></button>
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
