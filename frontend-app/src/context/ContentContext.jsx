import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ContentContext = createContext({
  content: {},
  loading: true,
  get: (_s, _k, fb = '') => fb,
  getJson: (_s, _k, fb = []) => fb,
  refresh: () => {},
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch(`${API_BASE}/content/public`)
      .then(r => r.json())
      .then(data => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const get = useCallback((section, key, fallback = '') => {
    const v = content[section]?.[key];
    return (v != null && v !== '') ? v : fallback;
  }, [content]);

  const getJson = useCallback((section, key, fallback = []) => {
    const v = content[section]?.[key];
    if (!v) return fallback;
    try { return JSON.parse(v); } catch { return fallback; }
  }, [content]);

  return (
    <ContentContext.Provider value={{ content, loading, get, getJson, refresh: load }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
