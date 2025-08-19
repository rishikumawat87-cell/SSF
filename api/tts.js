export const config = { api: { bodyParser: true } };
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'Rachel';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Missing text' });

    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: 'Missing ELEVENLABS_API_KEY on server' });
    }

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_settings: { stability: 0.5, similarity_boost: 0.8 } })
    });

    if (!r.ok) return res.status(500).json({ error: await r.text() });

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(buf);
  } catch (e) { res.status(500).json({ error: e.message }); }
}
