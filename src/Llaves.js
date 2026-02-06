/**
 * API key de OpenWeatherMap.
 * No subas la clave al repo: usa variables de entorno.
 * En local: .env.local con REACT_APP_OPENWEATHER_API_KEY=tu_clave
 * En Vercel: Settings → Environment Variables
 */
export const llaveApi = process.env.REACT_APP_OPENWEATHER_API_KEY || "";
