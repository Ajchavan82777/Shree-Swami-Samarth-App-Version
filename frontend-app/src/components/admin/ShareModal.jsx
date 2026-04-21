import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getPDFBlob } from './InvoiceTemplates';

function fmtIN(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}
function fmtD(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildMessage(doc, docType, docNumber, company) {
  const name      = doc.customer_name || 'Valued Customer';
  const event     = doc.event_type    || '';
  const eventDate = doc.event_date    ? ` on ${fmtD(doc.event_date)}`  : '';
  const venueStr  = doc.venue         ? `\n• Venue: ${doc.venue}`      : '';
  const total     = fmtIN(doc.grand_total);
  const phone     = company.phone || '';
  const email     = company.email || '';
  const isInv     = docType === 'invoice';

  if (isInv) {
    const dueStr = doc.due_date
      ? `\n• Due Date: ${fmtD(doc.due_date)}` : '';
    return (
      `Dear ${name},\n\n` +
      `Please find attached Invoice *${docNumber}* from ${company.name || 'Shree Swami Samarth Food & Hospitality Services'}.\n\n` +
      `📋 *Invoice Details:*\n` +
      `• Invoice No: ${docNumber}\n` +
      `• Event: ${event}${eventDate}${venueStr}${dueStr}\n` +
      `• Grand Total: ${total}\n` +
      `• Amount Paid: ${fmtIN(doc.advance_paid)}\n` +
      `• Balance Due: ${fmtIN(doc.balance_due)}\n\n` +
      `For any queries, please contact:\n` +
      `📞 ${phone}\n` +
      `📧 ${email}\n\n` +
      `Thank you for choosing ${company.name || 'Shree Swami Samarth'}! 🙏`
    );
  } else {
    const validStr = doc.valid_until
      ? `\n• Valid Until: ${fmtD(doc.valid_until)}` : '';
    return (
      `Dear ${name},\n\n` +
      `Please find attached Quotation *${docNumber}* from ${company.name || 'Shree Swami Samarth Food & Hospitality Services'}.\n\n` +
      `📋 *Quotation Details:*\n` +
      `• Quotation No: ${docNumber}\n` +
      `• Event: ${event}${eventDate}${venueStr}${validStr}\n` +
      `• Total Amount: ${total}\n\n` +
      `For any queries, please contact:\n` +
      `📞 ${phone}\n` +
      `📧 ${email}\n\n` +
      `Thank you for considering our services! 🙏`
    );
  }
}

export default function ShareModal({ printRef, doc, docType, orientation, company, onClose }) {
  const isInv     = docType === 'invoice';
  const docNumber = doc.invoice_number || doc.quotation_number || `SSS-${isInv ? 'INV' : 'QUO'}-${doc.id}`;
  const subject   = isInv
    ? `Invoice ${docNumber} — ${company.name || 'Shree Swami Samarth'}`
    : `Quotation ${docNumber} — ${company.name || 'Shree Swami Samarth'}`;

  const [pdfBlob,    setPdfBlob]    = useState(null);
  const [generating, setGenerating] = useState(true);
  const [genError,   setGenError]   = useState(false);
  const [message,    setMessage]    = useState(() => buildMessage(doc, docType, docNumber, company));
  const [copied,     setCopied]     = useState(false);

  useEffect(() => {
    if (!printRef?.current) { setGenerating(false); return; }
    getPDFBlob(printRef.current, docNumber, orientation)
      .then(blob => { setPdfBlob(blob); setGenerating(false); })
      .catch(() => { setGenError(true); setGenerating(false); });
  }, []);

  const triggerDownload = (blob) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = `${docNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleShareNative = async () => {
    if (!pdfBlob) return;
    const file = new File([pdfBlob], `${docNumber}.pdf`, { type: 'application/pdf' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: subject, text: message }); }
      catch (e) { if (e.name !== 'AbortError') alert('Sharing failed: ' + e.message); }
    } else {
      triggerDownload(pdfBlob);
      alert('Native sharing not supported in this browser. PDF has been downloaded — please share it manually.');
    }
  };

  const handleEmail = () => {
    const to   = encodeURIComponent(doc.email || '');
    const sub  = encodeURIComponent(subject);
    const body = encodeURIComponent(message + '\n\n[Please find the PDF attached]');
    window.open(`mailto:${to}?subject=${sub}&body=${body}`, '_blank');
    if (pdfBlob) triggerDownload(pdfBlob);
  };

  const handleWhatsApp = () => {
    const raw  = (doc.phone || '').replace(/\D/g, '');
    const text = encodeURIComponent(message);
    window.open(raw ? `https://wa.me/${raw}?text=${text}` : `https://wa.me/?text=${text}`, '_blank');
  };

  const handleSMS = () => {
    const phone = doc.phone || '';
    const body  = encodeURIComponent(message.replace(/\*/g, ''));
    window.open(`sms:${phone}?body=${body}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => { if (pdfBlob) triggerDownload(pdfBlob); };

  const CHANNELS = [
    {
      key:   'native',
      emoji: '📤',
      label: 'Share via Apps',
      hint:  'PDF attached (WhatsApp, Drive, etc.)',
      color: 'var(--gold)',
      hoverBg: 'var(--cream)',
      onClick: handleShareNative,
      disabled: generating || !pdfBlob,
    },
    {
      key:   'email',
      emoji: '✉️',
      label: 'Gmail / Email',
      hint:  'Downloads PDF + opens email app',
      color: '#ea4335',
      hoverBg: '#fef2f2',
      onClick: handleEmail,
      disabled: generating || !pdfBlob,
    },
    {
      key:   'whatsapp',
      emoji: '💬',
      label: 'WhatsApp',
      hint:  'Opens WhatsApp with pre-filled message',
      color: '#25d366',
      hoverBg: '#f0fdf4',
      onClick: handleWhatsApp,
      disabled: false,
    },
    {
      key:   'sms',
      emoji: '📱',
      label: 'SMS',
      hint:  'Opens SMS app on this device',
      color: '#2563eb',
      hoverBg: '#eff6ff',
      onClick: handleSMS,
      disabled: false,
    },
  ];

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.72)', zIndex:1200,
               display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width:'100%', maxWidth:520, background:'#fff', borderRadius:16, overflow:'hidden',
                    boxShadow:'0 28px 90px rgba(0,0,0,0.45)' }}>

        {/* Header */}
        <div style={{ background:'var(--dark)', padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ color:'var(--gold)', fontWeight:700, fontSize:15, margin:0 }}>
              Share {isInv ? 'Invoice' : 'Quotation'}
            </p>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, margin:'2px 0 0' }}>{docNumber}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:4 }}>
            <X size={18}/>
          </button>
        </div>

        <div style={{ padding:20, maxHeight:'80vh', overflowY:'auto' }}>

          {/* PDF status */}
          {generating && (
            <div style={{ background:'#f3f4f6', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#6b7280', display:'flex', alignItems:'center', gap:8 }}>
              <span>⏳</span> Generating PDF — please wait…
            </div>
          )}
          {!generating && pdfBlob && (
            <div style={{ background:'#f0fdf4', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#16a34a', display:'flex', alignItems:'center', gap:8 }}>
              <span>✅</span> PDF ready · {(pdfBlob.size / 1024).toFixed(0)} KB
            </div>
          )}
          {genError && (
            <div style={{ background:'#fef2f2', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#dc2626', display:'flex', alignItems:'center', gap:8 }}>
              <span>⚠️</span> PDF generation failed — you can still copy the message or use WhatsApp/SMS.
            </div>
          )}

          {/* Editable message */}
          <label style={{ fontSize:11, fontWeight:600, color:'var(--text-light)', letterSpacing:'0.5px', textTransform:'uppercase', display:'block', marginBottom:6 }}>
            Message (editable)
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ width:'100%', minHeight:180, fontFamily:'inherit', fontSize:13, lineHeight:1.65,
                     padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8,
                     resize:'vertical', boxSizing:'border-box', outline:'none' }}
          />

          {/* Channel buttons */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
            {CHANNELS.map(ch => (
              <button
                key={ch.key}
                onClick={ch.onClick}
                disabled={ch.disabled}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                         padding:'12px 8px', borderRadius:10, border:`2px solid #e5e7eb`,
                         background:'#fff', cursor: ch.disabled ? 'not-allowed' : 'pointer',
                         opacity: ch.disabled ? 0.45 : 1, transition:'all 0.15s' }}
                onMouseEnter={e => { if (!ch.disabled) { e.currentTarget.style.borderColor = ch.color; e.currentTarget.style.background = ch.hoverBg; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; }}
              >
                <span style={{ fontSize:22 }}>{ch.emoji}</span>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--dark)' }}>{ch.label}</span>
                <span style={{ fontSize:10, color:'var(--text-light)', textAlign:'center', lineHeight:1.3 }}>{ch.hint}</span>
              </button>
            ))}
          </div>

          {/* Copy + Download row */}
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button
              onClick={handleCopy}
              style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                       padding:'10px 12px', borderRadius:8, border:'1px solid var(--border)',
                       background: copied ? '#f0fdf4' : '#fff',
                       color: copied ? '#16a34a' : 'var(--dark)',
                       cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.15s' }}
            >
              {copied ? '✓ Copied!' : '📋 Copy Message'}
            </button>
            <button
              onClick={handleDownload}
              disabled={generating || !pdfBlob}
              style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                       padding:'10px 12px', borderRadius:8, border:'none',
                       background:'#dc2626', color:'#fff',
                       cursor: (generating || !pdfBlob) ? 'not-allowed' : 'pointer',
                       fontSize:13, fontWeight:600,
                       opacity: (generating || !pdfBlob) ? 0.45 : 1 }}
            >
              ⬇ Download PDF
            </button>
          </div>

          <p style={{ fontSize:11, color:'var(--text-light)', marginTop:10, textAlign:'center', lineHeight:1.5 }}>
            Gmail / Email: PDF downloads to your device — attach it from Downloads when composing.
          </p>
        </div>
      </div>
    </div>
  );
}
