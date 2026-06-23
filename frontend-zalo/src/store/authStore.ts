import { create } from "zustand";

interface AuthState {
    zaloId: string | null;
    fullName: string | null;
    phone: string | null;
    accessToken: string | null;
    adminToken: string | null;
    login: (
        id: string,
        name: string,
        phone: string,
        accessToken?: string,
    ) => void;
    logout: () => void;
    setAdminToken: (token: string) => void;
    clearAdminToken: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
    zaloId: localStorage.getItem("zalo_id"),
    fullName: localStorage.getItem("full_name"),
    phone: localStorage.getItem("phone"),
    accessToken: localStorage.getItem("zalo_access_token"),
    adminToken: localStorage.getItem("admin_token"),
    login: (id, name, phone, accessToken) => {
        localStorage.setItem("zalo_id", id);
        localStorage.setItem("full_name", name);
        localStorage.setItem("phone", phone);
        if (accessToken) {
            localStorage.setItem("zalo_access_token", accessToken);
        } else {
            localStorage.removeItem("zalo_access_token");
        }
        set({
            zaloId: id,
            fullName: name,
            phone,
            accessToken: accessToken || null,
        });
    },
    logout: () => {
        localStorage.removeItem("zalo_id");
        localStorage.removeItem("full_name");
        localStorage.removeItem("phone");
        localStorage.removeItem("zalo_access_token");
        set({ zaloId: null, fullName: null, phone: null, accessToken: null });
    },
    setAdminToken: token => {
        localStorage.setItem("admin_token", token);
        set({ adminToken: token });
    },
    clearAdminToken: () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        set({ adminToken: null });
    },
}));
