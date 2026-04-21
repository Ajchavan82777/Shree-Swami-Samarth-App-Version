import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import { useContent } from '../../context/ContentContext';

function PageHero({ bg = 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)', subtitle, subtitleColor = 'var(--gold)', title, desc, descColor = '#C4A882', children }) {
  return (
    <div style={{ background: bg, padding: '160px 24px 80px', textAlign: 'center' }}>
      {subtitle && <p style={{ fontSize: 12, color: subtitleColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14 }}>{subtitle}</p>}
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,48px)', color: 'white', marginBottom: 16 }}>{title}</h1>
      {desc && <p style={{ color: descColor, maxWidth: 600, margin: '0 auto 32px', fontSize: 16 }}>{desc}</p>}
      {children}
    </div>
  );
}

// ---- ABOUT PAGE ----
const DEFAULT_VALUES = [
  { icon: '🛡️', title: 'Hygiene & Food Safety First',    text: 'FSSAI certified kitchen with regular audits' },
  { icon: '🍛', title: 'Authentic Regional Flavors',      text: 'Recipes rooted in tradition, cooked with care' },
  { icon: '🤝', title: 'Professional, Courteous Service', text: 'On-time delivery, always' },
  { icon: '♻️', title: 'Zero-Waste Kitchen Practices',   text: 'Responsible kitchen, minimal waste' },
  { icon: '⏰', title: 'Timely, Reliable Delivery',       text: 'We show up every single time' },
  { icon: '⭐', title: 'Client Satisfaction Guaranteed', text: 'Your happiness is our success' },
];

export function AboutPage() {
  const { get, getJson } = useContent();
  const heroTitle  = get('about', 'hero_title',       'About Us');
  const heroSub    = get('about', 'hero_subtitle',    'Our Story');
  const heroDesc   = get('about', 'hero_description', 'Serving authentic, hygienic, and premium catering services since 2010');
  const whoLabel   = get('about', 'who_label',        'Who We Are');
  const whoHeading = get('about', 'who_heading',      'Passionate About Food & Hospitality');
  const valuesHdr  = get('about', 'values_heading',   'Our Core Values');
  const story      = get('about', 'story',   'Founded in 2010 by Devendra Kamble in Vikhroli, Mumbai, Shree Swami Samarth Food and Hospitality Services has grown into a trusted name for corporate offices, weddings, and events across Maharashtra.');
  const founder    = get('about', 'founder', 'Devendra Kamble');
  const location   = get('about', 'location', 'Vikhroli, Mumbai');
  const values     = getJson('about', 'values', DEFAULT_VALUES);

  const stat_e = get('hero', 'stat_events', '5000+');
  const stat_c = get('hero', 'stat_clients', '500+');
  const stat_y = get('hero', 'stat_years', '14+');

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSub} desc={heroDesc} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div className="corp-grid" style={{ marginBottom: 60 }}>
          <div>
            <p className="section-title">{whoLabel}</p>
            <h2 className="section-heading" style={{ marginBottom: 20 }}>{whoHeading}</h2>
            <p style={{ color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 16 }}>
              {story.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
            </p>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 24 }}>
              {[[stat_e,'Events'], [stat_c,'Clients'], [stat_y,'Years']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--maroon)' }}>{v}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-light)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--cream-dark)', borderRadius: 18, padding: 40, border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: 20, fontSize: 22 }}>{valuesHdr}</h3>
            {values.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{v.icon}</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{v.title}</p>
                  {v.text && <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{v.text}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- CORPORATE CATERING PAGE ----
const DEFAULT_CORP_CARDS = [
  { icon: '📅', title: 'Daily Office Meal Plans',  desc: 'Nutritious and tasty breakfast, lunch and dinner for your team, every working day.' },
  { icon: '👥', title: 'Executive Lunch Service',  desc: 'Premium multi-course lunches for leadership teams, board meetings and VIP guests.' },
  { icon: '📦', title: 'Office Buffet Catering',   desc: 'Lavish buffets for team celebrations, product launches, and year-end parties.' },
  { icon: '📚', title: 'Conference & Training',    desc: 'Full-day catering for conferences, workshops, seminars and training programs.' },
  { icon: '☕', title: 'Pantry & Snack Service',   desc: 'Healthy morning and evening snacks, tea, coffee and fresh juices for your office.' },
  { icon: '🏗️', title: 'Bulk Meal Service',        desc: 'Large-scale meal service for factories, construction sites and large workforces.' },
];

export function CorporateCateringPage() {
  const { get, getJson } = useContent();
  const heroSub  = get('corporate', 'hero_subtitle',    'For Businesses & Offices');
  const heroTitle = get('corporate', 'hero_title',      'Corporate Catering');
  const heroDesc  = get('corporate', 'hero_description','Reliable, hygienic, professional catering solutions for offices of all sizes');
  const heroCta   = get('corporate', 'hero_cta',        'Get Corporate Quote');
  const secTitle  = get('corporate', 'section_title',   'Corporate Catering Solutions');
  const secDesc   = get('corporate', 'section_desc',    'Everything your office needs, delivered with precision and warmth');
  const whyTitle  = get('corporate', 'why_title',       'Why Companies Choose Us');
  const cards     = getJson('corporate', 'cards',    DEFAULT_CORP_CARDS);
  const benefits  = getJson('corporate', 'benefits', [
    'Timely delivery — always', 'FSSAI compliant kitchen', 'Monthly GST-ready invoices',
    'Dedicated account manager', 'Custom menu planning', 'Diet-inclusive options',
    'Scalable to any team size', 'Festive special meal plans',
  ]);

  return (
    <div>
      <PageHero
        bg="linear-gradient(135deg, #1A2A4A 0%, #0D1B2A 100%)"
        subtitle={heroSub} subtitleColor="#90CAF9"
        title={heroTitle}
        desc={heroDesc} descColor="#90CAF9"
      >
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/request-quote" className="btn btn-primary">{heroCta}</Link>
          <Link to="/contact" className="btn" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', color: 'white' }}>Talk to Us</Link>
        </div>
      </PageHero>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="section-heading">{secTitle}</h2>
          <p className="section-sub" style={{ margin: '12px auto 0' }}>{secDesc}</p>
        </div>
        <div className="auto-grid" style={{ marginBottom: 60 }}>
          {cards.map((card, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: 36, marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--dark)', borderRadius: 18, padding: 48, color: 'white' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--gold)', marginBottom: 28, textAlign: 'center' }}>{whyTitle}</h3>
          <div className="auto-grid-sm">
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <CheckCircle size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#C4A882' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- PACKAGES PAGE ----
export function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/packages/public').then(r => { setPackages(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cats     = ['all', 'corporate', 'wedding', 'events'];
  const filtered = filter === 'all' ? packages : packages.filter(p => p.category === filter);

  return (
    <div>
      <PageHero title="Menu Packages" subtitle="Our Offerings" desc="Carefully crafted packages to suit every occasion and budget" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`btn ${filter === c ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ textTransform: 'capitalize' }}>
              {c === 'all' ? 'All Packages' : c}
            </button>
          ))}
        </div>
        {loading ? <div className="loading">Loading packages...</div> : (
          <div className="auto-grid">
            {filtered.map(pkg => (
              <div key={pkg.id} className="card" style={{ position: 'relative' }}>
                {pkg.featured && <span style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gold)', color: 'var(--dark)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>Featured</span>}
                <span className={`badge badge-${pkg.category}`} style={{ marginBottom: 14 }}>{pkg.category}</span>
                <h3 style={{ fontSize: 19, marginBottom: 6 }}>{pkg.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16, lineHeight: 1.6 }}>{pkg.description}</p>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Inclusions</p>
                  {pkg.inclusions.map(inc => (
                    <div key={inc} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <CheckCircle size={13} style={{ color: 'var(--gold)' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-light)' }}>{inc}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--maroon)' }}>₹{pkg.price_per_person}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>/person</span>
                    <p style={{ fontSize: 11, color: 'var(--text-light)' }}>Min {pkg.min_persons} persons</p>
                  </div>
                  <Link to="/request-quote" className="btn btn-primary btn-sm">Enquire</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- GALLERY PAGE ----
const DEFAULT_GALLERY = [
  { emoji: '🍽️', title: 'Corporate Buffet Setup',  category: 'corporate', image: '' },
  { emoji: '💒', title: 'Wedding Reception',        category: 'wedding',   image: '' },
  { emoji: '🫓', title: 'Live Dosa Counter',         category: 'events',    image: '' },
  { emoji: '🥗', title: 'Executive Lunch',           category: 'corporate', image: '' },
  { emoji: '🍱', title: 'Festive Thali',             category: 'events',    image: '' },
  { emoji: '🌸', title: 'Wedding Mandap Catering',  category: 'wedding',   image: '' },
  { emoji: '🥘', title: 'Office Daily Meals',        category: 'corporate', image: '' },
  { emoji: '☕', title: 'Conference Tea Break',      category: 'corporate', image: '' },
  { emoji: '🎂', title: 'Birthday Celebration',     category: 'events',    image: '' },
];

export function GalleryPage() {
  const { getJson } = useContent();
  const items = getJson('gallery', 'items', DEFAULT_GALLERY);

  return (
    <div>
      <PageHero title="Our Gallery" desc="A glimpse into the events we have crafted with love and expertise" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              background: 'var(--cream-dark)', borderRadius: 14,
              border: '1px solid var(--border)', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              {item.image ? (
                <img
                  src={item.image} alt={item.title}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div style={{
                height: item.image ? 'auto' : 180,
                display: item.image ? 'none' : 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: 60,
              }}>
                {item.emoji}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</p>
                <span className={`badge badge-${item.category}`} style={{ marginTop: 6 }}>{item.category}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: 32, fontSize: 14 }}>
          📸 Full photo gallery available on request. Contact us for event portfolio.
        </p>
      </div>
    </div>
  );
}

// ---- TESTIMONIALS PAGE ----
export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => { api.get('/reports/testimonials').then(r => setTestimonials(r.data)).catch(() => {}); }, []);

  return (
    <div>
      <PageHero title="Testimonials" desc="What our valued clients say about their experience" />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        {testimonials.map(t => (
          <div key={t.id} className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {Array.from({ length: t.rating }).map((_, i) => <span key={i} style={{ color: 'var(--gold)' }}>★</span>)}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 20 }}>"{t.text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontFamily: 'Playfair Display, serif', color: 'var(--maroon)' }}>{t.name[0]}</div>
              <div>
                <p style={{ fontWeight: 600 }}>{t.name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{t.role}{t.company ? ` · ${t.company}` : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- FAQ PAGE ----
const DEFAULT_FAQS = [
  { q: 'What is the minimum guest count?',          a: 'Our minimum is 25 persons for most packages. Contact us to discuss smaller groups.' },
  { q: 'Do you provide Jain and vegan options?',    a: 'Yes! We cater to Jain, vegan, diabetic-friendly, and all dietary preferences.' },
  { q: 'How far in advance should I book?',         a: 'Weddings: 2–3 months. Corporate: 2–4 weeks. Recurring meals: 1 week.' },
  { q: 'Do you handle outdoor events?',             a: 'Yes, we provide full setup for outdoor venues including equipment and serving staff.' },
  { q: 'Is GST billing available for corporates?',  a: 'Absolutely. We provide GST-compliant invoices for all corporate clients.' },
  { q: 'What areas do you serve?',                  a: 'Mumbai, Pune, Nashik, and nearby Maharashtra districts.' },
  { q: 'Can we do a food tasting before booking?',  a: 'Yes, for wedding bookings above ₹1 lakh. Corporate clients can request a sample tray.' },
  { q: 'What payment methods do you accept?',       a: 'Cash, NEFT/RTGS, UPI, and cheque payments.' },
];

export function FAQPage() {
  const [open, setOpen]    = useState(null);
  const { getJson }        = useContent();
  const faqs               = getJson('faq', 'items', DEFAULT_FAQS);

  return (
    <div>
      <PageHero title="FAQ" desc="Answers to your most common questions" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        {faqs.map((item, i) => (
          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '18px 20px', background: open === i ? 'var(--cream-dark)' : 'var(--white)', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, fontFamily: 'Playfair Display, serif', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {item.q} <span style={{ fontSize: 22, color: 'var(--gold)', lineHeight: 1 }}>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div style={{ padding: '0 20px 20px', fontSize: 15, color: 'var(--text-light)', lineHeight: 1.7 }}>{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- SERVICES PAGE ----
export function ServicesPage() {
  return (
    <div>
      <PageHero title="Our Services" desc="Full-spectrum catering for every occasion" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        {[
          { title: 'Corporate Catering', path: '/corporate-catering', desc: 'Daily meal plans, executive lunches, office buffets, conference catering and more for businesses of all sizes.' },
          { title: 'Wedding Catering',   path: '/wedding-catering',   desc: 'Grand wedding feasts with multi-course menus, live counters, and professional service for memorable celebrations.' },
          { title: 'Event Catering',     path: '/event-catering',     desc: 'Birthday parties, anniversaries, social gatherings, cultural events, and private celebrations.' },
        ].map(s => (
          <div key={s.title} className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-light)', maxWidth: 560 }}>{s.desc}</p>
            </div>
            <Link to={s.path} className="btn btn-primary btn-sm">Learn More <ArrowRight size={14} /></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_WEDDING_SERVICES = [
  'Haldi & Mehendi Catering', 'Sangeet Evening Snacks', 'Reception Grand Buffet',
  'Live Counters (Dosa, Chat, Pasta)', 'Traditional Thali Service',
  'Cocktail & Welcome Drinks', 'Varmala Ceremony Refreshments', 'Post-Wedding Lunch',
];

export function WeddingCateringPage() {
  const { get, getJson } = useContent();
  const heroSub  = get('wedding', 'hero_subtitle',    'For Your Special Day');
  const heroTitle = get('wedding', 'hero_title',      'Wedding Catering');
  const heroDesc  = get('wedding', 'hero_description','Unforgettable wedding feasts crafted with love, tradition, and culinary excellence');
  const heroCta   = get('wedding', 'hero_cta',        'Plan Your Wedding Menu');
  const services  = getJson('wedding', 'services',    DEFAULT_WEDDING_SERVICES);

  return (
    <div>
      <PageHero
        bg="linear-gradient(135deg, #4A0018 0%, #2D000E 100%)"
        subtitle={heroSub} subtitleColor="#F48FB1"
        title={heroTitle}
        desc={heroDesc} descColor="#F48FB1"
      >
        <Link to="/request-quote" className="btn btn-primary">{heroCta}</Link>
      </PageHero>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div className="auto-grid">
          {services.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '16px 20px', background: 'var(--white)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <CheckCircle size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <span style={{ fontSize: 15 }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/packages" className="btn btn-primary">View Wedding Packages</Link>
          <Link to="/request-quote" className="btn btn-ghost">Request Custom Quote</Link>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_EVENT_TYPES = [
  { icon: '🎂', title: 'Birthday Parties' },
  { icon: '💑', title: 'Anniversary Celebrations' },
  { icon: '🪔', title: 'Festive Get-Togethers' },
  { icon: '🎭', title: 'Cultural Events' },
  { icon: '⚽', title: 'Sports Events' },
  { icon: '🎓', title: 'Alumni Meets' },
  { icon: '👋', title: 'Farewell Parties' },
  { icon: '🕉️', title: 'Pooja & Religious Events' },
];

export function EventCateringPage() {
  const { get, getJson } = useContent();
  const heroTitle = get('events', 'hero_title',       'Event Catering');
  const heroDesc  = get('events', 'hero_description', 'Every celebration deserves extraordinary food and flawless service');
  const heroCta   = get('events', 'hero_cta',         'Book for Your Event');
  const types     = getJson('events', 'types',         DEFAULT_EVENT_TYPES);

  return (
    <div>
      <PageHero
        bg="linear-gradient(135deg, #1B3A1B 0%, #0D200D 100%)"
        title={heroTitle}
        desc={heroDesc} descColor="#A5D6A7"
      >
        <Link to="/request-quote" className="btn btn-primary">{heroCta}</Link>
      </PageHero>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div className="auto-grid">
          {types.map((e, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{e.icon || '🎉'}</div>
              <h4 style={{ fontSize: 16 }}>{e.title || e}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
