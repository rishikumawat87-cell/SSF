export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    hasOPENAI: !!process.env.OPENAI_API_KEY
  });
}
