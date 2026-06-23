const apiUrl = import.meta.env.VITE_BASE_URL?.trim();

if (!apiUrl && !import.meta.env.DEV) {
    throw new Error("VITE_BASE_URL is required for production builds");
}

export const API_BASE_URL = apiUrl || "http://localhost:3001";
export const ZALO_DEV_MODE = import.meta.env.VITE_ZALO_DEV_MODE === "true";
