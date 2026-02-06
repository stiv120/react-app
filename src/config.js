/**
 * API de historial: siempre la de Vercel (Node.js) en /api/historial/...
 */
export const API_BASE_URL = "";

export function getHistorialApiUrl(action) {
  return `${API_BASE_URL}/api/historial/${
    action === "ver" ? "ver" : "guardar"
  }`;
}
