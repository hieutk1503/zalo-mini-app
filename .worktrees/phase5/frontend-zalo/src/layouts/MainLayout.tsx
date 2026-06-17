import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useAuthStore } from '../store/authStore';

export default function MainLayout() {
  const location = useLocation();
  const { fullName } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 shadow-2xl relative pb-20">
      <AuthModal />
      {/* Top Header - Glassmorphism */}
      <div className="glass-panel sticky top-0 z-50 px-4 py-3 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              T
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary">
              Tự Lạn Smart
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${fullName ? encodeURIComponent(fullName) : 'Cong+Dan'}&background=e0f2fe&color=0369a1`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-130px)] no-scrollbar">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <div className="glass-panel fixed bottom-0 max-w-md w-full px-6 py-3 flex justify-between items-center z-50 pb-safe">
        <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
          <Home size={24} className={isActive('/') ? 'fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">Trang chủ</span>
        </Link>
        
        <Link to="/chatbot" className="relative -top-5">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:scale-105 transition-transform border-4 border-gray-50">
            <MessageCircle size={28} className="fill-white/20" />
          </div>
        </Link>
        
        <Link to="/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
          <User size={24} className={isActive('/profile') ? 'fill-primary/20' : ''} />
          <span className="text-[10px] font-medium">Cá nhân</span>
        </Link>
      </div>
    </div>
  );
}
