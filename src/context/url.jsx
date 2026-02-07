/**
 * API Configuration
 * 
 * @description
 * Base URL for the Saleem Footwear API.
 * Toggle between production and development URLs as needed.
 */

// Production API URL
export const URL = "https://saleem-footwear-api.vercel.app/api/v1";

// Development API URL (uncomment for local development)
// export const URL = "http://localhost:8080/api/v1";

// Derive BOT_URL from the context URL (stripping /api/v1)
const BASE_URL = URL.replace("/api/v1", "");
export const BOT_URL = `${BASE_URL}/bot`;
