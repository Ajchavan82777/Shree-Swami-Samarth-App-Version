import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, MessageSquare, Users, Building2, Calendar,
  FileText, Receipt, Package, UserCheck, BarChart2, Settings,
  LogOut, Menu, X, ChefHat
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { path: '/admin/customers', icon: Users, label: 'Customers' },
  { path: '/admin/corporate', icon: Building2, label: 'Corporate' },
  { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/admin/quotations', icon: FileText, label: 'Quotations' },
  { path: '/admin/invoices', icon: Receipt, label: 'Invoices' },
  { path: '/admin/packages', icon: Package, label: 'Packages' },
  { path: '/admin/staff', icon: UserCheck, label: 'Staff' },
  { path: '/admin/reports', icon: BarChart2, label: 'Reports' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/admin/login'); };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 12px' : '20px 20px', borderBottom: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ChefHat size={20} color="var(--dark)" />
        </div>
        {!collapsed && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', lineHeight: 1.2 }}>SSS Foods</p>
            <p style={{ fontSize: 10, color: '#7A6255' }}>Admin Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = loc.pathname === path;
          return (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px 12px' : '10px 14px',
              borderRadius: 8, marginBottom: 2,
              background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: active ? 'var(--gold)' : '#8A7060',
              fontWeight: active ? 600 : 400,
              fontSize: 14,
              transition: 'all 0.15s',
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: collapsed ? '12px 8px' : '12px 8px', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
        {!collapsed && user && (
          <div style={{ padding: '8px 14px 12px', fontSize: 13 }}>
            <p style={{ color: '#C4A882', fontWeight: 600 }}>{user.name}</p>
            <p style={{ color: '#6A5040', fontSize: 12 }}>{user.email}</p>
          </div>
        )}
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', border: 'none', background: 'transparent',
          borderRadius: 8, cursor: 'pointer', color: '#8A7060',
          justifyContent: collapsed ? 'center' : 'flex-start',
          fontSize: 14,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,40,40,0.1)'; e.currentTarget.style.color = '#C62828'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8A7060'; }}>
          <LogOut size={18} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--cream)', overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220,
        background: 'var(--dark)',
        flexShrink: 0,
        transition: 'width 0.2s',
        display: 'flex', flexDirection: 'column',
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)} />
          <aside style={{ width: 240, background: 'var(--dark)', position: 'relative', zIndex: 201 }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: 60, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
          <button className="close-btn" onClick={() => { setCollapsed(!collapsed); setMobileOpen(!mobileOpen); }} style={{ flexShrink: 0 }}>
            {collapsed || mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
              {navItems.find(n => n.path === loc.pathname)?.label || 'Admin'}
            </span>
          </div>
          <Link to="/" target="_blank" style={{ fontSize: 12, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
            View Website ↗
          </Link>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>

      <style>{`@media(max-width:768px){ .desktop-sidebar{display:none!important;} }`}</style>
    </div>
  );
}
