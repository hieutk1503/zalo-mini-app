import { create } from 'zustand';

interface AuthState {
  zaloId: string | null;
  fullName: string | null;
  phone: string | null;
  login: (id: string, name: string, phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  zaloId: localStorage.getItem('zalo_id'),
  fullName: localStorage.getItem('full_name'),
  phone: localStorage.getItem('phone'),
  login: (id, name, phone) => {
    localStorage.setItem('zalo_id', id);
    localStorage.setItem('full_name', name);
    localStorage.setItem('phone', phone);
    set({ zaloId: id, fullName: name, phone });
  },
  logout: () => {
    localStorage.clear();
    set({ zaloId: null, fullName: null, phone: null });
  }
}));
