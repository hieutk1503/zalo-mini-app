import { ChevronLeft, PhoneCall, ShieldAlert, Flame, Ambulance, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hotline() {
  const navigate = useNavigate();

  const emergencyNumbers = [
    { title: 'Cảnh sát phản ứng nhanh', number: '113', icon: <ShieldAlert size={28} className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Cứu hoả - PCCC', number: '114', icon: <Flame size={28} className="text-orange-500" />, bg: 'bg-orange-50' },
    { title: 'Cấp cứu y tế', number: '115', icon: <Ambulance size={28} className="text-red-500" />, bg: 'bg-red-50' },
  ];

  const localNumbers = [
    { title: 'Trực ban Công an Phường', desc: 'Hỗ trợ an ninh trật tự 24/7', number: '02043123456', icon: <ShieldAlert size={24} className="text-slate-600" /> },
    { title: 'Bộ phận Một cửa', desc: 'Hỗ trợ thủ tục hành chính', number: '02043654321', icon: <Users size={24} className="text-slate-600" /> },
  ];

  return (
    <div className="animate-fade-in pb-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 pt-6 pb-12 px-4 rounded-b-[2rem] text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold">Đường dây nóng</h1>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20 space-y-6">
        {/* Emergency Section */}
        <div className="bg-white rounded-3xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PhoneCall size={18} className="text-red-500" />
            Khẩn cấp toàn quốc
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {emergencyNumbers.map((item, idx) => (
              <a 
                key={idx} 
                href={`tel:${item.number}`}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 active:scale-95"
              >
                <div className={`${item.bg} w-14 h-14 rounded-full flex items-center justify-center mb-2`}>
                  {item.icon}
                </div>
                <span className="text-lg font-black text-gray-800">{item.number}</span>
                <span className="text-[10px] text-center font-semibold text-gray-500 leading-tight mt-1">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Local Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3 px-2">Liên hệ Phường Tự Lạn</h2>
          <div className="space-y-3">
            {localNumbers.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    <p className="text-sm font-black text-slate-700 mt-1 tracking-wide">{item.number.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')}</p>
                  </div>
                </div>
                <a 
                  href={`tel:${item.number}`}
                  className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors shrink-0"
                >
                  <PhoneCall size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>
        
        {/* Helper text */}
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-2xl text-xs font-medium leading-relaxed border border-yellow-200/50">
          <strong className="block mb-1">Lưu ý:</strong>
          Chỉ gọi các số khẩn cấp trong trường hợp thực sự cần thiết. Hành vi gọi trêu đùa, báo tin giả sẽ bị xử lý theo quy định của pháp luật.
        </div>
      </div>
    </div>
  );
}
