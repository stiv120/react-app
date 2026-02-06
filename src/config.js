/**
 * URL base de la API.
 * - Vacío (default) = API serverless de Vercel (rutas relativas /api/...)
 * - REACT_APP_API_URL = URL de otro backend (ej: InfinityFree)
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";
