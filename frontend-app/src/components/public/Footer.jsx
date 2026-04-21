import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

// Inline SVG icons for social brands not in lucide-react
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
import { useContent } from '../../context/ContentContext';

export default function Footer() {
  const { get } = useContent();

  const phone   = get('contact', 'phone',   '+91 98765 43210');
  const email   = get('contact', 'email',   'info@shreeswamisamarthfoods.com');
  const address = get('contact', 'address', 'Vikhroli, Mumbai – 400083, Maharashtra');
  const desc    = get('footer',  'description', 'Premium catering solutions for corporate offices, weddings, and special events across Mumbai & Maharashtra since 2010. Founded by Devendra Kamble.');
  const copy    = get('footer',  'copyright',   '© 2024 Shree Swami Samarth Food and Hospitality Services. All rights reserved.');
  const tagline = get('company', 'tagline',  'Serving with Love & Hygiene since 2010');

  const whatsapp  = get('social_links', 'whatsapp',  '');
  const instagram = get('social_links', 'instagram', '');
  const facebook  = get('social_links', 'facebook',  '');
  const youtube   = get('social_links', 'youtube',   '');
  const twitter   = get('social_links', 'twitter',   '');

  const socialLinks = [
    { href: whatsapp  || `https://wa.me/${phone.replace(/\D/g,'')}`, Icon: MessageCircle, label: 'WhatsApp' },
    { href: instagram, Icon: InstagramIcon, label: 'Instagram' },
    { href: facebook,  Icon: FacebookIcon,  label: 'Facebook' },
    { href: youtube,   Icon: YoutubeIcon,   label: 'YouTube' },
    { href: twitter,   Icon: TwitterIcon,   label: 'Twitter' },
  ].filter(s => s.href);

  const serviceLinks = [
    ['Corporate Catering', '/corporate-catering'],
    ['Wedding Catering',   '/wedding-catering'],
    ['Event Catering',     '/event-catering'],
    ['Conference Meals',   '/services'],
    ['Bulk Meal Service',  '/services'],
    ['Pantry Service',     '/services'],
  ];
  const quickLinks = [
    ['About Us',       '/about'],
    ['Menu Packages',  '/packages'],
    ['Gallery',        '/gallery'],
    ['Testimonials',   '/testimonials'],
    ['FAQ',            '/faq'],
    ['Request Quote',  '/request-quote'],
  ];

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
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#A89080' }}>{desc}</p>
            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                {socialLinks.map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                    style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--dark)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; e.currentTarget.style.color = 'var(--gold)'; }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 18 }}>Our Services</h4>
            {serviceLinks.map(([label, path]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <Link to={path} style={{ fontSize: 14, color: '#A89080', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = '#A89080'}>
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--gold-light)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 18 }}>Quick Links</h4>
            {quickLinks.map(([label, path]) => (
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
                <span style={{ fontSize: 14, color: '#A89080' }}>{address}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--gold)' }} />
                <a href={`tel:${phone.replace(/\s/g,'')}`} style={{ fontSize: 14, color: '#A89080' }}>{phone}</a>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--gold)' }} />
                <a href={`mailto:${email}`} style={{ fontSize: 14, color: '#A89080' }}>{email}</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#6B5040' }}>{copy}</p>
          <p style={{ fontSize: 13, color: '#6B5040' }}>{tagline}</p>
        </div>
      </div>
    </footer>
  );
}
