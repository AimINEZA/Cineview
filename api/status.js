/* eslint-env node */
/* global process */
// Simple server-side status endpoint for Vercel
// Returns JSON indicating whether required server-side keys are configured.
export default function handler(req, res) {
  const omdb = Boolean(process.env.OMDB_API_KEY);
  const yt = Boolean(process.env.YT_API_KEY || process.env.YOUTUBE_API_KEY);

  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  return res.status(200).json({ ok: omdb, omdbKeyConfigured: omdb, youtubeKeyConfigured: yt });
}
