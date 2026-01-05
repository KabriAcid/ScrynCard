import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Airtime/Data Redemption API Configuration
export const API_CONFIG = {
  // Existing configs...

  // NEW: Airtime/Data API Configuration
  AIRTIME_API: {
    PROVIDER: import.meta.env.VITE_AIRTIME_PROVIDER || "ebills",
    EBILLS: {
      BASE_URL:
        import.meta.env.VITE_EBILLS_API_URL || "https://api.ebills.ng/v1",
      API_KEY: import.meta.env.VITE_EBILLS_API_KEY || "",
      MERCHANT_ID: import.meta.env.VITE_EBILLS_MERCHANT_ID || "",
      SECRET_KEY: import.meta.env.VITE_EBILLS_SECRET_KEY || "",
    },
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },

  // Network prefix mappings
  OPERATOR_PREFIXES: {
    MTN: ["0703", "0704", "0706", "0916"],
    Airtel: ["0701", "0708", "0802", "0808", "0812"],
    Glo: ["0705", "0807"],
    "9Mobile": ["0809", "0817"],
  },
} as const;

// Add auth token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
