import { Link } from 'react-router-dom';
import { CalendarDays, FileText, MessageCircle, MapPin } from 'lucide-react';

export default function Home() {
  const menuItems = [
    { icon: <CalendarDays size={24}/>, label: 'Đặt lịch hẹn', path: '/appointments' },
    { icon: <FileText size={24}/>, label: 'Thủ tục HC', path: '/procedures' },
    { icon: <MapPin size={24}/>, label: 'Bản đồ', path: '/map' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
        <h2 className="text-xl font-bold text-zalo-blue mb-2">Xin chào, Công dân!</h2>
        <p className="text-gray-600 text-sm">Chào mừng bạn đến với Cổng tương tác số phường Tự Lạn.</p>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item, idx) => (
          <Link key={idx} to={item.path} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 transition">
            <div className="text-zalo-blue mb-2">{item.icon}</div>
            <span className="text-xs text-center font-medium text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Floating Chatbot Button */}
      <Link to="/chatbot" className="fixed bottom-6 right-6 bg-zalo-blue text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
        <MessageCircle size={28} />
      </Link>
    </div>
  );
}
