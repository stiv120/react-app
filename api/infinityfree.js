/**
 * Proxy: app en Vercel → este endpoint → API PHP en InfinityFree.
 * Así la app (Vercel) y la API (InfinityFree) funcionan juntas sin CORS.
 */
const BASE =
  process.env.INFINITYFREE_API_URL || "https://weather-api.infinityfreeapp.com";
const BASE_CLEAN = BASE.replace(/\/$/, "");

const HOST = new URL(BASE_CLEAN).host;
const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Accept-Language": "es,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Host: HOST,
};

const TIMEOUT_MS = 28000;
const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 3;

async function fetchWithRetry(url, options) {
  let lastErr;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      return res;
    } catch (err) {
      lastErr = err;
      if (i < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }
  throw lastErr;
}

module.exports = async function handler(req, res) {
  const action = req.query.action;
  if (!action || !["ver", "guardar"].includes(action)) {
    res.status(400).json({ error: "action debe ser 'ver' o 'guardar'" });
    return;
  }

  const url = `${BASE_CLEAN}/api/index.php?action=${action}`;

  try {
    if (req.method === "GET") {
      const r = await fetchWithRetry(url, {
        method: "GET",
        headers: DEFAULT_HEADERS,
      });
      const text = await r.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        res.status(502).json({
          error:
            "La API no devolvió JSON. InfinityFree puede estar despertando; intenta de nuevo en unos segundos.",
        });
        return;
      }
      res.status(r.status).json(data);
      return;
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body || {});
      const r = await fetchWithRetry(url, {
        method: "POST",
        headers: {
          ...DEFAULT_HEADERS,
          "Content-Type": "application/json",
        },
        body,
      });
      const text = await r.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        res.status(502).json({
          error: "La API no devolvió JSON. Intenta de nuevo.",
        });
        return;
      }
      res.status(r.status).json(data);
      return;
    }

    res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    console.error("Proxy infinityfree:", err);
    const isTimeout = err.name === "AbortError";
    res.status(502).json({
      error: isTimeout
        ? "La API tardó demasiado (InfinityFree puede estar despertando). Espera 30 s y vuelve a intentar."
        : "Error al conectar con la API. Comprueba que la URL en INFINITYFREE_API_URL sea correcta.",
    });
  }
};
