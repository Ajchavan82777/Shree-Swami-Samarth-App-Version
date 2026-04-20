import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Share2, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark-2)', color: '#D4B896', paddingTop: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 48 }}>
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--gold)', marginBottom: 12 }}>
              Shree Swami Samarth
            </h3>
            <p style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 16 }}>
              Food & Hospitality Services
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#A89080' }}>
              Premium catering solutions for corporate offices, weddings, and special events across Mumbai &amp; Maharashtra since 2010. Founded by Devendra Kamble.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[Share2, MessageCircle, Globe].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.15)'}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 18 }}>Our Services</h4>
            {['Corporate Catering', 'Wedding Catering', 'Event Catering', 'Conference Meals', 'Bulk Meal Service', 'Pantry Service'].map(s => (
              <div key={s} style={{ marginBottom: 10 }}>
                <Link to="/services" style={{ fontSize: 14, color: '#A89080', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = '#A89080'}>
                  {s}
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 18 }}>Quick Links</h4>
            {[['About Us', '/about'], ['Menu Packages', '/packages'], ['Gallery', '/gallery'], ['Testimonials', '/testimonials'], ['FAQ', '/faq'], ['Request Quote', '/request-quote']].map(([label, path]) => (
              <div key={path} style={{ marginBottom: 10 }}>
                <Link to={path} style={{ fontSize: 14, color: '#A89080' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = '#A89080'}>
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 18 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#A89080' }}>Vikhroli, Mumbai – 400083, Maharashtra</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--gold)' }} />
                <a href="tel:+919876543210" style={{ fontSize: 14, color: '#A89080' }}>+91 98765 43210</a>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--gold)' }} />
                <a href="mailto:info@shreeswamisamarthfoods.com" style={{ fontSize: 14, color: '#A89080' }}>info@shreeswamisamarthfoods.com</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#6B5040' }}>© 2024 Shree Swami Samarth Food and Hospitality Services. All rights reserved.</p>
          <p style={{ fontSize: 13, color: '#6B5040' }}>Serving with Love & Hygiene since 2010</p>
        </div>
      </div>
    </footer>
  );
}
