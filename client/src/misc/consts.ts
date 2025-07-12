export const APP_SETTINGS = {
  apiUrl: "/api",
  pocketbaseUrl: "/db",
} as const;

export const API_PATHS = {
  hello: APP_SETTINGS.apiUrl + "/",
};
