import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

const AdminLayout = () => {
  const { adminToken, clearAdminToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login', { replace: true });
    }
  }, [adminToken, navigate]);

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Quản lý Phản ánh', path: '/admin/feedbacks' },
    { name: 'Quản lý Lịch hẹn', path: '/admin/appointments' },
    { name: 'Nhập Thủ tục (Excel)', path: '/admin/import' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Tử Lan Smart</h1>
          <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">ADMIN</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-6 py-3 text-sm font-medium transition-colors ${
                    location.pathname.startsWith(item.path)
                      ? 'text-blue-700 bg-blue-50 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header (Mobile menu toggle can go here if needed) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find(i => location.pathname.startsWith(i.path))?.name || 'Trang Quản Trị'}
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <span>Cán bộ: admin@visssoft.vn</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
