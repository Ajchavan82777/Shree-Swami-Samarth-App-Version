import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Code2, Palette, Database, Globe, ToggleLeft, ToggleRight,
  Download, Upload, Plus, Trash2, Copy, Check, RefreshCw,
  ChevronDown, ChevronUp, GripVertical, Eye, EyeOff, Save,
  Zap, AlertTriangle, Terminal, Settings2, Package2
} from 'lucide-react';
import api from '../../utils/api';

// ─── Default config ────────────────────────────────────────────────────────────

const DEFAULT_COLORS = {
  'gold':         '#C9A84C',
  'gold-light':   '#E8D5A3',
  'gold-dark':    '#A07830',
  'maroon':       '#7B1D1D',
  'maroon-light': '#A52A2A',
  'cream':        '#FDF8F0',
  'cream-dark':   '#F5EDD8',
  'dark':         '#1A0A00',
  'dark-2':       '#2D1A0A',
};

const DEFAULT_SECTIONS = [
  { id: 'hero',         label: 'Hero Banner',         visible: true  },
  { id: 'services',     label: 'Services',            visible: true  },
  { id: 'corporate',    label: 'Corporate Highlight', visible: true  },
  { id: 'why_us',       label: 'Why Choose Us',       visible: true  },
  { id: 'packages',     label: 'Packages Preview',    visible: true  },
  { id: 'steps',        label: 'How to Book',         visible: true  },
  { id: 'testimonials', label: 'Testimonials',        visible: true  },
  { id: 'gallery',      label: 'Gallery Preview',     visible: true  },
  { id: 'cta',          label: 'Call to Action',      visible: true  },
];

const DEFAULT_ADMIN_NAV = {
  dashboard: true, inquiries: true, customers: true, corporate: true,
  bookings: true, quotations: true, invoices: true, packages: true,
  staff: true, reports: true, content: true, settings: true,
  roles: true, users: true,
};

const DEFAULT_PUBLIC_PAGES = {
  gallery: true, testimonials: true, faq: true,
  about: true, corporate: true, wedding: true, events: true,
};

function makeDefaultProfile(name = 'Shree Swami Samarth') {
  return {
    clientName: name,
    clientSlug: name.toLowerCase().replace(/\s+/g, '-'),
    description: 'Catering & Hospitality Services',
    colors: { ...DEFAULT_COLORS },
    fonts: { body: 'DM Sans', heading: 'Playfair Display' },
    connections: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      supabaseServiceKey: '',
      apiBaseUrl: 'http://localhost:5000/api',
      frontendUrl: 'http://localhost:5173',
      renderServiceUrl: '',
      vercelUrl: '',
    },
    sections: DEFAULT_SECTIONS.map(s => ({ ...s })),
    adminNav: { ...DEFAULT_ADMIN_NAV },
    publicPages: { ...DEFAULT_PUBLIC_PAGES },
  };
}

function loadConfig() {
  try {
    const raw = localStorage.getItem('sss_dev_config');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveConfig(cfg) {
  localStorage.setItem('sss_dev_config', JSON.stringify(cfg));
}

export function applyBranding(colors) {
  if (!colors) return;
  Object.entries(colors).forEach(([k, v]) => {
    document.documentElement.style.setProperty(`--${k}`, v);
  });
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
      fontWeight: 600, fontSize: 13,
      background: active ? 'var(--maroon)' : 'var(--cream)',
      color: active ? '#fff' : 'var(--text)',
      transition: 'all .18s',
    }}>{label}</button>
  );
}

function SectionCard({ children, title, icon: Icon }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          {Icon && <Icon size={16} style={{ color: 'var(--gold-dark)' }} />}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--maroon)', margin: 0 }}>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

function CopyBtn({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button onClick={handleCopy} className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
      {copied ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

function MaskedInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        className="form-input"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingRight: 42, fontSize: 13 }}
      />
      <button onClick={() => setShow(s => !s)} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: 2,
      }}>
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ─── Tab: Client Profiles ──────────────────────────────────────────────────────

function ProfilesTab({ cfg, setCfg }) {
  const [newName, setNewName] = useState('');

  const profiles = cfg.profiles || {};
  const activeKey = cfg.activeProfile;

  const switchProfile = key => {
    const updated = { ...cfg, activeProfile: key };
    setCfg(updated);
    saveConfig(updated);
    applyBranding(profiles[key]?.colors);
  };

  const createProfile = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (profiles[key]) return alert('Profile with this slug already exists.');
    const updated = {
      ...cfg,
      activeProfile: key,
      profiles: {
        ...profiles,
        [key]: makeDefaultProfile(trimmed),
      },
    };
    setCfg(updated);
    saveConfig(updated);
    setNewName('');
  };

  const duplicateProfile = () => {
    const source = profiles[activeKey];
    if (!source) return;
    const base = source.clientName + ' Copy';
    const key  = base.toLowerCase().replace(/\s+/g, '-');
    const updated = {
      ...cfg,
      activeProfile: key,
      profiles: { ...profiles, [key]: { ...source, clientName: base, clientSlug: key } },
    };
    setCfg(updated);
    saveConfig(updated);
  };

  const deleteProfile = key => {
    if (Object.keys(profiles).length <= 1) return alert('Cannot delete the last profile.');
    if (!confirm(`Delete profile "${profiles[key]?.clientName}"?`)) return;
    const rest = { ...profiles };
    delete rest[key];
    const nextKey = Object.keys(rest)[0];
    const updated = { ...cfg, activeProfile: nextKey, profiles: rest };
    setCfg(updated);
    saveConfig(updated);
    applyBranding(rest[nextKey]?.colors);
  };

  const updateActiveField = (field, value) => {
    const updated = {
      ...cfg,
      profiles: {
        ...profiles,
        [activeKey]: { ...profiles[activeKey], [field]: value },
      },
    };
    setCfg(updated);
    saveConfig(updated);
  };

  const active = profiles[activeKey] || {};

  return (
    <div>
      <SectionCard title="Active Profile" icon={Settings2}>
        <div className="form-grid" style={{ marginBottom: 12 }}>
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input className="form-input" value={active.clientName || ''} onChange={e => updateActiveField('clientName', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Profile Slug (read-only)</label>
            <input className="form-input" value={activeKey} readOnly style={{ background: 'var(--cream)', color: 'var(--text-light)' }} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <input className="form-input" value={active.description || ''} onChange={e => updateActiveField('description', e.target.value)} placeholder="e.g. Catering & Hospitality Services" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={duplicateProfile}><Copy size={13} /> Duplicate</button>
          <button className="btn btn-danger btn-sm" onClick={() => deleteProfile(activeKey)}><Trash2 size={13} /> Delete This Profile</button>
        </div>
      </SectionCard>

      <SectionCard title="All Profiles" icon={Package2}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 12, marginBottom: 16 }}>
          {Object.entries(profiles).map(([key, p]) => (
            <div key={key} onClick={() => switchProfile(key)} style={{
              padding: '14px 16px', borderRadius: 10, border: `2px solid ${key === activeKey ? 'var(--gold)' : 'var(--border)'}`,
              background: key === activeKey ? 'rgba(201,168,76,0.08)' : '#fff',
              cursor: 'pointer', transition: 'all .15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: key === activeKey ? 'var(--maroon)' : 'var(--dark)', margin: 0 }}>{p.clientName}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-light)', margin: '3px 0 0' }}>{p.description || key}</p>
                </div>
                {key === activeKey && (
                  <span style={{ fontSize: 10, background: 'var(--gold)', color: 'var(--dark)', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>ACTIVE</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {Object.values(p.colors || {}).slice(0, 5).map((c, i) => (
                  <span key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)', display: 'inline-block' }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="form-input" placeholder="New client name…" value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createProfile()}
            style={{ flex: 1, maxWidth: 280, fontSize: 13 }} />
          <button className="btn btn-primary btn-sm" onClick={createProfile}><Plus size={13} /> Create Profile</button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Branding ─────────────────────────────────────────────────────────────

const GOOGLE_FONTS = [
  'DM Sans','Inter','Roboto','Open Sans','Lato','Nunito','Poppins','Raleway','Montserrat',
  'Source Sans Pro','Quicksand','Mulish','Work Sans','Cabin','Karla',
];
const SERIF_FONTS = [
  'Playfair Display','Merriweather','Lora','Cormorant Garamond','EB Garamond',
  'Libre Baskerville','Crimson Text','Josefin Serif','Gilda Display',
];

function BrandingTab({ cfg, setCfg }) {
  const activeKey = cfg.activeProfile;
  const profile   = cfg.profiles?.[activeKey] || {};
  const [colors, setColors] = useState({ ...DEFAULT_COLORS, ...(profile.colors || {}) });
  const [fonts,  setFonts]  = useState({ body: 'DM Sans', heading: 'Playfair Display', ...(profile.fonts || {}) });
  const [dirty,  setDirty]  = useState(false);

  const updateColor = (key, val) => {
    const next = { ...colors, [key]: val };
    setColors(next);
    document.documentElement.style.setProperty(`--${key}`, val);
    setDirty(true);
  };

  const apply = () => {
    const updated = {
      ...cfg,
      profiles: {
        ...cfg.profiles,
        [activeKey]: { ...profile, colors, fonts },
      },
    };
    setCfg(updated);
    saveConfig(updated);
    applyBranding(colors);
    setDirty(false);
    alert('Branding saved and applied!');
  };

  const resetColors = () => {
    setColors({ ...DEFAULT_COLORS });
    applyBranding(DEFAULT_COLORS);
    setDirty(true);
  };

  const COLOR_GROUPS = [
    { label: 'Primary Gold', keys: ['gold', 'gold-light', 'gold-dark'] },
    { label: 'Maroon / Accent', keys: ['maroon', 'maroon-light'] },
    { label: 'Backgrounds', keys: ['cream', 'cream-dark', 'dark', 'dark-2'] },
  ];

  return (
    <div>
      {/* Live preview strip */}
      <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 16, border: '1px solid var(--border)' }}>
        <div style={{ height: 12, display: 'flex' }}>
          {Object.values(colors).map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
        <div style={{ background: colors['dark'] || '#1A0A00', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: colors['gold'] || '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽</div>
          <div>
            <p style={{ fontFamily: fonts.heading + ', serif', color: colors['gold'] || '#C9A84C', fontSize: 16, fontWeight: 700, margin: 0 }}>{profile.clientName || 'Client Name'}</p>
            <p style={{ fontFamily: fonts.body + ', sans-serif', color: '#9A8070', fontSize: 12, margin: '2px 0 0' }}>{profile.description || 'Tagline here'}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <div style={{ padding: '6px 14px', borderRadius: 6, background: colors['gold'] || '#C9A84C', color: colors['dark'] || '#1A0A00', fontWeight: 700, fontSize: 12 }}>Button</div>
            <div style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${colors['gold'] || '#C9A84C'}`, color: colors['gold'] || '#C9A84C', fontSize: 12 }}>Outline</div>
          </div>
        </div>
        <div style={{ background: colors['cream'] || '#FDF8F0', padding: '12px 20px', display: 'flex', gap: 16 }}>
          <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 8, border: `1px solid ${colors['cream-dark'] || '#F5EDD8'}`, flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontFamily: fonts.heading + ', serif', fontSize: 15, color: colors['maroon'] || '#7B1D1D', margin: '0 0 4px', fontWeight: 700 }}>Card Title</p>
            <p style={{ fontFamily: fonts.body + ', sans-serif', fontSize: 12, color: '#7A6255', margin: 0 }}>Card body text in selected font</p>
          </div>
          <div style={{ background: colors['maroon'] || '#7B1D1D', padding: '10px 14px', borderRadius: 8, flex: 1 }}>
            <p style={{ fontFamily: fonts.heading + ', serif', fontSize: 15, color: colors['gold'] || '#C9A84C', margin: '0 0 4px', fontWeight: 700 }}>Dark Card</p>
            <p style={{ fontFamily: fonts.body + ', sans-serif', fontSize: 12, color: '#9A8070', margin: 0 }}>Inverted layout preview</p>
          </div>
        </div>
      </div>

      <SectionCard title="Color Palette" icon={Palette}>
        {COLOR_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>{group.label}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {group.keys.map(k => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--cream)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', minWidth: 180 }}>
                  <input type="color" value={colors[k] || '#000'} onChange={e => updateColor(k, e.target.value)}
                    style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: 'var(--text)' }}>{k}</p>
                    <input value={colors[k] || ''} onChange={e => updateColor(k, e.target.value)}
                      style={{ fontSize: 11, color: 'var(--text-light)', border: 'none', background: 'transparent', width: '100%', fontFamily: 'monospace', outline: 'none' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Typography" icon={Code2}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Body Font (DM Sans, Inter…)</label>
            <select className="form-select" value={fonts.body} onChange={e => setFonts(f => ({ ...f, body: e.target.value })) || setDirty(true)}>
              {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>Used for paragraphs, labels, buttons</p>
          </div>
          <div className="form-group">
            <label className="form-label">Heading Font (Playfair Display…)</label>
            <select className="form-select" value={fonts.heading} onChange={e => setFonts(f => ({ ...f, heading: e.target.value })) || setDirty(true)}>
              {SERIF_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>Used for h1–h4 tags</p>
          </div>
        </div>
      </SectionCard>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={resetColors}><RefreshCw size={13} /> Reset to Defaults</button>
        <button className="btn btn-primary" onClick={apply} style={{ gap: 6 }}>
          <Save size={14} /> {dirty ? 'Apply & Save Branding' : 'Save Branding'}
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Connections ──────────────────────────────────────────────────────────

function ConnectionsTab({ cfg, setCfg }) {
  const activeKey = cfg.activeProfile;
  const profile   = cfg.profiles?.[activeKey] || {};
  const [conn, setConn] = useState({ apiBaseUrl: 'http://localhost:5000/api', frontendUrl: 'http://localhost:5173', ...(profile.connections || {}) });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const setField = (k, v) => setConn(c => ({ ...c, [k]: v }));

  const save = () => {
    const updated = {
      ...cfg,
      profiles: { ...cfg.profiles, [activeKey]: { ...profile, connections: conn } },
    };
    setCfg(updated);
    saveConfig(updated);
    alert('Connection settings saved!');
  };

  const testBackend = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await fetch(conn.apiBaseUrl.replace(/\/api$/, '') + '/health', { signal: AbortSignal.timeout(5000) });
      setTestResult({ ok: r.ok, msg: r.ok ? `✅ Backend reachable (${r.status})` : `⚠️ Got status ${r.status}` });
    } catch (e) {
      setTestResult({ ok: false, msg: `❌ Could not reach backend: ${e.message}` });
    } finally { setTesting(false); }
  };

  const backendEnv = `# backend/.env\nDATABASE_URL=postgresql://postgres.XXXX:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres\nSUPABASE_URL=${conn.supabaseUrl || 'https://XXXX.supabase.co'}\nSUPABASE_SERVICE_ROLE_KEY=${conn.supabaseServiceKey || 'your-service-role-key'}\nJWT_SECRET_KEY=REPLACE_WITH_LONG_RANDOM_SECRET\nSECRET_KEY=REPLACE_WITH_ANOTHER_LONG_RANDOM_SECRET\nCORS_ORIGINS=${conn.frontendUrl || 'http://localhost:5173'}\nFLASK_ENV=development\nPORT=5000`;

  const frontendEnv = `# frontend-app/.env.local\nVITE_API_BASE_URL=${conn.apiBaseUrl || 'http://localhost:5000/api'}`;

  const renderEnv = `# Set these in Render → Environment Variables\nSUPABASE_URL=${conn.supabaseUrl || 'https://XXXX.supabase.co'}\nSUPABASE_SERVICE_ROLE_KEY=${conn.supabaseServiceKey || 'your-service-role-key'}\nJWT_SECRET_KEY=REPLACE_WITH_LONG_RANDOM_SECRET\nSECRET_KEY=REPLACE_WITH_ANOTHER_LONG_RANDOM_SECRET\nCORS_ORIGINS=${conn.vercelUrl || conn.frontendUrl || 'https://your-app.vercel.app'}\nPORT=10000`;

  return (
    <div>
      <SectionCard title="Supabase Configuration" icon={Database}>
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>
          <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6, color: '#e65100' }} />
          These values are stored in your browser only. Copy them to your <code>.env</code> files manually.
        </div>
        <div className="form-grid">
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Supabase Project URL</label>
            <input className="form-input" value={conn.supabaseUrl || ''} onChange={e => setField('supabaseUrl', e.target.value)} placeholder="https://xxxxxxxxxxxx.supabase.co" />
          </div>
          <div className="form-group">
            <label className="form-label">Anon / Public Key</label>
            <MaskedInput value={conn.supabaseAnonKey || ''} onChange={v => setField('supabaseAnonKey', v)} placeholder="eyJhbGc..." />
          </div>
          <div className="form-group">
            <label className="form-label">Service Role Key (secret)</label>
            <MaskedInput value={conn.supabaseServiceKey || ''} onChange={v => setField('supabaseServiceKey', v)} placeholder="eyJhbGc..." />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Application URLs" icon={Globe}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Backend API Base URL</label>
            <input className="form-input" value={conn.apiBaseUrl || ''} onChange={e => setField('apiBaseUrl', e.target.value)} placeholder="http://localhost:5000/api" />
          </div>
          <div className="form-group">
            <label className="form-label">Frontend URL</label>
            <input className="form-input" value={conn.frontendUrl || ''} onChange={e => setField('frontendUrl', e.target.value)} placeholder="http://localhost:5173" />
          </div>
          <div className="form-group">
            <label className="form-label">Render Backend URL (production)</label>
            <input className="form-input" value={conn.renderServiceUrl || ''} onChange={e => setField('renderServiceUrl', e.target.value)} placeholder="https://your-app.onrender.com/api" />
          </div>
          <div className="form-group">
            <label className="form-label">Vercel / Netlify Frontend URL (production)</label>
            <input className="form-input" value={conn.vercelUrl || ''} onChange={e => setField('vercelUrl', e.target.value)} placeholder="https://your-app.vercel.app" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={testBackend} disabled={testing}>
            <Zap size={13} /> {testing ? 'Testing…' : 'Test Backend'}
          </button>
          {testResult && (
            <span style={{ fontSize: 13, padding: '6px 12px', borderRadius: 6, background: testResult.ok ? '#e8f5e9' : '#ffebee', color: testResult.ok ? '#2e7d32' : '#c62828' }}>
              {testResult.msg}
            </span>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Generated .env Files" icon={Terminal}>
        <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>Copy these into your project files. Never commit secrets to git.</p>
        {[
          { label: 'backend/.env (local dev)', content: backendEnv },
          { label: 'frontend-app/.env.local', content: frontendEnv },
          { label: 'Render Environment Variables (production)', content: renderEnv },
        ].map(({ label, content }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
              <CopyBtn text={content} />
            </div>
            <pre style={{ background: 'var(--dark)', color: '#C4A882', padding: 12, borderRadius: 8, fontSize: 11, overflowX: 'auto', margin: 0, lineHeight: 1.7 }}>
              {content}
            </pre>
          </div>
        ))}
      </SectionCard>

      <button className="btn btn-primary" onClick={save}><Save size={14} /> Save Connection Settings</button>
    </div>
  );
}

// ─── Tab: Sections (drag-and-drop) ────────────────────────────────────────────

function SectionsTab({ cfg, setCfg }) {
  const activeKey = cfg.activeProfile;
  const profile   = cfg.profiles?.[activeKey] || {};
  const [sections, setSections] = useState(profile.sections || DEFAULT_SECTIONS.map(s => ({ ...s })));
  const dragIdx = useRef(null);

  const save = (sects) => {
    const updated = {
      ...cfg,
      profiles: { ...cfg.profiles, [activeKey]: { ...profile, sections: sects } },
    };
    setCfg(updated);
    saveConfig(updated);
  };

  const toggleVisible = (idx) => {
    const next = sections.map((s, i) => i === idx ? { ...s, visible: !s.visible } : s);
    setSections(next);
    save(next);
  };

  const onDragStart = (e, idx) => {
    dragIdx.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const next = [...sections];
    const [item] = next.splice(dragIdx.current, 1);
    next.splice(idx, 0, item);
    dragIdx.current = idx;
    setSections(next);
  };

  const onDragEnd = () => {
    dragIdx.current = null;
    save(sections);
  };

  return (
    <div>
      <SectionCard title="Homepage Section Order" icon={Globe}>
        <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 14 }}>
          Drag sections to reorder. Toggle visibility to show/hide them on the public website.
        </p>
        <div>
          {sections.map((s, i) => (
            <div
              key={s.id}
              draggable
              onDragStart={e => onDragStart(e, i)}
              onDragOver={e => onDragOver(e, i)}
              onDragEnd={onDragEnd}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', marginBottom: 6, borderRadius: 8,
                background: s.visible ? '#fff' : 'var(--cream)',
                border: '1px solid var(--border)',
                cursor: 'grab', opacity: s.visible ? 1 : 0.55,
                transition: 'opacity .15s',
              }}
            >
              <GripVertical size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{s.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-light)', fontFamily: 'monospace' }}>{s.id}</p>
              </div>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 8, fontWeight: 700,
                background: s.visible ? '#e8f5e9' : '#f5f5f5',
                color: s.visible ? '#2e7d32' : '#9e9e9e',
              }}>{s.visible ? 'Visible' : 'Hidden'}</span>
              <button onClick={() => toggleVisible(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.visible ? 'var(--gold-dark)' : 'var(--text-light)', padding: 4 }}>
                {s.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8, fontStyle: 'italic' }}>
          Note: Section visibility requires the public pages to read this config from localStorage.
        </p>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Feature Flags ────────────────────────────────────────────────────────

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{label}</p>
        {desc && <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-light)' }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!checked)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: checked ? 'var(--gold-dark)' : 'var(--text-light)' }}>
        {checked ? <ToggleRight size={28} style={{ color: '#2e7d32' }} /> : <ToggleLeft size={28} />}
      </button>
    </div>
  );
}

function FeaturesTab({ cfg, setCfg }) {
  const activeKey = cfg.activeProfile;
  const profile   = cfg.profiles?.[activeKey] || {};
  const [adminNav,  setAdminNav]  = useState({ ...DEFAULT_ADMIN_NAV,  ...(profile.adminNav  || {}) });
  const [pubPages,  setPubPages]  = useState({ ...DEFAULT_PUBLIC_PAGES, ...(profile.publicPages || {}) });

  const saveAll = (nav, pub) => {
    const updated = {
      ...cfg,
      profiles: { ...cfg.profiles, [activeKey]: { ...profile, adminNav: nav, publicPages: pub } },
    };
    setCfg(updated);
    saveConfig(updated);
  };

  const toggleNav = (k) => {
    const next = { ...adminNav, [k]: !adminNav[k] };
    setAdminNav(next);
    saveAll(next, pubPages);
  };

  const togglePub = (k) => {
    const next = { ...pubPages, [k]: !pubPages[k] };
    setPubPages(next);
    saveAll(adminNav, next);
  };

  const ADMIN_ITEMS = [
    { key: 'dashboard',  label: 'Dashboard',      desc: 'Main overview page' },
    { key: 'inquiries',  label: 'Inquiries',       desc: 'Customer inquiry management' },
    { key: 'customers',  label: 'Customers',       desc: 'Customer CRM' },
    { key: 'corporate',  label: 'Corporate',       desc: 'Corporate leads' },
    { key: 'bookings',   label: 'Bookings',        desc: 'Event bookings calendar' },
    { key: 'quotations', label: 'Quotations',      desc: 'Quote creation & management' },
    { key: 'invoices',   label: 'Invoices',        desc: 'Invoice & billing' },
    { key: 'packages',   label: 'Packages & Menu', desc: 'Service packages' },
    { key: 'staff',      label: 'Staff',           desc: 'Team management' },
    { key: 'reports',    label: 'Reports',         desc: 'Analytics & reporting' },
    { key: 'content',    label: 'Website Content', desc: 'Public site content editor' },
    { key: 'settings',   label: 'Settings',        desc: 'App settings' },
    { key: 'roles',      label: 'Roles & Access',  desc: 'Role-based access control' },
    { key: 'users',      label: 'Users',           desc: 'Admin user management' },
  ];

  const PUB_ITEMS = [
    { key: 'gallery',      label: 'Gallery Page',          desc: '/gallery' },
    { key: 'testimonials', label: 'Testimonials Page',     desc: '/testimonials' },
    { key: 'faq',          label: 'FAQ Page',              desc: '/faq' },
    { key: 'about',        label: 'About Page',            desc: '/about' },
    { key: 'corporate',    label: 'Corporate Catering',    desc: '/corporate-catering' },
    { key: 'wedding',      label: 'Wedding Catering',      desc: '/wedding-catering' },
    { key: 'events',       label: 'Event Catering',        desc: '/event-catering' },
  ];

  return (
    <div>
      <SectionCard title="Admin Navigation" icon={Settings2}>
        <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>Toggle which admin pages appear in the sidebar. Useful for hiding unused modules per client.</p>
        {ADMIN_ITEMS.map(({ key, label, desc }) => (
          <ToggleRow key={key} label={label} desc={desc} checked={adminNav[key] !== false} onChange={() => toggleNav(key)} />
        ))}
      </SectionCard>

      <SectionCard title="Public Website Pages" icon={Globe}>
        <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>Enable or disable public-facing pages for this client.</p>
        {PUB_ITEMS.map(({ key, label, desc }) => (
          <ToggleRow key={key} label={label} desc={desc} checked={pubPages[key] !== false} onChange={() => togglePub(key)} />
        ))}
      </SectionCard>
    </div>
  );
}

// ─── Tab: Export & Clone ───────────────────────────────────────────────────────

function ExportTab({ cfg, setCfg }) {
  const activeKey = cfg.activeProfile;
  const profile   = cfg.profiles?.[activeKey];
  const [importJson, setImportJson] = useState('');
  const [importErr,  setImportErr]  = useState('');

  const exportActive = () => {
    const blob = new Blob([JSON.stringify({ activeProfile: activeKey, profiles: { [activeKey]: profile } }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${activeKey}-config.json`;
    a.click();
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dev-config-all-profiles.json`;
    a.click();
  };

  const handleImport = () => {
    setImportErr('');
    try {
      const parsed = JSON.parse(importJson);
      if (!parsed.profiles) throw new Error('Invalid config: missing "profiles" key');
      const merged = { ...cfg, profiles: { ...cfg.profiles, ...parsed.profiles } };
      if (parsed.activeProfile && parsed.profiles[parsed.activeProfile]) {
        merged.activeProfile = parsed.activeProfile;
      }
      setCfg(merged);
      saveConfig(merged);
      setImportJson('');
      alert('Config imported successfully!');
    } catch (e) {
      setImportErr('Parse error: ' + e.message);
    }
  };

  const SETUP_STEPS = `# New Client Setup Checklist

## 1. Clone the repository
git clone https://github.com/your-org/sss-catering-app.git client-name-app
cd client-name-app

## 2. Create a new Supabase project
- Go to https://supabase.com → New Project
- Copy: Project URL, Anon Key, Service Role Key

## 3. Run database migrations
- Open Supabase SQL Editor
- Run each file in /migrations/ in order (001, 002, 003...)

## 4. Configure backend
Edit backend/.env:
  SUPABASE_URL=https://XXXX.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your-service-key
  JWT_SECRET_KEY=<random 64 char string>
  SECRET_KEY=<random 64 char string>
  CORS_ORIGINS=http://localhost:5173

## 5. Configure frontend
Edit frontend-app/.env.local:
  VITE_API_BASE_URL=http://localhost:5000/api

## 6. Import this config file
- Open Admin → Developer Support → Export & Clone tab
- Paste the exported JSON into Import box
- This restores branding, colors, feature flags

## 7. Update website content
- Admin → Website Content → update all sections with new client info

## 8. Deploy
Backend: Render.com → New Web Service → Connect repo
Frontend: Vercel → Import → Set VITE_API_BASE_URL to Render URL`;

  return (
    <div>
      <SectionCard title="Export Configuration" icon={Download}>
        <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 14 }}>Export your configuration to reuse this codebase for a new client.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={exportActive}><Download size={14} /> Export Active Profile ({activeKey})</button>
          <button className="btn btn-ghost" onClick={exportAll}><Download size={14} /> Export All Profiles</button>
        </div>
      </SectionCard>

      <SectionCard title="Import Configuration" icon={Upload}>
        <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 10 }}>Paste an exported JSON config to restore settings for a new client.</p>
        <textarea
          className="form-textarea"
          placeholder='Paste exported JSON here… {"profiles": {"client-name": {...}}}'
          value={importJson}
          onChange={e => setImportJson(e.target.value)}
          style={{ minHeight: 120, fontFamily: 'monospace', fontSize: 12 }}
        />
        {importErr && <p style={{ color: 'var(--error)', fontSize: 13, marginTop: 4 }}>{importErr}</p>}
        <button className="btn btn-primary btn-sm" onClick={handleImport} style={{ marginTop: 10 }} disabled={!importJson.trim()}>
          <Upload size={13} /> Import & Apply
        </button>
      </SectionCard>

      <SectionCard title="New Client Setup Guide" icon={Terminal}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <CopyBtn text={SETUP_STEPS} label="Copy Guide" />
        </div>
        <pre style={{ background: 'var(--cream)', padding: 16, borderRadius: 8, fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text)', border: '1px solid var(--border)' }}>
          {SETUP_STEPS}
        </pre>
      </SectionCard>
    </div>
  );
}

// ─── Main DeveloperPage ────────────────────────────────────────────────────────

const TABS = [
  { id: 'profiles',     label: 'Client Profiles', icon: Package2  },
  { id: 'branding',     label: 'Branding',        icon: Palette   },
  { id: 'connections',  label: 'Connections',      icon: Database  },
  { id: 'sections',     label: 'Sections',         icon: Globe     },
  { id: 'features',     label: 'Feature Flags',    icon: ToggleRight },
  { id: 'export',       label: 'Export & Clone',   icon: Download  },
];

export default function DeveloperPage() {
  const [tab, setTab] = useState('profiles');
  const [cfg, setCfg] = useState(() => {
    const saved = loadConfig();
    if (saved && saved.profiles) return saved;
    const initial = {
      activeProfile: 'shree-swami-samarth',
      profiles: { 'shree-swami-samarth': makeDefaultProfile('Shree Swami Samarth') },
    };
    saveConfig(initial);
    return initial;
  });

  const activeProfile = cfg.profiles?.[cfg.activeProfile];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Developer Support</h1>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>
            Configure branding, connections, and features — reuse this codebase for any client.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ background: 'var(--cream)', padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}>
            <span style={{ color: 'var(--text-light)' }}>Active: </span>
            <span style={{ fontWeight: 700, color: 'var(--maroon)' }}>{activeProfile?.clientName || cfg.activeProfile}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', background: '#fff', padding: '8px 10px', borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active ? 'var(--maroon)' : 'transparent',
              color: active ? '#fff' : 'var(--text-light)',
              fontWeight: active ? 700 : 400, fontSize: 13,
              transition: 'all .15s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--cream)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'profiles'    && <ProfilesTab    cfg={cfg} setCfg={setCfg} />}
      {tab === 'branding'    && <BrandingTab    cfg={cfg} setCfg={setCfg} />}
      {tab === 'connections' && <ConnectionsTab cfg={cfg} setCfg={setCfg} />}
      {tab === 'sections'    && <SectionsTab    cfg={cfg} setCfg={setCfg} />}
      {tab === 'features'    && <FeaturesTab    cfg={cfg} setCfg={setCfg} />}
      {tab === 'export'      && <ExportTab      cfg={cfg} setCfg={setCfg} />}
    </div>
  );
}
