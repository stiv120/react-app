/**
 * - Sin REACT_APP_API_URL = API de Vercel (/api/historial/...)
 * - Con REACT_APP_API_URL = API PHP en InfinityFree vía proxy CORS público (mismo flujo que OpenWeather)
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/** Si está set, la app consume la API PHP: GET vía AllOrigins (CORS), POST vía proxy Vercel */
export const USE_INFINITYFREE_API = !!API_BASE_URL;

/** Proxy CORS público: el navegador llama aquí y el proxy pide a InfinityFree y devuelve con CORS */
const CORS_PROXY_GET = "https://api.allorigins.win/raw?url=";

/** URL lista para GET/POST a la API PHP (con o sin proxy CORS según USE_INFINITYFREE_API) */
export function getHistorialApiUrl(action) {
  if (USE_INFINITYFREE_API) {
    const base = API_BASE_URL.replace(/\/$/, "");
    if (action === "ver") {
      return (
        CORS_PROXY_GET + encodeURIComponent(`${base}/api/index.php?action=ver`)
      );
    }
    return "/api/infinityfree?action=guardar";
  }
  return `${API_BASE_URL}/api/historial/${
    action === "ver" ? "ver" : "guardar"
  }`;
}
