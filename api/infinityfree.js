/**
 * Proxy a la API PHP en InfinityFree.
 * Evita CORS: la app llama a este endpoint (mismo origen) y Vercel reenvía a InfinityFree.
 */
const BASE = process.env.INFINITYFREE_API_URL || "https://weather-api.infinityfreeapp.com";

module.exports = async function handler(req, res) {
  const action = req.query.action;
  if (!action || !["ver", "guardar"].includes(action)) {
    res.status(400).json({ error: "action debe ser 'ver' o 'guardar'" });
    return;
  }

  const url = `${BASE.replace(/\/$/, "")}/api/index.php?action=${action}`;

  try {
    if (req.method === "GET") {
      const r = await fetch(url, { method: "GET" });
      const data = await r.json();
      res.status(r.status).json(data);
      return;
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await r.json().catch(() => ({}));
      res.status(r.status).json(data);
      return;
    }
    res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    console.error("Proxy infinityfree:", err);
    res.status(502).json({ error: "Error al conectar con la API" });
  }
};
