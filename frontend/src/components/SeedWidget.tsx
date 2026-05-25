'use client';
import { useState, useEffect } from 'react';
export function SeedWidget() {
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => { fetch('/api/v1/demo/status').then(r=>r.json()).then(d=>setSeeded(d.seeded)).catch(()=>{}); }, []);
  const seed = async () => { setLoading(true); await fetch('/api/v1/demo/seed',{method:'POST'}); setSeeded(true); setLoading(false); };
  const clear = async () => { setLoading(true); await fetch('/api/v1/demo/clear',{method:'DELETE'}); setSeeded(false); setLoading(false); };
  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <button onClick={seed} disabled={loading} className="bg-[var(--accent-col)] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">{seeded?'Re-seed Data':'Seed Demo Data'}</button>
      {seeded && <button onClick={clear} disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">Clear Data</button>}
    </div>
  );
}
