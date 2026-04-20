import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'admin@shreeswamisamarthfoods.demo', password: 'Admin@123' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.email, form.password);
    if (res.success) nav('/admin/dashboard');
    else setError(res.message);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 60%, #3A1A00 100%)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ChefHat size={34} color="var(--dark)" />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--white)', marginBottom: 4 }}>
            Shree Swami Samarth
          </h1>
          <p style={{ fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--white)', borderRadius: 18, padding: '36px 32px', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 28 }}>Sign in to your admin account</p>

          {/* Demo hint */}
          <div style={{ background: '#E8EAF6', border: '1px solid #C5CAE9', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: '#283593', fontWeight: 600, marginBottom: 2 }}>🔑 Demo Credentials</p>
            <p style={{ fontSize: 12, color: '#3949AB' }}>Email: admin@shreeswamisamarthfoods.demo</p>
            <p style={{ fontSize: 12, color: '#3949AB' }}>Password: Admin@123</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input className="form-input" type={showPwd ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="close-btn"
                style={{ position: 'absolute', right: 12, top: 34 }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6A5040' }}>
          <a href="/" style={{ color: 'var(--gold)' }}>← Back to website</a>
        </p>
      </div>
    </div>
  );
}
