import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, MapPin, ChevronRight, Bell, Search, Library, PhoneCall, Map as MapIcon, Globe, Building2, Briefcase, Landmark, CalendarClock, ClipboardList } from 'lucide-react';
import api from '../lib/axios';

interface NewsItem {
  id: number;
  title: string;
  published_at: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        setNews(res.data);
      } catch (error) {
        console.error('Error fetching news', error);
      }
    };
    fetchNews();
  }, []);

  const menuItems = [
    { icon: <CalendarDays size={24} className="text-blue-500" />, label: 'Đặt lịch hẹn', path: '/appointments', bg: 'bg-blue-50' },
    { icon: <MapPin size={24} className="text-rose-500" />, label: 'Phản ánh', path: '/feedbacks', bg: 'bg-rose-50' },
    { icon: <FileText size={24} className="text-amber-500" />, label: 'Thủ tục', path: '/procedures', bg: 'bg-amber-50' },
    { icon: <Library size={24} className="text-indigo-500" />, label: 'Kho văn bản', path: '/documents', bg: 'bg-indigo-50' },
    { icon: <PhoneCall size={24} className="text-red-500" />, label: 'Đường dây nóng', path: '/hotline', bg: 'bg-red-50' },
    { icon: <MapIcon size={24} className="text-emerald-500" />, label: 'Bản đồ', path: '/map', bg: 'bg-emerald-50' },
    { icon: <Building2 size={24} className="text-teal-500" />, label: 'Quy hoạch', path: '/planning', bg: 'bg-teal-50' },
    { icon: <Briefcase size={24} className="text-orange-500" />, label: 'Dự án', path: '/investment', bg: 'bg-orange-50' },
    { icon: <Landmark size={24} className="text-violet-500" />, label: 'Đấu thầu', path: '/bidding', bg: 'bg-violet-50' },
    { icon: <CalendarClock size={24} className="text-fuchsia-500" />, label: 'Lịch công tác', path: '/work-schedule', bg: 'bg-fuchsia-50' },
    { icon: <ClipboardList size={24} className="text-lime-500" />, label: 'Kho mẫu đơn', path: '/forms', bg: 'bg-lime-50' },
    { icon: <Globe size={24} className="text-cyan-500" />, label: 'Dịch vụ công', path: 'https://dichvucong.gov.vn', bg: 'bg-cyan-50', external: true },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Tìm kiếm thủ tục, tin tức..." 
          className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-2xl focus:ring-primary focus:border-primary block pl-10 p-3 shadow-sm outline-none"
        />
      </div>

      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-light p-6 rounded-3xl shadow-lg shadow-primary/30 text-white">
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold mb-1 tracking-tight">Xin chào, Công dân!</h2>
          <p className="text-blue-100 text-sm font-medium mb-4">Chào mừng bạn đến với Cổng tương tác số phường Tự Lạn.</p>
          <Link to="/profile" className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all text-white text-xs font-semibold py-2 px-4 rounded-full flex items-center gap-1 w-max">
            Xem hồ sơ của bạn <ChevronRight size={14} />
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
      </div>

      {/* Grid Menu */}
      <div>
        <div className="flex justify-between items-end mb-3 px-1">
          <h3 className="font-bold text-gray-800">Tiện ích</h3>
          <span className="text-xs text-primary font-medium cursor-pointer">Xem tất cả</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {menuItems.map((item, idx) => {
            if (item.external) {
              return (
                <a key={idx} href={item.path} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all active:scale-95">
                  <div className={`${item.bg} w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] text-center font-bold text-gray-700 leading-tight">{item.label}</span>
                </a>
              );
            }
            return (
              <Link key={idx} to={item.path} className="group flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all active:scale-95">
                <div className={`${item.bg} w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[10px] text-center font-bold text-gray-700 leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* News Section */}
      <div>
        <div className="flex justify-between items-end mb-3 px-1">
          <h3 className="font-bold text-gray-800">Tin tức & Thông báo</h3>
          <span className="text-xs text-primary font-medium cursor-pointer">Xem tất cả</span>
        </div>
        <div className="space-y-3">
          {news.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              Đang tải tin tức...
            </div>
          ) : (
            news.map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:bg-gray-50 transition-colors block">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                  <Bell size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                    {new Date(item.published_at).toLocaleDateString('vi-VN')} • UBND Phường Tự Lạn
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
