import React, { useEffect, useState } from 'react';

function ServiceBanner() {
  const [status, setStatus] = useState({ ok: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) {
          setStatus({ ok: false, message: 'status endpoint returned an error' });
          return;
        }
        const json = await res.json();
        if (!cancelled) setStatus(json || { ok: false });
      } catch (err) {
        if (!cancelled) setStatus({ ok: false, message: String(err) });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    check();
    return () => { cancelled = true; };
  }, []);

  if (loading || status.ok) return null;

  return (
    <div className="w-full bg-yellow-600 text-black text-sm py-2 px-4 text-center">
      <div className="container mx-auto">
        <strong className="font-semibold">Warning:</strong>
        <span className="ml-2">OMDB server key is not configured — movie data may not load on the deployed site.</span>
        <span className="hidden sm:inline"> Set <code className="bg-black/10 px-1 rounded">OMDB_API_KEY</code> in your Vercel Project Environment Variables and redeploy.</span>
      </div>
    </div>
  );
}

export default ServiceBanner;
