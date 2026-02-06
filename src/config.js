/**
 * - Sin REACT_APP_API_URL = API serverless de Vercel (/api/historial/...)
 * - Con REACT_APP_API_URL = se usa proxy en Vercel (/api/infinityfree?action=...) para evitar CORS
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/** Si está set, usamos el proxy /api/infinityfree (mismo origen, sin CORS) */
export const API_USE_INFINITYFREE_PROXY = !!process.env.REACT_APP_API_URL;
