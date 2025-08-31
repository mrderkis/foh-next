'use client';

import { useEffect, useState } from 'react';

type SvcType = { id: string; name: string };

export default function PcoTestPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [serviceTypes, setServiceTypes] = useState<SvcType[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch('/api/pco/service-types', { cache: 'no-store' });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || 'Unknown error');
        setServiceTypes(json.items || []);
      } catch (e: any) {
        setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 16, color: '#fff', background: '#111', minHeight: '100vh' }}>
      <h1>PCO Test</h1>
      {loading && <p>Loading service types…</p>}
      {err && (
        <p style={{ color: 'salmon' }}>
          Error: {err}
        </p>
      )}
      {!loading && !err && (
        <>
          <h2>Service Types</h2>
          {serviceTypes.length === 0 ? (
            <p>No service types found.</p>
          ) : (
            <ul>
              {serviceTypes.map((s) => (
                <li key={s.id}>{s.name} ({s.id})</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}