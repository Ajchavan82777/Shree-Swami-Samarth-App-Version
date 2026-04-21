import { fmt, fmtDate } from '../../utils/api';

export const FONTS = [
  'Inter','Roboto','Open Sans','Lato','Montserrat','Raleway','Poppins','Nunito',
  'Work Sans','DM Sans','Source Sans 3','Barlow','Cabin','Karla','Mulish','Exo 2',
  'Oswald','Josefin Sans','Quicksand',
  'Playfair Display','Merriweather','Libre Baskerville','EB Garamond',
  'Cormorant Garamond','Crimson Text',
];

export const THEMES = {
  'Gold & Maroon': { p:'#8B1A1A', a:'#C9A84C', bg:'#FDF8F0', light:'#FAF0D7', text:'#2C1810' },
  'Ocean Blue':    { p:'#1e3a8a', a:'#3b82f6', bg:'#eff6ff', light:'#dbeafe', text:'#1e3a8a' },
  'Forest Green':  { p:'#166534', a:'#16a34a', bg:'#f0fdf4', light:'#dcfce7', text:'#14532d' },
  'Royal Purple':  { p:'#6d28d9', a:'#8b5cf6', bg:'#f5f3ff', light:'#ede9fe', text:'#4c1d95' },
  'Sunset Orange': { p:'#c2410c', a:'#f97316', bg:'#fff7ed', light:'#fed7aa', text:'#7c2d12' },
  'Slate Gray':    { p:'#1e293b', a:'#475569', bg:'#f8fafc', light:'#e2e8f0', text:'#0f172a' },
  'Rose Pink':     { p:'#9d174d', a:'#ec4899', bg:'#fdf2f8', light:'#fce7f3', text:'#831843' },
};

export const TEMPLATES = [
  { id:'classic',   name:'Classic',   icon:'📜', desc:'Traditional gold border' },
  { id:'modern',    name:'Modern',    icon:'💼', desc:'Clean with color sidebar' },
  { id:'executive', name:'Executive', icon:'🎩', desc:'Dark header, premium' },
  { id:'minimal',   name:'Minimal',   icon:'⬜', desc:'Clean & simple' },
  { id:'bold',      name:'Bold',      icon:'⚡', desc:'High contrast header' },
];

export const GST_TYPES = [
  { value:'sgst_cgst', label:'SGST + CGST' },
  { value:'igst',      label:'IGST' },
  { value:'vat',       label:'VAT' },
  { value:'custom',    label:'Custom Tax %' },
  { value:'none',      label:'No Tax' },
];

export function gstLines(taxAmount, taxRate, gstType) {
  const r = parseFloat(taxRate) || 0;
  const a = parseFloat(taxAmount) || 0;
  if (gstType === 'sgst_cgst') return [
    { label:`SGST @${(r/2).toFixed(1)}%`, amount: a/2 },
    { label:`CGST @${(r/2).toFixed(1)}%`, amount: a/2 },
  ];
  if (gstType === 'igst')   return [{ label:`IGST @${r}%`, amount: a }];
  if (gstType === 'vat')    return [{ label:`VAT @${r}%`, amount: a }];
  if (gstType === 'none')   return [];
  return [{ label:`Tax @${r}%`, amount: a }];
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function CompanyHeader({ logo, company, t, align = 'left' }) {
  return (
    <div style={{ textAlign: align }}>
      {logo && <img src={logo} alt="logo" style={{ height: 52, marginBottom: 8, objectFit:'contain' }} />}
      <div style={{ fontWeight: 700, fontSize: 20, color: t.p }}>{company.name}</div>
      {company.tagline && <div style={{ fontSize: 11, color: t.a, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom: 6 }}>{company.tagline}</div>}
      <div style={{ fontSize: 12, color:'#555', lineHeight:1.7 }}>
        {company.address && <div>{company.address}</div>}
        {company.phone   && <div>Phone: {company.phone}</div>}
        {company.email   && <div>Email: {company.email}</div>}
        {company.gstin   && <div>GSTIN: {company.gstin}</div>}
      </div>
    </div>
  );
}

function BillTo({ invoice, t }) {
  return (
    <div>
      <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1.5px', color:'#999', marginBottom:6 }}>Bill To</div>
      <div style={{ fontWeight:700, fontSize:15, color:t.p }}>{invoice.customer_name}</div>
      {invoice.company_name && <div style={{ fontSize:13, color:'#555' }}>{invoice.company_name}</div>}
      {invoice.email        && <div style={{ fontSize:12, color:'#777' }}>{invoice.email}</div>}
      {invoice.phone        && <div style={{ fontSize:12, color:'#777' }}>{invoice.phone}</div>}
    </div>
  );
}

function EventBox({ invoice, t }) {
  const items = [
    ['Event', invoice.event_type],
    ['Date',  fmtDate(invoice.event_date)],
    ['Venue', invoice.venue],
  ].filter(([,v]) => v);
  if (!items.length) return null;
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${items.length},1fr)`, gap:12, background:t.light, borderRadius:8, padding:'10px 14px', marginBottom:18 }}>
      {items.map(([l,v]) => (
        <div key={l}>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'#999' }}>{l}</div>
          <div style={{ fontSize:13, fontWeight:500, color:t.text }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function ItemsTable({ invoice, t }) {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:12, fontSize:13 }}>
      <thead>
        <tr style={{ background:t.p }}>
          {['Description','Qty','Rate','Amount'].map((h,i) => (
            <th key={h} style={{ color:'#fff', padding:'9px 12px', textAlign: i===0?'left':'right', fontSize:11, textTransform:'uppercase', letterSpacing:'0.8px' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(invoice.items||[]).map((item,i) => (
          <tr key={i} style={{ borderBottom:`1px solid ${t.light}`, background: i%2===0?'#fff':t.bg }}>
            <td style={{ padding:'10px 12px' }}>{item.description}</td>
            <td style={{ padding:'10px 12px', textAlign:'right', color:'#666' }}>{item.qty}</td>
            <td style={{ padding:'10px 12px', textAlign:'right', color:'#666' }}>{fmt(item.rate)}</td>
            <td style={{ padding:'10px 12px', textAlign:'right', fontWeight:600 }}>{fmt(item.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TotalsBox({ invoice, gstType, t }) {
  const taxes = gstLines(invoice.tax_amount, invoice.tax_rate, gstType);
  const hasTax = taxes.length > 0;
  return (
    <div style={{ display:'flex', justifyContent:'flex-end' }}>
      <div style={{ width: 260 }}>
        {[
          { l:'Subtotal', v: fmt(invoice.subtotal), light:true },
          invoice.discount > 0 && { l:'Discount', v:`- ${fmt(invoice.discount)}`, light:true },
          ...(hasTax ? taxes.map(tx => ({ l:tx.label, v:fmt(tx.amount), light:true })) : []),
        ].filter(Boolean).map(row => (
          <div key={row.l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:13, borderBottom:`1px solid ${t.light}`, color:row.light?'#666':'inherit' }}>
            <span>{row.l}</span><span>{row.v}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', fontSize:16, fontWeight:700, borderBottom:`2px solid ${t.a}`, color:t.p }}>
          <span>Grand Total</span><span>{fmt(invoice.grand_total)}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:13 }}>
          <span style={{ color:'#666' }}>Advance Paid</span>
          <span style={{ color:'#16a34a', fontWeight:600 }}>{fmt(invoice.advance_paid)}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', fontSize:14, fontWeight:700 }}>
          <span>Balance Due</span>
          <span style={{ color: parseFloat(invoice.balance_due)>0?'#dc2626':'#16a34a' }}>{fmt(invoice.balance_due)}</span>
        </div>
      </div>
    </div>
  );
}

function NotesFooter({ invoice, t, footerText }) {
  return (
    <>
      {invoice.notes && (
        <div style={{ marginTop:16, padding:'10px 14px', background:t.light, borderRadius:6, borderLeft:`3px solid ${t.a}` }}>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'#999', marginBottom:4 }}>Terms & Notes</div>
          <div style={{ fontSize:12, color:'#555' }}>{invoice.notes}</div>
        </div>
      )}
      <div style={{ marginTop:24, paddingTop:12, borderTop:`1px solid ${t.light}`, textAlign:'center', fontSize:11, color:'#aaa' }}>
        {footerText || 'Thank you for choosing Shree Swami Samarth Food & Hospitality Services!'}
      </div>
    </>
  );
}

// ─── TEMPLATE 1: Classic ─────────────────────────────────────────────────────
function TemplateClassic({ inv, t, font, logo, gstType, company }) {
  return (
    <div style={{ fontFamily: font+',sans-serif', background:'#fff', padding:32 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, paddingBottom:20, borderBottom:`3px solid ${t.a}` }}>
        <CompanyHeader logo={logo} company={company} t={t} />
        <div style={{ textAlign:'right' }}>
          <div style={{ background:t.bg, border:`1px solid ${t.light}`, borderRadius:10, padding:'10px 18px', marginBottom:10 }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'#999' }}>Invoice No.</div>
            <div style={{ fontSize:20, fontWeight:700, color:t.p }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          </div>
          <div style={{ fontSize:12, color:'#666' }}>Date: {fmtDate(inv.invoice_date)}</div>
          {inv.due_date && <div style={{ fontSize:12, color:'#666' }}>Due: {fmtDate(inv.due_date)}</div>}
          {inv.payment_status && <div style={{ marginTop:6, display:'inline-block', background: inv.payment_status==='paid'?'#dcfce7':inv.payment_status==='partial'?'#fef9c3':'#fee2e2', color: inv.payment_status==='paid'?'#166534':inv.payment_status==='partial'?'#854d0e':'#991b1b', padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, textTransform:'uppercase' }}>{inv.payment_status}</div>}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:20 }}>
        <BillTo invoice={inv} t={t} />
        <div />
      </div>
      <EventBox invoice={inv} t={t} />
      <ItemsTable invoice={inv} t={t} />
      <TotalsBox invoice={inv} gstType={gstType} t={t} />
      <NotesFooter invoice={inv} t={t} />
    </div>
  );
}

// ─── TEMPLATE 2: Modern ──────────────────────────────────────────────────────
function TemplateModern({ inv, t, font, logo, gstType, company }) {
  return (
    <div style={{ fontFamily: font+',sans-serif', background:'#fff', display:'flex', minHeight:600 }}>
      {/* Left accent bar */}
      <div style={{ width:8, background:`linear-gradient(180deg,${t.p},${t.a})`, flexShrink:0, borderRadius:'4px 0 0 4px' }} />
      <div style={{ flex:1, padding:28 }}>
        {/* Top */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
          <div>
            <div style={{ fontSize:28, fontWeight:800, color:t.p, letterSpacing:'-1px' }}>INVOICE</div>
            <div style={{ fontSize:11, color:'#aaa', letterSpacing:'2px', textTransform:'uppercase' }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          </div>
          <CompanyHeader logo={logo} company={company} t={t} align="right" />
        </div>
        {/* Meta */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24, background:t.bg, borderRadius:8, padding:16 }}>
          <div><div style={{ fontSize:10, textTransform:'uppercase', color:'#aaa', letterSpacing:'1px' }}>Issue Date</div><div style={{ fontWeight:600, color:t.text }}>{fmtDate(inv.invoice_date)}</div></div>
          {inv.due_date && <div><div style={{ fontSize:10, textTransform:'uppercase', color:'#aaa', letterSpacing:'1px' }}>Due Date</div><div style={{ fontWeight:600, color:t.text }}>{fmtDate(inv.due_date)}</div></div>}
          {inv.payment_status && <div><div style={{ fontSize:10, textTransform:'uppercase', color:'#aaa', letterSpacing:'1px' }}>Status</div><div style={{ fontWeight:700, color: inv.payment_status==='paid'?'#16a34a':inv.payment_status==='partial'?'#ca8a04':'#dc2626', textTransform:'uppercase' }}>{inv.payment_status}</div></div>}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:20 }}>
          <BillTo invoice={inv} t={t} />
          <EventBox invoice={inv} t={t} />
        </div>
        <ItemsTable invoice={inv} t={t} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 3: Executive ───────────────────────────────────────────────────
function TemplateExecutive({ inv, t, font, logo, gstType, company }) {
  return (
    <div style={{ fontFamily: font+',sans-serif', background:'#fff' }}>
      {/* Dark header */}
      <div style={{ background:t.p, padding:'24px 32px', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            {logo && <img src={logo} alt="logo" style={{ height:44, marginBottom:6, objectFit:'contain', filter:'brightness(0) invert(1)' }} />}
            <div style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.5px' }}>{company.name}</div>
            {company.tagline && <div style={{ fontSize:11, color:t.a, letterSpacing:'2px', textTransform:'uppercase' }}>{company.tagline}</div>}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:13, opacity:0.7, textTransform:'uppercase', letterSpacing:'2px' }}>Invoice</div>
            <div style={{ fontSize:26, fontWeight:800, color:t.a }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
            <div style={{ fontSize:12, opacity:0.8 }}>Date: {fmtDate(inv.invoice_date)}</div>
          </div>
        </div>
      </div>
      {/* Accent bar */}
      <div style={{ height:4, background:`linear-gradient(90deg,${t.a},${t.p})` }} />
      {/* Body */}
      <div style={{ padding:'24px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:20 }}>
          <BillTo invoice={inv} t={t} />
          <div>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1.5px', color:'#999', marginBottom:6 }}>From</div>
            <div style={{ fontSize:12, color:'#555', lineHeight:1.7 }}>
              {company.address && <div>{company.address}</div>}
              {company.phone   && <div>Phone: {company.phone}</div>}
              {company.email   && <div>Email: {company.email}</div>}
              {company.gstin   && <div>GSTIN: {company.gstin}</div>}
            </div>
          </div>
        </div>
        <EventBox invoice={inv} t={t} />
        <ItemsTable invoice={inv} t={t} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        {inv.due_date && <div style={{ marginTop:12, padding:'8px 14px', background:t.bg, borderRadius:6, fontSize:12 }}>Due Date: <strong>{fmtDate(inv.due_date)}</strong>{inv.payment_status && <span style={{ marginLeft:12, fontWeight:700, color: inv.payment_status==='paid'?'#16a34a':'#dc2626', textTransform:'uppercase' }}>{inv.payment_status}</span>}</div>}
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 4: Minimal ─────────────────────────────────────────────────────
function TemplateMinimal({ inv, t, font, logo, gstType, company }) {
  return (
    <div style={{ fontFamily: font+',sans-serif', background:'#fff', padding:32, border:`1px solid #e5e7eb`, borderRadius:4 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
        <div>
          {logo && <img src={logo} alt="logo" style={{ height:44, marginBottom:8, objectFit:'contain' }} />}
          <div style={{ fontSize:20, fontWeight:700, color:'#111' }}>{company.name}</div>
          <div style={{ fontSize:12, color:'#888', lineHeight:1.7, marginTop:4 }}>
            {company.address && <div>{company.address}</div>}
            {company.phone   && <div>{company.phone}</div>}
            {company.email   && <div>{company.email}</div>}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:30, fontWeight:200, color:'#111', letterSpacing:'-1px', textTransform:'uppercase' }}>Invoice</div>
          <div style={{ fontSize:14, color:'#666', marginTop:4 }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:12, color:'#999', marginTop:4 }}>{fmtDate(inv.invoice_date)}</div>
        </div>
      </div>
      <div style={{ borderTop:'2px solid #111', borderBottom:'1px solid #e5e7eb', padding:'16px 0', marginBottom:20 }}>
        <BillTo invoice={inv} t={{ p:'#111', a:'#333', bg:'#f9fafb', light:'#f3f4f6', text:'#111' }} />
      </div>
      <EventBox invoice={inv} t={{ p:'#111', a:'#333', bg:'#f9fafb', light:'#f3f4f6', text:'#111' }} />
      <ItemsTable invoice={inv} t={{ p:'#111', a:'#333', bg:'#f9fafb', light:'#f3f4f6', text:'#111' }} />
      <TotalsBox invoice={inv} gstType={gstType} t={{ p:'#111', a:'#333', bg:'#f9fafb', light:'#f3f4f6', text:'#111' }} />
      <NotesFooter invoice={inv} t={{ p:'#111', a:'#333', bg:'#f9fafb', light:'#f3f4f6', text:'#111' }} />
    </div>
  );
}

// ─── TEMPLATE 5: Bold ────────────────────────────────────────────────────────
function TemplateBold({ inv, t, font, logo, gstType, company }) {
  return (
    <div style={{ fontFamily: font+',sans-serif', background:'#fff' }}>
      <div style={{ background:`linear-gradient(135deg,${t.p} 0%,${t.a} 100%)`, padding:'28px 32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            {logo && <img src={logo} alt="logo" style={{ height:48, marginBottom:6, objectFit:'contain', filter:'brightness(0) invert(1)' }} />}
            <div style={{ fontSize:24, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', textTransform:'uppercase' }}>{company.name}</div>
            {company.tagline && <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', letterSpacing:'2px', marginTop:2 }}>{company.tagline}</div>}
          </div>
          <div style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(4px)', borderRadius:12, padding:'16px 22px', textAlign:'center' }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'2px', color:'rgba(255,255,255,0.75)' }}>Invoice</div>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', marginTop:2 }}>{fmtDate(inv.invoice_date)}</div>
          </div>
        </div>
      </div>
      <div style={{ padding:'24px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:20 }}>
          <BillTo invoice={inv} t={t} />
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'#999', marginBottom:6 }}>Company Details</div>
            <div style={{ fontSize:12, color:'#555', lineHeight:1.7 }}>
              {company.address && <div>{company.address}</div>}
              {company.phone   && <div>{company.phone}</div>}
              {company.email   && <div>{company.email}</div>}
              {company.gstin   && <div>GSTIN: {company.gstin}</div>}
            </div>
            {inv.payment_status && <div style={{ marginTop:10, display:'inline-block', padding:'4px 14px', borderRadius:20, fontWeight:700, fontSize:12, textTransform:'uppercase', background: inv.payment_status==='paid'?'#dcfce7':inv.payment_status==='partial'?'#fef9c3':'#fee2e2', color: inv.payment_status==='paid'?'#166534':inv.payment_status==='partial'?'#854d0e':'#991b1b' }}>{inv.payment_status}</div>}
          </div>
        </div>
        <EventBox invoice={inv} t={t} />
        <ItemsTable invoice={inv} t={t} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── Master renderer ─────────────────────────────────────────────────────────
const MAP = { classic:TemplateClassic, modern:TemplateModern, executive:TemplateExecutive, minimal:TemplateMinimal, bold:TemplateBold };

export function InvoicePreview({ invoice, template='classic', themeName='Gold & Maroon', font='Inter', logo='', gstType='sgst_cgst', company={} }) {
  const t   = THEMES[themeName] || THEMES['Gold & Maroon'];
  const Cmp = MAP[template]    || TemplateClassic;
  const co  = { name:'Shree Swami Samarth', tagline:'Food & Hospitality Services', address:'Vikhroli, Mumbai – 400083, Maharashtra', phone:'+91 98765 43210', email:'info@shreeswamisamarthfoods.com', gstin:'27XXXXX1234X1Z5', ...company };
  return <Cmp inv={invoice} t={t} font={font} logo={logo} gstType={gstType} company={co} />;
}
