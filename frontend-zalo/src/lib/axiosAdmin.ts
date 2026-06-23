/* eslint-disable no-param-reassign */
import axios from "axios";
import { API_BASE_URL } from "./config";

const axiosAdmin = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor: attach JWT token
axiosAdmin.interceptors.request.use(config => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: redirect on 401
axiosAdmin.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
            window.location.hash = "#/admin"; // ZMP uses HashRouter by default, fallback if necessary
        }
        return Promise.reject(error);
    },
);

export default axiosAdmin;
