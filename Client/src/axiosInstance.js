import axios from "axios";
import { showError, showSuccess } from "././Assets/Constants/showNotifier";
import { Navigate } from "react-router-dom";
import { logout } from "./store/redux/thunks";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_URL ||
  process.env.REACT_APP_URL ||
  "http://localhost:6000";

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    showError(error?.response || "")
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMsg = "Something went wrong.";
    if (error?.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error?.message) {
      errorMsg = error.message;
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      // showError(errorMsg || "Token expired");
    } else {
      // showError(errorMsg || "Unprocessable");
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
