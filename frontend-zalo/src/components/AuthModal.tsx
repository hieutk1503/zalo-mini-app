import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { initZaloSession, isZaloDevMode } from '../lib/zalo';

export default function AuthModal() {
  const { zaloId, login } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isCheckingZalo, setIsCheckingZalo] = useState(true);

  useEffect(() => {
    if (zaloId) return;

    let cancelled = false;
    const initAuth = async () => {
      try {
        const session = await initZaloSession();
        if (cancelled || !session) return;

        login(session.id, session.name, session.phone, session.accessToken);
      } catch (error) {
        console.warn('Zalo auth initialization failed', error);
      } finally {
        if (!cancelled) setIsCheckingZalo(false);
      }
    };

    void initAuth();
    return () => {
      cancelled = true;
    };
  }, [login, zaloId]);

  if (zaloId) return null;
  if (isCheckingZalo) return null;

  if (!isZaloDevMode()) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
          <h2 className="text-lg font-bold text-gray-800">Không thể đăng nhập</h2>
          <p className="text-sm text-gray-500 mt-2">
            Vui lòng mở ứng dụng trong Zalo Mini App để sử dụng dịch vụ.
          </p>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const stableId = `DEV-ZALO-${phone.trim()}`;
    login(stableId, name.trim(), phone.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Chào mừng bạn!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Chế độ dev: nhập thông tin để thử nghiệm ngoài Zalo.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Ví dụ: Nguyễn Văn A"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="09xx xxx xxx"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-dark to-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-2"
          >
            Bắt đầu sử dụng
          </button>
        </form>
      </div>
    </div>
  );
}
