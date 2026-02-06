/**
 * - Sin REACT_APP_API_URL = API de Vercel (/api/historial/...)
 * - Con REACT_APP_API_URL = API PHP en InfinityFree vía proxy CORS público (mismo flujo que OpenWeather)
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/** Si está set, la app (en Vercel) consume la API PHP en InfinityFree vía corsproxy.org */
export const USE_INFINITYFREE_API = !!API_BASE_URL;

/** Proxy CORS público: el navegador llama aquí y el proxy pide a InfinityFree y devuelve con CORS */
const CORS_PROXY = "https://corsproxy.org/?";

/** URL lista para GET/POST a la API PHP (con o sin proxy CORS según USE_INFINITYFREE_API) */
export function getHistorialApiUrl(action) {
  if (USE_INFINITYFREE_API) {
    const target = `${API_BASE_URL.replace(
      /\/$/,
      ""
    )}/api/index.php?action=${action}`;
    return CORS_PROXY + encodeURIComponent(target);
  }
  return `${API_BASE_URL}/api/historial/${
    action === "ver" ? "ver" : "guardar"
  }`;
}
