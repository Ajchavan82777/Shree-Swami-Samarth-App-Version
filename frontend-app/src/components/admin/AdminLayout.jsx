import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  LayoutDashboard, MessageSquare, Users, Building2, Calendar,
  FileText, Receipt, Package, UserCheck, BarChart2, Settings,
  LogOut, Menu, X, ChefHat, Layers, Shield, Code2
} from 'lucide-react';

const ALL_NAV = [
  { path: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard',      key: 'dashboard'  },
  { path: '/admin/inquiries',  icon: MessageSquare,   label: 'Inquiries',       key: 'inquiries'  },
  { path: '/admin/customers',  icon: Users,           label: 'Customers',       key: 'customers'  },
  { path: '/admin/corporate',  icon: Building2,       label: 'Corporate',       key: 'corporate'  },
  { path: '/admin/bookings',   icon: Calendar,        label: 'Bookings',        key: 'bookings'   },
  { path: '/admin/quotations', icon: FileText,        label: 'Quotations',      key: 'quotations' },
  { path: '/admin/invoices',   icon: Receipt,         label: 'Invoices',        key: 'invoices'   },
  { path: '/admin/packages',   icon: Package,         label: 'Packages',        key: 'packages'   },
  { path: '/admin/staff',      icon: UserCheck,       label: 'Staff',           key: 'staff'      },
  { path: '/admin/reports',    icon: BarChart2,       label: 'Reports',         key: 'reports'    },
  { path: '/admin/content',    icon: Layers,          label: 'Website Content', key: 'content'    },
  { path: '/admin/settings',   icon: Settings,        label: 'Settings',        key: 'settings'   },
  { path: '/admin/roles',      icon: Shield,          label: 'Roles & Access',  key: 'roles'      },
  { path: '/admin/users',      icon: Users,           label: 'Users',            key: 'users'      },
  { path: '/admin/developer',  icon: Code2,           label: 'Developer Support', key: 'developer'  },
];

/* Nav list always rendered with icon + label */
function NavLinks({ onClose, navItems }) {
  const loc = useLocation();
  return (
    <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = loc.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 8, marginBottom: 2,
              background: active ? 'rgba(201,168,76,0.18)' : 'transparent',
              color: active ? 'var(--gold)' : '#9A8070',
              fontWeight: active ? 600 : 400,
              fontSize: 14, textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* Icon-only nav for collapsed desktop sidebar */
function CollapsedNav({ navItems }) {
  const loc = useLocation();
  return (
    <nav style={{ flex: 1, padding: '8px 4px', overflowY: 'auto' }}>
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = loc.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            title={label}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '11px 0', borderRadius: 8, marginBottom: 2,
              background: active ? 'rgba(201,168,76,0.18)' : 'transparent',
              color: active ? 'var(--gold)' : '#9A8070',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon size={18} />
          </Link>
        );
      })}
    </nav>
  );
}

/* Shared user + logout footer */
function SidebarFooter({ user, onLogout, showText }) {
  return (
    <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
      {showText && user && (
        <div style={{ padding: '4px 14px 10px', overflow: 'hidden' }}>
          <p style={{ color: '#C4A882', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
          <p style={{ color: '#6A5040', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
        </div>
      )}
      <button
        onClick={onLogout}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: showText ? 10 : 0, justifyContent: showText ? 'flex-start' : 'center',
          padding: '10px 14px', border: 'none', background: 'transparent',
          borderRadius: 8, cursor: 'pointer', color: '#8A7060', fontSize: 14,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,40,40,0.12)'; e.currentTarget.style.color = '#C62828'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8A7060'; }}
      >
        <LogOut size={18} />
        {showText && <span>Logout</span>}
      </button>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // 'loading' = not yet fetched, null = admin (all access), object = role permissions
  const [permissions, setPermissions] = useState('loading');
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/admin/login'); };

  /* Fetch role permissions after user loads */
  useEffect(() => {
    if (!user) return;
    const role = user.role || 'admin';
    if (role === 'admin') { setPermissions(null); return; }
    api.get(`/roles/${role}`)
      .then(r => setPermissions(r.data.permissions || {}))
      .catch(() => setPermissions({})); // {} = no access on API failure
  }, [user]);

  /* Route-level guard: redirect if user navigates directly to a restricted page */
  useEffect(() => {
    if (permissions === 'loading') return;
    if (permissions === null) return; // admin — all pages allowed
    const allowedPaths = ALL_NAV.filter(n => permissions[n.key] === true).map(n => n.path);
    if (!allowedPaths.includes(loc.pathname)) {
      // Redirect to first page the user actually has access to
      const first = allowedPaths[0] || '/admin/login';
      nav(first, { replace: true });
    }
  }, [permissions, loc.pathname, nav]);

  /* Filter nav based on permissions; admin always sees all */
  const navItems = (permissions === 'loading' || permissions === null)
    ? ALL_NAV
    : ALL_NAV.filter(n => permissions[n.key] === true);

  /* Close drawer on route change */
  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const pageTitle = ALL_NAV.find(n => n.path === loc.pathname)?.label || 'Admin';

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--cream)', overflow: 'hidden' }}>

      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="admin-desktop-sidebar" style={{
        width: collapsed ? 60 : 220,
        background: 'var(--dark)', flexShrink: 0,
        transition: 'width 0.2s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{
          padding: '16px 12px', borderBottom: '1px solid rgba(201,168,76,0.2)',
          display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', minHeight: 69,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ChefHat size={20} color="var(--dark)" />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', lineHeight: 1.2, whiteSpace: 'nowrap' }}>SSS Foods</p>
              <p style={{ fontSize: 10, color: '#7A6255', whiteSpace: 'nowrap' }}>Admin Portal</p>
            </div>
          )}
        </div>

        {collapsed ? <CollapsedNav navItems={navItems} /> : <NavLinks navItems={navItems} onClose={() => {}} />}

        <SidebarFooter user={user} onLogout={handleLogout} showText={!collapsed} />
      </aside>

      {/* ── Mobile Drawer ────────────────────────────── */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex' }}>
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }}
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <aside style={{
            width: 270, maxWidth: '82vw',
            background: 'var(--dark)', position: 'relative', zIndex: 301,
            display: 'flex', flexDirection: 'column',
            animation: 'slideInLeft 0.22s ease',
          }}>
            {/* Drawer header */}
            <div style={{
              padding: '14px 14px', borderBottom: '1px solid rgba(201,168,76,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ChefHat size={20} color="var(--dark)" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', lineHeight: 1.2 }}>SSS Foods</p>
                  <p style={{ fontSize: 11, color: '#7A6255' }}>Admin Portal</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8A7060', padding: 6 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links with labels */}
            <NavLinks navItems={navItems} onClose={() => setMobileOpen(false)} />

            <SidebarFooter user={user} onLogout={() => { setMobileOpen(false); handleLogout(); }} showText />
          </aside>
        </div>
      )}

      {/* ── Main Content ────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 56, background: 'var(--white)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0,
        }}>
          {/* Mobile hamburger */}
          <button
            className="admin-hamburger"
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 6, color: 'var(--text)', flexShrink: 0,
            }}
          >
            <Menu size={22} />
          </button>
          {/* Desktop collapse toggle */}
          <button
            className="admin-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 6, color: 'var(--text)', flexShrink: 0,
            }}
          >
            <Menu size={20} />
          </button>

          <span style={{
            flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--text)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {pageTitle}
          </span>

          <Link
            to="/"
            target="_blank"
            style={{ fontSize: 12, color: 'var(--text-light)', whiteSpace: 'nowrap', textDecoration: 'none' }}
          >
            View Website ↗
          </Link>
        </header>

        {/* Page content */}
        <main className="admin-main-content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-hamburger       { display: flex !important; align-items: center; }
          .admin-collapse-btn    { display: none !important; }
        }
        @media (min-width: 769px) {
          .admin-hamburger    { display: none !important; }
          .admin-collapse-btn { display: flex !important; align-items: center; }
        }
      `}</style>
    </div>
  );
}
