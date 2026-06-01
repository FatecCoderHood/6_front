export const API_CONFIG = {
  // Use relative `/api` by default so the Vite dev proxy can forward requests.
  // In production override with a full URL via VITE_API_BASE_URL.
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
}