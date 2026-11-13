import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
});
api.interceptors.response.use(
  (r) => r,
  async (e) => {
    const c = e.config;
    if (
      e.response?.status === 401 &&
      c &&
      !c._retry &&
      !c.url?.includes("/users/refresh-token") &&
      !c.url?.includes("/users/login")
    ) {
      c._retry = true;
      try {
        await api.post("/users/refresh-token");
        return api(c);
      } catch {}
    }
    return Promise.reject(e);
  },
);
export const data = (r) => r?.data?.data ?? r?.data ?? r;
export const arr = (x) =>
  Array.isArray(x)
    ? x
    : x?.videos || x?.docs || x?.comments || x?.playlists || x?.channels || [];
export const msg = (e) =>
  e?.response?.data?.message || e.message || "Request failed";
