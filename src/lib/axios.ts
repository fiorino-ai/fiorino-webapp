import axios from "axios";
import SETTINGS from "@/config/config";
import { useAuthStore } from "@/stores/SessionStore";

const axiosInstance = axios.create({
  baseURL: SETTINGS.API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        sessionStorage.removeItem("access_token");

        const { logout } = useAuthStore.getState();
        logout();
      }
    } else {
      console.error("Error response is undefined", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
