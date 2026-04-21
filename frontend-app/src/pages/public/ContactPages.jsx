import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { useContent } from '../../context/ContentContext';

function PageHero({ subtitle, title, desc }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', padding: '160px 24px 80px', textAlign: 'center' }}>
      {subtitle && <p style={{ fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14 }}>{subtitle}</p>}
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,48px)', color: 'white', marginBottom: 14 }}>{title}</h1>
      {desc && <p style={{ color: '#C4A882', maxWidth: 540, margin: '0 auto', fontSize: 16 }}>{desc}</p>}
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {props.as === 'textarea'
        ? <textarea className="form-textarea" {...props} />
        : props.as === 'select'
          ? <select className="form-select" {...props}>{props.children}</select>
          : <input className="form-input" {...props} />}
    </div>
  );
}

// ---- CONTACT PAGE ----
export function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const { get }             = useContent();

  const phone        = get('contact', 'phone',         '+91 98765 43210');
  const email        = get('contact', 'email',         'info@shreeswamisamarthfoods.com');
  const address      = get('contact', 'address',       'Vikhroli, Mumbai – 400083, Maharashtra');
  const hoursWeekday = get('contact', 'hours_weekday', 'Mon–Sat: 8 AM – 8 PM');
  const hoursWeekend = get('contact', 'hours_weekend', 'Sun: 9 AM – 5 PM');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inquiries/', { ...form, event_type: 'general', status: 'new' });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHero subtitle="Get in Touch" title="Contact Us" desc="We'd love to hear from you. Reach out for inquiries, bookings, or just to say hello." />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48 }}>
        {/* Info */}
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 24 }}>Get in Touch</h2>
          {[
            { icon: Phone, label: 'Phone',   value: phone,                             link: `tel:${phone.replace(/\s/g,'')}` },
            { icon: Mail,  label: 'Email',   value: email,                             link: `mailto:${email}` },
            { icon: MapPin,label: 'Address', value: address,                           link: null },
            { icon: Clock, label: 'Hours',   value: `${hoursWeekday}\n${hoursWeekend}`,link: null },
          ].map(({ icon: Icon, label, value, link }) => (
            <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} style={{ color: 'var(--gold-dark)' }} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{label}</p>
                {link ? <a href={link} style={{ fontSize: 15, color: 'var(--maroon)', fontWeight: 500 }}>{value}</a>
                  : <p style={{ fontSize: 15, whiteSpace: 'pre-line' }}>{value}</p>}
              </div>
            </div>
          ))}
        </div>
        {/* Form */}
        <div className="card">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={52} style={{ color: 'var(--success)', marginBottom: 16 }} />
              <h3 style={{ fontSize: 22, marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-light)' }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: 20, marginBottom: 20 }}>Send a Message</h3>
              <div className="form-grid">
                <FormInput label="Your Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                <FormInput label="Email Address" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div className="form-grid">
                <FormInput label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                <FormInput label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
              </div>
              <FormInput label="Message" as="textarea" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your catering needs..." />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function PhoneHint() {
  const { get } = useContent();
  const phone = get('contact', 'phone', '+91 98765 43210');
  return (
    <p style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', marginTop: 12 }}>
      We respond within 24 hours. For urgent inquiries, call {phone}
    </p>
  );
}

// ---- REQUEST QUOTE PAGE ----
export function RequestQuotePage() {
  const [form, setForm] = useState({
    name: '', company_name: '', email: '', phone: '',
    event_type: 'corporate', service_type: '', event_date: '', venue: '',
    guest_count: '', budget_range: '', meal_preference: 'veg', notes: ''
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inquiries/', { ...form, status: 'new', is_corporate: form.event_type === 'corporate' });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHero subtitle="Free Consultation" title="Request a Quote" desc="Fill in your event details and we'll send you a customized quotation within 24 hours — no obligation." />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 24px' }}>
        {sent ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 28, marginBottom: 12 }}>Quote Request Received!</h2>
            <p style={{ color: 'var(--text-light)', fontSize: 16, marginBottom: 32 }}>
              Our team will review your requirements and send a detailed quotation within 24 hours.
            </p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        ) : (
          <div className="card">
            <h3 style={{ fontSize: 22, marginBottom: 24 }}>Event Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <FormInput label="Your Name *" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
                <FormInput label="Company Name" value={form.company_name} onChange={e => set('company_name', e.target.value)} placeholder="If applicable" />
              </div>
              <div className="form-grid">
                <FormInput label="Email Address *" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                <FormInput label="Phone Number *" required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Event Type *</label>
                  <select className="form-select" required value={form.event_type} onChange={e => set('event_type', e.target.value)}>
                    <option value="corporate">Corporate Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="event">Social Event</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <FormInput label="Service Required" value={form.service_type} onChange={e => set('service_type', e.target.value)} placeholder="e.g. Daily Meal Plan, Buffet..." />
              </div>
              <div className="form-grid">
                <FormInput label="Event Date" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} />
                <FormInput label="Venue / Location" value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="City, Venue Name" />
              </div>
              <div className="form-grid-3">
                <FormInput label="Guest Count" type="number" value={form.guest_count} onChange={e => set('guest_count', e.target.value)} placeholder="Approx. guests" />
                <FormInput label="Budget Range" value={form.budget_range} onChange={e => set('budget_range', e.target.value)} placeholder="e.g. ₹50,000–₹80,000" />
                <div className="form-group">
                  <label className="form-label">Meal Preference</label>
                  <select className="form-select" value={form.meal_preference} onChange={e => set('meal_preference', e.target.value)}>
                    <option value="veg">Vegetarian Only</option>
                    <option value="nonveg">Non-Vegetarian</option>
                    <option value="mixed">Mixed (Veg + Non-Veg)</option>
                    <option value="jain">Jain</option>
                  </select>
                </div>
              </div>
              <FormInput label="Special Requirements / Notes" as="textarea" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any specific requirements, dietary restrictions, or details..." />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                {loading ? 'Submitting...' : '🚀 Submit Quote Request'}
              </button>
              <PhoneHint />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function BookNowCall() {
  const { get } = useContent();
  const phone = get('contact', 'phone', '+91 98765 43210');
  return <a href={`tel:${phone.replace(/\s/g,'')}`} className="btn btn-ghost">Call to Book Directly</a>;
}

// ---- BOOK NOW PAGE ----
export function BookNowPage() {
  return (
    <div>
      <PageHero subtitle="Secure Your Date" title="Book Now" desc="Ready to confirm? Fill in your booking details and we'll get in touch to finalize everything." />
      <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="card">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontSize: 22, marginBottom: 12 }}>Start With a Quote</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: 28, lineHeight: 1.7 }}>
            To book, please first submit a quote request. Our team will prepare a detailed proposal, and once you approve, we'll confirm your booking and collect the advance payment.
          </p>
          <Link to="/request-quote" className="btn btn-primary" style={{ marginRight: 12 }}>Request Quote First</Link>
          <BookNowCall />
        </div>
      </div>
    </div>
  );
}
