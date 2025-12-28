export const APP_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Scryn",
  ENV: import.meta.env.VITE_APP_ENV || "development",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
