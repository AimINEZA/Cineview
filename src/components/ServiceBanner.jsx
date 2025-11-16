import React, { useEffect, useState } from 'react';

export default function ServiceBanner() {
  const [status, setStatus] = useState({ ok: true, omdbKeyConfigured: true, youtubeKeyConfigured: false });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/status')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setStatus(json || {});
      })
      .catch(() => {
        if (!mounted) return;
        setStatus({ ok: false, omdbKeyConfigured: false, youtubeKeyConfigured: false });
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!visible) return null;

  // Show banner only when OMDB key is not configured or status.ok is false
  if (status.ok) return null;

  return (
    <div className="w-full bg-amber-400 text-black text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-2 flex items-center justify-between">
        <div>
          <strong className="mr-2">Service Notice:</strong>
          <span>
            The server-side OMDB API key is not configured. Search and details may not work in production.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://vercel.com/docs/environment-variables"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Set OMDB_API_KEY
          </a>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss banner"
            className="px-2 py-1 bg-black text-white rounded"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

