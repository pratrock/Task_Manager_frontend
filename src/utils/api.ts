/* import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

let refreshSubscribers: ((token: string) => void)[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Queue requests while refreshing
      const retryOriginalRequest = new Promise((resolve) => {
        refreshSubscribers.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await api.post("/auth/refresh", { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);

        // Update Authorization header
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        // Retry all queued requests
        refreshSubscribers.forEach((cb) => cb(data.accessToken));
        refreshSubscribers = [];

        return retryOriginalRequest;
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
 */

import axios from "axios";

let baseURL = "";

if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
  baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
} else {
  // Fallback for local development
  baseURL = "http://localhost:5000/api";
  console.warn("Using fallback API base URL for local development.");
}

const api = axios.create({
  baseURL: baseURL,
});

let refreshSubscribers: ((token: string) => void)[] = [];

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const retryOriginalRequest = new Promise((resolve) => {
        refreshSubscribers.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await api.post("/auth/refresh", { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        refreshSubscribers.forEach((cb) => cb(data.accessToken));
        refreshSubscribers = [];

        return retryOriginalRequest;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
