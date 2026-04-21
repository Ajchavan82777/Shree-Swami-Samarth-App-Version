import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import HomePage from './pages/public/HomePage';
import { AboutPage, CorporateCateringPage, PackagesPage, GalleryPage, TestimonialsPage, FAQPage, ServicesPage, WeddingCateringPage, EventCateringPage } from './pages/public/OtherPages';
import { ContactPage, RequestQuotePage, BookNowPage } from './pages/public/ContactPages';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import InquiriesPage from './pages/admin/InquiriesPage';
import InvoicesPage from './pages/admin/InvoicesPage';
import { CorporatePage, BookingsPage, CustomersPage, PackagesAdminPage, StaffPage, SettingsPage } from './pages/admin/AdminPages';
import ContentPage from './pages/admin/ContentPage';
import QuotationsPage from './pages/admin/QuotationsPage';
import ReportsPage from './pages/admin/ReportsPage';
import RolesPage from './pages/admin/RolesPage';
import UsersPage from './pages/admin/UsersPage';
import DeveloperPage, { applyBranding } from './pages/admin/DeveloperPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (<><Navbar /><main style={{ minHeight: '100vh' }}>{children}</main><Footer /></>);
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function App() {
  useEffect(() => {
    try {
      const cfg = JSON.parse(localStorage.getItem('sss_dev_config') || '{}');
      const profile = cfg.profiles?.[cfg.activeProfile];
      if (profile?.colors) applyBranding(profile.colors);
    } catch {}
  }, []);

  return (
    <AuthProvider>
      <ContentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/corporate-catering" element={<PublicLayout><CorporateCateringPage /></PublicLayout>} />
          <Route path="/wedding-catering" element={<PublicLayout><WeddingCateringPage /></PublicLayout>} />
          <Route path="/event-catering" element={<PublicLayout><EventCateringPage /></PublicLayout>} />
          <Route path="/packages" element={<PublicLayout><PackagesPage /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
          <Route path="/testimonials" element={<PublicLayout><TestimonialsPage /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/request-quote" element={<PublicLayout><RequestQuotePage /></PublicLayout>} />
          <Route path="/book-now" element={<PublicLayout><BookNowPage /></PublicLayout>} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><InquiriesPage /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/admin/corporate" element={<ProtectedRoute><CorporatePage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/admin/quotations" element={<ProtectedRoute><QuotationsPage /></ProtectedRoute>} />
          <Route path="/admin/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
          <Route path="/admin/packages" element={<ProtectedRoute><PackagesAdminPage /></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/admin/content"  element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
          <Route path="/admin/roles"     element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />
          <Route path="/admin/users"     element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/developer" element={<ProtectedRoute><DeveloperPage /></ProtectedRoute>} />
          <Route path="*" element={<PublicLayout><div style={{textAlign:'center',padding:'120px 24px'}}><h1 style={{fontFamily:'Playfair Display,serif',fontSize:80,color:'var(--gold)'}}>404</h1><p>Page not found</p><a href="/" className="btn btn-primary">Go Home</a></div></PublicLayout>} />
        </Routes>
      </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
