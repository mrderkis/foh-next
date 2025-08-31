'use client';
import { useEffect, useState } from 'react';

type ServiceType = { id: string; name: string };
type Plan = { id: string; title: string; sort_date: string | null };

export default function PlansTester() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [serviceTypeId, setServiceTypeId] = useState<string>('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // load service types (using your existing endpoint)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/pco/service-types', { cache: 'no-store' });
        const json = await res.json();
        if (json?.ok) setServiceTypes(json.items || []);
        else setErr(json?.error || 'Failed to load service types');
      } catch (e: any) {
        setErr(String(e?.message || e));
      }
    })();
  }, []);

  async function loadPlans() {
    if (!serviceTypeId) return;
    setLoading(true);
    setErr(null);
    setPlans([]);
    try {
      const res = await fetch(`/api/pco/plans/${encodeURIComponent(serviceTypeId)}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!json?.ok) {
        setErr(json?.error || 'Failed to load plans');
      } else {
        setPlans(json.items || []);
      }
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>2) Plans (today & future)</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          value={serviceTypeId}
          onChange={(e) => setServiceTypeId(e.target.value)}
        >
          <option value="">— Select a Service Type —</option>
          {serviceTypes.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>
        <button onClick={loadPlans} disabled={!serviceTypeId || loading}>
          {loading ? 'Loading…' : 'Load Plans'}
        </button>
      </div>

      {err && <p style={{ color: 'tomato' }}>Error: {err}</p>}

      <ul>
        {plans.length === 0 && !loading && <li>No upcoming plans found.</li>}
        {plans.map((p) => (
          <li key={p.id}>
            {p.title} {p.sort_date ? `(${new Date(p.sort_date).toLocaleDateString()})` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}