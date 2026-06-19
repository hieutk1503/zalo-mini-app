import { ChevronLeft, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MapLocation() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in pb-8 min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-emerald-500 pt-6 pb-12 px-4 rounded-b-[2rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold">Bản đồ & Định vị</h1>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20 flex-1 flex flex-col gap-4">
        {/* Info Card */}
        <div className="bg-white rounded-3xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">UBND Phường Tự Lạn</h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Đường Nguyễn Thế Nho, Phường Tự Lạn, Thị xã Việt Yên, Tỉnh Bắc Giang.
              </p>
            </div>
          </div>
          
          <a 
            href="https://www.google.com/maps/search/?api=1&query=21.20516401065793,106.0792196147426" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-emerald-500/20"
          >
            <Navigation size={16} /> Mở trong Google Maps
          </a>
        </div>

        {/* Map iframe */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1 min-h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14878.691763132714!2d106.0792196147426!3d21.20516401065793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31450c2f82c40b25%3A0x6b876fc15c4d29eb!2sUBND%20x%C3%A3%20T%E1%BB%B1%20L%E1%BA%A1n!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ UBND Phường Tự Lạn"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
