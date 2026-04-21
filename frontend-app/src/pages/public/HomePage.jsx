import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Phone } from 'lucide-react';
import api from '../../utils/api';
import { useContent } from '../../context/ContentContext';

const DEFAULT_SERVICES = [
  { icon: '🏢', title: 'Corporate Catering',   description: 'Daily meal plans, executive lunches, conference catering and bulk employee meals for offices.', link: '/corporate-catering' },
  { icon: '💒', title: 'Wedding Catering',      description: 'Memorable wedding feasts with multi-course menus, live counters and impeccable service.',       link: '/wedding-catering' },
  { icon: '🎉', title: 'Event Catering',        description: 'Birthdays, anniversaries, social gatherings — we cater every celebration perfectly.',            link: '/event-catering' },
  { icon: '📦', title: 'Custom Packages',       description: 'Bespoke menus crafted to your taste, dietary needs and event size.',                             link: '/packages' },
];

const DEFAULT_WHY = [
  { icon: '✅', title: 'FSSAI Certified',       text: 'Fully licensed and compliant with all food safety standards.' },
  { icon: '⏰', title: 'Always On Time',         text: '99% on-time delivery record across 5000+ events served.' },
  { icon: '👨‍🍳', title: 'Expert Chefs',           text: 'Team of experienced chefs with 10+ years of expertise.' },
  { icon: '🏆', title: '14+ Years Experience',  text: 'Trusted by 500+ clients across Maharashtra and beyond.' },
  { icon: '📈', title: 'Scalable Service',      text: 'From 25 to 5000 guests — we handle any scale with ease.' },
  { icon: '🍽️', title: 'Custom Menus',          text: 'Jain, vegan, diabetic, and all diet preferences accommodated.' },
];

const DEFAULT_STEPS = [
  { icon: '📝', title: 'Submit Inquiry',    description: 'Fill our simple form with your event details and preferences.' },
  { icon: '💬', title: 'Get Custom Quote',  description: 'Our team prepares a detailed, tailored quotation within 24 hours.' },
  { icon: '✅', title: 'Confirm Booking',   description: 'Review, approve and secure your date with advance payment.' },
  { icon: '🎉', title: 'Enjoy Your Event',  description: 'Relax while our team delivers flawless catering at your venue.' },
];

const DEFAULT_PRICING = [
  { plan: 'Daily Meal Plan',     price: '₹150', unit: '/person/day' },
  { plan: 'Executive Lunch',     price: '₹350', unit: '/person' },
  { plan: 'Office Buffet',       price: '₹450', unit: '/person' },
  { plan: 'Conference Catering', price: '₹200', unit: '/person' },
];

export default function HomePage() {
  const [packages, setPackages]         = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const { get, getJson }                = useContent();

  useEffect(() => {
    api.get('/packages/public').then(r => setPackages(r.data.filter(p => p.featured).slice(0, 4))).catch(() => {});
    api.get('/reports/testimonials').then(r => setTestimonials(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const services = getJson('services', 'items', DEFAULT_SERVICES);
  const whyItems = getJson('why_us',   'items', DEFAULT_WHY);
  const steps    = getJson('steps',    'items', DEFAULT_STEPS);
  const pricing  = getJson('corporate','pricing', DEFAULT_PRICING);
  const benefits = getJson('corporate','benefits', [
    'Daily meal subscriptions from ₹150/person',
    'Timely delivery with 99% on-time record',
    'Custom menus with dietary accommodations',
    'GST billing and corporate account support',
    'Dedicated relationship manager',
  ]);

  const phone = get('contact', 'phone', '+91 98765 43210');

  const ht = (key, fb) => get('homepage_text', key, fb);

  const stats = [
    [get('hero','stat_events','5000+'), get('hero','stat_events_label','Events Served')],
    [get('hero','stat_clients','500+'), get('hero','stat_clients_label','Happy Clients')],
    [get('hero','stat_years','14+'),    get('hero','stat_years_label','Years Experience')],
    [get('hero','stat_menu','50+'),     get('hero','stat_menu_label','Menu Items')],
  ];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-circle hero-circle-tr" />
        <div className="hero-circle hero-circle-bl" />
        <div className="hero-circle hero-circle-center" />

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 30, padding: '6px 18px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {get('hero','badge','Est. 2010 • Vikhroli, Mumbai')}
            </span>
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,6vw,68px)', color: 'var(--white)', lineHeight: 1.15, marginBottom: 20 }}>
            {get('hero','tagline','Premium Catering')} <br />
            <em style={{ color: 'var(--gold)' }}>Crafted with Care</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#C4A882', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            {get('hero','description','Corporate meals, wedding feasts, and special events — we bring exceptional food and hospitality to every occasion.')}
          </p>

          <div className="hero-btns">
            <Link to="/request-quote" className="btn btn-primary hero-btn">
              Get Free Quote <ArrowRight size={18} />
            </Link>
            <Link to="/corporate-catering" className="btn btn-secondary hero-btn" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
              Corporate Plans
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px,4vw,32px)', color: 'var(--gold)', fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 11, color: '#8A7060', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-title">{ht('services_label', 'What We Offer')}</p>
          <h2 className="section-heading" style={{ margin: '0 auto' }}>{ht('services_title', 'Our Catering Services')}</h2>
          <p className="section-sub" style={{ margin: '12px auto 0' }}>{ht('services_desc', 'From intimate gatherings to large corporate events, we cater to every occasion with the same passion and precision.')}</p>
        </div>
        <div className="auto-grid">
          {services.map((svc, i) => (
            <Link key={i} to={svc.link || '#'} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{svc.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 10 }}>{svc.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7, marginBottom: 18 }}>{svc.description}</p>
                <span style={{ color: 'var(--gold-dark)', fontWeight: 600, fontSize: 14 }}>Learn More →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Corporate Highlight ───────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)' }} className="section-pad">
        <div className="corp-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14 }}>{ht('corp_label', 'For Businesses')}</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,4vw,38px)', color: 'var(--white)', marginBottom: 20, lineHeight: 1.3 }}>
              {ht('corp_title', 'Corporate Catering You Can Rely On')}
            </h2>
            <p style={{ color: '#A89080', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>
              {ht('corp_desc', 'Daily office meals, executive lunches, conference catering, and bulk employee meal service — all managed with professionalism, hygiene, and consistent quality.')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {benefits.slice(0, 5).map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle size={16} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: '#C4A882', fontSize: 14 }}>{point}</span>
                </div>
              ))}
            </div>
            <Link to="/corporate-catering" className="btn btn-primary">Explore Corporate Plans <ArrowRight size={16} /></Link>
          </div>

          <div className="pricing-grid">
            {pricing.map((pkg, i) => (
              <div key={i} style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 14, padding: 20 }}>
                <p style={{ fontSize: 13, color: 'var(--gold)', marginBottom: 8 }}>{pkg.plan}</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--white)' }}>{pkg.price}</p>
                <p style={{ fontSize: 12, color: '#7A6255' }}>{pkg.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-title">{ht('whyus_label', 'Our Commitment')}</p>
            <h2 className="section-heading">{ht('whyus_title', 'Why Choose Us?')}</h2>
          </div>
          <div className="auto-grid-sm">
            {whyItems.map((item, i) => (
              <div key={i} style={{ background: 'var(--white)', borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
                <h4 style={{ fontSize: 16, marginBottom: 8 }}>{item.title}</h4>
                <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages Preview ─────────────────────────────── */}
      {packages.length > 0 && (
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-title">{ht('packages_label', 'Popular Packages')}</p>
            <h2 className="section-heading">{ht('packages_title', 'Menu Packages')}</h2>
          </div>
          <div className="auto-grid">
            {packages.map(pkg => (
              <div key={pkg.id} className="card" style={{ position: 'relative' }}>
                {pkg.featured && (
                  <span style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gold)', color: 'var(--dark)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '1px', textTransform: 'uppercase' }}>Featured</span>
                )}
                <span className={`badge badge-${pkg.category}`} style={{ marginBottom: 12 }}>{pkg.category}</span>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{pkg.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16, lineHeight: 1.6 }}>{pkg.description}</p>
                <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                  {pkg.inclusions.slice(0, 4).map(inc => (
                    <li key={inc} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-light)', marginBottom: 6 }}>
                      <CheckCircle size={13} style={{ color: 'var(--gold)' }} /> {inc}
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--maroon)' }}>₹{pkg.price_per_person}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>/person</span>
                  </div>
                  <Link to="/request-quote" className="btn btn-primary btn-sm">Enquire</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/packages" className="btn btn-ghost">View All Packages <ArrowRight size={16} /></Link>
          </div>
        </section>
      )}

      {/* ── How it Works ─────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-title">{ht('steps_label', 'Simple Process')}</p>
          <h2 className="section-heading" style={{ marginBottom: 48 }}>{ht('steps_title', 'How to Book Us')}</h2>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px,6vw,56px)', color: 'rgba(201,168,76,0.2)', lineHeight: 1, marginBottom: 4 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h4 style={{ fontSize: 17, marginBottom: 8 }}>{step.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.6 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-title">{ht('testimonials_label', 'What Clients Say')}</p>
            <h2 className="section-heading">{ht('testimonials_title', 'Testimonials')}</h2>
          </div>
          <div className="auto-grid">
            {testimonials.map(t => (
              <div key={t.id} className="card">
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--maroon)', flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{t.role}{t.company ? `, ${t.company}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="section-pad-sm" style={{ background: 'linear-gradient(135deg, var(--maroon) 0%, #5C1010 100%)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px,4vw,36px)', color: 'var(--white)', marginBottom: 14 }}>
          {ht('cta_title', 'Ready to Plan Your Event?')}
        </h2>
        <p style={{ color: '#F0C0C0', fontSize: 16, marginBottom: 32 }}>
          {ht('cta_desc', 'Get a customized quote within 24 hours. No commitment required.')}
        </p>
        <div className="hero-btns">
          <Link to="/request-quote" className="btn btn-primary hero-btn" style={{ fontSize: 16 }}>{ht('cta_btn', 'Request Free Quote')}</Link>
          <a href={`tel:${phone.replace(/\s/g,'')}`} className="btn hero-btn" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', color: 'white', fontSize: 16 }}>
            <Phone size={16} /> {phone}
          </a>
        </div>
      </section>
    </div>
  );
}
