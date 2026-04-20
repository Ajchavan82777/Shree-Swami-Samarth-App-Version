import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Services', path: '/services',
    children: [
      { label: 'Corporate Catering', path: '/corporate-catering' },
      { label: 'Wedding Catering', path: '/wedding-catering' },
      { label: 'Event Catering', path: '/event-catering' },
    ]
  },
  { label: 'Menu Packages', path: '/packages' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropdown(null); }, [loc.pathname]);

  // When scrolled: cream light bar. When not scrolled: dark overlay so text stays readable on ANY page background.
  const linkColor       = scrolled ? 'var(--text)'      : 'rgba(255,255,255,0.92)';
  const activeLinkColor = scrolled ? 'var(--gold-dark)' : 'var(--gold)';
  const activeLinkBg    = scrolled ? 'var(--cream-dark)' : 'rgba(201,168,76,0.18)';
  const logoColor       = scrolled ? 'var(--maroon)'    : 'var(--white)';
  const subtitleColor   = scrolled ? 'var(--gold-dark)' : 'var(--gold-light)';
  const phoneColor      = scrolled ? 'var(--maroon)'    : 'var(--gold)';
  const iconColor       = scrolled ? 'var(--text)'      : 'rgba(255,255,255,0.92)';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(253,248,240,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72,
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', gap: 0, flexShrink: 0 }}>
          <span className="nav-logo-title" style={{
            fontFamily: 'Playfair Display, serif', fontSize: 18,
            fontWeight: 700, color: logoColor, lineHeight: 1.2, transition: 'color 0.3s',
          }}>
            Shree Swami Samarth
          </span>
          <span className="nav-logo-sub" style={{
            fontSize: 10, color: subtitleColor,
            letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.3s',
          }}>
            Food &amp; Hospitality Services
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
          {navLinks.map(link => (
            <div key={link.path} style={{ position: 'relative' }}
              onMouseEnter={() => link.children && setDropdown(link.path)}
              onMouseLeave={() => setDropdown(null)}>
              <Link to={link.path} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 13px', borderRadius: 8,
                fontSize: 14, fontWeight: 500,
                color: loc.pathname === link.path ? activeLinkColor : linkColor,
                background: loc.pathname === link.path ? activeLinkBg : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}>
                {link.label}
                {link.children && <ChevronDown size={13} style={{ color: 'inherit', opacity: 0.7 }} />}
              </Link>

              {link.children && dropdown === link.path && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 210,
                  background: 'var(--white)', borderRadius: 10,
                  boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
                  padding: '8px 0', zIndex: 200,
                }}>
                  {link.children.map(c => (
                    <Link key={c.path} to={c.path} style={{
                      display: 'block', padding: '10px 18px',
                      fontSize: 14, color: 'var(--text)',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA + Mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <a href="tel:+919876543210" className="nav-phone" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: phoneColor, fontWeight: 600, transition: 'color 0.3s',
          }}>
            <Phone size={14} /> +91 98765 43210
          </a>
          <Link to="/request-quote" className="btn btn-primary btn-sm" style={{ background: 'var(--gold)', color: 'var(--dark)', whiteSpace: 'nowrap' }}>
            Get Quote
          </Link>
          <button className="nav-toggle" onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: 4, borderRadius: 6, display: 'none', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s' }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: 'var(--white)', borderTop: '1px solid var(--border)',
          padding: '12px 20px 24px',
          maxHeight: 'calc(100vh - 72px)', overflowY: 'auto',
        }}>
          {navLinks.map(link => (
            <div key={link.path}>
              <Link to={link.path} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 0', borderBottom: '1px solid var(--cream-dark)',
                color: loc.pathname === link.path ? 'var(--gold-dark)' : 'var(--text)',
                fontWeight: 600, fontSize: 15,
              }}>
                {link.label}
              </Link>
              {link.children && link.children.map(c => (
                <Link key={c.path} to={c.path} style={{
                  display: 'block', padding: '10px 0 10px 20px',
                  color: 'var(--text-light)', fontSize: 14,
                  borderBottom: '1px solid var(--cream-dark)',
                }}>
                  › {c.label}
                </Link>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '2px solid var(--cream-dark)' }}>
            <a href="tel:+919876543210" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'var(--maroon)', fontWeight: 600, fontSize: 15, marginBottom: 14,
            }}>
              <Phone size={16} /> +91 98765 43210
            </a>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/request-quote" className="btn btn-primary btn-sm">Get Quote</Link>
              <Link to="/book-now" className="btn btn-ghost btn-sm">Book Now</Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .nav-phone   { display: none !important; }
          .nav-toggle  { display: flex !important; }
        }
        @media (max-width: 480px) {
          .nav-logo-title { font-size: 15px !important; }
          .nav-logo-sub   { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
