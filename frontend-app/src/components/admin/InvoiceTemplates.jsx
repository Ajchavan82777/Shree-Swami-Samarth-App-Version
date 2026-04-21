import { fmt, fmtDate } from '../../utils/api';

// ─── FONTS (105 Google Fonts) ────────────────────────────────────────────────
export const FONTS = [
  // Original 25 – sans-serif modern + serif
  'Inter','Roboto','Open Sans','Lato','Montserrat','Raleway','Poppins','Nunito',
  'Work Sans','DM Sans','Source Sans 3','Barlow','Cabin','Karla','Mulish','Exo 2',
  'Oswald','Josefin Sans','Quicksand',
  'Playfair Display','Merriweather','Libre Baskerville','EB Garamond',
  'Cormorant Garamond','Crimson Text',
  // Extended sans-serif
  'Rubik','Ubuntu','Titillium Web','Fira Sans','Dosis','Oxygen','Hind',
  'PT Sans','PT Serif','Noto Sans','Noto Serif',
  'Roboto Slab','Roboto Condensed',
  'Space Grotesk','Space Mono',
  'Figtree','Outfit','Manrope','Sora','Plus Jakarta Sans','Be Vietnam Pro',
  'IBM Plex Sans','IBM Plex Serif','Lexend','Red Hat Display','Epilogue',
  'Hanken Grotesk','Nunito Sans','Jost','Kanit','Libre Franklin','Assistant',
  'Varela Round','Heebo',
  // Monospace / code
  'Fira Code','Inconsolata','Courier Prime','Source Code Pro','JetBrains Mono',
  // Serif extended
  'Cardo','Spectral','Alegreya','Alegreya Sans','Arvo','Bitter','Domine',
  'Frank Ruhl Libre','Zilla Slab',
  // Display / bold
  'Archivo','Archivo Black','Chivo','DM Serif Display','Fraunces','Gloock',
  'Bebas Neue','Righteous','Secular One','BioRhyme','Encode Sans','Exo',
  'Asap','Catamaran','Muli',
  // Handwriting / decorative
  'Pacifico','Satisfy','Dancing Script','Caveat','Kalam','Indie Flower',
  'Shadows Into Light','Amatic SC','Permanent Marker','Lobster','Comfortaa',
  'Fredoka One','Varela',
  // World / multilingual
  'Alata','Tajawal','Taviraj','Sarabun','Prompt',
  'Zen Kaku Gothic New','Nanum Gothic',
  // Futuristic / tech
  'Oxanium','Audiowide','Russo One','Orbitron',
];

// ─── THEMES (7 color themes) ─────────────────────────────────────────────────
export const THEMES = {
  'Gold & Maroon': { p:'#8B1A1A', a:'#C9A84C', bg:'#FDF8F0', light:'#FAF0D7', text:'#2C1810' },
  'Ocean Blue':    { p:'#1e3a8a', a:'#3b82f6', bg:'#eff6ff', light:'#dbeafe', text:'#1e3a8a' },
  'Forest Green':  { p:'#166534', a:'#16a34a', bg:'#f0fdf4', light:'#dcfce7', text:'#14532d' },
  'Royal Purple':  { p:'#6d28d9', a:'#8b5cf6', bg:'#f5f3ff', light:'#ede9fe', text:'#4c1d95' },
  'Sunset Orange': { p:'#c2410c', a:'#f97316', bg:'#fff7ed', light:'#fed7aa', text:'#7c2d12' },
  'Slate Gray':    { p:'#1e293b', a:'#475569', bg:'#f8fafc', light:'#e2e8f0', text:'#0f172a' },
  'Rose Pink':     { p:'#9d174d', a:'#ec4899', bg:'#fdf2f8', light:'#fce7f3', text:'#831843' },
};

// ─── TEMPLATES (52 entries) ──────────────────────────────────────────────────
export const TEMPLATES = [
  // classic base (3)
  { id:'t01', name:'Classic Standard',   icon:'📜', base:'classic',   v:1, desc:'Traditional gold border, timeless layout' },
  { id:'t02', name:'Classic Bold',       icon:'📜', base:'classic',   v:2, desc:'Bolder borders and larger invoice number' },
  { id:'t03', name:'Classic Wide',       icon:'📜', base:'classic',   v:3, desc:'Full-bleed colored header bar variant' },
  // modern base (3)
  { id:'t04', name:'Modern Clean',       icon:'💼', base:'modern',    v:1, desc:'Left accent bar, clean split layout' },
  { id:'t05', name:'Modern Grid',        icon:'💼', base:'modern',    v:2, desc:'Wider sidebar, expanded meta grid' },
  { id:'t06', name:'Modern Compact',     icon:'💼', base:'modern',    v:3, desc:'Tighter spacing, condensed modern look' },
  // executive base (3)
  { id:'t07', name:'Executive Dark',     icon:'🎩', base:'executive', v:1, desc:'Dark solid header, gold accent line' },
  { id:'t08', name:'Executive Slate',    icon:'🎩', base:'executive', v:2, desc:'Deep slate header variant' },
  { id:'t09', name:'Executive Accent',   icon:'🎩', base:'executive', v:3, desc:'Thick colored accent bar below header' },
  // minimal base (3)
  { id:'t10', name:'Minimal Light',      icon:'⬜', base:'minimal',   v:1, desc:'Ultra-clean double border, plain type' },
  { id:'t11', name:'Minimal Lined',      icon:'⬜', base:'minimal',   v:2, desc:'Thin ruled lines separating sections' },
  { id:'t12', name:'Minimal Accent',     icon:'⬜', base:'minimal',   v:3, desc:'Single color accent underline variant' },
  // bold base (3)
  { id:'t13', name:'Bold Gradient',      icon:'⚡', base:'bold',      v:1, desc:'Full gradient header, frosted invoice box' },
  { id:'t14', name:'Bold Impact',        icon:'⚡', base:'bold',      v:2, desc:'High-impact diagonal gradient' },
  { id:'t15', name:'Bold Vivid',         icon:'⚡', base:'bold',      v:3, desc:'Vibrant saturated color header' },
  // corporate base (3)
  { id:'t16', name:'Corporate Banner',   icon:'🏢', base:'corporate', v:1, desc:'Logo + colored banner with invoice metadata' },
  { id:'t17', name:'Corporate Pro',      icon:'🏢', base:'corporate', v:2, desc:'Four-column banner, two-column body' },
  { id:'t18', name:'Corporate Classic',  icon:'🏢', base:'corporate', v:3, desc:'Conservative single-column letterhead' },
  // elegant base (3)
  { id:'t19', name:'Elegant Centered',   icon:'🌸', base:'elegant',   v:1, desc:'Centered letterhead, thin decorative lines' },
  { id:'t20', name:'Elegant Script',     icon:'🌸', base:'elegant',   v:2, desc:'Double ornamental dividers, premium spacing' },
  { id:'t21', name:'Elegant Formal',     icon:'🌸', base:'elegant',   v:3, desc:'Bold centered serif heading variant' },
  // retro base (3)
  { id:'t22', name:'Retro Classic',      icon:'🗞️', base:'retro',    v:1, desc:'Double outer border, vintage newspaper feel' },
  { id:'t23', name:'Retro Heavy',        icon:'🗞️', base:'retro',    v:2, desc:'Extra heavy borders and dividers' },
  { id:'t24', name:'Retro Typewriter',   icon:'🗞️', base:'retro',    v:3, desc:'All-caps typewriter-style layout' },
  // tech base (3)
  { id:'t25', name:'Tech Dark Sidebar',  icon:'💻', base:'tech',      v:1, desc:'Dark sidebar with white company info' },
  { id:'t26', name:'Tech Neon',          icon:'💻', base:'tech',      v:2, desc:'Darker sidebar with neon accent' },
  { id:'t27', name:'Tech Terminal',      icon:'💻', base:'tech',      v:3, desc:'Terminal-inspired monospace style' },
  // luxury base (3)
  { id:'t28', name:'Luxury Gold',        icon:'👑', base:'luxury',    v:1, desc:'Large centered name, gold rules, premium' },
  { id:'t29', name:'Luxury Ornate',      icon:'👑', base:'luxury',    v:2, desc:'Double gold rules with ornate spacing' },
  { id:'t30', name:'Luxury Royal',       icon:'👑', base:'luxury',    v:3, desc:'Royal large heading variant' },
  // simple base (3)
  { id:'t31', name:'Simple List',        icon:'📋', base:'simple',    v:1, desc:'No colors, clean text and thin gray borders' },
  { id:'t32', name:'Simple Clean',       icon:'📋', base:'simple',    v:2, desc:'Wider line spacing, even simpler look' },
  { id:'t33', name:'Simple Accent',      icon:'📋', base:'simple',    v:3, desc:'Simple with a single theme color accent' },
  // creative base (3)
  { id:'t34', name:'Creative Diagonal',  icon:'🎨', base:'creative',  v:1, desc:'Diagonal corner accent, modern card layout' },
  { id:'t35', name:'Creative Vivid',     icon:'🎨', base:'creative',  v:2, desc:'Larger triangle cut, floating header card' },
  { id:'t36', name:'Creative Pop',       icon:'🎨', base:'creative',  v:3, desc:'Bold color pop with creative typography' },
  // statement base (3)
  { id:'t37', name:'Statement Bank',     icon:'🏦', base:'statement', v:1, desc:'Bank-statement style with running balance' },
  { id:'t38', name:'Statement Detail',   icon:'🏦', base:'statement', v:2, desc:'Detailed tabular ledger with date column' },
  { id:'t39', name:'Statement Summary',  icon:'🏦', base:'statement', v:3, desc:'Summary statement with gray header bar' },
  // premium base (3)
  { id:'t40', name:'Premium Watermark',  icon:'💎', base:'premium',   v:1, desc:'Faded watermark initial, boxed header' },
  { id:'t41', name:'Premium Emboss',     icon:'💎', base:'premium',   v:2, desc:'Embossed watermark with shadow border' },
  { id:'t42', name:'Premium Foil',       icon:'💎', base:'premium',   v:3, desc:'Square-corner metallic style header' },
  // official base (3)
  { id:'t43', name:'Official Formal',    icon:'🏛️', base:'official',  v:1, desc:'Government-style double border, TAX INVOICE' },
  { id:'t44', name:'Official Stamp',     icon:'🏛️', base:'official',  v:2, desc:'Formal with recipient notice line' },
  { id:'t45', name:'Official Legal',     icon:'🏛️', base:'official',  v:3, desc:'Legal format with signature lines' },
  // compact base (3)
  { id:'t46', name:'Compact Dense',      icon:'📄', base:'compact',   v:1, desc:'Dense 11px layout, fits one A4 page' },
  { id:'t47', name:'Compact Mini',       icon:'📄', base:'compact',   v:2, desc:'10px font for very long item lists' },
  { id:'t48', name:'Compact Quick',      icon:'📄', base:'compact',   v:3, desc:'Quick receipt-style compact format' },
  // stripe base (3)
  { id:'t49', name:'Stripe Vibrant',     icon:'🌈', base:'stripe',    v:1, desc:'Alternating full-row stripes, vibrant colors' },
  { id:'t50', name:'Stripe Soft',        icon:'🌈', base:'stripe',    v:2, desc:'Soft pastel alternating stripes' },
  { id:'t51', name:'Stripe Bold',        icon:'🌈', base:'stripe',    v:3, desc:'Bold wide alternating stripes, high contrast' },
  // 52nd entry – classic extra
  { id:'t52', name:'Classic Premium',    icon:'📜', base:'classic',   v:2, desc:'Premium variant of the classic layout' },
];

// ─── GST TYPES ───────────────────────────────────────────────────────────────
export const GST_TYPES = [
  { value:'sgst_cgst', label:'SGST + CGST' },
  { value:'igst',      label:'IGST' },
  { value:'vat',       label:'VAT' },
  { value:'custom',    label:'Custom Tax %' },
  { value:'none',      label:'No Tax' },
];

// ─── GST LINES HELPER ────────────────────────────────────────────────────────
export function gstLines(taxAmount, taxRate, gstType) {
  const r = parseFloat(taxRate) || 0;
  const a = parseFloat(taxAmount) || 0;
  if (gstType === 'sgst_cgst') return [
    { label:`SGST @${(r/2).toFixed(1)}%`, amount: a/2 },
    { label:`CGST @${(r/2).toFixed(1)}%`, amount: a/2 },
  ];
  if (gstType === 'igst')  return [{ label:`IGST @${r}%`, amount: a }];
  if (gstType === 'vat')   return [{ label:`VAT @${r}%`,  amount: a }];
  if (gstType === 'none')  return [];
  return [{ label:`Tax @${r}%`, amount: a }];
}

// ─── SHARED SUB-COMPONENTS ───────────────────────────────────────────────────
function CompanyHeader({ logo, company, t, align='left' }) {
  const imgStyle = align === 'right'
    ? { marginLeft:'auto' }
    : align === 'center'
    ? { margin:'0 auto 8px' }
    : {};
  return (
    <div style={{ textAlign:align }}>
      {logo && (
        <img src={logo} alt="logo"
          style={{ height:52, marginBottom:8, objectFit:'contain', display:'block', ...imgStyle }} />
      )}
      <div style={{ fontWeight:700, fontSize:20, color:t.p }}>{company.name}</div>
      {company.tagline && (
        <div style={{ fontSize:11, color:t.a, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:6 }}>
          {company.tagline}
        </div>
      )}
      <div style={{ fontSize:12, color:'#555', lineHeight:1.7 }}>
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
  ].filter(([, v]) => v);
  if (!items.length) return null;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:`repeat(${items.length},1fr)`, gap:12,
      background:t.light, borderRadius:8, padding:'10px 14px', marginBottom:18,
      WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
    }}>
      {items.map(([l, v]) => (
        <div key={l}>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'#999' }}>{l}</div>
          <div style={{ fontSize:13, fontWeight:500, color:t.text }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ItemsTable – print-safe: background applied to BOTH <tr> and <th>
function ItemsTable({ invoice, t, fontSize=13, compact=false }) {
  const hPad   = compact ? '6px 10px'  : '9px 12px';
  const bPad   = compact ? '7px 10px'  : '10px 12px';
  const hFs    = compact ? 10 : 11;
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:12, fontSize }}>
      <thead>
        <tr style={{
          background:t.p,
          WebkitPrintColorAdjust:'exact',
          printColorAdjust:'exact',
        }}>
          {['Description','Qty','Rate','Amount'].map((h, i) => (
            <th key={h} style={{
              background:t.p,
              WebkitPrintColorAdjust:'exact',
              printColorAdjust:'exact',
              color:'#fff',
              padding:hPad,
              textAlign:i===0?'left':'right',
              fontSize:hFs,
              textTransform:'uppercase',
              letterSpacing:'0.8px',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(invoice.items||[]).map((item, i) => (
          <tr key={i} style={{ borderBottom:`1px solid ${t.light}`, background:i%2===0?'#fff':t.bg, pageBreakInside:'avoid', breakInside:'avoid' }}>
            <td style={{ padding:bPad }}>{item.description}</td>
            <td style={{ padding:bPad, textAlign:'right', color:'#666' }}>{item.qty}</td>
            <td style={{ padding:bPad, textAlign:'right', color:'#666' }}>{fmt(item.rate)}</td>
            <td style={{ padding:bPad, textAlign:'right', fontWeight:600 }}>{fmt(item.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TotalsBox({ invoice, gstType, t, fontSize=13 }) {
  const taxes  = gstLines(invoice.tax_amount, invoice.tax_rate, gstType);
  const hasTax = taxes.length > 0;
  return (
    <div style={{ display:'flex', justifyContent:'flex-end' }}>
      <div style={{ width:260 }}>
        {[
          { l:'Subtotal', v:fmt(invoice.subtotal) },
          parseFloat(invoice.discount) > 0 && { l:'Discount', v:`- ${fmt(invoice.discount)}` },
          ...(hasTax ? taxes.map(tx => ({ l:tx.label, v:fmt(tx.amount) })) : []),
        ].filter(Boolean).map(row => (
          <div key={row.l} style={{
            display:'flex', justifyContent:'space-between',
            padding:'5px 0', fontSize,
            borderBottom:`1px solid ${t.light}`, color:'#666',
          }}>
            <span>{row.l}</span><span>{row.v}</span>
          </div>
        ))}
        <div style={{
          display:'flex', justifyContent:'space-between',
          padding:'10px 0', fontSize:fontSize+3, fontWeight:700,
          borderBottom:`2px solid ${t.a}`, color:t.p,
        }}>
          <span>Grand Total</span><span>{fmt(invoice.grand_total)}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize }}>
          <span style={{ color:'#666' }}>Advance Paid</span>
          <span style={{ color:'#16a34a', fontWeight:600 }}>{fmt(invoice.advance_paid)}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', fontSize:fontSize+1, fontWeight:700 }}>
          <span>Balance Due</span>
          <span style={{ color:parseFloat(invoice.balance_due)>0?'#dc2626':'#16a34a' }}>
            {fmt(invoice.balance_due)}
          </span>
        </div>
      </div>
    </div>
  );
}

function NotesFooter({ invoice, t, footerText }) {
  return (
    <>
      {invoice.notes && (
        <div style={{
          marginTop:16, padding:'10px 14px',
          background:t.light, borderRadius:6, borderLeft:`3px solid ${t.a}`,
          WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
        }}>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'#999', marginBottom:4 }}>
            Terms &amp; Notes
          </div>
          <div style={{ fontSize:12, color:'#555' }}>{invoice.notes}</div>
        </div>
      )}
      <div style={{ marginTop:24, paddingTop:12, borderTop:`1px solid ${t.light}`, textAlign:'center', fontSize:11, color:'#aaa' }}>
        {footerText || 'Thank you for choosing Shree Swami Samarth Food & Hospitality Services!'}
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  if (!status) return null;
  const map = {
    paid:    { bg:'#dcfce7', color:'#166534' },
    partial: { bg:'#fef9c3', color:'#854d0e' },
  };
  const c = map[status] || { bg:'#fee2e2', color:'#991b1b' };
  return (
    <span style={{
      display:'inline-block', background:c.bg, color:c.color,
      padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, textTransform:'uppercase',
    }}>{status}</span>
  );
}

// ─── TEMPLATE 1: Classic ─────────────────────────────────────────────────────
function TemplateClassic({ inv, t, font, logo, gstType, company, v=1 }) {
  const borderW = v===2 ? 5 : 3;
  const isWide  = v===3;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff' }}>
      {/* Header */}
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'flex-start',
        marginBottom:0, padding: isWide ? '22px 32px' : '28px 32px 20px',
        background: isWide ? t.p : '#fff',
        borderBottom: isWide ? 'none' : `${borderW}px solid ${t.a}`,
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
      }}>
        <div>
          {logo && (
            <img src={logo} alt="logo" style={{
              height:52, marginBottom:8, objectFit:'contain',
              filter: isWide ? 'brightness(0) invert(1)' : 'none',
            }} />
          )}
          <div style={{ fontWeight:700, fontSize:20, color: isWide ? '#fff' : t.p }}>{company.name}</div>
          {company.tagline && (
            <div style={{ fontSize:11, color:t.a, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:6 }}>
              {company.tagline}
            </div>
          )}
          <div style={{ fontSize:12, color: isWide ? 'rgba(255,255,255,0.85)' : '#555', lineHeight:1.7 }}>
            {company.address && <div>{company.address}</div>}
            {company.phone   && <div>Phone: {company.phone}</div>}
            {company.email   && <div>Email: {company.email}</div>}
            {company.gstin   && <div>GSTIN: {company.gstin}</div>}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{
            background: isWide ? 'rgba(255,255,255,0.15)' : t.bg,
            border:`1px solid ${isWide ? 'rgba(255,255,255,0.3)' : t.light}`,
            borderRadius:10, padding:'10px 18px', marginBottom:10,
          }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color: isWide ? 'rgba(255,255,255,0.7)' : '#999' }}>Invoice No.</div>
            <div style={{ fontSize: v===2 ? 24 : 20, fontWeight:700, color: isWide ? '#fff' : t.p }}>
              {inv.invoice_number || 'SSS-INV-XXXX'}
            </div>
          </div>
          <div style={{ fontSize:12, color: isWide ? 'rgba(255,255,255,0.8)' : '#666' }}>Date: {fmtDate(inv.invoice_date)}</div>
          {inv.due_date && <div style={{ fontSize:12, color: isWide ? 'rgba(255,255,255,0.8)' : '#666' }}>Due: {fmtDate(inv.due_date)}</div>}
          <div style={{ marginTop:6 }}><StatusBadge status={inv.payment_status} /></div>
        </div>
      </div>
      {isWide && <div style={{ height:4, background:`linear-gradient(90deg,${t.a},${t.p})`, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }} />}
      {/* Body */}
      <div style={{ padding:'24px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:20 }}>
          <BillTo invoice={inv} t={t} />
          <div />
        </div>
        <EventBox invoice={inv} t={t} />
        <ItemsTable invoice={inv} t={t} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 2: Modern ──────────────────────────────────────────────────────
function TemplateModern({ inv, t, font, logo, gstType, company, v=1 }) {
  const barW   = v===1 ? 8 : v===2 ? 14 : 5;
  const cols   = v===2 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr';
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', display:'flex', minHeight:600 }}>
      <div style={{
        width:barW, background:`linear-gradient(180deg,${t.p},${t.a})`,
        flexShrink:0, borderRadius:'4px 0 0 4px',
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
      }} />
      <div style={{ flex:1, padding: v===3 ? 20 : 28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: v===3 ? 18 : 28 }}>
          <div>
            <div style={{ fontSize: v===2 ? 32 : 28, fontWeight:800, color:t.p, letterSpacing:'-1px' }}>INVOICE</div>
            <div style={{ fontSize:11, color:'#aaa', letterSpacing:'2px', textTransform:'uppercase' }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          </div>
          <CompanyHeader logo={logo} company={company} t={t} align="right" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:cols, gap:16, marginBottom:24, background:t.bg, borderRadius:8, padding:16, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
          <div>
            <div style={{ fontSize:10, textTransform:'uppercase', color:'#aaa', letterSpacing:'1px' }}>Issue Date</div>
            <div style={{ fontWeight:600, color:t.text }}>{fmtDate(inv.invoice_date)}</div>
          </div>
          {inv.due_date && (
            <div>
              <div style={{ fontSize:10, textTransform:'uppercase', color:'#aaa', letterSpacing:'1px' }}>Due Date</div>
              <div style={{ fontWeight:600, color:t.text }}>{fmtDate(inv.due_date)}</div>
            </div>
          )}
          {inv.payment_status && (
            <div>
              <div style={{ fontSize:10, textTransform:'uppercase', color:'#aaa', letterSpacing:'1px' }}>Status</div>
              <div style={{ fontWeight:700, textTransform:'uppercase', color: inv.payment_status==='paid'?'#16a34a':inv.payment_status==='partial'?'#ca8a04':'#dc2626' }}>
                {inv.payment_status}
              </div>
            </div>
          )}
          {v===2 && company.gstin && (
            <div>
              <div style={{ fontSize:10, textTransform:'uppercase', color:'#aaa', letterSpacing:'1px' }}>GSTIN</div>
              <div style={{ fontWeight:600, color:t.text, fontSize:11 }}>{company.gstin}</div>
            </div>
          )}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:20 }}>
          <BillTo invoice={inv} t={t} />
          <EventBox invoice={inv} t={t} />
        </div>
        <ItemsTable invoice={inv} t={t} compact={v===3} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 3: Executive ───────────────────────────────────────────────────
function TemplateExecutive({ inv, t, font, logo, gstType, company, v=1 }) {
  const hBg    = v===2 ? '#1e293b' : t.p;
  const accentH = v===3 ? 6 : 4;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff' }}>
      <div style={{
        background:hBg, padding:'24px 32px', color:'#fff',
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
      }}>
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
      <div style={{ height:accentH, background:`linear-gradient(90deg,${t.a},${t.p})`, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }} />
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
        {inv.due_date && (
          <div style={{ marginTop:12, padding:'8px 14px', background:t.bg, borderRadius:6, fontSize:12, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
            Due Date: <strong>{fmtDate(inv.due_date)}</strong>
            {inv.payment_status && (
              <span style={{ marginLeft:12, fontWeight:700, textTransform:'uppercase', color: inv.payment_status==='paid'?'#16a34a':'#dc2626' }}>
                {inv.payment_status}
              </span>
            )}
          </div>
        )}
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 4: Minimal ─────────────────────────────────────────────────────
function TemplateMinimal({ inv, t, font, logo, gstType, company, v=1 }) {
  const mt     = { p:'#111', a: v===3 ? t.a : '#333', bg:'#f9fafb', light:'#f3f4f6', text:'#111' };
  const border = v===2 ? 'none' : '1px solid #e5e7eb';
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding:32, border, borderRadius:4 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: v===2 ? 24 : 32 }}>
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
          <div style={{ fontSize:30, fontWeight: v===3?700:200, color:'#111', letterSpacing:'-1px', textTransform:'uppercase' }}>Invoice</div>
          <div style={{ fontSize:14, color:'#666', marginTop:4 }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:12, color:'#999', marginTop:4 }}>{fmtDate(inv.invoice_date)}</div>
        </div>
      </div>
      <div style={{ borderTop: v===3 ? `3px solid ${t.a}` : '2px solid #111', borderBottom:'1px solid #e5e7eb', padding:'16px 0', marginBottom:20 }}>
        <BillTo invoice={inv} t={mt} />
      </div>
      <EventBox invoice={inv} t={mt} />
      <ItemsTable invoice={inv} t={mt} />
      <TotalsBox invoice={inv} gstType={gstType} t={mt} />
      <NotesFooter invoice={inv} t={mt} />
    </div>
  );
}

// ─── TEMPLATE 5: Bold ────────────────────────────────────────────────────────
function TemplateBold({ inv, t, font, logo, gstType, company, v=1 }) {
  const angle = v===1 ? '135deg' : v===2 ? '160deg' : '120deg';
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff' }}>
      <div style={{
        background:`linear-gradient(${angle},${t.p} 0%,${t.a} 100%)`,
        padding:'28px 32px',
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            {logo && <img src={logo} alt="logo" style={{ height:48, marginBottom:6, objectFit:'contain', filter:'brightness(0) invert(1)' }} />}
            <div style={{ fontSize: v===3?28:24, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', textTransform:'uppercase' }}>{company.name}</div>
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
            <div style={{ marginTop:10 }}><StatusBadge status={inv.payment_status} /></div>
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

// ─── TEMPLATE 6: Corporate ───────────────────────────────────────────────────
function TemplateCorporate({ inv, t, font, logo, gstType, company, v=1 }) {
  const bannerCols = v===2 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr';
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff' }}>
      {/* Logo + company row */}
      <div style={{ display:'flex', alignItems:'center', padding:'20px 32px', borderBottom:`1px solid #e5e7eb` }}>
        {logo
          ? <img src={logo} alt="logo" style={{ height:60, objectFit:'contain', marginRight:20 }} />
          : (
            <div style={{
              width:60, height:60, background:t.p, borderRadius:8, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:900, fontSize:24, marginRight:20,
              WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
            }}>{company.name.charAt(0)}</div>
          )
        }
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:t.p, letterSpacing:'-0.5px' }}>{company.name}</div>
          {company.tagline && <div style={{ fontSize:11, color:t.a, letterSpacing:'1.5px', textTransform:'uppercase' }}>{company.tagline}</div>}
        </div>
      </div>
      {/* Colored banner */}
      <div style={{
        background:t.p, padding:'14px 32px',
        display:'grid', gridTemplateColumns:bannerCols, gap:16,
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
      }}>
        <div>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'rgba(255,255,255,0.65)' }}>Invoice No.</div>
          <div style={{ fontWeight:700, fontSize:15, color:'#fff' }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
        </div>
        <div>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'rgba(255,255,255,0.65)' }}>Invoice Date</div>
          <div style={{ fontWeight:600, fontSize:14, color:'#fff' }}>{fmtDate(inv.invoice_date)}</div>
        </div>
        {inv.due_date && (
          <div>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'rgba(255,255,255,0.65)' }}>Due Date</div>
            <div style={{ fontWeight:600, fontSize:14, color:'#fff' }}>{fmtDate(inv.due_date)}</div>
          </div>
        )}
        {v===2 && (
          <div>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1px', color:'rgba(255,255,255,0.65)' }}>Status</div>
            <div style={{ fontWeight:700, fontSize:13, textTransform:'uppercase', color: inv.payment_status==='paid'?'#86efac':'#fde68a' }}>
              {inv.payment_status || '—'}
            </div>
          </div>
        )}
      </div>
      {/* Accent line */}
      <div style={{ height:3, background:t.a, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }} />
      {/* Body */}
      <div style={{ display:'grid', gridTemplateColumns: v===3 ? '1fr' : '2fr 1fr' }}>
        <div style={{ padding:'24px 32px', borderRight: v===3 ? 'none' : `1px solid #e5e7eb` }}>
          <BillTo invoice={inv} t={t} />
          <div style={{ marginTop:20 }}><EventBox invoice={inv} t={t} /></div>
          <ItemsTable invoice={inv} t={t} />
        </div>
        {v!==3 && (
          <div style={{ padding:'24px', background:t.bg, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:t.p, marginBottom:12 }}>Company Info</div>
            <div style={{ fontSize:12, color:'#555', lineHeight:2 }}>
              {company.address && <div>{company.address}</div>}
              {company.phone   && <div>Ph: {company.phone}</div>}
              {company.email   && <div>{company.email}</div>}
              {company.gstin   && <div style={{ marginTop:8, fontWeight:600 }}>GSTIN: {company.gstin}</div>}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:'0 32px 24px' }}>
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 7: Elegant ─────────────────────────────────────────────────────
function TemplateElegant({ inv, t, font, logo, gstType, company, v=1 }) {
  const ruleStyle = {
    border:'none',
    borderTop: v===2 ? `2px solid ${t.a}` : `1px solid ${t.a}`,
    margin:'10px 0',
  };
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding:40 }}>
      {/* Centered letterhead */}
      <div style={{ textAlign:'center', marginBottom:28 }}>
        {logo && (
          <img src={logo} alt="logo" style={{ height:56, objectFit:'contain', display:'block', margin:'0 auto 10px' }} />
        )}
        <hr style={ruleStyle} />
        <div style={{ fontSize: v===3?28:24, fontWeight: v===3?800:700, color:t.p, letterSpacing: v===1?'1px':'2px', margin:'10px 0 4px' }}>
          {company.name}
        </div>
        {company.tagline && (
          <div style={{ fontSize:11, color:t.a, letterSpacing:'3px', textTransform:'uppercase', marginBottom:6 }}>{company.tagline}</div>
        )}
        <div style={{ fontSize:12, color:'#666', lineHeight:1.9 }}>
          {company.address && <span>{company.address}&nbsp;|&nbsp;</span>}
          {company.phone   && <span>Ph: {company.phone}&nbsp;|&nbsp;</span>}
          {company.email   && <span>{company.email}</span>}
        </div>
        {company.gstin && <div style={{ fontSize:11, color:'#888', marginTop:4 }}>GSTIN: {company.gstin}</div>}
        <hr style={ruleStyle} />
      </div>
      {/* Meta row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <BillTo invoice={inv} t={t} />
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'2px', color:'#999' }}>Invoice</div>
          <div style={{ fontSize:22, fontWeight:700, color:t.p }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:12, color:'#666', marginTop:4 }}>{fmtDate(inv.invoice_date)}</div>
          {inv.due_date && <div style={{ fontSize:12, color:'#666' }}>Due: {fmtDate(inv.due_date)}</div>}
          <div style={{ marginTop:6 }}><StatusBadge status={inv.payment_status} /></div>
        </div>
      </div>
      <EventBox invoice={inv} t={t} />
      <ItemsTable invoice={inv} t={t} />
      <TotalsBox invoice={inv} gstType={gstType} t={t} />
      <NotesFooter invoice={inv} t={t} />
    </div>
  );
}

// ─── TEMPLATE 8: Retro ───────────────────────────────────────────────────────
function TemplateRetro({ inv, t, font, logo, gstType, company, v=1 }) {
  const outerB = v===2 ? `4px double ${t.p}` : `3px double ${t.p}`;
  const innerB = v===2 ? `2px solid ${t.a}` : `1px solid ${t.a}`;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding:12 }}>
      <div style={{ border:outerB, padding:16 }}>
        <div style={{ border:innerB, padding:20 }}>
          {/* Retro header */}
          <div style={{ textAlign:'center', borderBottom:`3px solid ${t.p}`, paddingBottom:16, marginBottom:16 }}>
            {logo && <img src={logo} alt="logo" style={{ height:44, objectFit:'contain', display:'block', margin:'0 auto 8px' }} />}
            <div style={{ fontSize: v===2?26:22, fontWeight:900, color:t.p, textTransform:'uppercase', letterSpacing:'4px' }}>{company.name}</div>
            {company.tagline && <div style={{ fontSize:10, color:'#777', letterSpacing:'3px', textTransform:'uppercase', marginTop:4 }}>{company.tagline}</div>}
            <div style={{ fontSize:11, color:'#666', marginTop:8, lineHeight:1.8 }}>
              {company.address && <span>{company.address}&nbsp;★&nbsp;</span>}
              {company.phone   && <span>{company.phone}&nbsp;★&nbsp;</span>}
              {company.email   && <span>{company.email}</span>}
            </div>
          </div>
          {/* Title bar */}
          <div style={{ textAlign:'center', margin:'16px 0', padding:'8px 0', borderTop:`2px solid ${t.a}`, borderBottom:`2px solid ${t.a}` }}>
            <span style={{ fontSize: v===3?18:16, fontWeight:900, letterSpacing:'6px', textTransform:'uppercase', color:t.p }}>TAX INVOICE</span>
            <span style={{ marginLeft:20, fontSize:13, color:'#666', textTransform:'uppercase', letterSpacing:'2px' }}>
              No. {inv.invoice_number || 'SSS-INV-XXXX'}
            </span>
          </div>
          {/* Two-column meta */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'2px', color:'#999', marginBottom:4 }}>BILLED TO</div>
              <div style={{ fontWeight:700, fontSize:14, color:t.p, textTransform:'uppercase' }}>{inv.customer_name}</div>
              {inv.company_name && <div style={{ fontSize:12, color:'#555', textTransform:'uppercase' }}>{inv.company_name}</div>}
              {inv.phone        && <div style={{ fontSize:12, color:'#777' }}>{inv.phone}</div>}
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'2px', color:'#999' }}>DATE: {fmtDate(inv.invoice_date)}</div>
              {inv.due_date && <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'2px', color:'#999', marginTop:4 }}>DUE: {fmtDate(inv.due_date)}</div>}
            </div>
          </div>
          <EventBox invoice={inv} t={t} />
          <ItemsTable invoice={inv} t={t} />
          <TotalsBox invoice={inv} gstType={gstType} t={t} />
          <NotesFooter invoice={inv} t={t} />
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE 9: Tech ────────────────────────────────────────────────────────
function TemplateTech({ inv, t, font, logo, gstType, company, v=1 }) {
  const sidebarBg   = v===2 ? '#0f172a' : '#1e293b';
  const accentColor = v===2 ? t.a : '#38bdf8';
  const bodyFont    = v===3 ? 'JetBrains Mono,Courier New,monospace' : font+',sans-serif';
  return (
    <div style={{ fontFamily:bodyFont, background:'#fff', display:'flex', minHeight:640 }}>
      {/* Dark left sidebar */}
      <div style={{
        width:190, background:sidebarBg, padding:'28px 18px',
        color:'#fff', flexShrink:0,
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
      }}>
        {logo
          ? <img src={logo} alt="logo" style={{ width:'100%', height:50, objectFit:'contain', marginBottom:18, filter:'brightness(0) invert(1)' }} />
          : (
            <div style={{
              width:50, height:50, background:accentColor, borderRadius:8,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:900, fontSize:24, color:'#fff', marginBottom:18,
              WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
            }}>{company.name.charAt(0)}</div>
          )
        }
        <div style={{ fontSize:13, fontWeight:700, lineHeight:1.3, marginBottom:4 }}>{company.name}</div>
        {company.tagline && (
          <div style={{ fontSize:9, color:accentColor, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:16 }}>{company.tagline}</div>
        )}
        <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.15)', margin:'14px 0' }} />
        <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:10 }}>Contact</div>
        {company.address && <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:6 }}>{company.address}</div>}
        {company.phone   && <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)', marginBottom:4 }}>{company.phone}</div>}
        {company.email   && <div style={{ fontSize:10, color:accentColor, marginBottom:4, wordBreak:'break-all' }}>{company.email}</div>}
        {company.gstin   && (
          <>
            <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.15)', margin:'14px 0' }} />
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>GSTIN</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.8)', wordBreak:'break-all' }}>{company.gstin}</div>
          </>
        )}
        <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.15)', margin:'14px 0' }} />
        <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>Invoice</div>
        <div style={{ fontSize:13, fontWeight:700, color:accentColor }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.65)', marginTop:4 }}>{fmtDate(inv.invoice_date)}</div>
        {inv.payment_status && (
          <div style={{
            marginTop:12, padding:'4px 8px', borderRadius:4, fontSize:10, fontWeight:700,
            textTransform:'uppercase', textAlign:'center',
            background: inv.payment_status==='paid'?'rgba(22,163,74,0.3)':'rgba(220,38,38,0.3)',
            color: inv.payment_status==='paid'?'#86efac':'#fca5a5',
            WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
          }}>{inv.payment_status}</div>
        )}
      </div>
      {/* Right content panel */}
      <div style={{ flex:1, padding:'28px 28px' }}>
        <div style={{ borderBottom:`2px solid ${accentColor}`, paddingBottom:16, marginBottom:20 }}>
          <div style={{ fontSize:26, fontWeight:800, color:sidebarBg, letterSpacing:'-1px' }}>TAX INVOICE</div>
        </div>
        <div style={{ marginBottom:20 }}>
          <BillTo invoice={inv} t={{ ...t, p:sidebarBg }} />
        </div>
        <EventBox invoice={inv} t={t} />
        <ItemsTable invoice={inv} t={{ ...t, p:sidebarBg }} />
        <TotalsBox invoice={inv} gstType={gstType} t={{ ...t, p:sidebarBg }} />
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 10: Luxury ─────────────────────────────────────────────────────
function TemplateLuxury({ inv, t, font, logo, gstType, company, v=1 }) {
  const rH = v===2 ? 2 : 1;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding:40 }}>
      {/* Ornate centered header */}
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, justifyContent:'center', marginBottom:10 }}>
          <div style={{ flex:1, height:rH, background:`linear-gradient(90deg,transparent,${t.a})` }} />
          {logo && <img src={logo} alt="logo" style={{ height:50, objectFit:'contain' }} />}
          <div style={{ flex:1, height:rH, background:`linear-gradient(90deg,${t.a},transparent)` }} />
        </div>
        <div style={{ fontSize: v===3?34:28, fontWeight:300, color:t.p, letterSpacing:'6px', textTransform:'uppercase', margin:'12px 0 4px' }}>
          {company.name}
        </div>
        {company.tagline && (
          <div style={{ fontSize:10, color:t.a, letterSpacing:'4px', textTransform:'uppercase', marginBottom:10 }}>{company.tagline}</div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:14, justifyContent:'center', marginBottom:8 }}>
          <div style={{ flex:1, height:rH, background:`linear-gradient(90deg,transparent,${t.a})` }} />
          <span style={{ fontSize:12, color:'#bbb' }}>✦</span>
          <div style={{ flex:1, height:rH, background:`linear-gradient(90deg,${t.a},transparent)` }} />
        </div>
        <div style={{ fontSize:11, color:'#777', lineHeight:2 }}>
          {company.address && <span>{company.address}&nbsp;\xB7&nbsp;</span>}
          {company.phone   && <span>{company.phone}&nbsp;\xB7&nbsp;</span>}
          {company.email   && <span>{company.email}</span>}
        </div>
        {company.gstin && <div style={{ fontSize:10, color:'#aaa', marginTop:4 }}>GSTIN: {company.gstin}</div>}
      </div>
      {/* Invoice meta row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'16px 0', borderTop:`1px solid ${t.light}`, borderBottom:`1px solid ${t.light}`, marginBottom:24 }}>
        <BillTo invoice={inv} t={t} />
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'3px', color:'#aaa' }}>Invoice</div>
          <div style={{ fontSize:24, fontWeight:600, color:t.p, letterSpacing:'-0.5px' }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:12, color:'#888', marginTop:4 }}>{fmtDate(inv.invoice_date)}</div>
          {inv.due_date && <div style={{ fontSize:12, color:'#888' }}>Due: {fmtDate(inv.due_date)}</div>}
          <div style={{ marginTop:6 }}><StatusBadge status={inv.payment_status} /></div>
        </div>
      </div>
      <EventBox invoice={inv} t={t} />
      <ItemsTable invoice={inv} t={t} />
      <TotalsBox invoice={inv} gstType={gstType} t={t} />
      <NotesFooter invoice={inv} t={t} />
    </div>
  );
}

// ─── TEMPLATE 11: Simple ─────────────────────────────────────────────────────
function TemplateSimple({ inv, t, font, logo, gstType, company, v=1 }) {
  const lh = v===2 ? 1.9 : 1.7;
  const mt = { p:'#111', a: v===3 ? t.a : '#333', bg:'#f9fafb', light:'#f3f4f6', text:'#111' };
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding:36, color:'#222' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          {logo && <img src={logo} alt="logo" style={{ height:44, objectFit:'contain', marginBottom:8 }} />}
          <div style={{ fontSize:18, fontWeight:700, color:'#111' }}>{company.name}</div>
          <div style={{ fontSize:12, color:'#666', lineHeight:lh, marginTop:4 }}>
            {company.address && <div>{company.address}</div>}
            {company.phone   && <div>{company.phone}</div>}
            {company.email   && <div>{company.email}</div>}
            {company.gstin   && <div>GSTIN: {company.gstin}</div>}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:18, fontWeight:700, color:'#111', textTransform:'uppercase', letterSpacing:'2px' }}>Invoice</div>
          <div style={{ fontSize:13, color:'#444', marginTop:6 }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:12, color:'#666', marginTop:4 }}>{fmtDate(inv.invoice_date)}</div>
          {inv.due_date && <div style={{ fontSize:12, color:'#666' }}>Due: {fmtDate(inv.due_date)}</div>}
        </div>
      </div>
      <div style={{ borderTop:`1px solid #d1d5db`, borderBottom:`1px solid #d1d5db`, padding:'14px 0', marginBottom:20 }}>
        <BillTo invoice={inv} t={mt} />
      </div>
      <EventBox invoice={inv} t={mt} />
      <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:12, fontSize:13 }}>
        <thead>
          <tr style={{ background: v===3 ? t.p : '#111', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
            {['Description','Qty','Rate','Amount'].map((h, i) => (
              <th key={h} style={{
                background: v===3 ? t.p : '#111',
                WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
                color:'#fff', padding:'8px 12px',
                textAlign:i===0?'left':'right', fontSize:11,
                textTransform:'uppercase', letterSpacing:'0.8px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(inv.items||[]).map((item, i) => (
            <tr key={i} style={{ borderBottom:'1px solid #e5e7eb' }}>
              <td style={{ padding:'9px 12px' }}>{item.description}</td>
              <td style={{ padding:'9px 12px', textAlign:'right', color:'#555' }}>{item.qty}</td>
              <td style={{ padding:'9px 12px', textAlign:'right', color:'#555' }}>{fmt(item.rate)}</td>
              <td style={{ padding:'9px 12px', textAlign:'right', fontWeight:600 }}>{fmt(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TotalsBox invoice={inv} gstType={gstType} t={mt} />
      <NotesFooter invoice={inv} t={mt} />
    </div>
  );
}

// ─── TEMPLATE 12: Creative ───────────────────────────────────────────────────
function TemplateCreative({ inv, t, font, logo, gstType, company, v=1 }) {
  const clipSize = v===1 ? 180 : v===2 ? 220 : 160;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', position:'relative', overflow:'hidden' }}>
      {/* Diagonal triangle accent */}
      <div style={{
        position:'absolute', top:0, left:0, width:0, height:0,
        borderStyle:'solid',
        borderWidth:`${clipSize}px ${clipSize}px 0 0`,
        borderColor:`${t.p} transparent transparent transparent`,
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
        zIndex:0,
      }} />
      {/* Header */}
      <div style={{ position:'relative', zIndex:1, padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          {logo
            ? <img src={logo} alt="logo" style={{ height:44, objectFit:'contain', filter:'brightness(0) invert(1)', marginBottom:6 }} />
            : <div style={{ fontSize:36, fontWeight:900, color:'#fff', lineHeight:1, textShadow:'0 2px 4px rgba(0,0,0,0.3)' }}>{company.name.charAt(0)}</div>
          }
          <div style={{ fontSize: v===2?16:14, fontWeight:700, color:'#fff', marginTop:4, textShadow:'0 1px 3px rgba(0,0,0,0.4)' }}>{company.name}</div>
        </div>
        <div style={{ background:'#fff', borderRadius:12, padding:'14px 20px', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', minWidth:190 }}>
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'1.5px', color:'#999' }}>Invoice</div>
          <div style={{ fontSize:22, fontWeight:800, color:t.p }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:12, color:'#666', marginTop:2 }}>{fmtDate(inv.invoice_date)}</div>
          {inv.due_date && <div style={{ fontSize:12, color:'#666' }}>Due: {fmtDate(inv.due_date)}</div>}
          <div style={{ marginTop:6 }}><StatusBadge status={inv.payment_status} /></div>
        </div>
      </div>
      {/* Card body */}
      <div style={{ padding:'0 32px 32px' }}>
        <div style={{ background:t.bg, borderRadius:12, padding:20, marginBottom:20, display:'grid', gridTemplateColumns: v===3?'1fr':'1fr 1fr', gap:20, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
          <BillTo invoice={inv} t={t} />
          {v!==3 && (
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:t.p, marginBottom:8 }}>From</div>
              <div style={{ fontSize:12, color:'#555', lineHeight:1.7 }}>
                {company.address && <div>{company.address}</div>}
                {company.phone   && <div>{company.phone}</div>}
                {company.email   && <div>{company.email}</div>}
                {company.gstin   && <div style={{ marginTop:4, fontWeight:600 }}>GSTIN: {company.gstin}</div>}
              </div>
            </div>
          )}
        </div>
        <EventBox invoice={inv} t={t} />
        <ItemsTable invoice={inv} t={t} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 13: Statement ──────────────────────────────────────────────────
function TemplateStatement({ inv, t, font, logo, gstType, company, v=1 }) {
  const taxes   = gstLines(inv.tax_amount, inv.tax_rate, gstType);
  let running   = 0;
  const rows    = [];
  (inv.items||[]).forEach(item => {
    running += parseFloat(item.total) || 0;
    rows.push({ desc:item.description, qty:item.qty, rate:fmt(item.rate), amount:fmt(item.total), balance:fmt(running), type:'item' });
  });
  if (parseFloat(inv.discount) > 0) {
    running -= parseFloat(inv.discount) || 0;
    rows.push({ desc:'Discount', qty:'', rate:'', amount:`- ${fmt(inv.discount)}`, balance:fmt(running), type:'adj' });
  }
  taxes.forEach(tx => {
    running += parseFloat(tx.amount) || 0;
    rows.push({ desc:tx.label, qty:'', rate:'', amount:fmt(tx.amount), balance:fmt(running), type:'tax' });
  });
  const hasDateCol = v===2;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding:32 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <CompanyHeader logo={logo} company={company} t={t} />
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:22, fontWeight:800, color:t.p, textTransform:'uppercase', letterSpacing:'1px' }}>Statement</div>
          <div style={{ fontSize:14, fontWeight:600, color:'#555', marginTop:4 }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:12, color:'#777', marginTop:2 }}>{fmtDate(inv.invoice_date)}</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:18 }}>
        <BillTo invoice={inv} t={t} />
        <EventBox invoice={inv} t={t} />
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, marginBottom:16 }}>
        <thead>
          <tr style={{ background:'#374151', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
            {hasDateCol && <th style={{ background:'#374151', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact', color:'#fff', padding:'9px 12px', textAlign:'left', fontSize:10, textTransform:'uppercase', letterSpacing:'1px' }}>Date</th>}
            {['Description','Qty','Rate','Amount','Balance'].map((c, i) => (
              <th key={c} style={{
                background:'#374151',
                WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
                color:'#fff', padding:'9px 12px',
                textAlign:i===0?'left':'right', fontSize:10,
                textTransform:'uppercase', letterSpacing:'1px',
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{
              borderBottom:'1px solid #e5e7eb',
              background: r.type==='tax' ? t.light : r.type==='adj' ? '#fff7ed' : '#fff',
            }}>
              {hasDateCol && <td style={{ padding:'8px 12px', color:'#888', fontSize:11 }}>{i===0 ? fmtDate(inv.invoice_date) : ''}</td>}
              <td style={{ padding:'8px 12px', fontWeight:r.type!=='item'?600:400 }}>{r.desc}</td>
              <td style={{ padding:'8px 12px', textAlign:'right', color:'#666' }}>{r.qty}</td>
              <td style={{ padding:'8px 12px', textAlign:'right', color:'#666' }}>{r.rate}</td>
              <td style={{ padding:'8px 12px', textAlign:'right', fontWeight:600 }}>{r.amount}</td>
              <td style={{ padding:'8px 12px', textAlign:'right', fontWeight:700, color:t.p }}>{r.balance}</td>
            </tr>
          ))}
          {/* Grand total row */}
          <tr style={{ background:t.p, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
            {hasDateCol && <td style={{ background:t.p, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact', padding:'10px 12px' }} />}
            <td colSpan={3} style={{ background:t.p, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact', padding:'10px 12px', color:'#fff', fontWeight:700, fontSize:13, textTransform:'uppercase', letterSpacing:'1px' }}>Grand Total</td>
            <td style={{ background:t.p, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact', padding:'10px 12px', textAlign:'right', color:'#fff', fontWeight:700, fontSize:14 }}>{fmt(inv.grand_total)}</td>
            <td style={{ background:t.p, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact', padding:'10px 12px', textAlign:'right', color:t.a, fontWeight:800, fontSize:14 }}>{fmt(inv.grand_total)}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ display:'flex', justifyContent:'flex-end', gap:24, marginBottom:12 }}>
        <div style={{ fontSize:13, color:'#555' }}>Advance Paid: <span style={{ fontWeight:700, color:'#16a34a' }}>{fmt(inv.advance_paid)}</span></div>
        <div style={{ fontSize:14, fontWeight:700, color:parseFloat(inv.balance_due)>0?'#dc2626':'#16a34a' }}>Balance Due: {fmt(inv.balance_due)}</div>
      </div>
      <NotesFooter invoice={inv} t={t} />
    </div>
  );
}

// ─── TEMPLATE 14: Premium ────────────────────────────────────────────────────
function TemplatePremium({ inv, t, font, logo, gstType, company, v=1 }) {
  const initial    = company.name.charAt(0).toUpperCase();
  const shadowStyle = v===2 ? '0 4px 24px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.08)';
  const headerRadius = v===3 ? 0 : 10;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', position:'relative', overflow:'hidden', padding:36 }}>
      {/* Watermark */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        fontSize: v===3 ? 380 : 320, fontWeight:900,
        color:t.p, opacity:0.04, userSelect:'none', pointerEvents:'none',
        zIndex:0, lineHeight:1, letterSpacing:'-10px',
        WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
      }}>{initial}</div>
      {/* Content */}
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ border:`2px solid ${t.p}`, borderRadius:headerRadius, padding:20, marginBottom:24, boxShadow:shadowStyle }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <CompanyHeader logo={logo} company={company} t={t} />
            <div style={{ textAlign:'right' }}>
              <div style={{
                background:t.p, color:'#fff', padding:'8px 16px',
                borderRadius:headerRadius, display:'inline-block',
                WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
              }}>
                <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'2px', opacity:0.8 }}>Invoice No.</div>
                <div style={{ fontSize:20, fontWeight:800 }}>{inv.invoice_number || 'SSS-INV-XXXX'}</div>
              </div>
              <div style={{ marginTop:10, fontSize:12, color:'#666' }}>
                <div>Date: {fmtDate(inv.invoice_date)}</div>
                {inv.due_date && <div>Due: {fmtDate(inv.due_date)}</div>}
              </div>
              <div style={{ marginTop:6 }}><StatusBadge status={inv.payment_status} /></div>
            </div>
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
    </div>
  );
}

// ─── TEMPLATE 15: Official ───────────────────────────────────────────────────
function TemplateOfficial({ inv, t, font, logo, gstType, company, v=1 }) {
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding:16 }}>
      <div style={{ border:`3px double ${t.p}`, padding: v===2?20:16 }}>
        {/* Centered title */}
        <div style={{ textAlign:'center', padding:'12px 0', borderBottom:`2px solid ${t.p}`, marginBottom:16 }}>
          <div style={{ fontSize: v===3?20:18, fontWeight:900, letterSpacing:'4px', color:t.p, textTransform:'uppercase' }}>TAX INVOICE</div>
          {v===2 && <div style={{ fontSize:11, color:'#888', marginTop:4, letterSpacing:'2px' }}>ORIGINAL FOR RECIPIENT</div>}
        </div>
        {/* Left / right header */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${t.light}` }}>
          <div>
            {logo && <img src={logo} alt="logo" style={{ height:44, objectFit:'contain', marginBottom:8 }} />}
            <div style={{ fontWeight:700, fontSize:16, color:t.p }}>{company.name}</div>
            {company.tagline && <div style={{ fontSize:10, color:t.a, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:4 }}>{company.tagline}</div>}
            <div style={{ fontSize:12, color:'#555', lineHeight:1.8 }}>
              {company.address && <div>{company.address}</div>}
              {company.phone   && <div>Phone: {company.phone}</div>}
              {company.email   && <div>Email: {company.email}</div>}
              {company.gstin   && <div style={{ fontWeight:700, color:'#333' }}>GSTIN: {company.gstin}</div>}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <table style={{ width:'100%', fontSize:12, borderCollapse:'collapse' }}>
              <tbody>
                <tr><td style={{ color:'#777', padding:'3px 0' }}>Invoice No.</td><td style={{ fontWeight:700, color:t.p, textAlign:'right' }}>{inv.invoice_number||'SSS-INV-XXXX'}</td></tr>
                <tr><td style={{ color:'#777', padding:'3px 0' }}>Invoice Date</td><td style={{ textAlign:'right' }}>{fmtDate(inv.invoice_date)}</td></tr>
                {inv.due_date && <tr><td style={{ color:'#777', padding:'3px 0' }}>Due Date</td><td style={{ textAlign:'right' }}>{fmtDate(inv.due_date)}</td></tr>}
                {inv.payment_status && (
                  <tr>
                    <td style={{ color:'#777', padding:'3px 0' }}>Status</td>
                    <td style={{ textAlign:'right', fontWeight:700, textTransform:'uppercase', color:inv.payment_status==='paid'?'#16a34a':'#dc2626' }}>{inv.payment_status}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${t.light}` }}>
          <BillTo invoice={inv} t={t} />
        </div>
        <EventBox invoice={inv} t={t} />
        <ItemsTable invoice={inv} t={t} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
        {v===3 && (
          <div style={{ marginTop:28, display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div style={{ borderTop:'1px solid #ccc', paddingTop:8, fontSize:11, color:'#777', textAlign:'center' }}>Authorised Signatory</div>
            <div style={{ borderTop:'1px solid #ccc', paddingTop:8, fontSize:11, color:'#777', textAlign:'center' }}>Receiver&apos;s Signature</div>
          </div>
        )}
        <NotesFooter invoice={inv} t={t} />
      </div>
    </div>
  );
}

// ─── TEMPLATE 16: Compact ────────────────────────────────────────────────────
function TemplateCompact({ inv, t, font, logo, gstType, company, v=1 }) {
  const fs    = v===2 ? 10 : 11;
  const pad   = v===2 ? '3px 8px' : '4px 10px';
  const taxes = gstLines(inv.tax_amount, inv.tax_rate, gstType);
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff', padding: v===3?16:22, fontSize:fs }}>
      {/* Compact header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, paddingBottom:10, borderBottom:`2px solid ${t.p}` }}>
        <div>
          {logo && <img src={logo} alt="logo" style={{ height:32, objectFit:'contain', marginBottom:4 }} />}
          <div style={{ fontWeight:700, fontSize:13, color:t.p }}>{company.name}</div>
          <div style={{ fontSize:10, color:'#777', lineHeight:1.5 }}>
            {company.address && <span>{company.address} &middot; </span>}
            {company.phone   && <span>{company.phone} &middot; </span>}
            {company.email   && <span>{company.email}</span>}
          </div>
          {company.gstin && <div style={{ fontSize:10, color:'#888' }}>GSTIN: {company.gstin}</div>}
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:16, fontWeight:800, color:t.p }}>{inv.invoice_number||'SSS-INV-XXXX'}</div>
          <div style={{ fontSize:10, color:'#666' }}>{fmtDate(inv.invoice_date)}</div>
          {inv.due_date && <div style={{ fontSize:10, color:'#666' }}>Due: {fmtDate(inv.due_date)}</div>}
          <StatusBadge status={inv.payment_status} />
        </div>
      </div>
      {/* Compact bill-to */}
      <div style={{ marginBottom:10 }}>
        <span style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'1px', color:'#999' }}>Bill To: </span>
        <span style={{ fontWeight:700, color:t.p }}>{inv.customer_name}</span>
        {inv.company_name && <span style={{ color:'#555' }}> — {inv.company_name}</span>}
        {inv.phone        && <span style={{ color:'#777' }}> &middot; {inv.phone}</span>}
      </div>
      {/* Compact event */}
      {(inv.event_type||inv.event_date||inv.venue) && (
        <div style={{ fontSize:10, color:'#666', background:t.light, padding:'5px 10px', borderRadius:4, marginBottom:10, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
          {inv.event_type && <span>Event: <strong>{inv.event_type}</strong>&nbsp;</span>}
          {inv.event_date && <span>Date: <strong>{fmtDate(inv.event_date)}</strong>&nbsp;</span>}
          {inv.venue      && <span>Venue: <strong>{inv.venue}</strong></span>}
        </div>
      )}
      {/* Compact items table */}
      <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:8, fontSize:fs }}>
        <thead>
          <tr style={{ background:t.p, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
            {['Description','Qty','Rate','Amount'].map((h, i) => (
              <th key={h} style={{
                background:t.p, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact',
                color:'#fff', padding:pad, textAlign:i===0?'left':'right',
                fontSize:9, textTransform:'uppercase', letterSpacing:'0.8px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(inv.items||[]).map((item, i) => (
            <tr key={i} style={{ borderBottom:`1px solid ${t.light}`, background:i%2===0?'#fff':t.bg }}>
              <td style={{ padding:pad }}>{item.description}</td>
              <td style={{ padding:pad, textAlign:'right', color:'#666' }}>{item.qty}</td>
              <td style={{ padding:pad, textAlign:'right', color:'#666' }}>{fmt(item.rate)}</td>
              <td style={{ padding:pad, textAlign:'right', fontWeight:600 }}>{fmt(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Compact totals */}
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <div style={{ width:220, fontSize:fs }}>
          {inv.subtotal && <div style={{ display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${t.light}`, padding:'3px 0', color:'#666' }}><span>Subtotal</span><span>{fmt(inv.subtotal)}</span></div>}
          {parseFloat(inv.discount)>0 && <div style={{ display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${t.light}`, padding:'3px 0', color:'#666' }}><span>Discount</span><span>- {fmt(inv.discount)}</span></div>}
          {taxes.map(tx => (
            <div key={tx.label} style={{ display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${t.light}`, padding:'3px 0', color:'#666' }}>
              <span>{tx.label}</span><span>{fmt(tx.amount)}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:fs+2, borderBottom:`2px solid ${t.a}`, padding:'5px 0', color:t.p }}><span>Total</span><span>{fmt(inv.grand_total)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', color:'#16a34a' }}><span>Advance</span><span>{fmt(inv.advance_paid)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, padding:'3px 0', color:parseFloat(inv.balance_due)>0?'#dc2626':'#16a34a' }}><span>Balance Due</span><span>{fmt(inv.balance_due)}</span></div>
        </div>
      </div>
      {inv.notes && <div style={{ marginTop:10, padding:'6px 10px', background:t.light, borderRadius:4, fontSize:10, color:'#555', borderLeft:`2px solid ${t.a}`, WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>{inv.notes}</div>}
      <div style={{ marginTop:14, paddingTop:8, borderTop:`1px solid ${t.light}`, textAlign:'center', fontSize:9, color:'#aaa' }}>
        Thank you for choosing {company.name}!
      </div>
    </div>
  );
}

// ─── TEMPLATE 17: Stripe ─────────────────────────────────────────────────────
function TemplateStripe({ inv, t, font, logo, gstType, company, v=1 }) {
  const stripeA = v===1 ? t.p   : v===2 ? t.light : t.a;
  const stripeB = v===1 ? t.bg  : v===2 ? '#fff'  : t.bg;
  const hdrText = v===1 ? '#fff' : v===2 ? t.text  : '#fff';
  const darkHdr = v===1 || v===3;
  return (
    <div style={{ fontFamily:font+',sans-serif', background:'#fff' }}>
      {/* Header stripe */}
      <div style={{ background:stripeA, padding:'20px 32px', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            {logo && (
              <img src={logo} alt="logo" style={{ height:44, objectFit:'contain', marginBottom:6, filter:darkHdr?'brightness(0) invert(1)':'none' }} />
            )}
            <div style={{ fontSize:20, fontWeight:800, color:hdrText }}>{company.name}</div>
            {company.tagline && (
              <div style={{ fontSize:10, color:darkHdr?'rgba(255,255,255,0.75)':t.a, letterSpacing:'1.5px', textTransform:'uppercase' }}>{company.tagline}</div>
            )}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'2px', color:darkHdr?'rgba(255,255,255,0.7)':t.a }}>Invoice</div>
            <div style={{ fontSize:22, fontWeight:800, color:hdrText }}>{inv.invoice_number||'SSS-INV-XXXX'}</div>
            <div style={{ fontSize:12, color:darkHdr?'rgba(255,255,255,0.8)':t.text }}>{fmtDate(inv.invoice_date)}</div>
          </div>
        </div>
      </div>
      {/* Alternating stripe – bill-to + company */}
      <div style={{ background:stripeB, padding:'16px 32px', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <BillTo invoice={inv} t={t} />
          <div style={{ textAlign:'right', fontSize:12, color:'#555', lineHeight:1.7 }}>
            {company.address && <div>{company.address}</div>}
            {company.phone   && <div>{company.phone}</div>}
            {company.gstin   && <div>GSTIN: {company.gstin}</div>}
          </div>
        </div>
      </div>
      {/* Event stripe */}
      {(inv.event_type||inv.event_date||inv.venue) && (
        <div style={{ background:stripeA, padding:'12px 32px', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
          <EventBox invoice={inv} t={{ ...t, light: darkHdr ? 'rgba(255,255,255,0.15)' : t.light }} />
        </div>
      )}
      {/* White items section */}
      <div style={{ padding:'20px 32px' }}>
        <ItemsTable invoice={inv} t={t} />
        <TotalsBox invoice={inv} gstType={gstType} t={t} />
      </div>
      {/* Footer stripe */}
      <div style={{ background:stripeA, padding:'12px 32px', WebkitPrintColorAdjust:'exact', printColorAdjust:'exact' }}>
        {inv.notes && (
          <div style={{ fontSize:12, color:darkHdr?'rgba(255,255,255,0.85)':t.text, marginBottom:6 }}>
            <span style={{ fontWeight:700 }}>Note: </span>{inv.notes}
          </div>
        )}
        <div style={{ textAlign:'center', fontSize:11, color:darkHdr?'rgba(255,255,255,0.7)':'#888' }}>
          Thank you for choosing {company.name}!
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT MAP ───────────────────────────────────────────────────────────
const MAP = {
  classic:   TemplateClassic,
  modern:    TemplateModern,
  executive: TemplateExecutive,
  minimal:   TemplateMinimal,
  bold:      TemplateBold,
  corporate: TemplateCorporate,
  elegant:   TemplateElegant,
  retro:     TemplateRetro,
  tech:      TemplateTech,
  luxury:    TemplateLuxury,
  simple:    TemplateSimple,
  creative:  TemplateCreative,
  statement: TemplateStatement,
  premium:   TemplatePremium,
  official:  TemplateOfficial,
  compact:   TemplateCompact,
  stripe:    TemplateStripe,
};

// ─── MASTER RENDERER ─────────────────────────────────────────────────────────
export function InvoicePreview({
  invoice,
  template   = 't01',
  themeName  = 'Gold & Maroon',
  font       = 'Inter',
  logo       = '',
  gstType    = 'sgst_cgst',
  company    = {},
}) {
  const cfg = TEMPLATES.find(tp => tp.id === template) || TEMPLATES[0];
  const t   = THEMES[themeName] || THEMES['Gold & Maroon'];
  const Cmp = MAP[cfg.base] || TemplateClassic;
  const co  = {
    name:    'Shree Swami Samarth',
    tagline: 'Food & Hospitality Services',
    address: 'Vikhroli, Mumbai – 400083',
    phone:   '+91 98765 43210',
    email:   'info@sss.com',
    gstin:   '27XXXXX1234X1Z5',
    ...company,
  };
  return <Cmp inv={invoice} t={t} font={font} logo={logo} gstType={gstType} company={co} v={cfg.v || 1} />;
}

// ─── DOWNLOAD HELPERS ────────────────────────────────────────────────────────
export async function downloadPDF(element, filename) {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF }   = await import('jspdf');

    const canvas = await html2canvas(element, {
      scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
    });

    const pdf    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW  = pdf.internal.pageSize.getWidth();
    const pageH  = pdf.internal.pageSize.getHeight();
    const mmToPx = canvas.width / pageW;        // canvas pixels per mm
    const pageHpx = Math.floor(pageH * mmToPx); // A4 page height in canvas pixels

    // Collect safe Y-cut positions at row boundaries (so no row is ever sliced)
    const elRect  = element.getBoundingClientRect();
    const pxScale = canvas.height / elRect.height; // canvas px per CSS px
    const safeCuts = new Set([0, canvas.height]);
    element.querySelectorAll('tr').forEach(row => {
      const bottom = (row.getBoundingClientRect().bottom - elRect.top) * pxScale;
      if (bottom > 0) safeCuts.add(Math.round(bottom));
    });
    const cuts = [...safeCuts].sort((a, b) => a - b);

    // Build page slices aligned to row boundaries
    let sliceStart = 0;
    const slices   = [];
    while (sliceStart < canvas.height) {
      const ideal = sliceStart + pageHpx;
      if (ideal >= canvas.height) { slices.push([sliceStart, canvas.height]); break; }
      // Last safe cut that fits within this page (and is past current start)
      const fit = cuts.filter(c => c <= ideal && c > sliceStart);
      const cut = fit.length ? fit[fit.length - 1] : ideal;
      slices.push([sliceStart, cut]);
      sliceStart = cut;
    }

    // Render each slice as one PDF page
    slices.forEach(([y0, y1], i) => {
      const h  = y1 - y0;
      const sc = document.createElement('canvas');
      sc.width  = canvas.width;
      sc.height = h;
      sc.getContext('2d').drawImage(canvas, 0, y0, canvas.width, h, 0, 0, canvas.width, h);
      if (i > 0) pdf.addPage();
      pdf.addImage(sc.toDataURL('image/png'), 'PNG', 0, 0, pageW, h / mmToPx);
    });

    pdf.save(filename + '.pdf');
  } catch (e) {
    console.error('PDF download error:', e);
    window.print();
  }
}

export async function downloadJPG(element, filename) {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale: 2, useCORS: true, backgroundColor: '#ffffff',
    });
    const link    = document.createElement('a');
    link.download = filename + '.jpg';
    link.href     = canvas.toDataURL('image/jpeg', 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('JPG download requires html2canvas package', e);
  }
}

export function downloadWord(element, filename, invoiceNumber) {
  const content = element.innerHTML;
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${filename}</title><style>@page{size:A4;margin:2cm}body{font-family:Arial,sans-serif;font-size:11pt;color:#222}table{border-collapse:collapse;width:100%}th{background:#444 !important;color:#fff !important;padding:8pt 10pt;font-size:10pt;text-align:left;-webkit-print-color-adjust:exact}td{padding:7pt 10pt;border-bottom:1px solid #ddd;font-size:11pt}h1,h2,h3{color:#333}img{max-height:60pt}</style></head><body>${content}</body></html>`;
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = (invoiceNumber || filename) + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
