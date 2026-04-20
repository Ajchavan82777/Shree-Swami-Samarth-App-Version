import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Building2, Heart, PartyPopper, ChefHat, Clock, Shield, Award, Users, Phone } from 'lucide-react';
import api from '../../utils/api';

const SERVICES = [
  { icon: Building2, title: 'Corporate Catering', desc: 'Daily meal plans, executive lunches, conference catering and bulk employee meals for offices.', path: '/corporate-catering', color: '#E8EAF6' },
  { icon: Heart, title: 'Wedding Catering', desc: 'Memorable wedding feasts with multi-course menus, live counters and impeccable service.', path: '/wedding-catering', color: '#FCE4EC' },
  { icon: PartyPopper, title: 'Event Catering', desc: 'Birthdays, anniversaries, social gatherings — we cater every celebration perfectly.', path: '/event-catering', color: '#E8F5E9' },
  { icon: ChefHat, title: 'Custom Packages', desc: 'Bespoke menus crafted to your taste, dietary needs and event size.', path: '/packages', color: '#FFF8E1' },
];

const WHY = [
  { icon: Shield, label: 'FSSAI Certified', desc: 'Fully licensed and compliant with all food safety standards.' },
  { icon: Clock, label: 'Always On Time', desc: '99% on-time delivery record across 5000+ events served.' },
  { icon: ChefHat, label: 'Expert Chefs', desc: 'Team of experienced chefs with 10+ years of expertise.' },
  { icon: Award, label: '14+ Years Experience', desc: 'Trusted by 500+ clients across Maharashtra and beyond.' },
  { icon: Users, label: 'Scalable Service', desc: 'From 25 to 5000 guests — we handle any scale with ease.' },
  { icon: CheckCircle, label: 'Custom Menus', desc: 'Jain, vegan, diabetic, and all diet preferences accommodated.' },
];

const STEPS = [
  { num: '01', title: 'Submit Inquiry', desc: 'Fill our simple form with your event details and preferences.' },
  { num: '02', title: 'Get Custom Quote', desc: 'Our team prepares a detailed, tailored quotation within 24 hours.' },
  { num: '03', title: 'Confirm Booking', desc: 'Review, approve and secure your date with advance payment.' },
  { num: '04', title: 'Enjoy Your Event', desc: 'Relax while our team delivers flawless catering at your venue.' },
];

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/packages/public').then(r => setPackages(r.data.filter(p => p.featured).slice(0, 4))).catch(() => {});
    api.get('/reports/testimonials').then(r => setTestimonials(r.data.slice(0, 3))).catch(() => {});
  }, []);

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
            <span style={{ fontSize: 12, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>Est. 2010 • Vikhroli, Mumbai</span>
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,6vw,68px)', color: 'var(--white)', lineHeight: 1.15, marginBottom: 20 }}>
            Premium Catering <br /><em style={{ color: 'var(--gold)' }}>Crafted with Care</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#C4A882', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Corporate meals, wedding feasts, and special events — we bring exceptional food and hospitality to every occasion.
          </p>

          <div className="hero-btns">
            <Link to="/request-quote" className="btn btn-primary hero-btn">
              Get Free Quote <ArrowRight size={18} />
            </Link>
            <Link to="/corporate-catering" className="btn btn-secondary hero-btn" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
              Corporate Plans
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[['5000+', 'Events Served'], ['500+', 'Happy Clients'], ['14+', 'Years Experience'], ['50+', 'Menu Items']].map(([val, label]) => (
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
          <p className="section-title">What We Offer</p>
          <h2 className="section-heading" style={{ margin: '0 auto' }}>Our Catering Services</h2>
          <p className="section-sub" style={{ margin: '12px auto 0' }}>From intimate gatherings to large corporate events, we cater to every occasion with the same passion and precision.</p>
        </div>
        <div className="auto-grid">
          {SERVICES.map(({ icon: Icon, title, desc, path, color }) => (
            <Link key={title} to={path} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={26} style={{ color: 'var(--maroon)' }} />
                </div>
                <h3 style={{ fontSize: 20, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7, marginBottom: 18 }}>{desc}</p>
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
            <p style={{ fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14 }}>For Businesses</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,4vw,38px)', color: 'var(--white)', marginBottom: 20, lineHeight: 1.3 }}>
              Corporate Catering <br />You Can Rely On
            </h2>
            <p style={{ color: '#A89080', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>
              Daily office meals, executive lunches, conference catering, and bulk employee meal service — all managed with professionalism, hygiene, and consistent quality your team will love.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {['Daily meal subscriptions from ₹150/person', 'Timely delivery with 99% on-time record', 'Custom menus with dietary accommodations', 'GST billing and corporate account support', 'Dedicated relationship manager'].map(point => (
                <div key={point} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle size={16} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: '#C4A882', fontSize: 14 }}>{point}</span>
                </div>
              ))}
            </div>
            <Link to="/corporate-catering" className="btn btn-primary">Explore Corporate Plans <ArrowRight size={16} /></Link>
          </div>

          <div className="pricing-grid">
            {[
              { label: 'Daily Meal Plan',      from: '₹150', per: '/person/day' },
              { label: 'Executive Lunch',      from: '₹350', per: '/person' },
              { label: 'Office Buffet',        from: '₹450', per: '/person' },
              { label: 'Conference Catering',  from: '₹200', per: '/person' },
            ].map(pkg => (
              <div key={pkg.label} style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 14, padding: 20 }}>
                <p style={{ fontSize: 13, color: 'var(--gold)', marginBottom: 8 }}>{pkg.label}</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--white)' }}>{pkg.from}</p>
                <p style={{ fontSize: 12, color: '#7A6255' }}>{pkg.per}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-title">Our Commitment</p>
            <h2 className="section-heading">Why Choose Us?</h2>
          </div>
          <div className="auto-grid-sm">
            {WHY.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ background: 'var(--white)', borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={20} style={{ color: 'var(--gold-dark)' }} />
                </div>
                <h4 style={{ fontSize: 16, marginBottom: 8 }}>{label}</h4>
                <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages Preview ─────────────────────────────── */}
      {packages.length > 0 && (
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-title">Popular Packages</p>
            <h2 className="section-heading">Menu Packages</h2>
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
          <p className="section-title">Simple Process</p>
          <h2 className="section-heading" style={{ marginBottom: 48 }}>How to Book Us</h2>
          <div className="steps-grid">
            {STEPS.map(step => (
              <div key={step.num}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px,6vw,56px)', color: 'rgba(201,168,76,0.2)', lineHeight: 1, marginBottom: 4 }}>{step.num}</div>
                <h4 style={{ fontSize: 17, marginBottom: 8 }}>{step.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-title">What Clients Say</p>
            <h2 className="section-heading">Testimonials</h2>
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
          Ready to Plan Your Event?
        </h2>
        <p style={{ color: '#F0C0C0', fontSize: 16, marginBottom: 32 }}>
          Get a customized quote within 24 hours. No commitment required.
        </p>
        <div className="hero-btns">
          <Link to="/request-quote" className="btn btn-primary hero-btn" style={{ fontSize: 16 }}>Request Free Quote</Link>
          <a href="tel:+919876543210" className="btn hero-btn" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', color: 'white', fontSize: 16 }}>
            <Phone size={16} /> Call Now
          </a>
        </div>
      </section>
    </div>
  );
}
