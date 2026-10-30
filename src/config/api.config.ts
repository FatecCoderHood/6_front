export const API_CONFIG = {
  // Use relative `/api` by default so the Vite dev proxy can forward requests.
  // In production override with a full URL via VITE_API_BASE_URL.
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
}

// Single switch between in-memory mocks and the real backend (see .env.example).
// Defaults to the real backend; only the literal string "true" enables mocks.
export const USE_MOCKS: boolean = import.meta.env.VITE_USE_MOCKS === 'true'