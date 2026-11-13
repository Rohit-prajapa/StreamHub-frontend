import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      !config.url?.includes("/users/refresh-token") &&
      !config.url?.includes("/users/login")
    ) {
      config._retry = true;

      try {
        await api.post("/users/refresh-token");
        return api(config);
      } catch {
        // Refresh failed; return original error
      }
    }

    return Promise.reject(error);
  },
);

export const data = (response) =>
  response?.data?.data ?? response?.data ?? response;

export const arr = (value) =>
  Array.isArray(value)
    ? value
    : value?.videos ||
      value?.docs ||
      value?.comments ||
      value?.playlists ||
      value?.channels ||
      [];

export const msg = (error) =>
  error?.response?.data?.message || error?.message || "Request failed";
