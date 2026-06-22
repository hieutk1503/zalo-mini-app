import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, FileText, MapPin, ChevronRight, Bell, Search, 
  Library, PhoneCall, Map as MapIcon, Globe, Building2, Briefcase, 
  Landmark, CalendarClock, ClipboardList, CloudSun
} from 'lucide-react';
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

  const citizenTiles = [
    { icon: <CalendarDays size={24} className="text-blue-500" />, label: 'Đặt lịch hẹn', path: '/appointments', bg: 'bg-blue-50' },
    { icon: <MapPin size={24} className="text-rose-500" />, label: 'Phản ánh', path: '/feedbacks', bg: 'bg-rose-50' },
    { icon: <FileText size={24} className="text-amber-500" />, label: 'Thủ tục', path: '/procedures', bg: 'bg-amber-50' },
    { icon: <Library size={24} className="text-indigo-500" />, label: 'Kho văn bản', path: '/documents', bg: 'bg-indigo-50' },
    { icon: <PhoneCall size={24} className="text-red-500" />, label: 'Đường dây nóng', path: '/hotline', bg: 'bg-red-50' },
    { icon: <MapIcon size={24} className="text-emerald-500" />, label: 'Bản đồ', path: '/map', bg: 'bg-emerald-50' },
    { icon: <Globe size={24} className="text-cyan-500" />, label: 'Dịch vụ công', path: 'https://dichvucong.gov.vn', bg: 'bg-cyan-50', external: true },
  ];

  const businessTiles = [
    { icon: <Building2 size={24} className="text-teal-500" />, label: 'Quy hoạch', path: '/planning', bg: 'bg-teal-50' },
    { icon: <Briefcase size={24} className="text-orange-500" />, label: 'Dự án', path: '/investment', bg: 'bg-orange-50' },
    { icon: <Landmark size={24} className="text-violet-500" />, label: 'Đấu thầu', path: '/bidding', bg: 'bg-violet-50' },
    { icon: <CalendarClock size={24} className="text-fuchsia-500" />, label: 'Lịch công tác', path: '/work-schedule', bg: 'bg-fuchsia-50' },
    { icon: <ClipboardList size={24} className="text-lime-500" />, label: 'Kho mẫu đơn', path: '/forms', bg: 'bg-lime-50' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-br from-red-800 to-blue-900 pt-8 pb-16 px-4 rounded-b-[2.5rem] shadow-xl text-white relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-tight drop-shadow-md">CHÍNH QUYỀN SỐ</h1>
            <p className="text-lg font-medium text-white/90 drop-shadow mt-1">Phường Tự Lạn</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold opacity-90">{new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</div>
            <div className="text-[10px] opacity-75">{new Date().toLocaleDateString('vi-VN')}</div>
            <div className="mt-2 flex items-center gap-1 justify-end bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm text-xs font-medium">
              <CloudSun size={14} className="text-yellow-300" /> 30°C Có mây
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-6 flex justify-between items-center">
            <Link to="/profile" className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all text-white text-xs font-semibold py-2 px-4 rounded-full flex items-center gap-1">
              Xem hồ sơ cá nhân <ChevronRight size={14} />
            </Link>
        </div>
      </div>

      {/* 2. Stat Cards (Negative margin to overlap Hero) */}
      <div className="px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex divide-x divide-gray-100">
          <div className="flex-1 text-center">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Dân số</div>
            <div className="text-xl font-bold text-gray-800 mt-1">14.390</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Diện tích</div>
            <div className="text-xl font-bold text-gray-800 mt-1">67,68 <span className="text-sm font-normal">km²</span></div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        
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

        {/* 3. Tile Grid - Dành cho công dân */}
        <section>
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="font-bold text-gray-800 text-lg tracking-tight">Dành cho công dân</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {citizenTiles.map((item, idx) => {
              if (item.external) {
                return (
                  <a key={idx} href={item.path} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all active:scale-95">
                    <div className={`${item.bg} w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] text-center font-bold text-gray-700 leading-tight">{item.label}</span>
                  </a>
                );
              }
              return (
                <Link key={idx} to={item.path} className="group flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all active:scale-95">
                  <div className={`${item.bg} w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] text-center font-bold text-gray-700 leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Tile Grid - Quản lý khu phố / Doanh nghiệp */}
        <section>
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="font-bold text-gray-800 text-lg tracking-tight">Khu phố & Doanh nghiệp</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {businessTiles.map((item, idx) => (
              <Link key={idx} to={item.path} className="group flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all active:scale-95">
                <div className={`${item.bg} w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[10px] text-center font-bold text-gray-700 leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Featured News */}
        <section>
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="font-bold text-gray-800 text-lg tracking-tight">Tin tức & Thông báo</h3>
            <span className="text-xs text-primary font-medium cursor-pointer">Xem tất cả</span>
          </div>
          <div className="space-y-3">
            {news.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                Đang tải tin tức...
              </div>
            ) : (
              news.map((item) => (
                <Link key={item.id} to={`/news/${item.id}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:shadow-md transition-all active:scale-[0.98] block relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <CalendarDays size={12}/> {new Date(item.published_at).toLocaleDateString('vi-VN')} • Tự Lạn
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
