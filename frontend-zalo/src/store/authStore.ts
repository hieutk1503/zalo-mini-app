import { create } from 'zustand';

interface AuthState {
  zaloId: string | null;
  fullName: string | null;
  phone: string | null;
  accessToken: string | null;
  login: (id: string, name: string, phone: string, accessToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  zaloId: localStorage.getItem('zalo_id'),
  fullName: localStorage.getItem('full_name'),
  phone: localStorage.getItem('phone'),
  accessToken: localStorage.getItem('zalo_access_token'),
  login: (id, name, phone, accessToken) => {
    localStorage.setItem('zalo_id', id);
    localStorage.setItem('full_name', name);
    localStorage.setItem('phone', phone);
    if (accessToken) {
      localStorage.setItem('zalo_access_token', accessToken);
    } else {
      localStorage.removeItem('zalo_access_token');
    }
    set({ zaloId: id, fullName: name, phone, accessToken: accessToken || null });
  },
  logout: () => {
    localStorage.removeItem('zalo_id');
    localStorage.removeItem('full_name');
    localStorage.removeItem('phone');
    localStorage.removeItem('zalo_access_token');
    set({ zaloId: null, fullName: null, phone: null, accessToken: null });
  },
}));
