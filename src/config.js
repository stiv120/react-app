/**
 * URL base de la API.
 * - Vacío = API serverless de Vercel (/api/historial/...)
 * - Con valor = API PHP en InfinityFree (/api/index.php?action=...)
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/** URLs de InfinityFree usan index.php?action= porque mod_rewrite puede no estar disponible */
export const API_USE_QUERY_PARAMS = !!process.env.REACT_APP_API_URL;
