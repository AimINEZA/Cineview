/* eslint-env node */
/* global process */
// Vercel Serverless Function: api/omdb.js
// Proxies requests to OMDB while keeping the API key server-side.
export default async function handler(req, res) {
  const key = process.env.OMDB_API_KEY;
  if (!key) {
    return res.status(500).json({ Response: 'False', Error: 'OMDB API key not configured on server (OMDB_API_KEY).' });
  }

  try {
    const { s, i, type, page, plot } = req.query;
    const url = new URL('https://www.omdbapi.com/');
    url.searchParams.set('apikey', key);
    if (s) url.searchParams.set('s', s);
    if (i) url.searchParams.set('i', i);
    if (type) url.searchParams.set('type', type);
    if (page) url.searchParams.set('page', page);
    if (plot) url.searchParams.set('plot', plot);

    const r = await fetch(url.toString());
    const json = await r.json();
    // Pass through OMDB's JSON response (including Response: 'False' cases)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(json);
  } catch (err) {
    return res.status(502).json({ Response: 'False', Error: 'Upstream fetch failed', details: String(err) });
  }
}
