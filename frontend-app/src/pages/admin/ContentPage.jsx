import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import { useContent } from '../../context/ContentContext';

/* ── Section + Field definitions ─────────────────────────────── */
const SECTIONS = [
  {
    id: 'hero', label: 'Hero Section', icon: '🏠',
    fields: [
      { key: 'badge',              label: 'Badge Text',           type: 'text',     hint: 'e.g. Est. 2010 • Vikhroli, Mumbai' },
      { key: 'tagline',            label: 'Main Headline',        type: 'text' },
      { key: 'description',        label: 'Sub Description',      type: 'textarea' },
      { key: 'stat_events',        label: 'Events Count',         type: 'text',     hint: 'e.g. 5000+' },
      { key: 'stat_events_label',  label: 'Events Label',         type: 'text',     hint: 'e.g. Events Served' },
      { key: 'stat_clients',       label: 'Clients Count',        type: 'text' },
      { key: 'stat_clients_label', label: 'Clients Label',        type: 'text' },
      { key: 'stat_years',         label: 'Years Count',          type: 'text' },
      { key: 'stat_years_label',   label: 'Years Label',          type: 'text' },
      { key: 'stat_menu',          label: 'Menu Items Count',     type: 'text' },
      { key: 'stat_menu_label',    label: 'Menu Items Label',     type: 'text' },
    ]
  },
  {
    id: 'contact', label: 'Contact Info', icon: '📞',
    fields: [
      { key: 'phone',         label: 'Phone Number',   type: 'text' },
      { key: 'email',         label: 'Email Address',  type: 'text' },
      { key: 'address',       label: 'Address',        type: 'textarea' },
      { key: 'hours_weekday', label: 'Weekday Hours',  type: 'text', hint: 'Mon–Sat: 8 AM – 8 PM' },
      { key: 'hours_weekend', label: 'Weekend Hours',  type: 'text', hint: 'Sun: 9 AM – 5 PM' },
    ]
  },
  {
    id: 'company', label: 'Company Info', icon: '🏢',
    fields: [
      { key: 'name',           label: 'Full Company Name',         type: 'text' },
      { key: 'short_name',     label: 'Short Name',                type: 'text' },
      { key: 'tagline',        label: 'Company Tagline',           type: 'text' },
      { key: 'gstin',          label: 'GSTIN Number',              type: 'text' },
      { key: 'description',    label: 'Company Description',       type: 'textarea' },
      { key: 'invoice_prefix', label: 'Invoice Number Prefix',     type: 'text',  hint: 'e.g. SSS-INV-' },
      { key: 'tax_rate',       label: 'Default Tax Rate (%)',      type: 'text',  hint: 'e.g. 18' },
      { key: 'due_days',       label: 'Invoice Due Days',          type: 'text',  hint: 'e.g. 15' },
      { key: 'logo_url',         label: 'Company Logo (Website)',    type: 'image', hint: 'Shown on website header/footer' },
      { key: 'invoice_logo_url', label: 'Invoice Logo',             type: 'image', hint: 'Logo printed on PDF invoices — defaults to Company Logo if blank' },
    ]
  },
  {
    id: 'about', label: 'About Page', icon: 'ℹ️',
    fields: [
      { key: 'story',       label: 'Company Story',     type: 'textarea' },
      { key: 'founded_year',label: 'Founded Year',      type: 'text' },
      { key: 'founder',     label: 'Founder Name',      type: 'text' },
      { key: 'location',    label: 'Location',          type: 'text' },
      { key: 'mission',     label: 'Mission Statement', type: 'textarea' },
      {
        key: 'values', label: 'Core Values', type: 'array',
        itemSchema: [
          { key: 'icon',  label: 'Icon (emoji)', type: 'text', hint: '🛡️' },
          { key: 'title', label: 'Title',        type: 'text' },
          { key: 'text',  label: 'Description',  type: 'text' },
        ]
      },
    ]
  },
  {
    id: 'services', label: 'Services', icon: '🍽️',
    fields: [{
      key: 'items', label: 'Service Cards', type: 'array',
      itemSchema: [
        { key: 'icon',        label: 'Icon (emoji)',  type: 'text',     hint: '🏢' },
        { key: 'title',       label: 'Title',         type: 'text' },
        { key: 'description', label: 'Description',   type: 'textarea' },
        { key: 'link',        label: 'Link Path',     type: 'text',     hint: '/corporate-catering' },
      ]
    }]
  },
  {
    id: 'why_us', label: 'Why Choose Us', icon: '⭐',
    fields: [{
      key: 'items', label: 'Reasons', type: 'array',
      itemSchema: [
        { key: 'icon',  label: 'Icon (emoji)',  type: 'text', hint: '✅' },
        { key: 'title', label: 'Title',         type: 'text' },
        { key: 'text',  label: 'Description',   type: 'text' },
      ]
    }]
  },
  {
    id: 'steps', label: 'How to Book', icon: '📋',
    fields: [{
      key: 'items', label: 'Booking Steps', type: 'array',
      itemSchema: [
        { key: 'icon',        label: 'Icon (emoji)',  type: 'text', hint: '📝' },
        { key: 'title',       label: 'Step Title',    type: 'text' },
        { key: 'description', label: 'Description',   type: 'text' },
      ]
    }]
  },
  {
    id: 'corporate', label: 'Corporate', icon: '💼',
    fields: [
      {
        key: 'pricing', label: 'Pricing Plans', type: 'array',
        itemSchema: [
          { key: 'plan',  label: 'Plan Name', type: 'text' },
          { key: 'price', label: 'Price',     type: 'text', hint: '₹150' },
          { key: 'unit',  label: 'Unit',      type: 'text', hint: '/person/day' },
        ]
      },
      {
        key: 'benefits', label: 'Benefits List (one per item)', type: 'array-strings',
      },
    ]
  },
  {
    id: 'faq', label: 'FAQ', icon: '❓',
    fields: [{
      key: 'items', label: 'Questions & Answers', type: 'array',
      itemSchema: [
        { key: 'q', label: 'Question', type: 'text' },
        { key: 'a', label: 'Answer',   type: 'textarea' },
      ]
    }]
  },
  {
    id: 'gallery', label: 'Gallery', icon: '🖼️',
    fields: [{
      key: 'items', label: 'Gallery Items', type: 'array',
      itemSchema: [
        { key: 'emoji',    label: 'Emoji',              type: 'text',  hint: '🍽️' },
        { key: 'title',    label: 'Title',              type: 'text' },
        { key: 'category', label: 'Category',           type: 'text',  hint: 'corporate / wedding / events' },
        { key: 'image',    label: 'Image URL (optional)', type: 'image' },
      ]
    }]
  },
  {
    id: 'footer', label: 'Footer', icon: '🔻',
    fields: [
      { key: 'description', label: 'Footer Description', type: 'textarea' },
      { key: 'copyright',   label: 'Copyright Text',     type: 'text' },
    ]
  },
];

/* ── Helpers ──────────────────────────────────────────────────── */
const tryParse = (str, fb = []) => { try { return JSON.parse(str); } catch { return fb; } };

/* ── Simple field editors ─────────────────────────────────────── */
function TextField({ value, onChange, hint }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={hint || ''}
      className="form-input"
      style={{ width: '100%' }}
    />
  );
}

function TextareaField({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={4}
      className="form-input"
      style={{ width: '100%', resize: 'vertical' }}
    />
  );
}

function ImageField({ value, onChange }) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="form-input"
        style={{ width: '100%' }}
      />
      {value && (
        <img
          src={value}
          alt="preview"
          style={{ maxWidth: 200, maxHeight: 120, marginTop: 10, borderRadius: 8, border: '1px solid var(--border)' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}
    </div>
  );
}

/* ── Array of strings editor ──────────────────────────────────── */
function ArrayStringsEditor({ value, onChange }) {
  const items = tryParse(value, []);

  const update = (i, v) => { const n = [...items]; n[i] = v; onChange(JSON.stringify(n)); };
  const add    = ()     => onChange(JSON.stringify([...items, '']));
  const remove = (i)    => onChange(JSON.stringify(items.filter((_, idx) => idx !== i)));
  const move   = (i, d) => {
    const n = [...items];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(JSON.stringify(n));
  };

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <input
            type="text"
            value={item}
            onChange={e => update(i, e.target.value)}
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Enter value..."
          />
          <button onClick={() => move(i, -1)} style={iconBtnStyle} title="Move up"><ChevronUp size={14} /></button>
          <button onClick={() => move(i,  1)} style={iconBtnStyle} title="Move down"><ChevronDown size={14} /></button>
          <button onClick={() => remove(i)}   style={{ ...iconBtnStyle, color: '#E53E3E' }} title="Remove"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={add} className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}>
        <Plus size={14} style={{ marginRight: 4 }} /> Add Item
      </button>
    </div>
  );
}

/* ── Array of objects editor ──────────────────────────────────── */
function ArrayObjectsEditor({ value, onChange, itemSchema }) {
  const items = tryParse(value, []);
  const [collapsed, setCollapsed] = useState({});

  const updateField = (i, key, v) => {
    const n = [...items]; n[i] = { ...n[i], [key]: v }; onChange(JSON.stringify(n));
  };
  const add = () => {
    const blank = {}; itemSchema.forEach(f => { blank[f.key] = ''; });
    onChange(JSON.stringify([...items, blank]));
  };
  const remove = (i) => onChange(JSON.stringify(items.filter((_, idx) => idx !== i)));
  const move   = (i, d) => {
    const n = [...items]; const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(JSON.stringify(n));
  };
  const toggle = (i) => setCollapsed(prev => ({ ...prev, [i]: !prev[i] }));

  const getPreview = (item) =>
    item.title || item.q?.slice(0, 45) || item.plan || item.label || '';

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
          {/* Item header */}
          <div
            onClick={() => toggle(i)}
            style={{
              padding: '10px 14px', background: 'var(--cream-dark)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer', userSelect: 'none',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              {item.icon || item.emoji ? <span style={{ marginRight: 8 }}>{item.icon || item.emoji}</span> : null}
              Item {i + 1}{getPreview(item) ? ` — ${getPreview(item)}` : ''}
            </span>
            <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => move(i, -1)} style={iconBtnStyle} title="Move up"><ChevronUp size={14} /></button>
              <button onClick={() => move(i,  1)} style={iconBtnStyle} title="Move down"><ChevronDown size={14} /></button>
              <button onClick={() => remove(i)}   style={{ ...iconBtnStyle, color: '#E53E3E' }} title="Remove"><Trash2 size={14} /></button>
              <button onClick={() => toggle(i)}   style={iconBtnStyle}>
                {collapsed[i] ? '▾' : '▴'}
              </button>
            </div>
          </div>

          {/* Item fields */}
          {!collapsed[i] && (
            <div style={{ padding: '14px 16px' }}>
              {itemSchema.map(field => (
                <div key={field.key} style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-light)', marginBottom: 4 }}>
                    {field.label}
                    {field.hint && <span style={{ fontWeight: 400, marginLeft: 6, color: '#B0A090' }}>({field.hint})</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={item[field.key] || ''}
                      onChange={e => updateField(i, field.key, e.target.value)}
                      rows={3}
                      className="form-input"
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  ) : field.type === 'image' ? (
                    <div>
                      <input
                        type="text"
                        value={item[field.key] || ''}
                        onChange={e => updateField(i, field.key, e.target.value)}
                        className="form-input"
                        placeholder="https://..."
                        style={{ width: '100%' }}
                      />
                      {item[field.key] && (
                        <img
                          src={item[field.key]}
                          alt=""
                          style={{ maxWidth: 140, maxHeight: 90, marginTop: 8, borderRadius: 6, border: '1px solid var(--border)' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={item[field.key] || ''}
                      onChange={e => updateField(i, field.key, e.target.value)}
                      className="form-input"
                      placeholder={field.hint || ''}
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={add} className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}>
        <Plus size={14} style={{ marginRight: 4 }} /> Add Item
      </button>
    </div>
  );
}

const iconBtnStyle = {
  padding: '5px 8px', background: 'transparent',
  border: '1px solid var(--border)', borderRadius: 6,
  cursor: 'pointer', color: 'var(--text-light)', fontSize: 12,
  display: 'flex', alignItems: 'center',
};

/* ── Main ContentPage ─────────────────────────────────────────── */
export default function ContentPage() {
  const [active, setActive]   = useState('hero');
  const [values, setValues]   = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);
  const { refresh }           = useContent();

  useEffect(() => {
    api.get('/content/')
      .then(r => {
        const map = {};
        r.data.forEach(item => { map[`${item.section}.${item.key}`] = item.value ?? ''; });
        setValues(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const get    = (section, key) => values[`${section}.${key}`] ?? '';
  const onSet  = (section, key, val) => setValues(prev => ({ ...prev, [`${section}.${key}`]: val }));

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const save = async () => {
    setSaving(true);
    const sec   = SECTIONS.find(s => s.id === active);
    const items = sec.fields.map(f => ({
      section: active,
      key: f.key,
      value: get(active, f.key),
    }));
    try {
      await api.post('/content/batch', items);
      refresh(); // update public context so website reflects changes
      showToast('success', `${sec.label} saved! Website updated.`);
    } catch {
      showToast('error', 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activeSec = SECTIONS.find(s => s.id === active);

  const renderField = (field) => {
    const value    = get(active, field.key);
    const onChange = (v) => onSet(active, field.key, v);
    switch (field.type) {
      case 'text':          return <TextField value={value} onChange={onChange} hint={field.hint} />;
      case 'textarea':      return <TextareaField value={value} onChange={onChange} />;
      case 'image':         return <ImageField value={value} onChange={onChange} />;
      case 'array-strings': return <ArrayStringsEditor value={value} onChange={onChange} />;
      case 'array':         return <ArrayObjectsEditor value={value} onChange={onChange} itemSchema={field.itemSchema} />;
      default:              return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px - 40px)', gap: 0, margin: -20, overflow: 'hidden' }}>

      {/* ── Left: Section selector ───────────────────────── */}
      <div style={{
        width: 220, borderRight: '1px solid var(--border)',
        overflowY: 'auto', background: 'var(--white)', flexShrink: 0,
      }}>
        <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Content Sections
          </p>
        </div>
        {SECTIONS.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActive(sec.id)}
            style={{
              width: '100%', padding: '12px 14px',
              background: active === sec.id ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: 'none',
              borderLeft: `3px solid ${active === sec.id ? 'var(--gold)' : 'transparent'}`,
              textAlign: 'left', cursor: 'pointer',
              color: active === sec.id ? 'var(--gold-dark)' : 'var(--text)',
              fontSize: 14, fontWeight: active === sec.id ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (active !== sec.id) e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; }}
            onMouseLeave={e => { if (active !== sec.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: 17 }}>{sec.icon}</span>
            {sec.label}
          </button>
        ))}
      </div>

      {/* ── Right: Editor ────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 28, background: 'var(--cream)' }}>
        {loading ? (
          <div className="loading">Loading content...</div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, marginBottom: 4 }}>
                  <span style={{ marginRight: 8 }}>{activeSec.icon}</span>
                  {activeSec.label}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-light)' }}>
                  Edit content below and click Save. Changes reflect on the website immediately.
                </p>
              </div>
              <button
                onClick={save}
                disabled={saving}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
              >
                <Save size={15} />
                {saving ? 'Saving...' : 'Save Section'}
              </button>
            </div>

            {/* Toast */}
            {toast && (
              <div style={{
                padding: '12px 18px', borderRadius: 10, marginBottom: 20,
                background: toast.type === 'success' ? '#E8F5E9' : '#FEEBEE',
                color: toast.type === 'success' ? '#2E7D32' : '#C62828',
                border: `1px solid ${toast.type === 'success' ? '#A5D6A7' : '#FFCDD2'}`,
                fontSize: 14, fontWeight: 500,
              }}>
                {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
              </div>
            )}

            {/* Fields */}
            {activeSec.fields.map(field => (
              <div
                key={field.key}
                style={{
                  background: 'var(--white)', borderRadius: 12, padding: 20,
                  marginBottom: 16, border: '1px solid var(--border)',
                }}
              >
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
                  {field.label}
                  {field.hint && (
                    <span style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 400, marginLeft: 8 }}>
                      — hint: {field.hint}
                    </span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}

            {/* Bottom save */}
            <div style={{ textAlign: 'right', paddingTop: 8 }}>
              <button
                onClick={save}
                disabled={saving}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Save size={15} />
                {saving ? 'Saving...' : 'Save Section'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
